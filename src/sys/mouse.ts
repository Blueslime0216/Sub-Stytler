// ====================================================================================================
// 마우스 입력에 대한 정보가 담겨있는 클래스가 선언된 파일
// 이 클래스 안에 마우스 입력에 관한 정보가 저장되고, 불러올 수 있다
// 마우스 입력을 받으면 적절하게 처리해서 알맞은 컨트롤러를 실행시킨다
// ====================================================================================================
import $g from "../utils/$g";
import { Position, Size } from "../utils/unit";
import controller from "./controller";


/**
 * 마우스 move 함수 실행 시 해당 이벤트 실행의 원인이 move인지 drag인지 구분하기 위한 타입
 * 
 * - *move*는 마우스 좌표가 변할 때만 호출된다.
 * 
 * - *drag*는 움직일 때도 가만히 있을 때도 모두 호출되며, 가만히 있을 때 호출되는 건 일정한 주기를 갖고 호출된다.
 */
type TMouseMoveCause = "move"|"drag";



class Mouse {
    // ==================================================
    // 값 선언
    // ==================================================
    // 마우스 위치 관련
    position:TPosition = new Position(null, null); // 마우스 위치 (px)
    position_offset:TPosition = new Position(null, null); // 마우스 모듈 내에서의 상대 위치 (px)
    
    // 마우스 연속 클릭 횟수를 저장할 변수
    clickCount:IMouseKeys_number = { left: 0, wheel: 0, right: 0 };

    // 마우스 클릭 관련
    // 각 마우스 누른 여부 (클릭이건 드래그건 암튼 눌려졌는가)
    isDown:IMouseKeys_boolean = { left: false, wheel: false, right: false };
    // 각 마우스 누르기 시작 지점
    downStartPosition:IMouseKeys_position = { left: new Position(null, null), wheel: new Position(null, null), right: new Position(null, null) };
    // 각 마우스 드래그 상태 여부
    isDragging:IMouseKeys_boolean = { left: false, wheel: false, right: false };
    // 마우스가 드래그 된 거리
    draggedSize:IMouseDraggedSize = { left: new Size(null, null), wheel: new Size(null, null), right: new Size(null, null) };
    // 휠 방향
    wheelDelta:IWheelDelta = { x: 0, y: 0 };
    // 클릭된 요소
    downTarget:IMouseTargets = { left: null, wheel: null, right: null };
    // 지금 마우스 아래에 있는 요소
    moveTarget:IMouseTarget = null;
    // 마우스 클릭 해제할 때 아래에 있는 요소
    upTarget:IMouseTargets = { left: null, wheel: null, right: null };


