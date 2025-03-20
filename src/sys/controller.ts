// ====================================================================================================
// 모든 입력에 대한 처리를 실행하는 클래스가 선언된 코드
// ====================================================================================================
// 키보드와 마우스 가져오기
import $keyboard from "./keyboard";
// import $mouse from "./mouse";
// $g 가져오기
import $g from "../utils/$g";



// ==================================================
// 타입들 선언
// ==================================================
// ---------- 컨트롤러 클래스 형태 ----------
type IController = Record<eventTypes, Function>;

// ==================================================
// 컨트롤러 클래스
// ==================================================
const controller:IController = {
    // 키보드 이벤트
    keydown: keydown,
    tab: tab,
    holdstart: holdstart,
    holding: holding,
    holdend: holdend,
    keyup: keyup,

    // 마우스 이벤트
    mousedown: mousedown,
    mouseclick: mouseclick,
    mouseholdstart: mouseholdstart,
    mouseholding: mouseholding,
    mousemove: mousemove,
    hover: hover,
    enter: enter,
    leave: leave,
    mousedragstart: mousedragstart,
    mousedrag: mousedrag,
    mousedragend: mousedragend,
    mouseup: mouseup,
    mousewheel: mousewheel,

    // 시스템 이벤트
    resize: resize,
    load: load,
};
export default controller;


// ==================================================
// 자주 사용되는 코드 함수화
// ==================================================
// 키 배열이 같은지 비교하는 함수
function _areKeysEqual(arr1:string[], arr2:string[]):boolean {
    // 배열 길이가 다르면 바로 false 반환
    if (arr1.length !== arr2.length) return false;
  
    // 길이가 같은 경우, 같은 키인지 비교
    return arr1.every((value, index) => value === arr2[index]);
};


// ==================================================
// 각 이벤트에 실행될 함수들
// ==================================================
// --------------------------------------------------
// 키보드 관련
// --------------------------------------------------
// ==================== keydown ====================
function keydown(e:KeyboardEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const keycode = e.code; // 키 코드
    // ---------- keydown 실행 로그 남기기 ----------
    if ($g.debug.print_when_keydown) {
        console.log(`[%ckeydown%c 실행됨] : %c${keycode}`,
                    "color:yellow;","","color: cyan; font-weight: bold;");
    }
    // ---------- keydown 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.keydown.forEach((set) => {
        // 키가 일치하면 해당 함수 실행
        if (_areKeysEqual(set.keys, $keyboard.keymap)) {
            set.func(e);
        };
    });
}
if (false) {   // 형식 예제 
    $g.eventFunctions.keydown.push({
        keys: ['KeyR'],
        func: (e:KeyboardEvent) => {
            console.log('R 누름');
        }
    });
    $g.eventFunctions.holding.push({
        keys: ['KeyR'],
        func: (e:KeyboardEvent) => {
            console.log('R 홀딩');
        }
    });
    $g.eventFunctions.holdstart.push({
        keys: ['KeyR'],
        func: (e:KeyboardEvent) => {
            console.log('R 홀드 시작');
        }
    });
    $g.eventFunctions.keyup.push({
        keys: ['KeyR'],
        func: (e:KeyboardEvent) => {
            console.log('R 떼기');
        }
    });
}

// ==================== tab ====================
function tab(e:KeyboardEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const keycode = e.code; // 키 코드
    // ---------- tab 실행 로그 남기기 ----------
    if ($g.debug.print_when_tab) {
        console.log(`[%ctab%c 실행됨] : %c${keycode}`,
                    "color:yellow;","","color: cyan; font-weight: bold;");
    }
    // ---------- tab 배열에서 해당하는 함수 실행 ----------
    // 엉터리 코드임, 고치자
    // $g.eventFunctions.tab.forEach((set) => {
    //     set.func(e);
    // });
}

