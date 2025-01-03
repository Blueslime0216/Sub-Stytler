// ====================================================================================================
// 마우스 입력에 대한 정보가 담겨있는 클래스가 선언된 파일
// 이 클래스 안에 마우스 입력에 관한 정보가 저장되고, 불러올 수 있다
// 마우스 입력을 받으면 적절하게 처리해서 알맞은 컨트롤러를 실행시킨다
// ====================================================================================================
import $g from "../utils/$g";
import { Position, Size } from "../utils/utils";
import controller from "./controller";


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
type IMouseTarget = HTMLElement|null;
type IMouseTargets = {
    [key in TMouseKeys]: IMouseTarget;
};
/**
 * 마우스 move 함수 실행 시 해당 이벤트 실행의 원인이 move인지 drag인지 구분하기 위한 타입
 * 
 * *move*는 마우스 좌표가 변할 때 호출되지만, *drag*는 움직일 때와 가만히 있을 때 모두 호출된다
 */
type TMouseMoveType = "move"|"drag";



class Mouse {
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
        // --------------------------------------------------
        // $mouse 값 업데이트
        // --------------------------------------------------
        // 어떤 버튼이 눌렸는지 저장
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        // 마우스 클릭 시작 위치 저장
        $mouse.downStartPosition[button] = { x: e.clientX, y: e.clientY }; 
        // 눌렸다고 표시하기
        $mouse.isDown[button] = true;
        // 마우스 버튼 드래그 상태 초기화
        $mouse.isDragging[button] = false;
        // 클릭된 요소 저장
        $mouse.downTarget[button] = e.target as HTMLElement;

        // (디버깅) 각 키 표시 상태 로그 남기기
        if (false){
            const value = 'isDown';
            const color = { true: "lightgreen", false: "gray" };
            console.log(`[$mouse.${value}] : %c${$mouse[value].left}%c, %c${$mouse[value].wheel}%c, %c${$mouse[value].right}`,
                        `color: ${$mouse[value].left ? color.true : color.false}; font-weight: bold;`,"",
                        `color: ${$mouse[value].wheel ? color.true : color.false}; font-weight: bold;`,"",
                        `color: ${$mouse[value].right ? color.true : color.false}; font-weight: bold;`);
        }

        
        // --------------------------------------------------
        // 컨트롤러 이벤트 실행
        // --------------------------------------------------
        // mousedown 이벤트 실행
        controller.run("mousedown", e);
        
        // ---------- click 관련 판별하는 코드 ----------
        // click, dblclick, drag 등 판단하는 ref
        const start_ref = (button:TMouseKeys) => {
            // ref에서 사용할 인자 선언하기
            const startTime = Date.now();
            const pressed_button:TMouseKeys = button;

            const ref = () => {
                // 마우스 클릭/드래그 등 여부 판단 대기 중 로그
                if (false){
                    console.log(pressed_button + ` %cWaiting Mouse Input...`,
                                "color: orange;");
                };
                
                // 만약 마우스를 움직인다면 drag로 판단
                if ($mouse.isDragging[pressed_button]) {
                    // 만약 클릭을 했었다면 clickend 가상 이벤트 실행
                    if ($mouse.clickCount[pressed_button] !== 0) {
                        // 마우스 clickend 가상 이벤트 실행
                        $mouse.clickend(e);
                    }
                    // drag 이벤트 실행
                    controller.run("mousedrag", e);

                    return;
                };
                // 만약 마우스를 떼면 click으로 판단
                if (!$mouse.isDown[pressed_button]) {
                    // 마우스 click 가상 이벤트 실행
                    $mouse.click(e);

                    return;
                };
                // 설정된 시간이 지나면 holding으로 판단
                if (Date.now() - startTime > $g.mouseHoldingStartTime) {
                    // 만약 클릭을 했었다면 clickend 가상 이벤트 실행
                    if ($mouse.clickCount[pressed_button] !== 0) {
                        // 마우스 clickend 가상 이벤트 실행
                        $mouse.clickend(e);
                    }
                    // 마우스 holding 이벤트 실행
                    controller.run("mouseholding", e);

                    return;
                };

                requestAnimationFrame(ref);
            }
            ref();
        }
        start_ref(button);