    // 마우스를 누르면
    down(e: MouseEvent) {
        // ---------- 브라우저 기본 이벤트 실행 방지 ----------
        e.preventDefault();

        // -------------------- $mouse 값 업데이트 --------------------
        // 어떤 버튼이 눌렸는지 저장
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        // 마우스 클릭 시작 위치 저장
        $mouse.downStartPosition[button] = { x: e.clientX, y: e.clientY }; 
        // 눌렸다고 표시하기
        $mouse.isDown[button] = true;
        // 클릭된 요소 저장
        $mouse.downTarget[button] = e.composedPath()[0] as HTMLElement;

        // (디버깅) 클릭 됐을 때 각 키 표시 상태 로그 남기기
        if (false){
            const value = 'isDown';
            const color = { true: "lightgreen", false: "gray" };
            console.log(`[$mouse.${value}] : %c${$mouse[value].left}%c, %c${$mouse[value].wheel}%c, %c${$mouse[value].right}`,
                        `color: ${$mouse[value].left ? color.true : color.false}; font-weight: bold;`,"",
                        `color: ${$mouse[value].wheel ? color.true : color.false}; font-weight: bold;`,"",
                        `color: ${$mouse[value].right ? color.true : color.false}; font-weight: bold;`);
        }
        
        
        // ---------- 마우스가 클릭되었을 때 실행되는 컨트롤러 이벤트 실행 ----------
        controller.mousedown(e);

        // ==================================================
        // 드래그인지, 클릭인지, 홀딩인지 판별하는 코드
        // ==================================================
        // 변수를 선언한 걸 담고 ref를 시작하는 함수
        const start_ref = (button:TMouseKeys) => {
            // -------------------- ref에서 사용할 인자 선언하기 --------------------
            // 마우스를 누른 시간 저장
            const startTime = Date.now()

            const ref = () => {
                if (false){ // (디버깅) 마우스 클릭/드래그/홀딩 여부 판단 대기 중 로그
                    console.log(`%c${button}%c 버튼이 %c드래그%c/%c클릭%c/%c홀딩%c 중 무엇인지 %c대기 중...`,
                                "color: cyan; font-weight: bold;",""
                                ,"color: cyan; font-weight: bold;",""
                                ,"color: cyan; font-weight: bold;",""
                                ,"color: cyan; font-weight: bold;",""
                                ,"color: orange;");
                };
                if (false){ // (디버깅) 마우스 클릭/드래그/홀딩 여부 판단 결과 로그
                    const log = (e.x !== $mouse.position.x || e.y !== $mouse.position.y) ? "드래그%c라고" : (!$mouse.isDown[button]) ? "클릭%c이라고" : (Date.now() - startTime > $g.mouseHoldingStartTime) ? "홀딩%c이라고" : true;
                    if (log !== true){
                        console.log(`[%c판단 결과%c] %c${button}%c 버튼은 %c${log} 판단`,
                                    "color: orange; font-weight: bold;", "",
                                    "color: cyan; font-weight: bold;",""
                                    ,"color: cyan; font-weight: bold;",""
                        );
                    }
                };
                
                // --------------------------------------------------
                // 만약 마우스를 움직인다면 drag로 판단
                // --------------------------------------------------
                // 마우스가 눌린 시점에서의 좌표와 현재 좌표가 다르다면
                if (e.x !== $mouse.position.x || e.y !== $mouse.position.y) {
                    // ---------- clickend 가상 이벤트 실행 ----------
                    // 만약 이전에 클릭을 했었다면
                    if ($mouse.clickCount[button] !== 0) {
                        // 마우스 clickend 가상 이벤트 실행
                        $mouse.clickend(e);
                    }

                    // ---------- $mouse 값 업데이트 ----------
                    $mouse.isDragging[button] = true;

                    // ---------- 드래그 시작 시에 실행되는 컨트롤러 이벤트 실행 ----------
                    if (false){ // (디버깅) dragstart된 경우, 어떤 키가 어느 위치에서 드래그가 시작되었는지 로그 남기기
                        console.log(`[Mouse Drag Start] : %c${button}%c at (%c${$mouse.downStartPosition[button].x}%c, %c${$mouse.downStartPosition[button].y}%c)`,
                                    "color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","");
                    }
                    // mouse drag start 이벤트 실행
                    controller.mousedragstart(e);
                    // ---------- 드래그를 처리하는 ref ----------
                    const ref2 = () => {
                        // 드래그 거리 저장
                        $mouse.draggedSize[button] = new Size($mouse.position.x! - $mouse.downStartPosition[button].x!, $mouse.position.y! - $mouse.downStartPosition[button].y!);

                        // ---------- 드래그 중이라면 컨트롤러 이벤트 실행 ----------
                        if (false){  // 드래그 중이라면 콘솔에 드래그 중이라고 로그 남기기
                            console.log(`%cDrag%c : ${button} 버튼이 드래그 중입니다.`,
                                        "color: yellow; font-weight: bold;","");
                        }
                        // ---------- 드래그 중일 때 실행되는 컨트롤러 이벤트 실행 ----------
                        controller.mousedrag(e, button);

                        // 드래그 중이라면 계속해서 실행
                        if ($mouse.isDragging[button]){
                            requestAnimationFrame(ref2);
                        } else {
                            // 드래그가 끝나면 dragend 실행
                            // ---------- 마우스 드래그 종료 시에 실행되는 컨트롤러 이벤트 실행 ----------
                            controller.mousedragend(e);
                            
                            // ---------- $mouse 값 업데이트 ----------
                            $mouse.downStartPosition[button] = { x: null, y: null }; // 마우스 클릭 시작 위치 초기화
                            $mouse.draggedSize[button] = new Size(null, null);  // 마우스 왼쪽 버튼 드래그 거리 초기화
                        }
                    }
                    ref2();

                    return;
                };
                // --------------------------------------------------
                // 마우스를 떼면 click으로 판단
                // --------------------------------------------------
                if (!$mouse.isDown[button]) {
                    // ---------- 마우스 click 가상 이벤트 실행 ----------
                    $mouse.click(e);

                    return;
                };
                // --------------------------------------------------
                // 설정된 시간이 지나면 holding으로 판단
                // --------------------------------------------------
                if (Date.now() - startTime > $g.mouseHoldingStartTime) {
                    // ---------- clickend 가상 이벤트 실행 ----------
                    // 만약 이전에 클릭을 했었다면
                    if ($mouse.clickCount[button] !== 0) {
                        // 마우스 clickend 가상 이벤트 실행
                        $mouse.clickend(e);
                    }

                    // ---------- 마우스 holdStart 컨트롤러 이벤트 실행 ----------
                    controller.mouseholdstart(e);
                    // ---------- 마우스 holding 컨트롤러 이벤트 실행 ----------
                    const ref2 = () => {
                        // 마우스 클릭이 유지되는 동안 계속 이벤트 실행
                        if ($mouse.isDown[button]) {
                            // 마우스 holding 컨트롤러 이벤트 실행
                            controller.mouseholding(e);

                            requestAnimationFrame(ref2);
                        };
                    }
                    ref2();


                    return;
                };

                requestAnimationFrame(ref);
            }
            ref();
        }
        start_ref(button);
    };
    
