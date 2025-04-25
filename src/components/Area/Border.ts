/**====================================================================================================
 * 경계(Border) 클래스
 * - 영역의 4 방향에 존재하는 경계
 * - 마우스 드래그로 영역의 크기를 조절할 수 있음
 * - 변경 값과 이전 값을 따로 저장해, 마우스 우클릭으로 쉽게 실행 취소 가능
 * - 같은 선에 있는 다른 경계와 같이 이동하나, Ctrl 키를 눌러 독립적으로 이동할 수 있음
 * ==================================================================================================== */
// import
import $keyboard from '../../sys/keyboard';
import $mouse from '../../sys/mouse';
import $g from '../../utils/$g';
import { getOppositeSide, px2vh, px2vw, showBox } from '../../utils/unit';
import { Area } from './Area';



// 경계선
export class Border {
    // 중요 속성
    _id: string; // 고유 ID (외부에서는 읽기 전용)
    side: TSide; // 경계의 방향 (top | bottom | left | right)
    area: Area; // 이 경계가 속한 부모 Area 객체
    // 위치 및 크기 (vw, vh 단위)
    _x: number;
    _y: number;
    _size: number;
    // 크기 조절 시 임시로 저장해둘 변경될 위치와 크기 정도
    _temp_x: number = 0;
    _temp_y: number = 0;
    _temp_size: number = 0;
    // 실행될 이벤트 종류들
    mousedragstart: mouseFuncSet[] = [];
    mousedrag: mouseFuncSet[] = [];
    mousedragend: mouseFuncSet[] = [];
    mousedown: mouseFuncSet[] = [];
    // 개인 변수
    _is_resizing: boolean = false;
    _is_canceled: boolean = false;

    // 외부에서 읽기 전용으로 제공되는 getter
    get id() { return this._id; } // id는 읽기만 가능함
    get x() { return this._x + this._temp_x; } // 현재 보여질 X 좌표 (vw 단위)
    get y() { return this._y + this._temp_y; } // 현재 보여질 Y 좌표 (vh 단위)
    get size() { return this._size + this._temp_size; } // 현재 보여질 크기 (vw 또는 vh 단위)

    /**
     * 생성자
     * @param id - 경계의 고유 ID
     * @param side - 경계 방향 ('top' | 'bottom' | 'left' | 'right')
     * @param x - 초기 X 좌표 (vw 단위)
     * @param y - 초기 Y 좌표 (vh 단위)
     * @param size - 경계의 길이 또는 크기 (vw 또는 vh 단위)
     * @param area - 이 경계가 속한 부모 Area 객체
     */
    constructor({ id=(Math.random().toString(36).substring(2, 14)), side, x, y, size, area }: BorderProps) {
        this._id = id; // ID가 주어지지 않으면 랜덤 ID 생성
        this.side = side;
        this._x = x;
        this._y = y;
        this._size = size;
        this.area = area;
    }

    /**
     * HTML 상에 경계(Border)를 나타내는 DIV 요소를 생성하는 메소드
     * - 경계의 위치, 크기 및 CSS 클래스를 설정합니다.
     * @returns 생성된 HTMLDivElement
     */
    createElement(): HTMLDivElement {
        // 사용할 변수 가져오기
        const thickness = $g.AreaBorderThickness;

        // 경계선 요소 생성
        const borderElement = document.createElement('div');
        // 속성 설정
        borderElement.id = this.id;
        borderElement.classList.add('border', this.side);
        // 함수를 사용해 위치 및 크기 설정
        this.updateElementStyle(borderElement, thickness);

        // 생성된 경계를 객체 저장소에 저장하기
        $g.elements.set(this.id, this);

        // 이벤트 달아주기
        this.init();

        return borderElement;
    }

