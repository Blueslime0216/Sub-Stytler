import React, { useState, useRef, useEffect } from 'react';
import './easing.css';

type Position = {
    x: number; // 픽셀 단위로 저장
    y: number; // 픽셀 단위로 저장
};

function clamp (value:number, min:number, max:number){
  return Math.min(Math.max(value, min), max);
}

const AreaEasing: React.FC = () => {
    const [handleStart, setHandleStart] = useState<Position>({ x: 50, y: 450 });
    const [handleEnd, setHandleEnd] = useState<Position>({ x: 450, y: 50 });
    const areaRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const coordCanvasRef = useRef<HTMLCanvasElement>(null);

    // 좌표 캔버스에 그리드를 그림
    useEffect(() => {
        if (!coordCanvasRef.current) return;

        const ctx = coordCanvasRef.current.getContext('2d');
        if (!ctx) return;

        const width = coordCanvasRef.current.width;
        const height = coordCanvasRef.current.height;

        // 캔버스 초기화
        ctx.clearRect(0, 0, width, height);

        // 그리드 스타일 설정
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;

        // 가로줄 그리기
        for (let y = 0; y <= height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // 세로줄 그리기
        for (let x = 0; x <= width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
    }, []);

    function handleDragging (
        e: MouseEvent,
        setPosition: React.Dispatch<React.SetStateAction<Position>>
    ){
        if (!areaRef.current) return;

        // 밖으로 나가지 않도록 클램핑
        const rect = areaRef.current.getBoundingClientRect();
        const x = clamp(e.clientX - rect.left, 0, rect.width);
        const y = clamp(e.clientY - rect.top, 0, 500);

        // 위치 적용
        setPosition({ x, y });
    };

    // 마우스를 클릭하면 실행될 함수
    function addDragListeners (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        setPosition: React.Dispatch<React.SetStateAction<Position>>
    ){
        e.preventDefault(); // 드래그 기본 동작 방지

        // 클릭을 시작하고 움직이면
        function onMouseMove(event: MouseEvent){
            handleDragging(event, setPosition);
        };
        // 마우스를 떼면
        function onMouseUp(){
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        // 움직일 때와 떼었을 때의 이벤트 리스너 추가
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    // 함수 그리는 함수
    useEffect(() => {
        // 가져오기
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // 함수 만들기
        const getY = new Function("x", bezierFunction.slice(21, -1));

        // 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 기본 설정
        const width = canvas.width;
        const height = canvas.height;

        // 가이드 그리기
        // 시작점에서 시작점 핸들로 반투명한 직선 그리기
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.moveTo(handleStart.x, handleStart.y);
        ctx.lineTo(0, 500);
        ctx.stroke();
        // 끝점에서 끝점 핸들로 반투명한 직선 그리기
        ctx.beginPath();
        ctx.moveTo(handleEnd.x, handleEnd.y);
        ctx.lineTo(500, 0);
        ctx.stroke();

        // 그래프 그리기
        ctx.fillStyle = '#00ff00';
        for (let i = 0; i <= 100; i++) {
            const x = i / 100; // 0 ~ 1
            const y = getY(x);
            const canvasX = x * width; // translate x to canvas
            const canvasY = height - y*height; // translate y to canvas
            ctx.fillRect(canvasX, canvasY, 2, 2); // draw point
        }
    }, [handleStart, handleEnd]);

    // 출력 텍스트 에어리어에 함수 식 업데이트
    const bezierFunction = `
function easing(x) {
    const [controlPoint1X, controlPoint1Y] = [${handleStart.x / 500}, ${(500 - handleStart.y) / 500}];
    const [controlPoint2X, controlPoint2Y] = [${handleEnd.x / 500}, ${(500 - handleEnd.y) / 500}];

    // Calculate Bezier curve for given t
    const calculateBezier = (t, start, cp1, cp2, end) => {
        const oneMinusT = 1 - t;
        return (oneMinusT ** 3) * start +
               3 * (oneMinusT ** 2) * t * cp1 +
               3 * oneMinusT * (t ** 2) * cp2 +
               (t ** 3) * end;
    };

    // Derivative of Bezier curve for X-axis
    const calculateDerivative = (t, cp1, cp2) => {
        const oneMinusT = 1 - t;
        return 3 * (oneMinusT ** 2) * cp1 +
               6 * oneMinusT * t * cp2 +
               3 * (t ** 2);
    };

    // Solve for t based on X using Newton-Raphson method
    const findTForX = (targetX, maxIterations = 8) => {
        let t = targetX; // Initial guess for t
        for (let i = 0; i < maxIterations; i++) {
            const currentX = calculateBezier(t, 0, controlPoint1X, controlPoint2X, 1);
            const slope = calculateDerivative(t, controlPoint1X, controlPoint2X);
            t -= (currentX - targetX) / slope;
            if (Math.abs(currentX - targetX) < 1e-6) break;
        }
        return t;
    };

    // Find t for the given x and calculate corresponding Y value
    const t = findTForX(x);
    return calculateBezier(t, 0, controlPoint1Y, controlPoint2Y, 1);
}`;
    
    return (
        <div className="area area_easing" ref={areaRef}>
            {/* Start Handle */}
            <div
                className="handle start"
                style={{
                    left: `${handleStart.x}px`,
                    top: `${handleStart.y}px`,
                }}
                onMouseDown={(e) => addDragListeners(e, setHandleStart)}
            />

            {/* End Handle */}
            <div
                className="handle end"
                style={{
                    left: `${handleEnd.x}px`,
                    top: `${handleEnd.y}px`,
                }}
                onMouseDown={(e) => addDragListeners(e, setHandleEnd)}
            />

            <div className="point start"></div>
            <div className="point end"></div>

            <canvas
                className="canvas coordinate"
                ref={coordCanvasRef}
                width={500}
                height={500}
            ></canvas>
            <canvas
                className="canvas easing"
                ref={canvasRef}
                width={500}
                height={500}
            ></canvas>
            {/* Textarea Output */}
            <textarea
                className="output"
                value={bezierFunction}
                readOnly
            />
        </div>
    );
};

export default AreaEasing;
