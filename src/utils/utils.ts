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