import React, { useState, useRef, useEffect } from "react";

function IDGen() {
  return Math.random().toString(36).substring(2, 9);
}

// 작업 영역을 나타내는 상태를 정의하는 인터페이스
// 각 영역은 고유한 id와 위치 및 크기 정보를 가짐
interface IAreaState {
  id: string; // 고유한 ID (랜덤 문자열)
  x: number; // X 좌표 (% 단위)
  y: number; // Y 좌표 (% 단위)
  width: number; // 너비 (% 단위)
  height: number; // 높이 (% 단위)
}

// 영역 분할을 시작하는 거리 상수 (15px)
const AreaDivideStartDistance = 15;

const WorkspaceDivider: React.FC = () => {
  // 영역 상태 관리 (초기에는 전체 화면 하나의 영역만 있음)
  const [areas, setAreas] = useState<IAreaState[]>([
    { id: IDGen(), x: 0, y: 0, width: 50, height: 50 },
  ]);
  const [isDividing, setIsDividing] = useState(false); // 현재 분할 중인지 여부
  const [resizeTarget, setResizeTarget] = useState<string | null>(null); // 크기 조정 중인 영역의 ID
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null); // 드래그 시작 위치
  const containerRef = useRef<HTMLDivElement>(null); // 작업 영역 컨테이너 참조

  // 마우스 다운 이벤트 핸들러 (크기 조정 또는 분할 시작)
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    areaId: string,
    direction: "left" | "right" | "top" | "bottom"
  ) => {
    if (e.ctrlKey) {
      setIsDividing(true); // 분할 시작 설정
    }
    setResizeTarget(areaId); // 크기 조정 대상 영역 설정
    setDragStart({ x: e.clientX, y: e.clientY }); // 드래그 시작 위치 저장
    document.addEventListener("mousemove", handleMouseMove); // 마우스 이동 이벤트 리스너 추가
    document.addEventListener("mouseup", handleMouseUp); // 마우스 업 이벤트 리스너 추가
  };

  // 마우스 이동 이벤트 핸들러 (크기 조정 또는 분할 중)
  const handleMouseMove = (e: MouseEvent) => {
    if (isDividing && (!resizeTarget || !dragStart || !containerRef.current)) return;
    if (!resizeTarget || !dragStart || !containerRef.current) return;

    const deltaX = e.clientX - dragStart.x; // X축 이동 거리 계산
    const deltaY = e.clientY - dragStart.y; // Y축 이동 거리 계산
    const targetArea = areas.find((area) => area.id === resizeTarget); // 대상 영역 찾기

    if (!targetArea) return;

    if (isDividing) {
      // 분할 중인 경우
      const isHorizontalSplit = Math.abs(deltaX) > Math.abs(deltaY); // 가로 또는 세로 분할 여부 판단

      if (isHorizontalSplit) {
        // 가로로 분할
        setAreas((prev) => {
          const newAreas = [...prev];
          const targetIndex = newAreas.findIndex((area) => area.id === resizeTarget);
          if (targetIndex === -1) return newAreas;

          const splitWidth = targetArea.width / 2; // 기존 영역 너비의 절반 계산
          newAreas[targetIndex] = {
            ...targetArea,
            width: splitWidth, // 기존 영역 크기 업데이트
          };
          newAreas.push({
            id: IDGen(),
            x: targetArea.x + splitWidth, // 새로운 영역 시작 위치 설정
            y: targetArea.y,
            width: splitWidth,
            height: targetArea.height,
          });
          return newAreas;
        });
      } else {
        // 세로로 분할
        setAreas((prev) => {
          const newAreas = [...prev];
          const targetIndex = newAreas.findIndex((area) => area.id === resizeTarget);
          if (targetIndex === -1) return newAreas;

          const splitHeight = targetArea.height / 2; // 기존 영역 높이의 절반 계산
          newAreas[targetIndex] = {
            ...targetArea,
            height: splitHeight, // 기존 영역 크기 업데이트
          };
          newAreas.push({
            id: IDGen(),
            x: targetArea.x,
            y: targetArea.y + splitHeight, // 새로운 영역 시작 위치 설정
            width: targetArea.width,
            height: splitHeight,
          });
          return newAreas;
        });
      }
    } else {
      // 크기 조정 중인 경우
      setAreas((prev) =>
        prev.map((area) => {
          if (area.id === resizeTarget) {
            return {
              ...area,
              width: Math.max(10, targetArea.width + deltaX), // 최소 너비 제한
              height: Math.max(10, targetArea.height + deltaY), // 최소 높이 제한
            };
          }
          return area;
        })
      );
    }
  };

  // 마우스 업 이벤트 핸들러 (크기 조정 또는 분할 종료)
  const handleMouseUp = () => {
    setResizeTarget(null); // 크기 조정 대상 해제
    setIsDividing(false); // 분할 상태 해제
    setDragStart(null); // 드래그 시작 위치 초기화
    document.removeEventListener("mousemove", handleMouseMove); // 이벤트 제거
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // 모서리에 마우스를 올렸을 때 커서 모양 변경
  const handleEdgeHover = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: "left" | "right" | "top" | "bottom"
  ) => {
    if (e.ctrlKey) {
      const cursor = {
        left: "ew-resize", // 좌우 크기 조정 커서
        right: "ew-resize",
        top: "ns-resize", // 상하 크기 조정 커서
        bottom: "ns-resize",
      };
      e.currentTarget.style.cursor = cursor[direction];
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {areas.map((area) => (
        <div
          key={area.id}
          className="area"
          style={{
            position: "absolute",
            left: `${area.x}%`,
            top: `${area.y}%`,
            width: `${area.width}%`,
            height: `${area.height}%`,
            border: "1px solid black",
          }}
        >
          {/* 크기 조정을 위한 모서리 히트박스 */}
          {(["left", "right", "top", "bottom"] as const).map((direction) => (
            <div
              key={direction}
              style={{
                position: "absolute",
                [direction]: 0,
                width: direction === "left" || direction === "right" ? "10px" : "100%",
                height: direction === "top" || direction === "bottom" ? "10px" : "100%",
                cursor: "pointer",
                background: "transparent",
              }}
              onMouseDown={(e) => handleMouseDown(e, area.id, direction)} // 마우스 다운 시 크기 조정 또는 분할 시작
              onMouseOver={(e) => handleEdgeHover(e, direction)} // 커서 모양 변경
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WorkspaceDivider;
