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
    AreaBorderThickness:number = 5;    // Area 컨트롤러 두께 (px)
    AreaMinWidth:number = 10;    // Area 최소 너비 (vw)
    AreaMinHeight:number = 10;    // Area 최소 높이 (vh)

    // ---------- 작업 중에 사용될 것들 ----------
    linkedAreas:Area[] = [];    // 연결된 Area들
    linkedBorders:Border[] = [];    // 연결된 Border들
    area_adjustable_range: { min: number; max: number } = {
        min: 0,
        max: 100
    };

    // 디버깅 관련
    debug:debugSettings = {
        // ---------- 키보드 관련 ----------
        print_when_keydown: false,
        print_when_tab: false,
        print_when_holdstart: false,
        print_when_holding: false,
        print_when_holdend: false,
        print_when_keyup: false,

        // ---------- 마우스 관련 ----------
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

        // ---------- UI 관련 ----------
        show_hitbox_for_adjacent_detection: false,
        hitbox_for_adjacent_detection_color: 'rgba(0, 0, 255, 0.5)',
        hitbox_for_adjacent_detection_delay: 500,
        highlight_area_when_adjacent_detection: false,  // 경계 조정을 시작할 때 감지된 인접한 영역을 강조 표시할지 여부
        highlight_area_when_adjacent_detection___color: 'rgba(100, 100, 255, 0.5)',
        highlight_area_when_adjacent_detection___time: 100,
        highlight_area_when_adjacent_detection_with_direction: false,  // 경계 조정을 시작할 때 감지된 인접한 영역의 방향을 구분해서 강조 표시할지 여부
        highlight_area_when_adjacent_detection_with_direction___color: 'rgba(100, 100, 255, 0.5)',
        highlight_area_when_adjacent_detection_with_direction___time: 100,
        // 조절 가능 영역 표시 관련
        show_adjustable_area_range: true, // 조절 가능 영역을 표시할지 여부
        adjustable_area_range_color: 'rgba(100, 255, 100, 0.5)', // 조절 가능 영역 색상
        adjustable_area_range_time: 200, // 조절 가능 영역 표시 시간

        // ---------- 시스템 관련 ----------
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