    /**
     * 마우스 이벤트 리스너들을 초기화하는 메소드
     * - 드래그 시작, 진행, 종료 및 우클릭(취소) 이벤트에 대한 콜백을 등록합니다.
     */
    init() {
        this.mousedragstart.push({
            mouse: 'left',
            func: this.startResize.bind(this)
        });
        this.mousedrag.push({
            mouse: 'left',
            func: this.resize.bind(this)
        });
        this.mousedragend.push({
            mouse: 'left',
            func: this.endResize.bind(this)
        });
        this.mousedown.push({
            mouse: 'right',
            func: this.cancelResize.bind(this)
        });
    }
    /**
     * HTML 요소의 스타일을 업데이트하는 공통 함수
     * @param element - 업데이트할 HTML 요소
     * @param thickness - 경계 두께 (픽셀 단위)
     */
    private updateElementStyle(element: HTMLElement, thickness: number) {
        element.style.left = `calc(${this.x}vw - ${this.side === 'right' ? thickness : 0}px)`;
        element.style.top = `calc(${this.y}vh - ${this.side === 'bottom' ? thickness : 0}px)`;
        element.style.width = (this.side === 'left' || this.side === 'right')
                                ? `${thickness}px`
                                : `${this.size}vw`;
        element.style.height = (this.side === 'top' || this.side === 'bottom')
                                ? `${thickness}px`
                                : `${this.size}vh`;
    }

    /**
     * 드래그 시작 시 호출되는 함수
     * - 같은 선상의 다른 Border들을 찾아 _linked_borders에 저장하여 함께 이동하도록 준비합니다.
     */
    startResize() {
        this.detectLinkedBorders();
    }

    /**
     * 이 경계가 움직일 때 같이 움직일 경계 검색
     * @returns 인접한 Border 배열
     */
    detectLinkedBorders() {
        // ---------- 이 Border와 인접한 Area를 다양하게 찾기 ----------
        const adjacentAreas = this.detectAdjacentAreas();
        // 겹치는 영역을 하이라이트 하기
        if ($g.debug.highlight_area_when_adjacent_detection) {
            adjacentAreas.forEach(area => {
                area.highlight($g.debug.highlight_area_when_adjacent_detection___color, $g.debug.highlight_area_when_adjacent_detection___time);
            });
        }

        // $g.linkedAreas에 추가하기
        adjacentAreas.forEach(area => {
            if (!$g.linkedAreas.includes(area)) { // 만약 없는 경우
                $g.linkedAreas.push(area); // 추가

                // area의 특정 방향의 border 찾기
                const adjacentBorder = area.borders[getOppositeSide(this.side)]!
                // $g.linkedBorders에 없다면 추가
                if (!$g.linkedBorders.includes(adjacentBorder)) {
                    $g.linkedBorders.push(adjacentBorder);

                    // 추가된 Border의 인접한 Border들도 찾아서 추가
                    adjacentBorder.detectLinkedBorders();
                }
            }
        });

        // ---------- 조정 가능한 범위 구하기 ----------
        // 현재 border의 방향에 따라 감지할 영역 필터링 및 하이라이트
        if (this.side === 'left' || this.side === 'right') {
            // 세로 축: 왼쪽과 오른쪽만 감지
            adjacentAreas.forEach(area => {
                if (area.x < this.x) { // 왼쪽
                    $g.area_adjustable_range.min = Math.max($g.area_adjustable_range.min, area.x + $g.AreaMinWidth);
                    if ($g.debug.highlight_area_when_adjacent_detection_with_direction){
                        area.highlight($g.debug.highlight_area_when_adjacent_detection_with_direction___left_top_color);
                    }
                } else if (area.x >= this.x) { // 오른쪽
                    $g.area_adjustable_range.max = Math.min($g.area_adjustable_range.max, area.x + area.width - $g.AreaMinWidth);
                    if ($g.debug.highlight_area_when_adjacent_detection_with_direction){
                        area.highlight($g.debug.highlight_area_when_adjacent_detection_with_direction___right_bottom_color);
                    }
                }
            });
            // (디버깅) 조정 가능 영역 표시
            if ($g.debug.show_adjustable_area_range) {
                showBox({
                    id: '조절 가능 영역 표시',
                    x: $g.area_adjustable_range.min,
                    y: this.area.y,
                    width: $g.area_adjustable_range.max - $g.area_adjustable_range.min,
                    height: this.area.height,
                    color: $g.debug.adjustable_area_range_color,
                    time: $g.debug.adjustable_area_range_time,
                });
            }
        } else if (this.side === 'top' || this.side === 'bottom') {
            // 가로 축: 위쪽과 아래쪽만 감지
            adjacentAreas.forEach(area => {
                if (area.y < this.y) { // 위쪽
                    $g.area_adjustable_range.min = Math.max($g.area_adjustable_range.min, area.y + $g.AreaMinHeight);
                    if ($g.debug.highlight_area_when_adjacent_detection_with_direction){
                        area.highlight('rgba(100, 100, 255, 0.5)');
                    }
                } else if (area.y >= this.y) { // 아래쪽
                    $g.area_adjustable_range.max = Math.min($g.area_adjustable_range.max, area.y + area.height - $g.AreaMinHeight);
                    if ($g.debug.highlight_area_when_adjacent_detection_with_direction){
                        area.highlight('rgba(255, 100, 100, 0.5)');
                    }
                }
            });
            // (디버깅) 조정 가능 영역 표시
            if ($g.debug.show_adjustable_area_range) {
                showBox({
                    id: '조절 가능 영역 표시',
                    x: this.area.x,
                    y: $g.area_adjustable_range.min,
                    width: this.area.width,
                    height: $g.area_adjustable_range.max - $g.area_adjustable_range.min,
                    color: $g.debug.adjustable_area_range_color,
                    time: $g.debug.adjustable_area_range_time,
                });
            }
        }
    }

