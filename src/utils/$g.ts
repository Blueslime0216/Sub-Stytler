// ====================================================================================================
// 전역에서 사용될 변수/함수 등을 정의해두는 파일
// ====================================================================================================
import { Area } from "../components/Area";
import { Border } from "../components/Border";



// 전역 변수들을 담은 객체
class _$g{
    // 전역 변수
    elements = new Map<string, Area | Border>(); // 객체 저장소

    // UI 관련
    AreaBorderThickness:number = 5;    // Area 컨트롤러 두께
};
const $g = new _$g();
export default $g;