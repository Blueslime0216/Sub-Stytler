// ====================================================================================================
// 모든 입력에 대한 처리를 실행하는 클래스가 선언된 코드
// ====================================================================================================
import $keyboard from "./keyboard";
import $mouse from "./mouse";


// 타입들 선언
interface IController {
    run: Function;

    load: Function[];
    
    keydown: keydownSet[];
    holdStart: keydownSet[];
    holding: keydownSet[];
    keyup: keydownSet_singleKey[];

    mousedown: mouseSet[];
    mousemove: mouseSet[];
    mouseup: mouseSet[];

    resize: Function[];
};
interface keydownSet {
    keys: Array<KeyboardEvent['code']>;
    func: Function;
};
interface keydownSet_singleKey {
    key: KeyboardEvent['code'];
    func: Function;
};
interface mouseSet {
    mouse: TMouseKeys;
    id: string;
    func: Function;
};
type eventTypes =   'load'
                    |'keydown'|'holdStart'|'holding'|'keyup'
                    |'mousedown'|'mouseclick'|'mouseholding'|'mousemove'|'mousedrag'|'mouseup'
                    // |'tooltip'
                    |'resize';

type IEvents = {
    click: Function;
    dragging: Function;
    // dragstart: Function;
    // dragend: Function;
    // dblclick: Function;
};


// 요소 이벤트 추가하는 함수 묶음
export const addEvent:IEvents = {
    click(element:HTMLElement, func:Function) {
        element.addEventListener("click", (e) => {
            func(e);
        });
    },
    dragging(element:HTMLElement, func:Function) {
        element.addEventListener("dragstart", (e) => {
            // 클래스 추가
            element.classList.add("dragging");

            const ref = (event: DragEvent) => {
                func(event);

                // 드래그 중이면 계속 실행
                if (element.classList.contains("dragging")){
                    requestAnimationFrame(() => ref(e as DragEvent));
                }
            };
            // (할일) 문제 : e요소는 드래그 시작 위치를 기억해서 업데이트가 안됌
            // 해결 : $mouse의 드래그 시작 위치를 저장하고, 매 반복마다 새로 받아와서 그 차이만큼 이동하도록 수정

            ref(e as DragEvent);
        });
        // ref 중단
        window.addEventListener("mouseup", (e) => {
            if (element.classList.contains("dragging")) {
                console.log("dragend");
                element.classList.remove("dragging");
            }
        });
    },
    // dragstart(element:HTMLElement, func:Function) {
    //     element.addEventListener("dragstart", (e) => {
    //         func(e);
    //     });
    // },
    // dragend(element:HTMLElement, func:Function) {
    //     element.addEventListener("dragend", (e) => {
    //         func(e);
    //     });
    // },
    // dblclick(element:HTMLElement, func:Function) {
    //     element.addEventListener("dblclick", (e) => {
    //         func(e);
    //     });
    // }
};
// 키 입력 관련
const controller:IController = {
    run,            // 이벤트에 맞는 함수들 실행하는 함수

    load: [],       // 처음 접속할 때 실행될 함수들이 담긴 배열. 형식 : 함수들이 담긴 배열

    keydown: [],    // 특정 키들을 눌렸을 때 실행될 함수들이 담긴 배열. 형식 : ({ key:[ 'ctrl', 's' ], func:함수(e) })
    holdStart: [],  // 특정 키들을 꾹 누르기 시작했을 때 실행될 함수들이 담긴 배열. 형식 : ({ key:[ 'ctrl', 's' ], func:함수(e) })
    holding: [],    // 특정 키들을 꾹 누른 상태일 때 실행될 함수들이 담긴 배열. 형식 : ({ key:[ 'ctrl', 's' ], func:함수(e) })
    keyup: [],      // 특정 키를 뗐을 때 실행될 함수들이 담긴 배열. 형식 : ({ key:'a', func:함수(e) })

    mousedown: [],  // 마우스를 눌렀을 때 실행될 함수들이 담긴 배열. 형식 : ({ mouse:'left', func:함수(e) })
    mousemove: [],  // 마우스가 움직일 때 실행될 함수들이 담긴 배열. 형식 : (함수)
    mouseup: [],    // 마우스를 뗐을 때 실행될 함수들이 담긴 배열. 형식 : (함수)

    resize: [],     // 브라우저 크기가 변경될 때 실행될 함수들이 담긴 배열. 형식 : (함수)
};

