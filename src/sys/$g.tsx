// ====================================================================================================
// 다양한 코드에서 사용될 변수들을 정의하는 파일입니다.
// ====================================================================================================
import { area } from "framer-motion/client";
import { AreaResizer } from "./area/AreaController";
import controller from "./controller";



// id를 생성하는 함수
export function genID():string {
    // 랜덤 문자열 생성
    return Math.random().toString(36).substring(2, 16);
}

// 전역 변수들을 담은 객체
class _$g{
    width:number = window.innerWidth;   // 브라우저 너비
    height:number = window.innerHeight; // 브라우저 높이
    AreaHandleThickness:number = 20;    // Area 컨트롤러 두께
    Workspace:IWorkspaceArea[] = [];    // 워크스페이스로 변한된 Area들
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

// 브라우저 크기 업데이트하는 함수
function resizer () {
    // $g의 브라우저 크기 업데이트
    $g.width = window.innerWidth;
    $g.height = window.innerHeight

    // (디버깅) 콘솔에 바뀐 크기 출력
    // console.log(
    // `[브라우저 크기 업데이트] width: %c${$g.width}%c, height: %c${$g.height}%c`,
    // "color: cyan; font-weight: bold;","",
    // "color: cyan; font-weight: bold;","");

    // $g.Areas 배열에 담긴 모든 Area의 크기를 변경된 브라우저 사이즈에 맞게 업데이트하기
    AreaResizer();
};
// resize에 등록
controller.resize.push(resizer);

export default $g;