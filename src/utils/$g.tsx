// ====================================================================================================
// 전역에서 사용될 변수/함수 등을 정의해두는 파일
// ====================================================================================================



// id를 생성하는 함수
export function genID():string {
    // 랜덤 문자열 생성
    return Math.random().toString(36).substring(2, 16);
};

// 전역 변수들을 담은 객체
class _$g{
    AreaHandleThickness:number = 20;    // Area 컨트롤러 두께
    // Workspace:IWorkspaceArea[] = [];    // 워크스페이스로 변한된 Area들
};
const $g = new _$g();

// area가 가질 속성들
// $g.Areas.push({
//     id: genID(),            // Area ID 코드
//     type: "area",           // Area Type (종류)

//     x: x,                   // 왼쪽 상단의 X 좌표
//     y: y,                   // 왼쪽 상단의 Y 좌표
//     width: width,           // 너비 (0 ~ 10000)으로 (0.00% ~ 100.00%)로 적용된다
//     height: height,         // 높이 (0 ~ 10000)으로 (0.00% ~ 100.00%)로 적용된다
//     x_tmp: 0,                   // 조정되는 중 사용될 이동정도 임시 값
//     y_tmp: 0,                   // 조정되는 중 사용될 이동정도 임시 값
//     width_tmp: 0,           // 조정되는 중 사용될 이동정도 임시 값
//     height_tmp: 0,         // 조정되는 중 사용될 이동정도 임시 값

//     isSelected: false,      // 선택 여부, 단축키가 눌렸을 때 어떤 Area에 들어온 입력인지 구분하기 위해 선언
//     isMinimize: false,      // 최소화 여부
//     moduleType: "none",     // 안에 담길 모듈의 종류
// });

export default $g;