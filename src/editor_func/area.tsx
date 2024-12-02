import React, { useState, useRef } from "react";

function IDGen():string {
  return Math.random().toString(36).substring(2, 9);
}

// 각 div의 상태를 나타내는 인터페이스
interface DivState {
  id: string; // div의 고유 ID
  width: number; // div의 너비
  height: number; // div의 높이
  x: number; // div의 x 좌표
  y: number; // div의 y 좌표
}

const WorkspaceDivider: React.FC = () => {
  // div 상태를 관리하는 useState
  const [divs, setDivs] = useState<DivState[]>([
    { 
      id: IDGen(),
      x: 0,
      y: 0,
      width: 400,
      height: 400,
    }, // 초기 div 설정
  ]);

  // 분할/드래그 모드
  let mode:("drag"|"split") = "split";

  // 컨테이너 참조 (전체 영역을 담는 div)
  const containerRef = useRef<HTMLDivElement>(null);

  // 드래그 시작 시 호출되는 함수
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    divId: string, // 드래그가 시작된 div의 ID
    direction: "left" | "right" | "top" | "bottom" // 드래그 방향
  ) => {
    const targetDiv = divs.find((div) => div.id === divId); // 드래그된 div 찾기
    if (!targetDiv || !containerRef.current) return;

    // 컨테이너 영역 정보를 가져옴
    const containerRect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX - containerRect.left; // 드래그 시작 x 좌표
    const startY = e.clientY - containerRect.top; // 드래그 시작 y 좌표

    // 마우스 이동 중 발생하는 이벤트
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - containerRect.left; // 현재 마우스 x 좌표
      const newY = moveEvent.clientY - containerRect.top; // 현재 마우스 y 좌표

      const deltaX = newX - startX; // x 방향 변화량
      const deltaY = newY - startY; // y 방향 변화량

      // div 상태 업데이트
      setDivs((prevDivs) => {
        const updatedDivs = [...prevDivs]; // 이전 div 상태 복사
        const index = updatedDivs.findIndex((div) => div.id === divId); // 드래그 중인 div의 인덱스 찾기
        if (index === -1) return updatedDivs; // 해당 div가 없으면 그대로 반환

        const target = updatedDivs[index];

        if (direction === "left" || direction === "right") {
          // 가로 분할
          const newWidth = target.width / 2;
          updatedDivs[index] = { ...target, width: newWidth }; // 기존 div 크기 조정
          updatedDivs.push({
            id: IDGen(),
            x: target.x + newWidth,
            y: target.y,
            width: newWidth,
            height: target.height,
          }); // 새로운 div 추가
        } else {
          // 세로 분할
          const newHeight = target.height / 2;
          updatedDivs[index] = { ...target, height: newHeight }; // 기존 div 크기 조정
          updatedDivs.push({
            id: IDGen(),
            x: target.x,
            y: target.y + newHeight,
            width: target.width,
            height: newHeight,
          }); // 새로운 div 추가
        }
        return updatedDivs; // 업데이트된 div 상태 반환
      });

      // 이벤트 제거
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    // 드래그 종료 시 호출되는 함수
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    // function onKeyDown(e: KeyboardEvent) {
    //   mode = e.ctrlKey ? "split" : "drag"; // 분할 또는 크기 조정 모드 설정
    //   console.log("mode", mode);
    // }

    // 마우스 이동 및 종료 이벤트 등록
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    // document.addEventListener("keydown", onKeyDown);
  };

  // 모서리에 마우스를 올렸을 때 커서 모양 변경
  const handleEdgeHover = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: "left" | "right" | "top" | "bottom"
  ) => {
    const cursor = {
      drag : {
        left: "ew-resize", // 좌우 크기 조정 커서
        right: "ew-resize",
        top: "ns-resize", // 상하 크기 조정 커서
        bottom: "ns-resize",
      },
      split : {
        left: "col-resize", // 좌우 크기 조정 커서
        right: "col-resize",
        top: "row-resize", // 상하 크기 조정 커서
        bottom: "row-resize",
      },
    };
    e.currentTarget.style.cursor = mode === "split" ? cursor.split[direction] : cursor.drag[direction];
  };
  
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        border: "1px solid black", // 컨테이너 테두리
      }}
    >
      {/* 각 div 렌더링 */}
      {divs.map((div) => (
        <div
          key={div.id}
          style={{
            position: "absolute", // 절대 위치 지정
            top: div.y, // div y 좌표
            left: div.x, // div x 좌표
            width: div.width, // div 너비
            height: div.height, // div 높이
            border: "1px solid gray", // div 테두리
          }}
          // onMouseDown={(e) => handleMouseDown(e, div.id)} // 드래그 시작 이벤트
        >
          {/* 크기 조정을 위한 모서리 히트박스 */}
          {(["left", "right", "top", "bottom"] as const).map((direction) => (
            <div
              key={direction}
              style={{
                position: "absolute",
                [direction]: 0,
                width: direction === "left" || direction === "right" ? "5px" : "100%",
                height: direction === "top" || direction === "bottom" ? "5px" : "100%",
                background: "red",
              }}
              onMouseDown={(e) => handleMouseDown(e, div.id, direction)} // 마우스 다운 시 크기 조정 또는 분할 시작
              onMouseMove={(e) => handleEdgeHover(e, direction)} // 커서 모양 변경
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WorkspaceDivider;
