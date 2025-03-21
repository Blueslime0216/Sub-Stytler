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
import { getOppositeSide, px2vh, px2vw } from '../../utils/unit';
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
        // 이 Border와 인접한 Area를 찾기
        const adjacentAreas = this.detectAdjacentAreas();
        // 겹치는 영역을 하이라이트 하기
        adjacentAreas.forEach(area => {
            area.highlight();
        });

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
            const hitboxElement = document.createElement('div');
            hitboxElement.style.position = 'fixed';
            hitboxElement.style.left = `${hitbox.left}vw`;
            hitboxElement.style.top = `${hitbox.top}vh`;
            hitboxElement.style.width = `${hitbox.right - hitbox.left}vw`;
            hitboxElement.style.height = `${hitbox.bottom - hitbox.top}vh`;
            hitboxElement.style.backgroundColor = $g.debug.hitbox_for_adjacent_detection_color;
            document.body.appendChild(hitboxElement);
            setTimeout(() => {
                document.body.removeChild(hitboxElement);
            }, $g.debug.hitbox_for_adjacent_detection_delay);
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

        const move = {
            x: px2vw($mouse.draggedSize.left.width),
            y: px2vh($mouse.draggedSize.left.height),
        };

        // area의 너비와 높이가 10을 넘어가지 않도록 설정
        if (this.area.width + move.x <= 10) {
            // 최대로 줄일 수 있는 크기를 계산해 temp_x, temp_y에 저장
            if (this.side === 'left') {
                this._temp_x = Math.max(this._temp_x, 10);
                console.log("left : "+this.area.width);
            }
            if (this.side === 'right') {
                this._temp_x = 0;//Math.min(this._temp_x, 10);
                console.log("right : "+this.area.width);
            }
        } else {
            // 이동된 정도 업데이트 (픽셀 값을 vw 또는 vh 단위로 변환)
            if (this.side === 'left' || this.side === 'right') {
                this._temp_x = move.x;
            }
            if (this.side === 'top' || this.side === 'bottom') {
                this._temp_y = move.y;
            }
        }


        // 자신의 HTML 요소 스타일 업데이트
        const borderElement = document.getElementById(this.id);
        if (!borderElement) return;
        const thickness = $g.AreaBorderThickness;
        this.updateElementStyle(borderElement, thickness);

        // 부모 Area의 크기 조절을 호출하여 영역 전체 업데이트
        this.area.resize(this.side);
        // // 연결된 Border들도 동일한 임시 이동량을 적용하여 업데이트합니다.
        // if (!$keyboard.isKeyDown('ControlLeft')){
        //     $g.linkedBorders.forEach(border => {
        //     if (border.side === 'left' || border.side === 'right') {
        //         border._temp_x = px2vw($mouse.draggedSize.left.width);
        //     }
        //     if (border.side === 'top' || border.side === 'bottom') {
        //         border._temp_y = px2vh($mouse.draggedSize.left.height);
        //     }
        //         border.update();
        //         border.area.resize(border.side);
        //     });
        // }
    }

    /**
     * 임시(temp) 이동량을 실제 좌표에 반영하고, temp 값을 초기화하는 함수
     * - 자신의 좌표를 갱신한 후 HTML 스타일도 업데이트합니다.
     */
    private applyTempChange() {
        this._x += this._temp_x;
        this._y += this._temp_y;
        this._temp_x = 0;
        this._temp_y = 0;
        this.update();
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
        // 자신의 임시 이동량을 적용
        this.applyTempChange();

        // 연결된 Border들도 임시 이동량을 적용하고, 각 Border의 부모 Area를 업데이트합니다.
        $g.linkedBorders.forEach(border => {
            border.applyTempChange();
            border.area.resize(border.side);
        });

        // $g.linkedAreas, $g.linkedBorders 초기화
        $g.linkedAreas = [];
        $g.linkedBorders = [];
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
        this.area.resize(this.side);
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