    // ==================================================
    // 클릭이라고 판정될 때 실행될 가상 이벤트
    // ==================================================
    click(e: MouseEvent) {
        // 어떤 버튼이 눌렸는지 저장
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        // 클릭 횟수 증가
        $mouse.clickCount[button]++;

        // ==================================================
        // 더 클릭하는 지, 클릭을 멈추는 지 감지하기 위한 ref
        // ==================================================
        const start_ref = (button:TMouseKeys) => {
            // ---------- ref에서 사용할 인자 선언하기 ----------
            const startTime = Date.now();
            const pressed_position = new Position($mouse.position.x, $mouse.position.y);
            const clickCount_of_pressed_button = $mouse.clickCount[button];

            const ref = () => {
                if (false){ // (디버깅) 마우스 클릭 추가/중단 여부 판단 대기 중 로그
                    console.log(`%c${button}%c 버튼 클릭이 더 있는지, 여기서 끝인지 %c대기 중...`,
                                "color: cyan; font-weight: bold;","",
                                "color: orange;");
                };
                if (false){ // (디버깅) 마우스 클릭 추가/중단 여부 판단 결과 로그
                    const log = (clickCount_of_pressed_button !== $mouse.clickCount[button]) ? "추가적인 클릭%c이 있다고" :
                                ((pressed_position.x != $mouse.position.x)||(pressed_position.y != $mouse.position.y) || Date.now() - startTime > $g.mouseMultiClickEndTime) ? "여기서 클릭이 끝난다%c라고" : true;
                    if (log !== true){
                        console.log(`[%c판단 결과%c] %c${button}%c 버튼은 %c${log} 판단`,
                                    "color: orange; font-weight: bold;", "",
                                    "color: cyan; font-weight: bold;",""
                                    ,"color: cyan; font-weight: bold;",""
                        );
                    }
                };

                // --------------------------------------------------
                // 추가적인 클릭이 있는 경우, 조용히 퇴장하기
                // --------------------------------------------------
                // 만약 마우스 클릭이 실행되면 추가적인 click이 있다 보고 중단
                if (clickCount_of_pressed_button !== $mouse.clickCount[button]) {
                    // (디버깅) 추가적인 클릭이 들어와서 감지가 끝났다고 로그 남기기
                    if (false) {
                        console.log(`%cClick End%c : 추가적인 클릭이 실행되어 감지가 종료되었습니다.`,
                                    "color: red; font-weight: bold;","");
                    }
                    return;
                };
                // --------------------------------------------------
                // 여기서 클릭이 끝나는 경우, clickend 실행해서 클릭 마무리
                // --------------------------------------------------
                // 만약 마우스가 움직이거나, 설정된 시간이 지나면
                if ((pressed_position.x != $mouse.position.x)||(pressed_position.y != $mouse.position.y) || Date.now() - startTime > $g.mouseMultiClickEndTime) {
                    if (false) {    // (디버깅) 클릭이 종료된 원인 로그 남기기
                        const log = (Date.now() - startTime > $g.mouseMultiClickEndTime) ? "설정된 시간이 지나서" : "마우스가 움직여서";
                        console.log(`%cClick End%c : ${log} 클릭이 종료되었습니다.`,
                                    "color: yellow; font-weight: bold;", "");
                    }
                    // ---------- 마우스 clickend 가상 이벤트 실행 ----------
                    $mouse.clickend(e);

                    return;
                };

                requestAnimationFrame(ref);
            }
            ref();
        }
        start_ref(button);

        // --------------------------------------------------
        // 일단 클릭이 들어왔으니깐 컨트롤러 클릭 이벤트 실행
        // --------------------------------------------------
        // 첫 클릭이라면 이전에 실행된 취소할 클릭이 없으니 넘기기
        if ($mouse.clickCount[button] !== 1) {
            // 이전에 실행된 click 이벤트 취소
            controller.mouseclick(e, [$mouse.clickCount[button] - 1, "cancel"]);
        }
        // 불확정인 click 이벤트 실행
        controller.mouseclick(e, [$mouse.clickCount[button], "unsure"]);
    };

