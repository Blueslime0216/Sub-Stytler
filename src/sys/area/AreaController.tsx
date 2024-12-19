// ====================================================================================================
// Area 크기를 브라우저 크기에 맞춰 업데이트 하는 코드
// ====================================================================================================
import $g from "../$g";
import $keyboard from "../keyboard";
import $mouse from "../mouse";
import Area from "./Area";



// $g.Areas 배열에 담긴 모든 Area의 크기를 변경된 브라우저 사이즈에 맞게 업데이트하기
export function AreaResizer() {
    $g.Areas.forEach((area) => {
        // 해당 id를 가진 요소를 찾기
        const target = document.querySelector(`.area[data-id="${area.id}"]`) as HTMLElement;
        // 크기 업데이트
        target.style.width = $g.width * (area.width / 10000) + "px";
        target.style.height = $g.height * (area.height / 10000) + "px";
    });
}

function addEventListener_click(element:HTMLElement, click_callback:Function) {
    element.addEventListener("click", (e) => {
        click_callback(e);
    });
}

// edge가 클릭되면 콘솔에 출력하는 코드
export function EdgeFunctionAdd() {
    // 모든 edge를 찾아서 이벤트 리스너 등록
    document.querySelectorAll(".edge").forEach((edge) => {
        // 클릭 예제
        // $mouse.click(edge as HTMLElement, (e:MouseEvent) => {
        //     console.log($keyboard.isKeyDown("AltLeft"));
        //     console.log(e);
        // });
        // 크기 조절
        $mouse.drag(edge as HTMLElement, (e:MouseEvent) => {
            // 해당 id를 가진 요소를 찾기
            const target = edge.parentElement as HTMLElement;
            // 크기 업데이트
            if (edge.classList.contains("top") || edge.classList.contains("bottom")) {
                target.style.height = e.clientY+"px";
            } else {
                target.style.width = e.clientX+"px";
            }
        });
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
    });
}