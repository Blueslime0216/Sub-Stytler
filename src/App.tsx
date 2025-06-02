import React, { useEffect } from 'react';
import { setupEventListeners } from './utils/events';
import DebugModal from './components/debugModal';
import { useAreaStore, initialAreaConfigs } from './stores/areaStore';
import AreaComponent from './components/Area/AreaComponent';

const App: React.FC = () => {
  const { areas, initializeAreas } = useAreaStore();

  useEffect(() => {
    // 디버그 모달 (기존 로직 유지 또는 React 방식으로 변경 필요)
    const debugModal = new DebugModal();
    debugModal.createDebugButton();

    // Zustand 스토어에 초기 Area 데이터 설정
    initializeAreas(initialAreaConfigs);

    // 이벤트 리스너 등록 (키/마우스) - 추후 React 이벤트 시스템과 통합 필요
    setupEventListeners();
  }, [initializeAreas]);

  return (
    <div className="w-full h-screen relative bg-gray-800">
      {areas.map((area) => (
        <AreaComponent key={area.id} area={area} />
      ))}
      {/* 다른 전역 UI 요소들 (e.g., DebugModal을 React 컴포넌트로 만들어서 여기에 배치) */}
    </div>
  );
};

export default App;