    // ==================================================
    // 클릭이 마무리되었을 때 실행되는 함수
    // ==================================================
    clickend(e: MouseEvent) {
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        if (false){ // (디버깅) 클릭이 확정되었다고 로그 남기기
            console.log(`%cClick End%c 클릭이 %c확정%c되었습니다.`,
                        "color: yellow; font-weight: bold;","",
                        "color: orange; font-weight: bold;","");
        }

        // ---------- 확정된 click 이벤트 실행 ----------
        controller.mouseclick(e, [$mouse.clickCount[button], "sure"]);

        // 클릭 횟수 초기화
        $mouse.clickCount[button] = 0;
    };

    /**
     * 마우스가 움직이면 실행되는 함수
     * 
     * *move*는 마우스 좌표가 변할 때 호출되지만, *drag*는 움직일 때와 가만히 있을 때 모두 호출된다
     * @param {TMouseMoveCause} cause 함수 실행 시 해당 이벤트 실행의 원인이 move인지 drag인지 구분하기 위한 인자
     */
    move(e: MouseEvent, cause:TMouseMoveCause) {
        // 만약 위치가 변하지 않았다면 return 하기
        if ($mouse.position.x === e.clientX && $mouse.position.y === e.clientY){
            // 발생했던 상황 1 : cause가 drag일 때 일정한 주기로 마우스가 움직이지 않아도 실행될 때
            // 발생했던 상황 2 : 한 키를 누르고 있을 때 다른 한 키를 누르면, 이상하게 move 이벤트가 한번 실행됨
            if (false){ // (디버깅) 콘솔에 move 이벤트 실행 안 됬다고 로그 남기기
                console.log(`%creturn%c   마우스 위치가 변하지 않았기 때문에 move 이벤트가 실행이 취소되었습니다.`,
                    "color: red; font-weight: bold; font-size: 2em;","");
            };

            return;
        }

        if (false){ // (디버깅) 이벤트 실행 원인 로그 남기기
            console.log(`%c${cause}%c로 인해 %cmousemove%c 이벤트 발생`,
                "color: cyan; font-weight: bold;","","color: yellow; font-weight: bold;","");
        };

        // ---------- $mouse 값 업데이트 ----------
        // 위치 저장
        $mouse.position = new Position(e.clientX, e.clientY);
        $mouse.position_offset = new Position(e.offsetX, e.offsetY);
        // 지금 마우스 아래 있는 요소 저장
        $mouse.moveTarget = e.target as HTMLElement;
        //@ts-ignore
        const buttons:TMouseKeys[] = ["left", "wheel", "right"];
        // ---------- 마우스가 움직이면 실행되는 이벤트 실행 ----------
        controller.mousemove(e);
        // ---------- 호버 이벤트 실행 ----------
        controller.hover(e);


        if (false){ // (디버깅) mousemove 값 로그 남기기
            console.log(`[%cMouse Move%c] : %c${$mouse.position.x}%c, %c${$mouse.position.y}%c`,
                "color: yellow; font-weight: bold;","","color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","");
        }
    }


    // ==================================================
    // 마우스를 뗄 때 실행되는 함수
    // ==================================================
    up(e: MouseEvent) {
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        // ---------- 마우스 클릭 해제 시에 실행되는 컨트롤러 이벤트 실행 ----------
        controller.mouseup(e);

        // ---------- $mouse 값 업데이트 ----------
        $mouse.isDown[button] = false; // 초기화
        $mouse.isDragging[button] = false;  // 드래그 상태 초기화
        
        if (false){ // (디버깅) mouseup 키 표시 로그 남기기
            console.log(`[%cMouse Up%c] : %c${button}`,
                "color: yellow; font-weight: bold;","","color: cyan; font-weight: bold;");
        }
    }

    // ==================================================
    // 마우스 휠을 움직였을 때 실행되는 함수
    // ==================================================
    wheel(e: WheelEvent) {
        // 휠 방향 저장
        $mouse.wheelDelta = { x: e.deltaX, y: e.deltaY };

        // ---------- 마우스 휠 컨트롤러 이벤트 실행 ----------
        controller.mousewheel(e);
        
        if (false){ // (디버깅) wheel 값 로그 남기기
            console.log(`[%cMouse Wheel%c] : %c${$mouse.wheelDelta.x}%c, %c${$mouse.wheelDelta.y}%c`,
                "color: yellow; font-weight: bold;","","color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","");
        }
    }
};

const $mouse = new Mouse(); // 인스턴스 생성
export default $mouse; // 인스턴스를 export