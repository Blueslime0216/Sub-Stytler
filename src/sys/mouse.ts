// ====================================================================================================
// 마우스 입력에 관한 정보가 저장된 클래스가 선언된 파일
// 이 클래스 안에 마우스 입력에 관한 정보가 저장되고, 불러올 수 있다
// ====================================================================================================
import { Position, Size } from "../utils/utils";


// 마우스 클릭된 키들 타입
type IMouseKeys_boolean = {
    [key in TMouseKeys]:boolean;
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

    // 마우스 클릭 관련
    // 각 마우스 누른 여부 (클릭이건 드래그건 암튼 눌려졌는가)
    isDown:IMouseKeys_boolean = { left: false, wheel: false, right: false };
    // 각 마우스 누르기 시작 지점
    downStartPosition:IMouseKeys_position = { left: new Position(null, null), wheel: new Position(null, null), right: new Position(null, null) };
    // 각 마우스 클릭 상태 여부 (드래그하지 않고 바로 떼었는가)
    // isClick:IMouseKeys_boolean = { left: false, wheel: false, right: false };
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


    // 마우스를 누르면
    down(e: MouseEvent) {
        // 마우스 클릭 시작 위치 저장
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        // $mouse.isClick[button] = false;  // 마우스 버튼 클릭 상태 초기화
        $mouse.downStartPosition[button] = { x: e.clientX, y: e.clientY }; // 마우스 클릭 시작 위치 저장
        $mouse.isDown[button] = true; // 눌렸다고 표시하기
        $mouse.isDragging[button] = false;  // 마우스 버튼 드래그 상태 초기화

        // 클릭된 요소 저장
        $mouse.downTarget[button] = e.target as HTMLElement;

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

    /**
     * 마우스가 움직이면 실행되는 함수
     * 
     * *move*는 마우스 좌표가 변할 때 호출되지만, *drag*는 움직일 때와 가만히 있을 때 모두 호출된다
     * @param {TMouseMoveType} type 함수 실행 시 해당 이벤트 실행의 원인이 move인지 drag인지 구분하기 위한 인자
     */
    move(e: MouseEvent, type:TMouseMoveType) {
        // (디버깅) 이벤트 실행 원인 로그 남기기
        if (false){
            console.log(`%c${type}%c로 인해 %cmousemove%c 이벤트 발생`,
                "color: cyan; font-weight: bold;","","color: yellow; font-weight: bold;","");
        }

        // 위치 저장
        $mouse.position = new Position(e.clientX, e.clientY);
        $mouse.position_offset = new Position(e.offsetX, e.offsetY);

        // 지금 마우스 아래 있는 요소 저장
        $mouse.moveTarget = e.target as HTMLElement;

        
        // (디버깅) dragstart 키 표시 로그 남기기
        if (true){
            if (($mouse.isDown.left && !$mouse.isDragging.left) || ($mouse.isDown.wheel && !$mouse.isDragging.wheel) || ($mouse.isDown.right && !$mouse.isDragging.right)) {
                const button:TMouseKeys = $mouse.isDown.left ? "left" : $mouse.isDown.wheel ? "wheel" : "right";

                console.log(`[Mouse Drag Start] : %c${button}%c at (%c${$mouse.downStartPosition[button].x}%c, %c${$mouse.downStartPosition[button].y}%c)`,
                    "color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","","color: cyan; font-weight: bold;","");
            }
        }
        // 마우스가 눌려있으면 드래그 중으로 표시
        if ($mouse.isDown.left) { // 마우스 왼쪽 버튼이 눌려있으면
            // 왼쪽 버튼 드래그 중으로 표시
            $mouse.isDragging.left = true;
            // 드래그 거리 저장
            $mouse.draggedSize.left = new Size(e.clientX - $mouse.downStartPosition.left.x!, e.clientY - $mouse.downStartPosition.left.y!);
        }
        if ($mouse.isDown.wheel) { // 마우스 휠 버튼이 눌려있으면
            // 휠 버튼 드래그 중으로 표시
            $mouse.isDragging.wheel = true;
            // 드래그 거리 저장
            $mouse.draggedSize.wheel = new Size(e.clientX - $mouse.downStartPosition.wheel.x!, e.clientY - $mouse.downStartPosition.wheel.y!);
        }
        if ($mouse.isDown.right) { // 마우스 오른쪽 버튼이 눌려있으면
            // 오른쪽 버튼 드래그 중으로 표시
            $mouse.isDragging.right = true;
            // 드래그 거리 저장
            $mouse.draggedSize.right = new Size(e.clientX - $mouse.downStartPosition.right.x!, e.clientY - $mouse.downStartPosition.right.y!);
        }


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