    /**
     * 이 경계와 인접한 Area를 찾아 반환하는 함수
     * @returns 인접한 Area 배열
     */
    detectAdjacentAreas(): Area[] {
        // 히트박스 설정
        const sideMargin = 0.1; // 옆의 Area가 잘못 선택되는 것을 방지하기 위한 여백
        const frontMargin = 0.2; // 본인이 선택되는 것을 방지하기 위해 조금 떨어트려 놓기
        const frontSize = 0.5; // 히트박스 두께, 이 영역과 겹치면 감지됨
        let hitbox = { left: 0, top: 0, right: 0, bottom: 0 };
        switch (this.side) {
            case 'left':
                hitbox = {
                    left: this.x - frontMargin - frontSize,
                    top: this.y + sideMargin,
                    right: this.x - frontMargin,
                    bottom: this.y + this.size - sideMargin,
                }
                break;
            case 'top':
                hitbox = {
                    left: this.x + sideMargin,
                    top: this.y - frontMargin - frontSize,
                    right: this.x + this.size - sideMargin,
                    bottom: this.y - frontMargin,
                }
                break;
            case 'right':
                hitbox = {
                    left: this.x + frontMargin,
                    top: this.y + sideMargin,
                    right: this.x + frontMargin + frontSize,
                    bottom: this.y + this.size - sideMargin,
                }
                break;
            case 'bottom':
                hitbox = {
                    left: this.x + sideMargin,
                    top: this.y + frontMargin,
                    right: this.x + this.size - sideMargin,
                    bottom: this.y + frontMargin + frontSize,
                }
                break
        }

        // (디버깅) 히트박스를 시각적으로 표시
        if ($g.debug.show_hitbox_for_adjacent_detection) {
            showBox({
                x: hitbox.left,
                y: hitbox.top,
                width: hitbox.right - hitbox.left,
                height: hitbox.bottom - hitbox.top,
                color: $g.debug.hitbox_for_adjacent_detection_color,
                time: $g.debug.hitbox_for_adjacent_detection_delay,
            });
        }

        // 모든 영역을 순회하며 히트박스와 겹치는 영역 찾기
        const adjacentAreas = Array.from($g.elements.values()).filter((area): area is Area => {
            if (!(area instanceof Area)) return false;

            const areaBox = {
                left: area.x,
                top: area.y,
                right: area.x + area.width,
                bottom: area.y + area.height,
            };

            // 히트박스와 영역의 겹침 여부 확인
            return !(hitbox.right < areaBox.left || 
                     hitbox.left > areaBox.right || 
                     hitbox.bottom < areaBox.top || 
                     hitbox.top > areaBox.bottom);
        });

        // 찾은 영역들 반환
        return adjacentAreas;
    };

