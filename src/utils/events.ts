// ====================================================================================================
// 마우스 이벤트 감지 및 핸들링 함수
// ====================================================================================================
// 전역 변수
// import $g from "./$g";
// 클래스 가져오기
import $mouse from "../sys/mouse";
import $keyboard from "../sys/keyboard";
import controller from "../sys/controller";


export function setupEventListeners(): void {
    // window 시스템 관련
    window.addEventListener("contextmenu", (e) => e.preventDefault());      // 우클릭 메뉴 안 뜨게 하기
    window.addEventListener("resize", () => controller.resize());           // 창 크기가 변경될 때
    // 키보드 관련
    window.addEventListener("keydown", $keyboard.keydown);                  // 특정 키가 눌렀을 때
    window.addEventListener("keyup", $keyboard.keyup);                      // 특정 키를 뗐을 때
    // 마우스 관련
    window.addEventListener("mousedown", $mouse.down);                      // 마우스를 눌렀을 때
    window.addEventListener("mouseup", $mouse.up);                          // 마우스를 뗐을 때
    window.addEventListener("mousemove", (e) => $mouse.move(e, "move"));    // 마우스가 움직일 때
    window.addEventListener("drag", (e) => $mouse.move(e, "drag"));         //        //
    window.addEventListener("wheel", $mouse.wheel);    
}