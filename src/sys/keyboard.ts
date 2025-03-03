// ====================================================================================================
// 키 입력에 대한 정보가 담겨있는 클래스가 선언된 파일
// 키 입력을 받으면 적절하게 처리해서 알맞은 컨트롤러를 실행시킨다
// ====================================================================================================
import controller from "./controller"; // 컨트롤러 클래스를 불러옴


// 키보드 입력을 전부 관리하는 클래스
export class Keyboard {
    // 현재 눌려있는 키를 저장하는 배열
    keymap:Array<KeyboardEvent["code"]> = [];      // 눌린 키
    keymap_hold:Array<KeyboardEvent["code"]> = []; // 꾹 눌리고 있는 키
    time:Array<number> = [];                       // 눌린 시간 (홀딩 중에도 처음 눌렸던 시각이 기록되어 있음)

    // 특정 key가 눌려있는지 확인
    isKeyDown(key:KeyboardEvent["code"]): boolean { return $keyboard.keymap.indexOf(key) !== -1; };
    isKeyHold(key:KeyboardEvent["code"]): boolean { return $keyboard.keymap_hold.indexOf(key) !== -1; };
    // 특정 key의 index를 반환
    indexOf(key:KeyboardEvent["code"]): number { return $keyboard.keymap.indexOf(key); };


    // 키가 눌렸을 때 실행되는 함수
    keydown(e: KeyboardEvent) {
        // 키 감지하는 부분
        if ($keyboard.keymap.indexOf(e.code) === -1) { // 눌린 키가 keymap에 없다면 keydown 판정
            // keymap에 해당 키 추가
            $keyboard.keymap.push(e.code);
            // 시간도 추가
            $keyboard.time.push(e.timeStamp);

            // keydown 실행
            controller.keydown(e);
        } else { // 중복된 값이 있으면
            if ($keyboard.keymap_hold.indexOf(e.code) === -1) { // keymap_hold에 중복된 값이 없으면
                // holdStart 판정
                $keyboard.keymap_hold.push(e.code);

                // holdStart 실행
                controller.holdstart(e);
            } else {
                // holding 판정

                // holding 실행
                controller.holding(e);
            }
        }
    };
    // 키가 떼졌을 때 실행되는 함수
    keyup(e: KeyboardEvent) {
        // 만약 hold 중이었다면 holdEnd 실행
        if ($keyboard.keymap_hold.indexOf(e.code) !== -1) {
            // holdEnd 실행
            controller.holdend(e);
        } else { // hold 중이 아니었다면 tab 실행
            // tab 실행
            controller.tab(e);
        }
        // keymap에서 키 제거
        const index = $keyboard.keymap.indexOf(e.code);
        const index_hold = $keyboard.keymap_hold.indexOf(e.code);
        $keyboard.keymap.splice(index, 1);
        $keyboard.keymap_hold.splice(index_hold, 1);

        // 시간도 제거
        $keyboard.time.splice(index, 1);

        controller.keyup(e);
    };
}

const $keyboard = new Keyboard(); // 인스턴스 생성
export default $keyboard; // 인스턴스를 export