/**
 * 영역(Area) 클래스
 * - 화면상의 영역을 생성, 관리하며 해당 영역에 연결된 경계(Border) 객체들을 생성 및 업데이트합니다.
 */
import $g from '../../utils/$g';
import { Border } from './Border';

// AreaProps 타입은 외부에서 전달받는 영역 생성 정보를 나타낸다고 가정합니다.
export class Area {
    // 영역의 고유 ID
    id: string;
    areaElement: HTMLDivElement;
    // 네 방향(상, 우, 하, 좌)의 경계(Border) 객체를 저장하는 변수
    borders: Record<TSide, Border|undefined> = { top: undefined, right: undefined, bottom: undefined, left: undefined };

    // 영역의 위치와 크기 (vw, vh 단위)
    _x: number;
    _y: number;
    _width: number;
    _height: number;
    // 크기 조절 시 임시로 저장해둘 변경될 위치와 크기 정도
    _temp_x: number;
    _temp_y: number;
    _temp_width: number;
    _temp_height: number;

    // 실행될 이벤트 종류들
    mousedown: mouseFuncSet[] = [];

    // 영역 조정 가능 여부 플래그
    //@ts-ignore
    _is_resizable: boolean;
    //@ts-ignore
    _is_splitable: boolean;
    //@ts-ignore
    _is_joinable: boolean;

    // 외부에서 읽기 전용으로 영역의 위치와 크기에 접근할 수 있도록 getter 제공
    get x() { return this._x + this._temp_x; }
    get y() { return this._y + this._temp_y; }
    get width() { return this._width + this._temp_width; }
    get height() { return this._height + this._temp_height; }

    /**
     * 생성자
     * @param id - 영역의 고유 ID
     * @param areaElement - 실제 HTML 요소
     * @param x - 영역의 X 좌표 (vw 단위)
     * @param y - 영역의 Y 좌표 (vh 단위)
     * @param width - 영역의 너비 (vw 단위)
     * @param height - 영역의 높이 (vh 단위)
     * @param _temp_x - 영역의 임시 조정 중인 X 좌표 오프셋 (vw 단위)
     * @param _temp_y - 영역의 임시 조정 중인 Y 좌표 오프셋 (vh 단위)
     * @param _temp_width - 영역의 임시 조정 중인 너비 오프셋 (vw 단위)
     * @param _temp_height - 영역의 임시 조정 중인 높이 오프셋 (vh 단위)
     * @param is_resizable - 영역 크기 조절 가능 여부
     * @param is_splitable - 영역 분할 가능 여부
     * @param is_joinable - 영역 합치기 가능 여부
     */
    constructor({ id=(Math.random().toString(36).substring(2, 14)), x, y, width, height, is_resizable=true, is_splitable=true, is_joinable=true }: AreaProps) {
        this.id = id;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._temp_x = 0;
        this._temp_y = 0;
        this._temp_width = 0;
        this._temp_height = 0;
        this._is_resizable = is_resizable;
        this._is_splitable = is_splitable;
        this._is_joinable = is_joinable;

        // 네 방향의 경계(Border)를 생성합니다.
        const sides: TSide[] = ['top', 'bottom', 'left', 'right'];
        sides.forEach(side => {
            // 각 경계의 초기 좌표와 크기를 계산합니다.
            const borderX = side === 'left' ? this._x : (side === 'right' ? this._x + this._width : this._x);
            const borderY = side === 'top' ? this._y : (side === 'bottom' ? this._y + this._height : this._y);
            const borderSize = (side === 'top' || side === 'bottom') ? this._width : this._height;
            // 계산된 값으로 Border 객체를 생성하여 저장합니다.
            this.borders[side] = new Border({
                // id: Math.random().toString(36).substring(2, 14),
                side,
                x: borderX,
                y: borderY,
                size: borderSize,
                area: this
            });
        });
        
        this.areaElement = this.createElement();

        // 생성된 영역과 연결된 클래스를 객체 저장소에 저장
        $g.elements.set(this.id, this);
    }

    /**
     * HTML 상에 영역을 나타내는 DIV 요소를 생성하는 메소드
     * - 영역의 위치, 크기 및 연결된 경계(Border) 요소들을 포함합니다.
     * @returns 생성된 HTMLDivElement
     */
    createElement(): HTMLDivElement {
        // 요소 생성
        const areaElement = document.createElement('div');
        // 속성 설정
        areaElement.id = this.id;
        areaElement.classList.add('area');
        // 영역의 위치와 크기를 CSS 스타일로 설정 (vw, vh 단위)
        areaElement.style.left = `${this.x}vw`;
        areaElement.style.top = `${this.y}vh`;
        areaElement.style.width = `${this.width}vw`;
        areaElement.style.height = `${this.height}vh`;

        // 영역에 연결된 각 경계(Border) 요소들을 생성하여 자식 요소로 추가합니다.
        Object.values(this.borders).forEach(border => {
            if (border) {
                areaElement.appendChild(border.createElement());
            }
        });

        // 이벤트 달아주기
        this.init();

        // araeElement에 추가
        this.areaElement = areaElement;

        return areaElement;
    }

    
    /**
     * 마우스 이벤트 리스너들을 초기화하는 메소드
     * - 드래그 시작, 진행, 종료 및 우클릭(취소) 이벤트에 대한 콜백을 등록합니다.
     */
    init() {
        this.mousedown.push({
            mouse: 'left',
            func: () => this.highlight()
        });
        // this.mousedown.push({
        //     mouse: 'right',
        //     func: () => this.split('vertical')
        // });
    }

