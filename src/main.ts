// ====================================================================================================
// 앱의 엔트리 포인트, 초기화 및 이벤트 설정
// ====================================================================================================
// // sys 모듈
// import controller from "./sys/controller";
// import $keyboard from "./sys/keyboard";
// import $mouse from "./sys/mouse";
// 전역 변수 가져오기
import $g from "./utils/$g";
// // import해서 실행해야하는 코드들 불러오기
// import importList from "./import";
// importList.forEach(async (path) => {
//     await import(path);
//     $g.imported.push(path);

//     if (path === importList[importList.length - 1]) {
//         console.log("모든 코드가 로드되었습니다.");
//         controller.load();  // 모든 코드가 로드되었을 때 실행될 함수
//     }
// });

import { setupEventListeners } from './utils/events';
// import { state } from './utils/state';
import { Area } from './components/Area/Area';


// 처음 사이트 접속 시 실행될 함수
function init() {
    const root = document.getElementById('app');
    if (!root) return;

    // $g.debug 안에 있는 부울 값들 on/off할 수 있는 UI
    const debugContainer = document.createElement('div');
    debugContainer.id = 'debug-container';
    Object.keys($g.debug).forEach(key => {
        const label = document.createElement('label');
        label.textContent = key;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // @ts-ignore
        checkbox.checked = $g.debug[key];
        checkbox.addEventListener('change', (event) => {
            // @ts-ignore
            $g.debug[key] = (event.target as HTMLInputElement).checked;
        });

        label.appendChild(checkbox);
        debugContainer.appendChild(label);
        // 줄바꿈
        debugContainer.appendChild(document.createElement('br'));
    });
    root.appendChild(debugContainer);

    // 초기 메인 윈도우 영역 생성
    const mainArea = new Area({ 
        id: (Math.random().toString(36).substring(2, 14)), 
        x: 0, 
        y: 0, 
        width: 50, 
        height: 60, 
        is_resizable: true, 
        is_splitable: true, 
        is_joinable: true,
    });
    root.appendChild(mainArea.createElement());
    const secArea = new Area({ 
        id: (Math.random().toString(36).substring(2, 14)), 
        x: 50, 
        y: 0, 
        width: 50, 
        height: 50, 
        is_resizable: true, 
        is_splitable: true, 
        is_joinable: true,
    });
    root.appendChild(secArea.createElement());
    const thirdArea = new Area({ 
        id: (Math.random().toString(36).substring(2, 14)), 
        x: 50, 
        y: 50, 
        width: 50, 
        height: 50, 
        is_resizable: true, 
        is_splitable: true, 
        is_joinable: true,
    });
    root.appendChild(thirdArea.createElement());
    const fourthArea = new Area({ 
        id: (Math.random().toString(36).substring(2, 14)), 
        x: 0, 
        y: 60, 
        width: 50, 
        height: 40, 
        is_resizable: true, 
        is_splitable: true, 
        is_joinable: true,
    });
    root.appendChild(fourthArea.createElement());

    // 이벤트 리스너 등록
    setupEventListeners();
}
document.addEventListener('DOMContentLoaded', init);


