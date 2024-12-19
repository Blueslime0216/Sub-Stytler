// ====================================================================================================
// 모든 입력에 대한 처리를 담당하는 코드
// ====================================================================================================
import $keyboard from "./keyboard";
import $mouse from "./mouse";



// 타입들 선언
interface IController {
    run: Function;
    
    keydown: keydownSet[];
    holdStart: keydownSet[];
    holding: keydownSet[];
    keyup: keydownSet_singleKey[];

    // mousedown: Function[];
    // mousemove: Function[];
    // mouseup: Function[];

    resize: Function[];
}
interface keydownSet {
    keys: Array<KeyboardEvent["code"]>;
    func: Function;
}
interface keydownSet_singleKey {
    key: KeyboardEvent["code"];
    func: Function;
}
type eventTypes =  'keydown'|"holdStart"|"holding"|"keyup"|'resize'
                  |'mousedown'|'mousemove'|'mouseup';



const controller:IController = {
    run,            // 이벤트에 맞는 함수들 실행하는 함수

    keydown: [],    // 특정 키들을 눌렸을 때 실행될 함수들이 담긴 배열. 형식 : ({ key:[ 'ctrl', 's' ], func:함수(e) })
    holdStart: [],  // 특정 키들을 꾹 누르기 시작했을 때 실행될 함수들이 담긴 배열. 형식 : ({ key:[ 'ctrl', 's' ], func:함수(e) })
    holding: [],    // 특정 키들을 꾹 누른 상태일 때 실행될 함수들이 담긴 배열. 형식 : ({ key:[ 'ctrl', 's' ], func:함수(e) })
    keyup: [],      // 특정 키를 뗐을 때 실행될 함수들이 담긴 배열. 형식 : ({ key:'a', func:함수(e) })

    // mousedown: [],  // 마우스를 눌렀을 때 실행될 함수들이 담긴 배열. 형식 : (함수)
    // mousemove: [],  // 마우스가 움직일 때 실행될 함수들이 담긴 배열. 형식 : (함수)
    // mouseup: [],    // 마우스를 뗐을 때 실행될 함수들이 담긴 배열. 형식 : (함수)

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
}


function _areKeysEqual(arr1:string[], arr2:string[]):boolean {
    // 배열 길이가 다르면 바로 false 반환
    if (arr1.length !== arr2.length) return false;
  
    // 길이가 같은 경우, 같은 키인지 비교
    return arr1.every((value, index) => value === arr2[index]);
}

function run(type:eventTypes, e:KeyboardEvent) {
    if (type == 'keydown'|| type == 'holdStart' || type == 'holding') {     // ['keydown', 'holdStart', 'holding'].includes(type)을 사용하고 싶지만 타입스크립트 에러 뜸
        // keydown 배열에 있는 set 중에서 키가 일치하는 것을 찾아서 함수 실행
        controller[type].forEach((set) => {
            // 키가 일치하면 해당 함수 실행
            if (_areKeysEqual(set.keys, $keyboard.keymap)) {
                set.func(e);
            };
        });
    } 
    else if (type == 'keyup') {
        // keyup 배열에 있는 set 중에서 키가 일치하는 것을 찾아서 함수 실행
        controller.keyup.forEach((set) => {
            // 키가 일치하면 해당 함수 실행
            if (set.key == e.code) {
                set.func(e);
            };
        });
    }
    // else if (type == 'mousedown') {
    //     controller.mousedown.forEach((func) => {
    //         console.log('mousedown');
    //         func(e);
    //     });
    // }
    else if (type == 'resize') {
        controller.resize.forEach((func) => {
            func();
        });
    }
}

export default controller;