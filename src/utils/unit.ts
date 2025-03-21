// ====================================================================================================
// Position이나 Size 같이 기본적으로 사용되는 것들을 클래스로 선언해두는 파일
// ====================================================================================================

export class Position implements TPosition {
    x: number|null;
    y: number|null;
    constructor(x: number|null, y: number|null) {
        this.x = x;
        this.y = y;
    }
};

export class Size implements TSize {
    width: number|null;
    height: number|null;
    constructor(width: number|null, height: number|null) {
        this.width = width;
        this.height = height;
    }
};

// 현재 vw, vh단위를 px로 변환하는 함수
export function vw2px(vw: number): number {
    return vw * window.innerWidth / 100;
}
export function vh2px(vh: number): number {
    return vh * window.innerHeight / 100;
}
export function px2vw(px: number): number {
    return px / window.innerWidth * 100;
}
export function px2vh(px: number): number {
    return px / window.innerHeight * 100;
}

// 현재 방향의 반대를 반환하는 함수
export function getOppositeSide(side: TSide): TSide {
    switch (side) {
        case 'left': return 'right';
        case 'top': return 'bottom';
        case 'right': return 'left';
        case 'bottom': return 'top';
    }
}

/**
 * 화면에 박스를 표시하는 함수
 * 
 * @param arg.x - 박스의 왼쪽 위치를 나타내는 값 (vw 단위)
 * @param arg.y - 박스의 위쪽 위치를 나타내는 값 (vh 단위)
 * @param arg.width - 박스의 너비를 나타내는 값 (vw 단위)
 * @param arg.height - 박스의 높이를 나타내는 값 (vh 단위)
 * @param arg.color - 박스의 배경색 (기본값: 'rgba(0, 0, 0, 0.5)')
 * @param arg.time - 박스가 화면에 표시되는 시간 (밀리초 단위, 기본값: 100ms)
 */
export function showBox(arg: { id?:string, x: number, y: number, width: number, height: number, color?: string, time?: number }): void {
    const { id='empty', x, y, width, height, color = 'rgba(0, 0, 0, 0.5)', time = 100 } = arg;

    if (id !== 'empty') { // id가 지정된 경우
        // 이미 박스가 존재하는 경우 기존 박스를 삭제
        const box = document.getElementById(id);
        if (box) {
            document.body.removeChild(box);
        }
    }

    const box = document.createElement('div');
    box.id = id || '';
    box.style.position = 'fixed';
    box.style.left = `${x}vw`;
    box.style.top = `${y}vh`;
    box.style.width = `${width}vw`;
    box.style.height = `${height}vh`;
    box.style.backgroundColor = color;
    document.body.appendChild(box);
    setTimeout(() => {
        if (document.body.contains(box)) {
            document.body.removeChild(box);
        }
    }, time);
    
    // hitboxElement.style.left = `${hitbox.left}vw`;
    // hitboxElement.style.top = `${hitbox.top}vh`;
    // hitboxElement.style.width = `${hitbox.right - hitbox.left}vw`;
    // hitboxElement.style.height = `${hitbox.bottom - hitbox.top}vh`;
}