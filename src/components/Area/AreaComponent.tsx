import React from 'react';
import { AreaData } from '../../stores/areaStore';
import BorderComponent, { BorderSide } from './BorderComponent';

interface AreaComponentProps {
  area: AreaData;
}

const AreaComponent: React.FC<AreaComponentProps> = ({ area }) => {
  const borderSides: BorderSide[] = ['top', 'bottom', 'left', 'right'];

  return (
    <div
      id={area.id}
      className="absolute bg-slate-700 border border-slate-500 text-white overflow-hidden select-none"
      style={{
        left: `${area.x}vw`,
        top: `${area.y}vh`,
        width: `${area.width}vw`,
        height: `${area.height}vh`,
        // zIndex: area.zIndex, // 필요시 zIndex 관리
      }}
    >
      <div className="p-1 text-xs">
        Area ID: {area.id.substring(0, 4)} (x: {area.x.toFixed(1)}, y: {area.y.toFixed(1)}, w: {area.width.toFixed(1)}, h: {area.height.toFixed(1)})
      </div>
      {/* Panel 내용이 여기에 들어갈 수 있습니다. */}
      {borderSides.map(side => (
        <BorderComponent key={`${area.id}-${side}`} side={side} areaId={area.id} />
      ))}
    </div>
  );
};

export default AreaComponent;
