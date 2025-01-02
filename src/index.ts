// ====================================================================================================
// 최종적으로 전부 합쳐지는 파일
// ====================================================================================================
// sys 모듈
import controller from "./sys/controller";
import $keyboard from "./sys/keyboard";
import $mouse from "./sys/mouse";
// UI관련 모듈
import "./sys/area/area";
// import해서 실행해야하는 코드들 불러오기
import importList from "./import";
import $g from "./utils/$g";
importList.forEach(async (path) => {
    await import(path);
    $g.imported.push(path);

    if (path === importList[importList.length - 1]) {
        controller.run("load");
        console.log("모든 코드가 로드되었습니다.");
    }
});



// 이벤트 리스너 추가
// window 관련
window.addEventListener("contextmenu", (e) => e.preventDefault());  // 우클릭 메뉴 안 뜨게 하기
window.addEventListener("load", () => controller.run("load"));      // 처음 로드될 때
window.addEventListener("resize", () => controller.run("resize"));  // 창 크기가 변경될 때
// 키보드 관련
window.addEventListener("keydown", $keyboard.keydown);              // 특정 키가 눌렀을 때
window.addEventListener("keyup", $keyboard.keyup);                  // 특정 키를 뗐을 때
// 마우스 관련
window.addEventListener("mousedown", $mouse.down);                  // 마우스를 눌렀을 때
window.addEventListener("mouseup", $mouse.up);                      // 마우스를 뗐을 때
window.addEventListener("mousemove", (e) => $mouse.move(e, "move"));           // 마우스가 움직일 때
window.addEventListener("drag", (e) => $mouse.move(e, "drag"));                // 드래그 중일 때


  