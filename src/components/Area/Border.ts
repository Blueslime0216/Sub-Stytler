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
import { px2vh, px2vw } from '../../utils/unit';
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
    // 같이 움직여야 할 같은 선상의 다른 Border들을 저장
    private _linked_borders: Border[] = [];

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
        // 히트박스 설정 (현재 Border의 위치와 크기를 기준으로 생성)
        let hitbox = {
            left: this.x,
            top: this.y,
            right: this.x + (this.side === 'left' || this.side === 'right' ? px2vw($g.AreaBorderThickness) : this.size),
            bottom: this.y + (this.side === 'top' || this.side === 'bottom' ? px2vh($g.AreaBorderThickness) : this.size),
        };
        const sideMargine = 0.1;
        const frontMargine = 0.2;
        const frontSize = 0.5;
        switch (this.side) {
            case 'left':
                hitbox = {
                    left: this.x - frontMargine - frontSize,
                    top: this.y + sideMargine,
                    right: this.x - frontMargine,
                    bottom: this.y + this.size - sideMargine,
                }
                break;
            case 'top':
                hitbox = {
                    left: this.x + sideMargine,
                    top: this.y - frontMargine - frontSize,
                    right: this.x + this.size - sideMargine,
                    bottom: this.y - frontMargine,
                }
                break;
            case 'right':
                hitbox = {
                    left: this.x + this.size + frontMargine,
                    top: this.y + sideMargine,
                    right: this.x + this.size + frontMargine + frontSize,
                    bottom: this.y + this.size - sideMargine,
                }
                break;
            case 'bottom':
                hitbox = {
                    left: this.x + sideMargine,
                    top: this.y + frontMargine,
                    right: this.x + this.size - sideMargine,
                    bottom: this.y + this.size + frontMargine + frontSize,
                }
                break
        }
        // 해당 히트박스위 위치와 크기의 div를 만들어서 화면에 표시하고 삭제
        const hitboxElement = document.createElement('div');
        hitboxElement.style.position = 'fixed';
        hitboxElement.style.left = `${hitbox.left}vw`;
        hitboxElement.style.top = `${hitbox.top}vh`;
        hitboxElement.style.width = `${hitbox.right - hitbox.left}vw`;
        hitboxElement.style.height = `${hitbox.bottom - hitbox.top}vh`;
        hitboxElement.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
        document.body.appendChild(hitboxElement);
        setTimeout(() => {
            document.body.removeChild(hitboxElement);
        }, 500);

        // 모든 영역을 순회하며 히트박스와 겹치는 영역 찾기
        const overlappingAreas = Array.from($g.elements.values()).filter((area): area is Area => {
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

        // 겹치는 영역을 하이라이트 하기
        overlappingAreas.forEach(area => {
            area.highlight();
        });
    }
    
    /**
     * 같은 선상(수평 또는 수직)에 있는 Border들을 찾아 반환하는 함수
     * @returns 연결된 Border 배열
     */
    private getLinkedBorders(): Border[] {
        const tolerance = 1; // 좌표 오차 허용 범위
        if (this.side === 'left' || this.side === 'right') {
            return Array.from($g.elements.values()).filter((elem): elem is Border => {
                return (elem instanceof Border) &&
                    (elem.area !== this.area) &&
                    ((elem.side === 'left' || elem.side === 'right') && Math.abs(elem.x - this.x) <= tolerance);
            });
        } else if (this.side === 'top' || this.side === 'bottom') {
            return Array.from($g.elements.values()).filter((elem): elem is Border => {
                return (elem instanceof Border) &&
                    (elem.area !== this.area) &&
                    ((elem.side === 'top' || elem.side === 'bottom') && Math.abs(elem.y - this.y) <= tolerance);
            });
        }
        return [];
    }

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

        // 이동된 정도 업데이트 (픽셀 값을 vw 또는 vh 단위로 변환)
        if (this.side === 'left' || this.side === 'right') {
            this._temp_x = px2vw($mouse.draggedSize.left.width);
        }
        if (this.side === 'top' || this.side === 'bottom') {
            this._temp_y = px2vh($mouse.draggedSize.left.height);
        }

        // 자신의 HTML 요소 스타일 업데이트
        const borderElement = document.getElementById(this.id);
        if (!borderElement) return;
        const thickness = $g.AreaBorderThickness;
        this.updateElementStyle(borderElement, thickness);

        // 부모 Area의 크기 조절을 호출하여 영역 전체 업데이트
        this.area.resize(this.side);
        // 연결된 Border들도 동일한 임시 이동량을 적용하여 업데이트합니다.
        if (!$keyboard.isKeyDown('ControlLeft')){
            this._linked_borders.forEach(border => {
            if (border.side === 'left' || border.side === 'right') {
                border._temp_x = px2vw($mouse.draggedSize.left.width);
            }
            if (border.side === 'top' || border.side === 'bottom') {
                border._temp_y = px2vh($mouse.draggedSize.left.height);
            }
                border.update();
                border.area.resize(border.side);
            });
        }
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
        this._linked_borders.forEach(border => {
            border.applyTempChange();
            border.area.resize(border.side);
        });
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
