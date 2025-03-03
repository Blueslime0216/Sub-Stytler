// ====================================================================================================
// 프로젝트에서 사용할 타입 정의
// ====================================================================================================


// ----------------------------------------------------------------------------------------------------
// 기본적으로 사용될 단위 같은 것들
// ----------------------------------------------------------------------------------------------------
type TPosition = {
    x: number|null;
    y: number|null;
};

// 크기
type TSize = {
    width: number|null;
    height: number|null;
};

// ----------------------------------------------------------------------------------------------------
// 커스텀 HTML 요소 타입
// ----------------------------------------------------------------------------------------------------
interface Template {
    id?: string;

    // 키보드 관련
    keydown?: keydownFuncSet[];
    holdstart?: keydownFuncSet[];
    holding?: keydownFuncSet[];
    keyup?: keydownFuncSet[];

    // 마우스 관련
    mousedown?: mouseFuncSet[];
    mouseclick?: mouseFuncSet_click[];
    mouseholdstart?: mouseFuncSet[];
    mouseholding?: mouseFuncSet[];
    mousemove?: mouseFuncSet[];
    hover?: mouseFuncSet[];
    enter?: mouseFuncSet[];
    leave?: mouseFuncSet[];
    mousedragstart?: mouseFuncSet[];
    mousedrag?: mouseFuncSet[];
    mousedragend?: mouseFuncSet[];
    mouseup?: mouseFuncSet[];
    mousewheel?: Function[];
}

// ----------------------------------------------------------------------------------------------------
// 마우스 관련
// ----------------------------------------------------------------------------------------------------
// 마우스 입력 종류
type TMouseKeys = "left"|"wheel"|"right";
// 마우스 휠 방향
type IWheelDelta = {
    x: number;  // X 방향 거리
    y: number;  // Y 방향 거리
};
// 마우스 드래그된 거리
type IMouseDraggedSize = {
    [key in TMouseKeys]: Size;
};

// 마우스 클릭 이벤트의 종류
type mouseClickType = "unsure"|"sure"|"cancel";

// 마우스 클릭된 키들 타입
type IMouseKeys_boolean = {
    [key in TMouseKeys]:boolean;
};
type IMouseKeys_number = {
    [key in TMouseKeys]:number;
};
type IMouseKeys_position = {
    [key in TMouseKeys]:Position;
};
type IMouseTarget = HTMLElement|Template|null;
type IMouseTargets = {
    [key in TMouseKeys]: IMouseTarget;
};

// ----------------------------------------------------------------------------------------------------
// 특정 키가 눌릴 때 실행될 함수들이 저장되어 있을 형태
// ----------------------------------------------------------------------------------------------------
interface EventFunctions {
    // 키보드 이벤트
    keydown: keydownFuncSet[];
    holdstart: keydownFuncSet[];
    holding: keydownFuncSet[];
    keyup: keydownFuncSet[];

    // 마우스 이벤트
    mousedown: mouseFuncSet[];
    mouseclick: mouseFuncSet_click[];
    mouseholdstart: mouseFuncSet[];
    mouseholding: mouseFuncSet[];
    mousemove: mouseFuncSet[];
    hover: mouseFuncSet[];
    enter: mouseFuncSet[];
    leave: mouseFuncSet[];
    mousedragstart: mouseFuncSet[];
    mousedrag: mouseFuncSet[];
    mousedragend: mouseFuncSet[];
    mouseup: mouseFuncSet[];
    mousewheel: Function[];

    // 시스템 이벤트
    resize: Function[];
    load: Function[];
};
// ---------- 실행될 이벤트 종류 ----------
// 전체 이벤트
type eventTypes = eventTypes_keyboards | eventTypes_mouses | eventTypes_systems;
// 키보드 이벤트
type eventTypes_keyboards = 'keydown'|'tab'|'holdstart'|'holding'|'holdend'|'keyup';
// 마우스 이벤트
type eventTypes_mouses = 'mousedown'|'mouseclick'|'mouseholdstart'|'mouseholding'|'mousemove'|'hover'|'enter'|'leave'|'mousedragstart'|'mousedrag'|'mousedragend'|'mouseup'|'mousewheel';
// 시스템 이벤트
type eventTypes_systems = 'resize'|'load';

// ---------- 실행될 이벤트 함수 저장 형태 ----------
// 특정 키가 눌릴 때 실행될 함수 형태
interface keydownFuncSet {
    // 눌릴 키들
    keys: Array<KeyboardEvent['code']>;
    // 실행될 함수
    func: Function;
};
// 특정 마우스 입력이 있을 때 실행될 함수 형태
interface mouseFuncSet {
    // 눌릴 마우스 버튼
    mouse: TMouseKeys;
    // 실행될 함수
    func: Function;
};
// 클릭인 경우
interface mouseFuncSet_click {
    // 눌릴 마우스 버튼
    mouse: TMouseKeys;
    // 몇번 클릭인지
    clickCount: number;
    // 함수 타입
    clickType: mouseClickType;
    // 실행될 함수
    func: Function;
}

// ----------------------------------------------------------------------------------------------------
// 특정 디버그를 on/off 할 수 있는 값들을 모아둔 객체
// ----------------------------------------------------------------------------------------------------
interface debugSettings {
    // 키보드 관련
    print_when_keydown: boolean;
    print_when_tab: boolean;
    print_when_holdstart: boolean;
    print_when_holding: boolean;
    print_when_holdend: boolean;
    print_when_keyup: boolean;

    // 마우스 관련
    print_when_mousedown: boolean;
    print_when_mouseclick: boolean;
    print_when_mouseholdstart: boolean;
    print_when_mouseholding: boolean;
    print_when_mousemove: boolean;
    print_when_hover: boolean;
    print_when_enter: boolean;
    print_when_leave: boolean;
    print_when_mousedragstart: boolean;
    print_when_mousedrag: boolean;
    print_when_mousedragend: boolean;
    print_when_mouseup: boolean;
    print_when_mousewheel: boolean;

    // 시스템 관련
    print_when_resize: boolean;
    print_when_load: boolean;
};

// ----------------------------------------------------------------------------------------------------
// 기타
// ----------------------------------------------------------------------------------------------------
// // 모듈 종류
// type TModuleType = 'none'|'empty'
// // 워크스페이스에 저장될 Area들의 형태
// interface IWorkspaceArea {
//     x:number; // X 좌표 0 ~ 10000 (%값)
//     y:number; // Y 좌표 0 ~ 10000 (%값)
//     width:number; // 너비 0 ~ 10000 (%값)
//     height:number; // 높이 0 ~ 10000 (%값)

//     isMinimize:boolean; // 숨김 여부 (기능 구현 예정)
//     moduleType:string; // 안에 담길 모듈의 종류
// }

interface AreaProps extends Custom_Class_Setup {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    temp_x?: number;
    temp_y?: number;
    temp_width?: number;
    temp_height?: number;
    is_resizable: boolean;
    is_splitable: boolean;
    is_joinable: boolean;
}
  
interface BorderProps extends Custom_Class_Setup {
    id: string;
    side: 'top'|'bottom'|'left'|'right';
    x: number;
    y: number;
    size: number;
    temp_x?: number;
    temp_y?: number;
    temp_size?: number;
    area: Area;
}
  
interface State {
    isResizing: boolean;
    activeBorder: string | null;
    areas: Map<string, AreaProps>;
    borders: Map<string, BorderProps>;
}

// interface EventTarget extends EventTarget {
//     id?: string;
// }
interface Custom_Class_Setup {
    id?: string;

    mousedown?: (event: MouseEvent) => void;
}