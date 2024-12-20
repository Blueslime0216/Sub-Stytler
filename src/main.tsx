// ====================================================================================================
// 메인 코드(모든 코드는 여기서 출발된다)
// 이벤트 리스너 연결, React 렌더링
// ====================================================================================================
// React 관련
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// sys 코드
import controller from './sys/controller.ts'
import $keyboard from './sys/keyboard.ts'
// 페이지 구성, 모듈 등
import './index.css'
import App from './App.tsx'
// 한번 실행해야 해서 import한 코드들
import './sys/area/AreaController.tsx'
// 마우스 클릭 관련으로 추가될 이벤트 리스너들
import $mouse from './sys/mouse.ts'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)