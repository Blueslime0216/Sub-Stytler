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