        // (디버깅) mousedown 키 표시 로그 남기기
        if (false){
            console.log(`[Mouse Down] : %c${button}%c`,
                        "color: cyan; font-weight: bold;","");
        }
        // (디버깅) 클릭된 요소 로그 남기기
        if (false){
            // (할일) 클릭된 요소가 무엇인지 텍스트도 같이 적는 부분 추가하기
            console.log($mouse.downTarget[button]);
        }
    };
    
    click(e: MouseEvent) {
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        // 클릭 횟수 증가
        $mouse.clickCount[button]++;

        // 더 클릭하는 지, 클릭을 멈추는 지 감지하기 위한 ref
        const start_ref = (button:TMouseKeys) => {
            // ref에서 사용할 인자 선언하기
            const startTime = Date.now();
            const pressed_button:TMouseKeys = button;
            const pressed_position = new Position($mouse.position.x, $mouse.position.y);
            const clickCount_of_pressed_button = $mouse.clickCount[pressed_button];

            const ref = () => {
                // 마우스 클릭 추가/중단 여부 판단 대기 중 로그
                if (true){
                    console.log(`%cWaiting for Mouse Click End/More...`,
                                "color: orange;");
                };

                // 만약 마우스가 움직이거나, 설정된 시간이 지나면 clickend
                let now_position = new Position($mouse.position.x, $mouse.position.y);
                if ((pressed_position.x != now_position.x)||(pressed_position.y != now_position.y) || Date.now() - startTime > $g.mouseMultiClickEndTime) {
                    if ((pressed_position.x != now_position.x)||(pressed_position.y != now_position.y)) {
                        console.log(`%cClick End%c : 마우스가 움직여서 클릭이 종료되었습니다.`,
                                    "color: red; font-weight: bold;", "");
                        console.log(pressed_position, now_position)
                    } else {
                        console.log(`x : ${pressed_position.x} y : ${pressed_position.y}, x : ${now_position.x} y : ${now_position.y}`);
                        console.log(`%cClick End%c : 설정된 시간이 지나서 클릭이 종료되었습니다.`,
                                    "color: red; font-weight: bold;", "");
                    }
                    // 마우스 clickend 가상 이벤트 실행
                    $mouse.clickend(e);

                    return;
                };
                // 만약 마우스 클릭이 실행되면 추가적인 click이 있다 보고 중단
                if (clickCount_of_pressed_button !== $mouse.clickCount[pressed_button]) {
                    console.log(`%cClick End%c : 마우스 클릭이 실행되어 클릭이 종료되었습니다.`,
                                "color: red; font-weight: bold;","");
                    return;
                };

                requestAnimationFrame(ref);
            }
            ref();
        }
        start_ref(button);

        // 일단 클릭이 들어왔으니깐 컨트롤러 클릭 이벤트 실행
        if ($mouse.clickCount[button] !== 1) {  // 첫 클릭이라면 이전에 실행된 취소할 클릭이 없으니 넘기기
            // 이전에 실행된 click 이벤트 취소
            controller.run("mouseclick", e, [$mouse.clickCount[button] - 1, "cancel"]);
        }
        // 불확정인 click 이벤트 실행
        controller.run("mouseclick", e, [$mouse.clickCount[button], "unsure"]);
    };
    clickend(e: MouseEvent) {
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        // 확정된 click 이벤트 실행
        controller.run("mouseclick", e, [$mouse.clickCount[button], "sure"]);
        // 클릭 횟수 초기화
        $mouse.clickCount[button] = 0;
    };

    /**
     * 마우스가 움직이면 실행되는 함수
     * 
     * *move*는 마우스 좌표가 변할 때 호출되지만, *drag*는 움직일 때와 가만히 있을 때 모두 호출된다
     * @param {TMouseMoveType} type 함수 실행 시 해당 이벤트 실행의 원인이 move인지 drag인지 구분하기 위한 인자
     */
    move(e: MouseEvent, type:TMouseMoveType) {
        // 만약 위치가 변하지 않았다면 return 하기
        if ($mouse.position.x === e.clientX && $mouse.position.y === e.clientY){
            // (디버깅) 콘솔에 move 이벤트 실행 안 됬다고 로그 남기기
            if (false){
                console.log(`%creturn%c   move 이벤트가 실행되었지만 위치가 변하지 않았습니다.`,
                    "color: red; font-weight: bold; font-size: 2em;","");
            };
            return;
        }
        // (디버깅) 이벤트 실행 원인 로그 남기기
        if (false){
            console.log(`%c${type}%c로 인해 %cmousemove%c 이벤트 발생`,
                "color: cyan; font-weight: bold;","","color: yellow; font-weight: bold;","");
        };

        // 위치 저장
        $mouse.position = new Position(e.clientX, e.clientY);
        $mouse.position_offset = new Position(e.offsetX, e.offsetY);

        // 지금 마우스 아래 있는 요소 저장
        $mouse.moveTarget = e.target as HTMLElement;


        // (디버깅) dragstart 키 표시 로그 남기기
        if (false){
            if (($mouse.isDown.left && !$mouse.isDragging.left) || ($mouse.isDown.wheel && !$mouse.isDragging.wheel) || ($mouse.isDown.right && !$mouse.isDragging.right)) {
                const button:TMouseKeys = $mouse.isDown.left ? "left" : $mouse.isDown.wheel ? "wheel" : "right";

                console.log(`[Mouse Drag Start] : %c${button}%c at (%c${$mouse.downStartPosition[button].x}%c, %c${$mouse.downStartPosition[button].y}%c)`,
                    "color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","");
            }
        }

        const buttons:TMouseKeys[] = ["left", "wheel", "right"];
        buttons.forEach((button) => {
            // 만약 버튼이 눌려있는 상태라면 해당 버튼을 드래그 중으로 표시
            if ($mouse.isDown[button]){
                $mouse.isDragging[button] = true;
            }
            // 드래그 중이라면 콘솔에 드래그 중이라고 로그 남기기
            if (false) {
                if ($mouse.isDragging[button]){
                    console.log(`[Mouse Drag] : %c${button}%c`,
                                "color: cyan; font-weight: bold;","");
                }
            }
            // 드래그 거리 저장
            $mouse.draggedSize[button] = new Size(e.clientX - $mouse.downStartPosition[button].x!, e.clientY - $mouse.downStartPosition[button].y!);
        });


        // (디버깅) mousemove 값 로그 남기기
        // console.log(`[Mouse Move] : %c${$mouse.position.x}%c, %c${$mouse.position.y}%c`,
        //             "color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","");
    }


    // 마우스 클릭 해제 이벤트
    up(e: MouseEvent) {
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        // $mouse.isClick[button] = false;  // 마우스 버튼 클릭 상태 초기화
        $mouse.downStartPosition[button] = { x: null, y: null }; // 마우스 클릭 시작 위치 초기화
        $mouse.isDown[button] = false; // 초기화
        $mouse.isDragging[button] = false;  // 드래그 상태 초기화
        $mouse.draggedSize[button] = new Size(null, null);  // 마우스 왼쪽 버튼 드래그 거리 초기화

        
        // (디버깅) mouseup 키 표시 로그 남기기
        // console.log(`[Mouse Up] : %c${button}%c`,
        //             "color: cyan; font-weight: bold;","");
    }

    wheel(e: WheelEvent) {
        // 휠 방향 저장
        $mouse.wheelDelta = { x: e.deltaX, y: e.deltaY };

        
        // (디버깅) wheel 값 로그 남기기
        // console.log(`[Mouse Wheel] : %c${$mouse.wheelDelta.x}%c, %c${$mouse.wheelDelta.y}%c`,
        //             "color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","");
    }
};

const $mouse = new Mouse(); // 인스턴스 생성
export default $mouse; // 인스턴스를 export