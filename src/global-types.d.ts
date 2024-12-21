// ====================================================================================================
// 모든 코드에서 기본적으로 사용할 타입들을 정의해두는 파일
// ====================================================================================================

// 마우스 입력 종류
type TMouseKeys = "left"|"wheel"|"right";

type TId = {
    type:string;
    id:string;
};

interface IArea {
    id:string; // 16자리 문자열 ID
    type:string; // Area Type (종류)

    x:number; // X 좌표 0 ~ 10000 (%값)
    y:number; // Y 좌표 0 ~ 10000 (%값)
    width:number; // 너비 0 ~ 10000 (%값)
    height:number; // 높이 0 ~ 10000 (%값)
    x_tmp?:number; // X 좌표 0 ~ 10000 (%값)
    y_tmp?:number; // Y 좌표 0 ~ 10000 (%값)
    width_tmp?:number; // 너비 0 ~ 10000 (%값)
    height_tmp?:number; // 높이 0 ~ 10000 (%값)

    isSelected:boolean; // 선택 여부 (기능 구현 예정)
    isMinimize:boolean; // 숨김 여부 (기능 구현 예정)
    moduleType:string; // 안에 담길 모듈의 종류

    children?:React.ReactNode; // 내부에 추가될 모듈
};

interface IArea_needValues {
    id:string;
    
    x:number;
    y:number;
    width:number;
    height:number;
    
    isSelected:boolean;
    isMinimize:boolean;
    children:React.ReactNode;
};

interface IArea_needValues_tmp {
    x_tmp?:number;
    y_tmp?:number;
    width_tmp?:number;
    height_tmp?:number;
};