if (false) {   // 형식 예제
    controller.keydown.push({
        keys: ['KeyD'],
        func: (e:KeyboardEvent) => {
            e.preventDefault();
            console.log('D 누름');
        }
    });
    controller.holding.push({
        keys: ['KeyD'],
        func: (e:KeyboardEvent) => {
            e.preventDefault();
            console.log('D 홀딩');
        }
    });
    controller.holdStart.push({
        keys: ['KeyD'],
        func: (e:KeyboardEvent) => {
            e.preventDefault();
            console.log('D 홀드 시작');
        }
    });
    controller.keyup.push({
        key: 'KeyD',
        func: (e:KeyboardEvent) => {
            e.preventDefault();
            console.log('D 떼기');
        }
    });
};
// (지울거)
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


// 키 배열이 같은지 비교하는 함수
function _areKeysEqual(arr1:string[], arr2:string[]):boolean {
    // 배열 길이가 다르면 바로 false 반환
    if (arr1.length !== arr2.length) return false;
  
    // 길이가 같은 경우, 같은 키인지 비교
    return arr1.every((value, index) => value === arr2[index]);
};

// 이벤트에 맞는 함수들 실행하는 함수
function run(type:eventTypes, e:KeyboardEvent|MouseEvent, ...args:any[]) {
    if (type === 'load') {
        controller.load.forEach((func) => {
            func();
        });
    }
    else if (type === 'keydown'|| type === 'holdStart' || type === 'holding') {     // ['keydown', 'holdStart', 'holding'].includes(type)을 사용하고 싶지만 타입스크립트 에러 뜸
        // keydown 배열에 있는 set 중에서 키가 일치하는 것을 찾아서 함수 실행
        controller[type].forEach((set) => {
            // 키가 일치하면 해당 함수 실행
            if (_areKeysEqual(set.keys, $keyboard.keymap)) {
                set.func(e);
            };
        });
    } 
    else if (type === 'keyup') {
        // keyup 배열에 있는 set 중에서 키가 일치하는 것을 찾아서 함수 실행
        controller.keyup.forEach((set) => {
            // 키가 일치하면 해당 함수 실행
            // @ts-ignore
            if (set.key === e.code) {
                set.func(e);
            };
        });
    }
    else if (type === 'mousedown') {
        // console.log(`%cdown`, "color: red; font-weight: bold;");


        // (지울거) 캔버스에 글자 추가하기
        const e_button = (e as MouseEvent).button;
        const canvas = document.getElementById("mouseStatus") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        const x = [30, 50, 70][e_button] - 5;
        const y = 90;
        ctx.fillText("down", canvas.width/100 * x - 25, canvas.height/100 * y);
    }
    else if (type === 'mouseclick') {
        const e_mouse = e as MouseEvent;
        const button = ['left', 'wheel', 'right'][e_mouse.button] as TMouseKeys;
        console.log(`%c${button} - click`, "color: red; font-weight: bold;");

        const clickCount = args[0] as number;
        const clickType = args[1] as mouseClickType;


        // (지울거) 캔버스에 글자 추가하기
        const e_button = (e as MouseEvent).button;
        const canvas = document.getElementById("mouseStatus") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        const x = [30, 50, 70][e_button] - 5;
        const y = 90;
        ctx.fillText("click", canvas.width/100 * x - 25, canvas.height/100 * y);
    }
    else if (type === 'mouseholding') {
        console.log(`%cholding`, "color: red; font-weight: bold;");
    }
    else if (type === 'mousemove') {
        console.log(`%cmove`, "color: red; font-weight: bold;");
    }
    else if (type === 'mousedrag') {
        console.log(`%cdrag`, "color: red; font-weight: bold;");

        // (지울거) 캔버스에 글자 추가하기
        const e_button = (e as MouseEvent).button;
        const canvas = document.getElementById("mouseStatus") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        const x = [30, 50, 70][e_button] - 5;
        const y = 90;
        ctx.fillText("drag", canvas.width/100 * x - 25, canvas.height/100 * y);
    }
    else if (type === 'mouseup') {
        console.log(`%cup`, "color: red; font-weight: bold;");
    }
    else if (type === 'resize') {
        controller.resize.forEach((func) => {
            func();
        });
    }
};


export default controller;