    /**
     * 마우스 드래그 중에 호출되는 함수
     * - 자신의 임시(temp) 이동량을 갱신하고, HTML 요소와 부모 Area를 업데이트합니다.
     * - 같은 선상의 연결된 Border에도 동일한 임시 이동량을 적용합니다.
     * @param event - 마우스 이벤트 객체
     */
    resize(event: MouseEvent) {
        // 만약 우클릭으로 취소되었다면 실행 중단
        if (this._is_canceled) return;

        // 크기 조절 중이라고 설정
        this._is_resizing = true;

        const move_raw = {
            x: px2vw($mouse.draggedSize.left.width),
            y: px2vh($mouse.draggedSize.left.height),
        };

        // 연결된 Border들 전부 동일한 임시 이동량을 적용하여 업데이트합니다.
        if (!$keyboard.isKeyDown('ControlLeft')){
            $g.linkedBorders.forEach(border => {
                if (((border.area._width + move_raw.x < $g.AreaMinWidth) && border.side == 'right') ||
                    ((border.area._height - move_raw.y < $g.AreaMinHeight) && border.side == 'top') ||
                    ((border.area._width - move_raw.x < $g.AreaMinWidth)  && border.side == 'left') ||
                    ((border.area._height + move_raw.y < $g.AreaMinHeight) && border.side == 'bottom')
                ){
                    border.area.highlight('rgba(255, 100, 100, 0.5)');
                }
                // 이동 오프셋 업데이트 (최소값을 넘어가지 않게 하기)
                this.offsetUpdate(border, move_raw);
                border.update();
                border.area.resize(border.side);
            });
        }
    }

    offsetUpdate(border: Border, move: { x: number, y: number }) {
        // 이동 오프셋 업데이트 (최소값을 넘어가지 않게 하기)
        switch (border.side) {
            case 'right':
                border._temp_x = Math.min(
                    Math.max(move.x, $g.area_adjustable_range.min - border.area._x - border.area._width),
                    $g.area_adjustable_range.max - border.area._x - border.area._width
                );
                break;
            case 'top':
                border._temp_y = Math.min(
                    Math.max(move.y, $g.area_adjustable_range.min - border.area._y),
                    $g.area_adjustable_range.max - border.area._y
                );
                break;
            case 'left':
                border._temp_x = Math.min(
                    Math.max(move.x, $g.area_adjustable_range.min - border.area._x),
                    $g.area_adjustable_range.max - border.area._x
                );
                break;
            case 'bottom':
                border._temp_y = Math.min(
                    Math.max(move.y, $g.area_adjustable_range.min - border.area._y - border.area._height),
                    $g.area_adjustable_range.max - border.area._y - border.area._height
                );
            break;
        }
    }

    /**
     * 드래그 종료 시 호출되는 함수
     * - 자신의 임시 이동량은 물론, 함께 이동한 연결된 Border들의 임시 이동량도 실제 값으로 반영합니다.
     */
    endResize() {
        this._is_resizing = false;
        if (this._is_canceled) {
            this._is_canceled = false;
            return;
        }

        // 연결된 Border들도 임시 이동량을 적용하고, 각 Border의 부모 Area를 업데이트합니다.
        $g.linkedBorders.forEach(border => {
            border._x += border._temp_x;
            border._y += border._temp_y;
            border._temp_x = 0;
            border._temp_y = 0;

            border.update();

            border.area.endResize(this.side);
        });

        // $g.linkedAreas, $g.linkedBorders 초기화
        $g.linkedAreas = [];
        $g.linkedBorders = [];
        $g.area_adjustable_range = { min: 0, max: 100 };
    }

    /**
     * 우클릭 등으로 크기 조절을 취소할 때 호출되는 함수
     * - 임시 이동량을 초기화하고, 현재 상태를 HTML에 업데이트합니다.
     */
    cancelResize() {
        if (this._is_resizing) {
            this._is_canceled = true;
        }
        this._temp_x = 0;
        this._temp_y = 0;
        this.update();
        this.area.cancelResize(this.side);

        // 연결된 Border들도 임시 이동량을 초기화하고, 각 Border의 부모 Area를 업데이트합니다.
        $g.linkedBorders.forEach(border => {
            border._temp_x = 0;
            border._temp_y = 0;
            border.update();
            border.area.cancelResize(border.side);
        });

        // $g.linkedAreas, $g.linkedBorders 초기화
        $g.linkedAreas = [];
        $g.linkedBorders = [];
    }

    /**
     * 현재 Border의 HTML 요소 스타일을 갱신하여 변경된 위치와 크기를 반영하는 함수
     */
    update() {
        const borderElement = document.getElementById(this.id);
        if (!borderElement) return;
        const thickness = $g.AreaBorderThickness;
        this.updateElementStyle(borderElement, thickness);
    }
}
