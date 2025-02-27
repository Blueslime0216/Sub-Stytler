// ====================================================================================================
// 경계선(border) 감지 및 크기 조절 기능
// ====================================================================================================
import $g from '../utils/$g';
// import { Area } from './Area';


export class Border {
    // 중요 속성
    id: string;
    side: 'top'|'bottom'|'left'|'right';
    // 위치 및 크기
    x: number;
    y: number;
    size: number;
    // 크기 조절에서 사용할 임시 속성
    temp_x: number = 0;
    temp_y: number = 0;
    temp_size: number = 0;
    // 부모 영역
    area: string;

    constructor({ id, side, x, y, size, area }: BorderProps) {
        this.id = id;
        this.side = side;
        this.x = x;
        this.y = y;
        this.size = size;
        this.area = area;
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
        border.style.left = `${this.x}vw`;
        border.style.top = `${this.y}vh`;
        border.style.width = (this.side === 'left' || this.side === 'right') ? `${t}px` : `${this.size}vw`;
        border.style.height = (this.side === 'top' || this.side === 'bottom') ? `${t}px` : `${this.size}vh`;;
        // 이벤트 리스너 추가
        border.addEventListener('mousedown', this.startResize.bind(this));
        // 객체 저장
        $g.elements.set(this.id, this);

        return border;
    }

    mousedown(event: MouseEvent) {
        console.log('Border mousedown');
    }

    startResize(event: MouseEvent) {
        document.addEventListener('mousemove', this.resize.bind(this));
        document.addEventListener('mouseup', this.stopResize.bind(this));
    }

    resize(event: MouseEvent) {
        if (this.side === 'left' || this.side === 'right') {
            this.temp_x = event.clientX;
        } 
        if (this.side === 'top' || this.side === 'bottom') {
            this.temp_y = event.clientY;
        }
    }

    stopResize() {
        if (this.temp_x !== 0) this.x = this.temp_x;
        if (this.temp_y !== 0) this.y = this.temp_y;
        this.temp_x = 0;
        this.temp_y = 0;
        document.removeEventListener('mousemove', this.resize.bind(this));
        document.removeEventListener('mouseup', this.stopResize.bind(this));
    }
}
