// ====================================================================================================
// 마우스 입력에 대한 처리를 담당하는 클래스가 선언된 파일
// 이 클래스 안에 마우스 입력에 관한 정보가 저장되고, 불러올 수 있다
// ====================================================================================================
import controller from "./controller"; // 컨트롤러 클래스를 불러옴



// 타입 선언
type TPosition = {  // 마우스 위치
    x: number|null;  // X 좌표
    y: number|null;  // Y 좌표
};
class Position implements TPosition {
    x: number|null;
    y: number|null;
    constructor(x: number|null, y: number|null) {
        this.x = x;
        this.y = y;
    }
}
type TSize = {  // 마우스 드래그 거리
    width: number|null;  // 너비
    height: number|null; // 높이
};
class Size implements TSize {
    width: number|null;
    height: number|null;
    constructor(width: number|null, height: number|null) {
        this.width = width;
        this.height = height;
    }
}
// 마우스 클릭된 키들 타입
type TMouseKeys = "left"|"wheel"|"right";
type IMouseKeys_boolean = {
    [key in TMouseKeys]: boolean;
};
type IMouseKeys_position = {
    [key in TMouseKeys]:  Position;
};
type IWheelDelta = {
    x: number;  // X 방향 거리
    y: number;  // Y 방향 거리
};
type IMouseDraggedSize = {
    [key in TMouseKeys]: Size;
};

class Mouse {
    // 마우스 위치 관련
    position: TPosition = new Position(null, null); // 마우스 위치 (px)
    // position_offset: TPosition = new Position(null, null); // 마우스 모듈 내에서의 상대 위치 (px)

    // 마우스 클릭 관련
    // 각 마우스 누른 여부 (클릭이건 드래그건 암튼 눌려졌는가)
    isDown: IMouseKeys_boolean = { left: false, wheel: false, right: false };
    // 각 마우스 누르기 시작 지점
    downStartPosition: IMouseKeys_position = { left: new Position(null, null), wheel: new Position(null, null), right: new Position(null, null) };
    // 각 마우스 클릭 상태 여부 (드래그하지 않고 바로 떼었는가)
    isClick: IMouseKeys_boolean = { left: false, wheel: false, right: false };
    // 각 마우스 드래그 시작 상태 여부
    isDragFirst: IMouseKeys_boolean = { left: false, wheel: false, right: false };
    // 각 마우스 드래그 상태 여부
    isDragging: IMouseKeys_boolean = { left: false, wheel: false, right: false };
    // 마우스가 드래그 된 거리
    draggedSize: IMouseDraggedSize = { left: new Size(null, null), wheel: new Size(null, null), right: new Size(null, null) };
    // 휠 방향
    wheelDelta: IWheelDelta = { x: 0, y: 0 };


    // 마우스를 누르면
    mousedown(e: MouseEvent) {
        // 마우스 클릭 시작 위치 저장
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        $mouse.isClick[button] = false;  // 마우스 버튼 클릭 상태 초기화
        $mouse.downStartPosition[button] = { x: e.clientX, y: e.clientY }; // 마우스 클릭 시작 위치 저장
        $mouse.isDown[button] = true; // 눌렸다고 표시하기
        // $mouse.isDragFirst[button] = true; // 드래그 시작 상태로 표시하기
        $mouse.isDragging[button] = false;  // 마우스 왼쪽 버튼 드래그 상태 초기화

        console.log($mouse.downStartPosition[button]);
        // controller.mousedown(e); // 컨트롤러 실행
    };

    mousemove(e: MouseEvent) {
        // 위치 저장
        $mouse.position = new Position(e.clientX, e.clientY);
        // $mouse.position_offset = new Position(e.offsetX, e.offsetY);

        // // 마우스가 눌려있으면 드래그 중으로 표시
        // if ($mouse.isDown.left) { // 마우스 왼쪽 버튼이 눌려있으면
        //     // 왼쪽 버튼 드래그 중으로 표시
        //     $mouse.isDragging.left = true;
        //     // 드래그 거리 저장
        //     $mouse.draggedSize.left = new Size(e.clientX - $mouse.downStartPosition.left.x, e.clientY - $mouse.downStartPosition.left.y);
        // }
        // if ($mouse.isDown.wheel) { // 마우스 휠 버튼이 눌려있으면
        //     // 휠 버튼 드래그 중으로 표시
        //     $mouse.isDragging.wheel = true;
        //     // 드래그 거리 저장
        //     $mouse.draggedSize.wheel = new Size(e.clientX - $mouse.downStartPosition.wheel.x, e.clientY - $mouse.downStartPosition.wheel.y);
        // }
        // if ($mouse.isDown.right) { // 마우스 오른쪽 버튼이 눌려있으면
        //     // 오른쪽 버튼 드래그 중으로 표시
        //     $mouse.isDragging.right = true;
        //     // 드래그 거리 저장
        //     $mouse.draggedSize.right = new Size(e.clientX - $mouse.downStartPosition.right.x, e.clientY - $mouse.downStartPosition.right.y);
        // }

        // controller.mousemove(e); // 컨트롤러 실행
    }

