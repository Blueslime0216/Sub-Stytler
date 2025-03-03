// ====================================================================================================
// 경계선(Border) 감지 및 크기 조절 기능
// ====================================================================================================
import $mouse from '../../sys/mouse';
import $g from '../../utils/$g';
import { px2vh, px2vw } from '../../utils/unit';
import { Area } from './Area';

export class Border {
    // 중요 속성
    _id: string;
    side: 'top' | 'bottom' | 'left' | 'right';
    area: Area; // 부모 영역
    // 위치 및 크기
    _x: number;
    _y: number;
    _size: number;
    // 크기 조절에서 사용할 임시 속성
    _temp_x: number = 0;
    _temp_y: number = 0;
    _temp_size: number = 0;
    // 이벤트 리스너
    mousedrag:mouseFuncSet[] = [];
    mousedragend:mouseFuncSet[] = [];
    mousedown:mouseFuncSet[] = [];
    // 개인 변수
    _is_resizing: boolean = false;
    _is_canceled: boolean = false;

    get id(){ return this._id; }    // id는 읽기만 가능함
    get x(){ return this._x + this._temp_x; }
    get y(){ return this._y + this._temp_y; }
    get size(){ return this._size + this._temp_size; }

    constructor({ id, side, x, y, size, area }: BorderProps) {
        this._id = id;
        this.side = side;
        this._x = x;
        this._y = y;
        this._size = size;
        this.area = area; // `Area` 객체 자체를 저장
    }

    createElement(): HTMLDivElement {
        // 사용할 변수 가져오기
        const t = $g.AreaBorderThickness;
        // 경계선 요소 생성
        const border = document.createElement('div');
        // 속성 설정
        border.id = this.id;
        border.classList.add('border', this.side);
        // 위치 및 크기 설정
        border.style.left = `${this._x}vw`;
        border.style.top = `${this._y}vh`;
        border.style.width = (this.side === 'left' || this.side === 'right') ? `${t}px` : `${this._size}vw`;
        border.style.height = (this.side === 'top' || this.side === 'bottom') ? `${t}px` : `${this._size}vh`;
        
        // 요소 저장
        $g.elements.set(this.id, this);

        // 이벤트 리스너 추가
        this.init();

        return border;
    }

    // 이벤트 리스너 추가
    init() {
        // 요소 위에서 드래그 중일 때
        this.mousedrag.push({
            mouse: 'left',
            func: this.resize.bind(this)
        });
        // 요소 위에서 드래그가 끝날 때
        this.mousedragend.push({
            mouse: 'left',
            func: this.endResize.bind(this)
        });
        // 요소 위에서 우클릭 시
        this.mousedown.push({
            mouse: 'right',
            func: this.cancelResize.bind(this)
        });
    }

    resize(event: MouseEvent) {
        // 우클릭을 눌러 취소가 되었다면 실행 중단
        if (this._is_canceled) return;

        // 크기 조절 중이라고 설정
        this._is_resizing = true;

        if (this.side === 'left' || this.side === 'right') {
            this._temp_x = px2vw($mouse.draggedSize.left.width);
        } 
        if (this.side === 'top' || this.side === 'bottom') {
            this._temp_y = px2vh($mouse.draggedSize.left.height);
        }

        // style 업데이트
        const Border = document.getElementById(this.id);
        if (!Border) return;
        Border.style.left = `${this._x + this._temp_x}vw`;
        Border.style.top = `${this._y + this._temp_y}vh`;

        // Area의 resize 함수 호출
        this.area.resize(this.side);
    }

    endResize() {
        this._is_resizing = false;
        if (this._is_canceled) {
            this._is_canceled = false;
            return;
        }

        this._x += this._temp_x;
        this._y += this._temp_y;
        this._temp_x = 0;
        this._temp_y = 0;
    }

    cancelResize() {
        if (this._is_resizing) {
            this._is_canceled = true;
        }
        this._temp_x = 0;
        this._temp_y = 0;

        // 스타일 업데이트
        this.update();
        this.area.resize(this.side);
    }

    update() {
        // Border 가져오기
        const Border = document.getElementById(this.id);
        if (!Border) return;
        
        
        Border.style.left = `${this.x}vw`;
        Border.style.top = `${this.y}vh`;
        Border.style.width = (this.side === 'left' || this.side === 'right') ? `${$g.AreaBorderThickness}px` : `${this.size}vw`;
        Border.style.height = (this.side === 'top' || this.side === 'bottom') ? `${$g.AreaBorderThickness}px` : `${this.size}vh`;

        if (this.side === 'top') {
            console.log(`top: ${this.x}, ${this.y}, ${this.size}`);
        }
    }
}