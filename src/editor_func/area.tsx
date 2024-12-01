import { dir } from "console";
import React, { useState, useRef } from "react";

const AreaDivideStartDistance = 15; // 분할 시작 거리

// 각 Area의 상태를 나타내는 인터페이스
interface IAreaState {
  id: string; // Area의 고유 ID
  width: number; // Area의 너비
  height: number; // Area의 높이
  x: number; // Area의 x 좌표
  y: number; // Area의 y 좌표
}

function IDGen() {
  return Math.random().toString(36).substring(2, 8);
}

const AreaDivider: React.FC = () => {
  // Area들이 저장될 배열
  const [areas, setDivs] = useState<IAreaState[]>([
    { id: IDGen(),
      width: 400,
      height: 400,
      x: 0,
      y: 0
    }, // 초기 div 설정
  ]);

  // 컨테이너 참조 (전체 영역을 담는 div)
  const containerRef = useRef<HTMLDivElement>(null);

  // 드래그 시작 시 호출되는 함수
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    divId: string, // 드래그가 시작된 div의 ID
    dir: "right" | "left" | "top" | "bottom" // 드래그 방향
  ) => {
    let isAdded:Boolean = false; // 분할 여부
    const targetDiv = areas.find((div) => div.id === divId); // 드래그된 div 찾기
    if (!targetDiv || !containerRef.current) return; // div가 없거나 컨테이너가 없으면 종료

    // 컨테이너 영역 정보를 가져옴
    const containerRect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX - containerRect.left; // 드래그 시작 x 좌표
    const startY = e.clientY - containerRect.top; // 드래그 시작 y 좌표

    // 마우스 이동 중 발생하는 이벤트
    const onMouseMove = (e:MouseEvent) => {
      const newX = e.clientX - containerRect.left; // 현재 마우스 x 좌표
      const newY = e.clientY - containerRect.top; // 현재 마우스 y 좌표

      const deltaX = newX - startX; // x 방향 변화량
      const deltaY = newY - startY; // y 방향 변화량
      
      // div 상태 업데이트
      setDivs((prevDivs) => {
        console.log("setDivs");
        const updatedDivs = [...prevDivs]; // 기존 div 상태 복사
        const index = updatedDivs.findIndex((div) => div.id === divId); // 드래그된 div의 인덱스 찾기
        if (index === -1) return updatedDivs; // 해당 div가 없으면 그대로 반환

        const target = updatedDivs[index];

        // 만약 움직인 거리가 AreaDivideStartDistance 이상이면 분할 시작
        if (!isAdded && (Math.abs(deltaX) > AreaDivideStartDistance || Math.abs(deltaY) > AreaDivideStartDistance)){
          if (dir === "right" && deltaX < -AreaDivideStartDistance) {
            console.log("right");
            // 세로 분할
            const newHeight = target.height / 2;
            updatedDivs[index] = { ...target, height: newHeight }; // 기존 div 크기 조정
            updatedDivs.push({
              id: IDGen(),
              width: target.width,
              height: newHeight,
              x: target.x,
              y: target.y + newHeight,
            }); // 새로운 div 추가
            isAdded = true;
          } else if (dir === "bottom" && deltaY < -AreaDivideStartDistance) {
            console.log("bottom");
            // 가로 분할
            const newWidth = target.width / 2;
            updatedDivs[index] = { ...target, width: newWidth }; // 기존 div 크기 조정
            updatedDivs.push({
              id: IDGen(),
              width: newWidth,
              height: target.height,
              x: target.x + newWidth,
              y: target.y,
            }); // 새로운 div 추가
            isAdded = true;
          }
        }
        console.log("updatedDivs", updatedDivs, dir);
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

    // 마우스 이동 및 종료 이벤트 등록
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
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
      {areas.map((div) => (
        <div
          key={div.id}
          style={{
            position: "absolute", // 절대 위치 지정
            width: div.width, // div 너비
            height: div.height, // div 높이
            top: div.y, // div y 좌표
            left: div.x, // div x 좌표
            border: "1px solid gray", // div 테두리
          }}
        >
          {/* 모서리 부분 (드래그 가능한 영역) */}
          <div
            className="edge-right"
            style={{
              position: "absolute",
              width: "5px",
              height: "100%",
              backgroundColor: "blue",
              bottom: 0,
              right: 0,
              cursor: "col-resize",
            }}
            onMouseDown={(e) => handleMouseDown(e, div.id, "right")} // 드래그 시작 이벤트
          ></div>
          {/* 모서리 부분 (드래그 가능한 영역) */}
          <div
            className="edge-bottom"
            style={{
              position: "absolute",
              width: "100%",
              height: "5px",
              backgroundColor: "cyan",
              bottom: 0,
              right: 0,
              cursor: "row-resize",
            }}
            onMouseDown={(e) => handleMouseDown(e, div.id, "bottom")} // 드래그 시작 이벤트
          ></div>
        </div>
      ))}
    </div>
  );
};

export default AreaDivider;