// ====================================================================================================
// 전역에서 사용될 변수/함수 등을 정의해두는 파일
// ====================================================================================================
import { Area } from "../components/Area/Area";
import { Border } from "../components/Area/Border";



// 전역 변수들을 담은 객체
class _$g{
    // 불러온 코드들
    imported:string[] = [];

    // ---------- 고급 설정 관련 ----------
    // 키 입력 관련
    mouseHoldingStartTime:number = 500;   // 홀딩으로 인정할 시간 (ms)
    mouseMultiClickEndTime:number = 500;   // 추가적인 클릭을 기다릴 시간 (ms)
    // UI 관련
    AreaBorderThickness:number = 5;    // Area 컨트롤러 두께

    // 디버깅 관련
    debug:debugSettings = {
        // 키보드 관련
        print_when_keydown: false,
        print_when_tab: false,
        print_when_holdstart: false,
        print_when_holding: false,
        print_when_holdend: false,
        print_when_keyup: false,

        // 마우스 관련
        print_when_mousedown: false,
        print_when_mouseclick: false,
        print_when_mouseholdstart: false,
        print_when_mouseholding: false,
        print_when_mousemove: false,
        print_when_hover: false,
        print_when_enter: false,
        print_when_leave: false,
        print_when_mousedragstart: false,
        print_when_mousedrag: false,
        print_when_mousedragend: false,
        print_when_mouseup: false,
        print_when_mousewheel: false,

        // 시스템 관련
        print_when_resize: false,
        print_when_load: false,
    }

    // 특정 이벤트에 실행될 함수들
    eventFunctions:EventFunctions = {
        // 키보드 이벤트
        keydown:[],
        holdstart:[],
        holding:[],
        keyup:[],

        // 마우스 이벤트
        mousedown:[],
        mouseclick:[],
        mouseholdstart:[],
        mouseholding:[],
        mousemove:[],
        hover:[],
        enter:[],
        leave:[],
        mousedragstart:[],
        mousedrag:[],
        mousedragend:[],
        mouseup:[],
        mousewheel:[],
        
        // 시스템 이벤트
        resize:[],
        load:[]
    };

    // 전역 변수
    elements = new Map<string, Template|Area|Border>(); // 객체 저장소
};
const $g = new _$g();
export default $g;