// ==================== holdstart ====================
function holdstart(e:KeyboardEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const keycode = e.code; // 키 코드
    // ---------- holdstart 실행 로그 남기기 ----------
    if ($g.debug.print_when_holdstart) {
        console.log(`[%choldStart%c 실행됨] : %c${keycode}`,
                    "color:yellow;","","color: cyan; font-weight: bold;");
    }
    // ---------- holdstart 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.holdstart.forEach((set) => {
        // 키가 일치하면 해당 함수 실행
        if (_areKeysEqual(set.keys, $keyboard.keymap)) {
            set.func(e);
        };
    });
}

// ==================== holding ====================
function holding(e:KeyboardEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const keycode = e.code; // 키 코드
    // ---------- holding 실행 로그 남기기 ----------
    if ($g.debug.print_when_holding) {
        console.log(`[%cholding%c 실행됨] : %c${keycode}`,
                    "color:yellow;","","color: cyan; font-weight: bold;");
    }
    // ---------- holding 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.holding.forEach((set) => {
        // 키가 일치하면 해당 함수 실행
        if (_areKeysEqual(set.keys, $keyboard.keymap)) {
            set.func(e);
        };
    });
}

// ==================== holdend ====================
function holdend(e:KeyboardEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const keycode = e.code; // 키 코드
    // ---------- holdend 실행 로그 남기기 ----------
    if ($g.debug.print_when_holdend) {
        console.log(`[%choldEnd%c 실행됨] : %c${keycode}`,
                    "color:yellow;","","color: cyan; font-weight: bold;");
    }
    // ---------- holdend 배열에서 해당하는 함수 실행 ----------
    // $g.eventFunctions.holdend.forEach((set) => {
    //     // 키가 일치하면 해당 함수 실행
    //     if (_areKeysEqual(set.keys, $keyboard.keymap)) {
    //         set.func(e);
    //     };
    // });
}

// ==================== keyup ====================
function keyup(e:KeyboardEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const keycode = e.code; // 키 코드
    // ---------- keyup 실행 로그 남기기 ----------
    if ($g.debug.print_when_keyup) {
        console.log(`[%ckeyup%c 실행됨] : %c${keycode}`,
                    "color:yellow;","","color: cyan; font-weight: bold;");
    }
    // ---------- keyup 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.keyup.forEach((set) => {
        // 키가 일치하면 해당 함수 실행
        if (_areKeysEqual(set.keys, [keycode])) {
            set.func(e);
        };
    });
}


// --------------------------------------------------
// 마우스 관련
// --------------------------------------------------
// ==================== mousedown ====================
function mousedown(e:MouseEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const e_mouse = e as MouseEvent;
    const button = ['left', 'wheel', 'right'][e_mouse.button] as TMouseKeys;
    // ---------- mousedown 실행 로그 남기기 ----------
    if ($g.debug.print_when_mousedown) {
        console.log(`[Run %cmousedown%c] : %c${button}%c`,
                "color:yellow;","","color: cyan; font-weight: bold;","");
    }
    // ---------- mousedown 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mousedown.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.mousedown?.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
}
if (false) {   // 형식 예제
    $g.eventFunctions.mousedown.push({
        mouse: 'left',
        func: (e:MouseEvent) => {
            console.log('마우스 좌클릭');
        }
    });
}

// ==================== mouseclick ====================
function mouseclick(e:MouseEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const e_mouse = e as MouseEvent;
    const button = ['left', 'wheel', 'right'][e_mouse.button] as TMouseKeys;
    const clickCount = args[0][0] as number;
    const clickType = args[0][1] as mouseClickType;
    // ---------- mouseclick 실행 로그 남기기 ----------
    if ($g.debug.print_when_mouseclick) {
        console.log(`[Run %cmouseclick%c] : %c${button}%c, %c${clickCount}%c번 클릭, %c${clickType}`,
                    "color:yellow;","","color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;");
    }
    // ---------- mouseclick 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mouseclick.forEach((set) => {
        // 버튼, 클릭 횟수, 클릭 타입이 일치하면 해당 함수 실행
        if (set.mouse === button && set.clickCount === clickCount && set.clickType === clickType) {
            set.func(e);
        };
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.mouseclick?.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button && set.clickCount === clickCount && set.clickType === clickType) {
            set.func(e);
        };
    });
}
// 형식 예제
if (false) {
    $g.eventFunctions.mouseclick.push({
        mouse: 'left',
        clickCount: 1,
        clickType: 'unsure',
        func: (e:MouseEvent) => {
            console.log('마우스 좌클릭');
        }
    });
}

