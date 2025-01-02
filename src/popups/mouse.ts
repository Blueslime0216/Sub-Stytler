// ====================================================================================================
// 전역에서 사용될 변수/함수 등을 정의해두는 파일
// ====================================================================================================
import controller from "../sys/controller";
import $mouse from "../sys/mouse";



controller.load.push( () => {
    // 화면에 캔버스 추가
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    // id 추가
    canvas.id = "mouseStatus";
    // 캔버스 위치 조정
    canvas.style.position = "absolute";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    // 보더 설정
    canvas.style.borderRadius = "25px";
    // 중앙으로 이동
    canvas.style.transform = "translate(-50%, -50%)";
    // 배경 검은색
    canvas.style.backgroundColor = "black";
    const refContainer = () => {
        let isdrawLine = false;
        // $mouse의 각 키의 값이 눌렸는지에 따라 하단에 원 그리기
        const draw = () => {
            moveUp();

            // 마우스 표시
            ctx.font = "19px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ['left', 'wheel', 'right'].forEach((key, index) => {
                // 검은색으로 지우기
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.fillRect(canvas.width/100 * (index * 20 + 30) - 25, canvas.height - 50, 50, 50);
                ctx.fill();
                // 텍스트 쓰기
                ctx.fillStyle = "white";
                ctx.fillText(key, canvas.width/100 * (index * 20 + 30), canvas.height - 30);
            });
            
            // 만약 0.5초 경과라면 가로선 그리기
            const now = Date.now();
            const time:number = parseInt(now.toString().slice(10, 11));    // 0 ~ 9까지의 숫자
            if ((time == 0 || time == 5) && !isdrawLine) {
                isdrawLine = true;

                ctx.fillStyle = 'white';
                ctx.beginPath();
                const y = 90;
                ctx.fillRect(0, canvas.height/100 * y, canvas.width, 1);
                ctx.fill();

                //0.5 라고 적기
                ctx.font = "20px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "white";
                ctx.fillText("0.5s", canvas.width/100 * 85, canvas.height/100 * y - 15);
            }
            if ((time == 1 || time == 6)) {
                isdrawLine = false;
            }

            drawButton(30, 90, $mouse.isDown.left ? ($mouse.isDragging.left ? "blue" : "green"): "gray");
            drawButton(50, 90, $mouse.isDown.wheel ? ($mouse.isDragging.wheel ? "blue" : "green"): "gray");
            drawButton(70, 90, $mouse.isDown.right ? ($mouse.isDragging.right ? "blue" : "green"): "gray");

            requestAnimationFrame(draw);
        };
        function drawButton(x:number, y:number, color:string) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.fillRect(canvas.width/100 * x - 25, canvas.height/100 * y - 5, 50, 10);
            ctx.fill();
        };
        function moveUp() {
            // 캔버스에 그려진 그림을 위로 5px 이동
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, -10);
        }
        requestAnimationFrame(draw);
    };
    refContainer();
});