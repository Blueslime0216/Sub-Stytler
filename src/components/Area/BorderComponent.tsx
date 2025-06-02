import React, { useState, useCallback } from 'react';
import { useAreaStore, AreaData } from '../../stores/areaStore';

export type BorderSide = 'top' | 'bottom' | 'left' | 'right';

interface BorderComponentProps {
  areaId: string;
  side: BorderSide;
  // containerSize: { width: number; height: number }; // vw/vh 단위의 부모 컨테이너 크기
}

const BORDER_THICKNESS_VW = 0.2; // 예시: Border 두께 vw
const BORDER_THICKNESS_VH = 0.35; // 예시: Border 두께 vh
const MIN_AREA_SIZE_VW = 5; // 최소 Area 너비 vw
const MIN_AREA_SIZE_VH = 5; // 최소 Area 높이 vh

const BorderComponent: React.FC<BorderComponentProps> = ({ areaId, side }) => {
  // const { areas, updateArea, getAreaById } = useAreaStore(); // getAreaById 추가 고려
  const { areas, updateArea } = useAreaStore();
  const [isDragging, setIsDragging] = useState(false);

  const getBorderStyles = useCallback(() => {
    let styles: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: isDragging ? 'rgba(0, 80, 180, 0.7)' : 'rgba(0, 120, 255, 0.5)', // 드래그 중 색상 변경
      zIndex: 10, // Area 내용보다 위에 표시
    };
    switch (side) {
      case 'top':
        styles.top = 0;
        styles.left = 0;
        styles.width = '100%';
        styles.height = `${BORDER_THICKNESS_VH}vh`;
        styles.cursor = 'ns-resize';
        break;
      case 'bottom':
        styles.bottom = 0;
        styles.left = 0;
        styles.width = '100%';
        styles.height = `${BORDER_THICKNESS_VH}vh`;
        styles.cursor = 'ns-resize';
        break;
      case 'left':
        styles.top = 0;
        styles.left = 0;
        styles.width = `${BORDER_THICKNESS_VW}vw`;
        styles.height = '100%';
        styles.cursor = 'ew-resize';
        break;
      case 'right':
        styles.top = 0;
        styles.right = 0;
        styles.width = `${BORDER_THICKNESS_VW}vw`;
        styles.height = '100%';
        styles.cursor = 'ew-resize';
        break;
    }
    return styles;
  }, [isDragging, side]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 중단
    setIsDragging(true);

    const initialMouseX = e.clientX;
    const initialMouseY = e.clientY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const currentArea: AreaData | undefined = areas.find(a => a.id === areaId);
    // const currentArea = getAreaById(areaId); // 스토어에 getAreaById 구현 시 대체 가능
    if (!currentArea) return;

    // 연결된 Border 로직 (단순화된 버전, 추후 확장 필요)
    // const linkedAreas: { area: AreaData, linkSide: BorderSide }[] = [];
    // 기존 detectLinkedBorders 로직을 여기에 적용하여 linkedAreas를 채웁니다.

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = ((moveEvent.clientX - initialMouseX) / screenWidth) * 100; // vw
      const deltaY = ((moveEvent.clientY - initialMouseY) / screenHeight) * 100; // vh
      
      let newX = currentArea.x;
      let newY = currentArea.y;
      let newWidth = currentArea.width;
      let newHeight = currentArea.height;

      // TODO: calculateNewRects와 유사한 로직 구현
      // side에 따라 newX, newY, newWidth, newHeight 계산
      // 최소/최대 크기 제한 적용
      // 연결된 Area들의 크기/위치도 함께 조정 (linkedAreas 사용)

      switch (side) {
        case 'top':
          // 예시: 상단 Border 드래그 시 Y 위치와 높이 변경
          newY = currentArea.y + deltaY;
          newHeight = currentArea.height - deltaY;
          if (newHeight < MIN_AREA_SIZE_VH) {
            newHeight = MIN_AREA_SIZE_VH;
            newY = currentArea.y + currentArea.height - MIN_AREA_SIZE_VH;
          }
          break;
        case 'bottom':
          newHeight = currentArea.height + deltaY;
          if (newHeight < MIN_AREA_SIZE_VH) {
            newHeight = MIN_AREA_SIZE_VH;
          }
          break;
        case 'left':
          newX = currentArea.x + deltaX;
          newWidth = currentArea.width - deltaX;
          if (newWidth < MIN_AREA_SIZE_VW) {
            newWidth = MIN_AREA_SIZE_VW;
            newX = currentArea.x + currentArea.width - MIN_AREA_SIZE_VW;
          }
          break;
        case 'right':
          newWidth = currentArea.width + deltaX;
          if (newWidth < MIN_AREA_SIZE_VW) {
            newWidth = MIN_AREA_SIZE_VW;
          }
          break;
      }
      // 화면 경계를 벗어나지 않도록 추가 검사 (옵션)
      // newX = Math.max(0, newX);
      // newY = Math.max(0, newY);
      // if (newX + newWidth > 100) newWidth = 100 - newX;
      // if (newY + newHeight > 100) newHeight = 100 - newY;

      updateArea(areaId, { x: newX, y: newY, width: newWidth, height: newHeight });

      // 연결된 Area들도 업데이트 (단순화된 예시)
      // linkedAreas.forEach(linked => {
      //   // linked.area의 크기와 위치를 delta 값과 linkSide에 따라 조정
      //   // updateArea(linked.area.id, { ... }); 
      // });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

  }, [areaId, areas, updateArea, side]);

  return (
    <div
      style={getBorderStyles()}
      onMouseDown={handleMouseDown}
      className={`border-control-${side}`}
    />
  );
};

export default BorderComponent;