// ==================== mouseholdstart ====================
function mouseholdstart(e:MouseEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const e_mouse = e as MouseEvent;
    const button = ['left', 'wheel', 'right'][e_mouse.button] as TMouseKeys;
    // ---------- mouseholdstart 실행 로그 남기기 ----------
    if ($g.debug.print_when_mouseholdstart) {
        console.log(`[Run %cmouseholdstart%c] : %c${button}%c`,
                "color:yellow;","","color: cyan; font-weight: bold;","");
    }
    // ---------- mouseholdstart 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mouseholdstart.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.mouseholdstart?.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
}

// ==================== mouseholding ====================
function mouseholding(e:MouseEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const e_mouse = e as MouseEvent;
    const button = ['left', 'wheel', 'right'][e_mouse.button] as TMouseKeys;
    // ---------- mouseholding 실행 로그 남기기 ----------
    if ($g.debug.print_when_mouseholding) {
        console.log(`[Run %cmouseholding%c] : %c${button}%c`,
                "color:yellow;","","color: cyan; font-weight: bold;","");
    }
    // ---------- mouseholding 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mouseholding.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.mouseholding?.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
}

// ==================== mousemove ====================
function mousemove(e:MouseEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    // ---------- mousemove 실행 로그 남기기 ----------
    if ($g.debug.print_when_mousemove) {
        console.log(`[Run %cmove%c]`,
                "color:yellow;","");
    }
    // ---------- mousemove 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mousemove.forEach((set) => {
        set.func(e);
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.mousemove?.forEach((set) => {
        set.func(e);
    });
}

// ==================== hover ====================
function hover(e:MouseEvent, ...args:any) {
    // ---------- hover 실행 로그 남기기 ----------
    if ($g.debug.print_when_hover) {
        console.log(`[Run %chover%c]`,
                "color:yellow;","");
    }
    // ---------- hover 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mouseholding.forEach((set) => {
        set.func(e);
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.hover?.forEach((set) => {
        set.func(e);
    });
}

// ==================== enter ====================
function enter(e:MouseEvent, ...args:any) {
    // ---------- enter 실행 로그 남기기 ----------
    if ($g.debug.print_when_enter) {
        console.log(`[Run %center%c]`,
                "color:yellow;","");
    }
    // ---------- enter 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.enter.forEach((set) => {
        set.func(e);
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.enter?.forEach((set) => {
        set.func(e);
    });
}

// ==================== leave ====================
function leave(e:MouseEvent, ...args:any) {
    // ---------- leave 실행 로그 남기기 ----------
    if ($g.debug.print_when_leave) {
        console.log(`[Run %cleave%c]`,
                "color:yellow;","");
    }
    // ---------- leave 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.leave.forEach((set) => {
        set.func(e);
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.leave?.forEach((set) => {
        set.func(e);
    });
}

// ==================== mousedragstart ====================
function mousedragstart(e:MouseEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const e_mouse = e as MouseEvent;
    const button = ['left', 'wheel', 'right'][e_mouse.button] as TMouseKeys;
    // ---------- mousedragstart 실행 로그 남기기 ----------
    if ($g.debug.print_when_mousedragstart) {
        console.log(`[Run %cmousedragstart%c] : %c${button}%c`,
                "color:yellow;","","color: cyan; font-weight: bold;","");
    }
    // ---------- mousedragstart 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mousedragstart.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.mousedragstart?.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
}

