// ====================================================================================================
// 영역(Area) 생성 및 관리
// ====================================================================================================
import $g from '../utils/$g';
import { Border } from './Border';



export class Area {
    // 영역 중요 속성
    id: string;
    // 영역 위치 및 크기
    x: number;
    y: number;
    width: number;
    height: number;
    // 크기 조절에서 사용할 임시 속성
    temp_x: number = 0;
    temp_y: number = 0;
    temp_width: number = 0;
    temp_height: number = 0;
    // 토글 가능 속성
    is_resizable: boolean;
    is_splitable: boolean;
    is_joinable: boolean;

    constructor({ id, x, y, width, height, is_resizable, is_splitable, is_joinable }: AreaProps) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.is_resizable = is_resizable;
        this.is_splitable = is_splitable;
        this.is_joinable = is_joinable;
    }

    createElement(): HTMLDivElement {
        // 요소 생성
        const area = document.createElement('div');
        // 속성 설정
        area.id = this.id;
        area.classList.add('area');
        // 위치 및 크기 설정
        area.style.left = `${this.x}vw`;
        area.style.top = `${this.y}vh`;
        area.style.width = `${this.width}vw`;
        area.style.height = `${this.height}vh`;
        // 객체 저장
        $g.elements.set(this.id, this);

        // 모서리 추가
        // 위
        const border_top = new Border({
            id: (Math.random().toString(36).substring(2, 14)),
            side: 'top',
            x: this.x,
            y: this.y,
            size: this.width,
            area: this.id,
        });
        // 아래
        const border_bottom = new Border({
            id: (Math.random().toString(36).substring(2, 14)),
            side: 'bottom',
            x: this.x,
            y: this.y + this.height,
            size: this.width,
            area: this.id,
        });
        // 왼쪽
        const border_left = new Border({
            id: (Math.random().toString(36).substring(2, 14)),
            side: 'left',
            x: this.x,
            y: this.y,
            size: this.height,
            area: this.id,
        });
        const border_right = new Border({
            id: (Math.random().toString(36).substring(2, 14)),
            side: 'right',
            x: this.x + this.width,
            y: this.y,
            size: this.height,
            area: this.id,
        });

        area.appendChild(border_top.createElement());
        area.appendChild(border_bottom.createElement());
        area.appendChild(border_left.createElement());
        area.appendChild(border_right.createElement());

        return area;
    }

    mousedown(event: MouseEvent) {
        console.log('Area mousedown');
    }
}