    // 클릭 이벤트 실행하기
    mouseclick(e: MouseEvent) {
        // controller.mouseclick(e); // 컨트롤러 실행
    };

    // 드래그 시작 이벤트 실행하기
    mousedragstart(e: MouseEvent) {
        // controller.mousedragstart(e);
    };

    /*
    // 마우스 이동 이벤트
    mousemove(e: MouseEvent) {
        // 위치 저장
        $mouse._mousePos = new Point(e.clientX, e.clientY);
        // $mouse._mousePos_offset = new Point(e.offsetX, e.offsetY);

        // 마우스가 눌려있으면 드래그 중으로 표시
        if ($mouse._isMouseDown.left) { // 마우스 왼쪽 버튼이 눌려있으면
            // 왼쪽 버튼 드래그 중으로 표시
            $mouse._isMouseDragging.left = true;
            // 드래그 거리 저장
            $mouse._draggedSize.left = new Size(e.clientX - $mouse._mouseStart.left.x, e.clientY - $mouse._mouseStart.left.y);
        }
        if ($mouse._isMouseDown.wheel) { // 마우스 휠 버튼이 눌려있으면
            // 휠 버튼 드래그 중으로 표시
            $mouse._isMouseDragging.wheel = true;
            // 드래그 거리 저장
            $mouse._draggedSize.wheel = new Size(e.clientX - $mouse._mouseStart.wheel.x, e.clientY - $mouse._mouseStart.wheel.y);
        }
        if ($mouse._isMouseDown.right) { // 마우스 오른쪽 버튼이 눌려있으면
            // 오른쪽 버튼 드래그 중으로 표시
            $mouse._isMouseDragging.right = true;
            // 드래그 거리 저장
            $mouse._draggedSize.right = new Size(e.clientX - $mouse._mouseStart.right.x, e.clientY - $mouse._mouseStart.right.y);
        }

        controller.mousemove(e); // 컨트롤러 실행
    } */

    // 마우스 클릭 해제 이벤트
    mouseup(e: MouseEvent) {
        console.log("mouseup");
        const button:TMouseKeys = ["left", "wheel", "right"][e.button] as TMouseKeys;

        $mouse.isClick[button] = false;  // 마우스 버튼 클릭 상태 초기화
        $mouse.downStartPosition[button] = { x: null, y: null }; // 마우스 클릭 시작 위치 초기화
        $mouse.isDown[button] = false; // 초기화
        // $mouse.isDragFirst[button] = true;
        $mouse.isDragging[button] = false;  // 드래그 상태 초기화
        $mouse.draggedSize[button] = new Size(null, null);  // 마우스 왼쪽 버튼 드래그 거리 초기화

        // controller.mouseup(e); // 컨트롤러 실행
    }

    // wheel(e: WheelEvent) {
    //     // 휠 방향 저장
    //     $mouse._wheelDelta = { x: e.deltaX, y: e.deltaY };

    //     controller.wheel(e); // 컨트롤러 실행
    // }

    // edge.addEventListener('dragstart', (e) => {
    //     e.preventDefault(); // 기본 드래그 동작 방지
    //     console.log("dragstart");
    // });
    // edge.addEventListener("drag", (e) => {
    //     console.log("drag");
    //     const mouseEvent = e as MouseEvent;
    //     if (mouseEvent.clientY === 0 || mouseEvent.clientX === 0) {
    //         return;
    //     }
        
    //     // 해당 id를 가진 요소를 찾기
    //     const id = edge.parentElement?.getAttribute("data-id")
    //     const target = edge.parentElement as HTMLElement;
    //     // 크기 업데이트
    //     if (edge.classList.contains("top") || edge.classList.contains("bottom")) {
    //         target.style.height = mouseEvent.clientY + "px";
    //     } else {
    //         target.style.width = mouseEvent.clientX + "px";
    //     }
    // });
};

const $mouse = new Mouse(); // 인스턴스 생성
export default $mouse; // 인스턴스를 export