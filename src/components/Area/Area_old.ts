// ====================================================================================================
// 영역(Area) 생성 및 관리
// ====================================================================================================
import $g from '../../utils/$g';
import { Border } from './Border';

export class Area {
    // 영역 중요 속성
    id: string;
    borders = {
        top: null as Border | null,
        right: null as Border | null,
        bottom: null as Border | null,
        left: null as Border | null
    };
    // 영역 위치 및 크기
    _x: number;
    _y: number;
    _width: number;
    _height: number;
    // // 크기 조절에서 사용할 임시 속성
    // _temp_x: number = 0;
    // _temp_y: number = 0;
    // _temp_width: number = 0;
    // _temp_height: number = 0;
    // 토글 가능 속성
    _is_resizable: boolean;
    _is_splitable: boolean;
    _is_joinable: boolean;

    get x(){ return this._x }
    get y(){ return this._y }
    get width(){ return this._width }
    get height(){ return this._height }

    constructor({ id, x, y, width, height, is_resizable, is_splitable, is_joinable }: AreaProps) {
        this.id = id;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._is_resizable = is_resizable;
        this._is_splitable = is_splitable;
        this._is_joinable = is_joinable;
        
        // Border 객체 생성 (각각 new 로 새로운 id 부여)
        const sides:("top"|"bottom"|"left"|"right")[] = ["top", "bottom", "left", "right"];
        sides.forEach((side) => {
            this.borders[side] = new Border({
                id: Math.random().toString(36).substring(2, 14), // 새로운 id 생성
                side,
                x: side === 'left' ? this._x : side === 'right' ? this._x + this._width : this._x,
                y: side === 'top' ? this._y : side === 'bottom' ? this._y + this._height : this._y,
                size: side === 'top' || side === 'bottom' ? this._width : this._height,
                area: this
            });
        });

        // 객체 저장
        $g.elements.set(this.id, this);
    }

    createElement(): HTMLDivElement {
        // 요소 생성
        const area = document.createElement('div');
        // 속성 설정
        area.id = this.id;
        area.classList.add('area');
        // 위치 및 크기 설정
        area.style.left = `${this._x}vw`;
        area.style.top = `${this._y}vh`;
        area.style.width = `${this._width}vw`;
        area.style.height = `${this._height}vh`;

        Object.values(this.borders).forEach((border: Border | null) => {
            if (border) {
                area.appendChild(border.createElement());
            }
        });

        return area;
    }

    resize(direction: 'top' | 'right' | 'bottom' | 'left') {
        const [top, right, bottom, left] = Object.values(this.borders);
        if (!top || !right || !bottom || !left) return;

        // Area 크기 조절
        this._x = left.x;
        this._y = top.y;
        this._width = right.x - left.x;
        this._height = bottom.y - top.y;
        const areaElement = document.getElementById(this.id);
        if (areaElement) {
            areaElement.style.left = `${this._x}vw`;
            areaElement.style.top = `${this._y}vh`;
            areaElement.style.width = `${this._width}vw`;
            areaElement.style.height = `${this._height}vh`;
        }

        // 인접한 Border 재배치
        switch (direction) {
            case 'left':
                top._x = this.x;
                top._size = this.width;
                top.update();
                bottom._x = this.x;
                bottom._size = this.width;
                bottom.update();
                break;
            case 'right':
                top._size = this.width;
                top.update();
                bottom._size = this.width;
                bottom.update();
                break;
            case 'top':
                left._y = this.y;
                left._size = this.height;
                left.update();
                right._y = this.y;
                right._size = this.height;
                right.update();
                break;
            case 'bottom':
                left._size = this.height;
                left.update();
                right._size = this.height;
                right.update();
                break;
        }
    }
}