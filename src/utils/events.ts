// ====================================================================================================
// 마우스 이벤트 감지 및 핸들링 함수
// ====================================================================================================
// 전역 변수
import $g from "./$g";
// 클래스 가져오기
import { Area } from "../components/Area";
import { Border } from "../components/Border";



export function setupEventListeners(): void {
    console.log("Initializing events");

    document.addEventListener("mousedown", (event) => {
        const targetId = (event.target as HTMLElement)?.id;
        if (!targetId) return;
    
        const element = $g.elements.get(targetId);
        if (!element) return;
    
        if (element instanceof Area) {
            console.log(`Area ${element.id} clicked`);
            // 실행할 함수 호출 (예: element.someMethod())
        } else if (element instanceof Border) {
            console.log(`Border ${element.id} clicked`);
            // 실행할 함수 호출 (예: element.startResize(event))
        }
        console.log(element.mousedown(event));
    });
  
    document.addEventListener("mouseup", (event) => {
        console.log(`Mouse up at: ${event.clientX}, ${event.clientY}`);
    });
  
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        console.log("Context menu opened");
    });
}

// export function setupEventListeners() {
//   document.addEventListener('mousedown', (event) => {
//     const target = event.target as HTMLElement;
//     if (target.classList.contains('border')) {
//       state.activeBorder = target.id;
//       state.isResizing = true;
//       document.addEventListener('mousemove', resizeHandler);
//       document.addEventListener('mouseup', stopResize);
//     }
//   });
// }

// function resizeHandler(event: MouseEvent) {
//   if (!state.isResizing || !state.activeBorder) return;
//   const border = document.getElementById(state.activeBorder) as HTMLDivElement;
//   if (!border) return;

//   if (border.classList.contains('vertical')) {
//     const deltaX = event.clientX - border.getBoundingClientRect().left;
//     border.style.left = `${border.offsetLeft + deltaX}px`;
//   } else {
//     const deltaY = event.clientY - border.getBoundingClientRect().top;
//     border.style.top = `${border.offsetTop + deltaY}px`;
//   }
// }

// function stopResize() {
//   state.isResizing = false;
//   state.activeBorder = null;
//   document.removeEventListener('mousemove', resizeHandler);
//   document.removeEventListener('mouseup', stopResize);
// }