// ==================== mousedrag ====================
function mousedrag(e:MouseEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    //@ts-ignore e_mouse의 .button을 사용하지 않아서 에러 뜸, 그냥 무시하자
    const e_mouse = e as MouseEvent;
    const button = args[0] as TMouseKeys;
    // ---------- mousedrag 실행 로그 남기기 ----------
    if ($g.debug.print_when_mousedrag) {
        console.log(`[Run %cmousedrag%c] : %c${button}%c`,
                "color:yellow;","","color: cyan; font-weight: bold;","");
    }
    // ---------- mousedrag 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mousedrag.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            // button을 인자로 보냄
            set.func(e, button);
        };
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.mousedrag?.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            // button을 인자로 보냄
            set.func(e, button);
        };
    });
}

// ==================== mousedragend ====================
function mousedragend(e:MouseEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const e_mouse = e as MouseEvent;
    const button = ['left', 'wheel', 'right'][e_mouse.button] as TMouseKeys;
    // ---------- mousedragend 실행 로그 남기기 ----------
    if ($g.debug.print_when_mousedragend) {
        console.log(`[Run %cmousedragend%c] : %c${button}%c`,
                "color:yellow;","","color: cyan; font-weight: bold;","");
    }
    // ---------- mousedragend 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mousedragend.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.mousedragend?.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
}

// ==================== mouseup ====================
function mouseup(e:MouseEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const e_mouse = e as MouseEvent;
    const button = ['left', 'wheel', 'right'][e_mouse.button] as TMouseKeys;
    // ---------- mouseup 실행 로그 남기기 ----------
    if ($g.debug.print_when_mouseup) {
        console.log(`[Run %cmouseup%c] : %c${button}%c`,
                "color:yellow;","","color: cyan; font-weight: bold;","");
    }
    // ---------- mouseup 배열에서 해당하는 함수 실행 ----------
    $g.eventFunctions.mouseup.forEach((set) => {
        // 버튼이 일치하면 해당 함수 실행
        if (set.mouse === button) {
            set.func(e);
        };
    });
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    if (target?.mouseup) {
        target.mouseup.forEach((set) => {
            // 버튼이 일치하면 해당 함수 실행
            if (set.mouse === button) {
                set.func(e);
            };
        });
    }
}

// ==================== mousewheel ====================
function mousewheel(e:WheelEvent, ...args:any) {
    // ---------- 인자 정리하기 ----------
    const delta = e.deltaY; // 휠 이동량
    // ---------- mousewheel 실행 로그 남기기 ----------
    if ($g.debug.print_when_mousewheel) {
        console.log(`[Run %cmousewheel%c] : %c${delta}`,
                "color:yellow;","","color: cyan; font-weight: bold;");
    }
    // ---------- mousewheel 배열에 담긴 각 함수 실행 ----------
    $g.eventFunctions.mousewheel.forEach(func => func());
    // ---------- 요소에서 해당하는 함수 실행 ----------
    const target:Template = e.target as Template;
    const targetId = target.id;
    if (!targetId) return;
    const obj:Template = $g.elements.get(targetId) as Template;
    if (!obj) return;
    obj.mousewheel?.forEach((func) => {
        func(e);
    });
}


// --------------------------------------------------
// 시스템 관련
// --------------------------------------------------
// ==================== resize ====================
function resize(e:UIEvent, ...args:any) {
    // ---------- resize 실행 로그 남기기 ----------
    if ($g.debug.print_when_resize) {
        console.log(`[Run %cresize%c]`,
                "color:yellow;","");
    }
    // ---------- resize 배열에 담긴 각 함수 실행 ----------
    $g.eventFunctions.resize.forEach(func => func());
}

// ==================== load ====================
function load(e:UIEvent, ...args:any) {
    // ---------- load 실행 로그 남기기 ----------
    if ($g.debug.print_when_load) {
        console.log(`[Run %cload%c]`,
                "color:yellow;","");
    }
    // ---------- load 배열에 담긴 각 함수 실행 ----------
    $g.eventFunctions.load.forEach(func => func());
}