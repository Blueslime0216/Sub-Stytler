// ====================================================================================================
// Area 컴포넌트
// ====================================================================================================
// 모듈 관련
import React from "react";
// sys 관련
import $g from "../$g";
// css
import "./area.css";



interface IArea {
  id: string; // 16자리 문자열 ID
  x: number; // X 좌표 0 ~ 10000 (%값)
  y: number; // Y 좌표 0 ~ 10000 (%값)
  width: number; // 너비 0 ~ 10000 (%값)
  height: number; // 높이 0 ~ 10000 (%값)
  isSelected: boolean; // 선택 여부 (기능 구현 예정)
  isMinimize: boolean; // 숨김 여부 (기능 구현 예정)
  children: React.ReactNode; // 내부에 추가될 모듈
}

const Area = ({ id, x, y, width, height, isSelected, isMinimize, children }: IArea) => {
  const Thickness = $g.AreaBorderThickness;

  return (
    <div
      className={`area ${isSelected ? "selected" : ""} ${isMinimize ? "minimize" : ""}`}
      style={{
        top: y,
        left: x,
        width: $g.width * (width / 10000),
        height: $g.height * (height / 10000),
      }}
      data-id={id}
    >
      {/* 4방향 컨트롤러 */}
      <div className="edge top"   style={{height:Thickness}}></div>
      <div className="edge right" style={{width:Thickness}}></div>
      <div className="edge bottom"style={{height:Thickness}}></div>
      <div className="edge left"  style={{width:Thickness}}></div>

      {/* 안에 담기는 모듈 */}
      {children}
    </div>
  );
};

export default Area;
