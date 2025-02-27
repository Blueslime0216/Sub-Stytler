// ====================================================================================================
// 앱의 엔트리 포인트, 초기화 및 이벤트 설정
// ====================================================================================================
import { setupEventListeners } from './utils/events';
// import { state } from './utils/state';
import { Area } from './components/Area';



function init() {
    const root = document.getElementById('app');
    if (!root) return;

    // 초기 메인 윈도우 영역 생성
    const mainArea = new Area({ 
        id: (Math.random().toString(36).substring(2, 14)), 
        x: 25, 
        y: 25, 
        width: 50, 
        height: 50, 
        is_resizable: true, 
        is_splitable: true, 
        is_joinable: true,
    });
  
    root.appendChild(mainArea.createElement());

    // 이벤트 리스너 등록
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);