    /**
     * 영역을 분할하는 메소드
     * - 수평 또는 수직 방향으로 영역을 분할합니다.
     * @param direction - 분할 방향 ('vertical' | 'horizontal')
     */
    split(direction: 'vertical' | 'horizontal') {
        if (direction === 'vertical') {
            // 수직 분할 시, 영역을 가로로 두 개로 나누어 생성합니다.
            const newWidth = this.width / 2;
            const newArea = new Area({ x: this.x + newWidth, y: this.y, width: newWidth, height: this.height });
            // 기존 영역의 너비를 반으로 줄입니다.
            this.borders.right!._x = this.borders.right!._x -1 * newWidth;
            this._width = newWidth;
            // border와 area 업데이트
            this.update('right');
            Object.values(this.borders).forEach((border: Border | undefined) => {
                if (border) {
                    border.update();
                }
            });
            // 새로운 영역을 추가합니다.
            this.areaElement.after(newArea.areaElement);
        }
    }


    /**
     * 영역의 위치와 크기를 재계산하고 업데이트하는 메소드
     * - 좌측과 상단 경계를 기준으로 영역의 새 위치와 크기를 계산하고,
     *   변경된 값을 HTML 요소와 연결된 경계(Border)들에게 반영합니다.
     * @param direction - 크기 조절이 발생한 방향 ('top' | 'right' | 'bottom' | 'left')
     */
    resize(direction:TSide) {
        const { top, right, bottom, left } = this.borders as Record<TSide, Border>;

        // 경계를 기준으로 영역의 새 위치와 크기를 결정합니다.
        switch (direction) {
            case 'left':
                this._temp_x = left._temp_x;
                this._temp_width = -1 * left._temp_x;
                break;
            case 'top':
                this._temp_y = top._temp_y;
                this._temp_height = -1 * top._temp_y;
                break;
            case 'right':
                this._temp_width = right._temp_x;
                break;
            case 'bottom':
                this._temp_height = bottom._temp_y;
                break;
        }
        // 업데이트
        this.update(direction);
    }

    endResize(direction:TSide) {
        // 변경된 위치와 크기를 영구적으로 반영합니다.
        this._x += this._temp_x;
        this._y += this._temp_y;
        this._width += this._temp_width;
        this._height += this._temp_height;
        
        // temp 변수 초기화
        this._temp_x = 0;
        this._temp_y = 0;
        this._temp_width = 0;
        this._temp_height = 0;

        // 업데이트
        this.update(direction);
    }
    
    cancelResize(direction:TSide) {
        // temp 변수 초기화
        this._temp_x = 0;
        this._temp_y = 0;
        this._temp_width = 0;
        this._temp_height = 0;

        // 업데이트
        this.update(direction);
    }

    update(direction:TSide) {
        const { top, right, bottom, left } = this.borders as Record<TSide, Border>;

        // 영역의 위치와 크기를 CSS 스타일로 업데이트합니다.
        this.areaElement.style.left = `${this.x}vw`;
        this.areaElement.style.top = `${this.y}vh`;
        this.areaElement.style.width = `${this.width}vw`;
        this.areaElement.style.height = `${this.height}vh`;
        
        // 크기 조절 방향에 따라 인접한 경계(Border)의 좌표 및 크기를 업데이트합니다.
        switch (direction) {
            case 'left':
                // 좌측 조절 시 상단, 하단 경계의 X 좌표와 너비를 갱신합니다.
                top._x = this.x;
                top._size = this.width;
                top.update();
                bottom._x = this.x;
                bottom._size = this.width;
                bottom.update();
                break;
            case 'top':
                // 상단 조절 시 좌측, 우측 경계의 Y 좌표와 높이를 갱신합니다.
                left._y = this.y;
                left._size = this.height;
                left.update();
                right._y = this.y;
                right._size = this.height;
                right.update();
                break;
            case 'right':
                // 우측 조절 시 상단, 하단 경계의 너비만 갱신합니다.
                top._size = this.width;
                top.update();
                bottom._size = this.width;
                bottom.update();
                break;
            case 'bottom':
                // 하단 조절 시 좌측, 우측 경계의 높이만 갱신합니다.
                left._size = this.height;
                left.update();
                right._size = this.height;
                right.update();
                break;
        }
    }

    /**
     * 잠시 이 영역을 표시해주는 함수
     * - 영역을 잠시 하이라이트하여 표시합니다.
     */
    highlight(color:string = 'rgba(100, 100, 100, 0.5)', time:number = 100) {
        const areaElement = document.getElementById(this.id)!;
        areaElement.style.backgroundColor = color;

        setTimeout(() => {
            areaElement.style.backgroundColor = '';
        }, time);
    }
}
