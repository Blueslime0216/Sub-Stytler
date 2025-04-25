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
import DebugModal from './components/debugModal';


// 처음 사이트 접속 시 실행될 함수
function init() {
    const root = document.getElementById('app');
    if (!root) return;

    // 디버그 모달 생성 및 버튼 추가
    const debugModal = new DebugModal();
    debugModal.createDebugButton();

    // 초기 메인 윈도우 영역 생성
    if (true){
        const Areas = [
            new Area({ x: 0, y: 0, width: 16, height: 50 }),
            new Area({ x: 16, y: 0, width: 34, height: 25 }),
            new Area({ x: 16, y: 25, width: 34, height: 25 }),
            new Area({ x: 0, y: 50, width: 33, height: 50 }),
            new Area({ x: 33, y: 50, width: 17, height: 50 }),

            new Area({ x: 50, y: 0, width: 16, height: 33 }),
            new Area({ x: 50, y: 33, width: 16, height: 67 }),
            
            new Area({ x: 66, y: 0, width: 17, height: 50 }),
            new Area({ x: 83, y: 0, width: 17, height: 50 }),
            new Area({ x: 66, y: 50, width: 34, height: 50 }),
            
            // new Area({ x: 0, y: 0, width: 100, height: 100 }),
        ];
        
        Areas.forEach(area => {
            root.appendChild(area.areaElement);
        });
    }

    // 이벤트 리스너 등록
    setupEventListeners();
}
document.addEventListener('DOMContentLoaded', init);


