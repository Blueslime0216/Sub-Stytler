// ====================================================================================================
// Area 크기를 브라우저 크기에 맞춰 업데이트 하는 코드
// ====================================================================================================
import $g from "../$g";
import controller, { addEvent } from "../controller";
import $keyboard from "../keyboard";
import $mouse from "../mouse";
import Area from "./Area";



// $g.Areas 배열에 담긴 모든 Area의 크기를 변경된 브라우저 사이즈에 맞게 업데이트하기
export function AreaResizer() {
    $g.Areas.forEach((area) => {
        // 해당 id를 가진 요소를 찾기
        const target = document.querySelector(`.area[data-id="${area.id}"]`) as HTMLElement;
        // 좌표 업데이트
        target.style.top = $g.height * (area.y / 10000) + "px";
        target.style.left = $g.width * (area.x / 10000) + "px";
        // 크기 업데이트
        target.style.width = $g.width * (area.width / 10000) + "px";
        target.style.height = $g.height * (area.height / 10000) + "px";
    });
};


// // edge 이벤트 리스너 등록
// function EdgeFunctionAdd() {
//     // 모든 edge를 찾아서 이벤트 리스너 등록
//     document.querySelectorAll(".edge").forEach((edge) => {
//         addEvent.click(edge, (e:MouseEvent) => { // edge as HTMLElement 왜 안 적어도 에러 안 뜨지?
//             console.log("Edge 클릭됨", $keyboard.isKeyDown("AltLeft"), e);
//         });

//         addEvent.dragging(edge, (e:MouseEvent) => {
//             // 해당 id를 가진 요소를 찾기
//             const target = edge.parentElement as HTMLElement;
//             // 크기 업데이트
//             if (edge.classList.contains("top") || edge.classList.contains("bottom")) {
//                 target.style.height = e.clientY+"px";
//             } else {
//                 target.style.width = e.clientX+"px";
//                 console.log(target.style.width + e.clientX+"px");
//             }
//         });

//         controller.mousedown.push({
//             mouse: 'left',
//             id: edge.id,
//             func: (e:KeyboardEvent) => {
//                 e.preventDefault();
//                 console.log('D 떼기');
//             }
//         });
//     });
// };


export function AreaEdgeController(e:any, id:string, direction:string) {
    console.log("start drag");
    // if (e.clientY === 0 || e.clientX === 0) {
    //     return;
    // };
    
    // 부모 요소를 찾기
    const target = document.querySelector(`.area[data-id="${id}"]`) as HTMLElement;
    // 타입스크립트 때문에 null 체크하기
    if ($mouse.draggedSize.left.height === null || $mouse.draggedSize.left.width === null) {
        return;
    }
    // 크기 업데이트
    if (direction === "top" || direction === "bottom") {
        $g.editArea(id, { height_tmp: $mouse.draggedSize.left.height / $g.height * 10000 });
        // target.style.height = $mouse.draggedSize.left.height + "px";
    } else {
        $g.editArea(id, { width_tmp: $mouse.draggedSize.left.width / $g.width * 10000 });
        // target.style.width = $mouse.draggedSize.left.width + "px";
    }
};