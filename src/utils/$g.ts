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
        print_when_keydown: false,                                  print_when_keydown_tooltip: "키보드의 키를 누르면, 눌린 키를 콘솔에 출력함",
        print_when_tab: false,                                      print_when_tab_tooltip: "키보드의 키를 탭(누르고 바로 떼기)하면, 콘솔에 출력함",
        print_when_holdstart: false,                                print_when_holdstart_tooltip: "키보드의 키를 꾹 누르고 있기 시작하면, 콘솔에 출력함",
        print_when_holding: false,                                  print_when_holding_tooltip: "키보드의 키를 꾹 누르고 있는 중이라면, 계속 콘솔에 출력함",
        print_when_holdend: false,                                  print_when_holdend_tooltip: "키보드의 키를 꾹 누르고 있다가 떼면, 콘솔에 출력함",
        print_when_keyup: false,                                    print_when_keyup_tooltip: "키보드의 키가 떼지면, 콘솔에 출력함",

        // ---------- 마우스 관련 ----------
        print_when_mousedown: false,                                print_when_mousedown_tooltip: "마우스의 버튼이 눌리면, 해당 버튼을 콘솔에 출력함",
        print_when_mouseclick: false,                               print_when_mouseclick_tooltip: "마우스의 버튼이 클릭되면(누르고 바로 떼기), 해당 버튼을 콘솔에 출력함. 해당 클릭이 확실하지 않은지, 추가적인 클릭으로 취소되었는지, 확정적인지 같이 띄워줌",
        print_when_mouseholdstart: false,                           print_when_mouseholdstart_tooltip: "마우스의 버튼을 꾹 누르고 있기 시작하면, 해당 버튼을 콘솔에 출력함",
        print_when_mouseholding: false,                             print_when_mouseholding_tooltip: "마우스의 버튼을 꾹 누르고 있는 중이라면, 계속 콘솔에 출력함",
        print_when_mousemove: false,                                print_when_mousemove_tooltip: "마우스가 움직이면, 콘솔에 출력함",
        print_when_hover: false,                                    print_when_hover_tooltip: "empty",
        print_when_enter: false,                                    print_when_enter_tooltip: "empty",
        print_when_leave: false,                                    print_when_leave_tooltip: "empty",
        print_when_mousedragstart: false,                           print_when_mousedragstart_tooltip: "마우스의 버튼을 누르고 바로 움직이기 시작하면, 콘솔에 출력함",
        print_when_mousedrag: false,                                print_when_mousedrag_tooltip: "마우스를 누르고 바로 움직이는 드래그 중이라면, 계속 콘솔에 출력함",
        print_when_mousedragend: false,                             print_when_mousedragend_tooltip: "드래그가 끝나면, 콘솔에 출력함",
        print_when_mouseup: false,                                  print_when_mouseup_tooltip: "마우스의 버튼이 떼지면, 해당 버튼을 콘솔에 출력함",
        print_when_mousewheel: false,                               print_when_mousewheel_tooltip: "마우스 휠을 굴리면, 콘솔에 출력함",

        // ---------- UI 관련 ----------
        show_hitbox_for_adjacent_detection: false,                                                      show_hitbox_for_adjacent_detection_tooltip: "경계 조정을 시작할 때, 인접한 Area를 감지하기 위해 겹침을 감지하는 영역을 시각화해서 보여줌",
        hitbox_for_adjacent_detection_color: 'rgba(0, 0, 255, 0.5)',                                  hitbox_for_adjacent_detection_color_tooltip: "경계 조정을 시작할 때, 시각화된 인접한 Area 감지 히트박스의 색상",
        hitbox_for_adjacent_detection_delay: 500,                                                       hitbox_for_adjacent_detection_delay_tooltip: "경계 조정을 시작할 때, 시각화된 인접한 Area 감지 히트박스를 표시할 시간",
        highlight_area_when_adjacent_detection: false,                                                  highlight_area_when_adjacent_detection_tooltip: "경계 조정을 시작할 때, 인접하다고 감지된 Area를 하이라이트함",
        highlight_area_when_adjacent_detection___color: 'rgba(100, 100, 255, 0.5)',                   highlight_area_when_adjacent_detection___color_tooltip: "하이라이트 색상",
        highlight_area_when_adjacent_detection___time: 100,                                             highlight_area_when_adjacent_detection___time_tooltip: "하이라이트 지속 시간",
        highlight_area_when_adjacent_detection_with_direction: false,                                   highlight_area_when_adjacent_detection_with_direction_tooltip: "경계 조정을 시작할 때, 감지된 인접한 Area의 방향을 구분해서 강조 표시할지 여부",
        highlight_area_when_adjacent_detection_with_direction___left_top_color: 'rgba(100, 100, 255, 0.5)',    highlight_area_when_adjacent_detection_with_direction___left_top_color_tooltip: "인접한 Area의 왼쪽/위쪽 방향을 강조 표시할 때의 색상",
        highlight_area_when_adjacent_detection_with_direction___right_bottom_color: 'rgba(255, 100, 100, 0.5)',    highlight_area_when_adjacent_detection_with_direction___right_bottom_color_tooltip: "인접한 Area의 오른쪽/아래쪽 방향을 강조 표시할 때의 색상",
        highlight_area_when_adjacent_detection_with_direction___time: 100,                              highlight_area_when_adjacent_detection_with_direction___time_tooltip: "지속 시간",
        // 조절 가능 영역 표시 관련
        show_adjustable_area_range: true,                           show_adjustable_area_range_tooltip: "empty", // 조절 가능 영역을 표시할지 여부
        adjustable_area_range_color: 'rgba(100, 255, 100, 0.5)',  adjustable_area_range_color_tooltip: "empty", // 조절 가능 영역 색상
        adjustable_area_range_time: 200,                            adjustable_area_range_time_tooltip: "empty", // 조절 가능 영역 표시 시간

        // ---------- 시스템 관련 ----------
        print_when_resize: false,                                   print_when_resize_tooltip: "empty",
        print_when_load: false,                                     print_when_load_tooltip: "empty",
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



