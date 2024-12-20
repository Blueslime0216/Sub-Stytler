// ====================================================================================================
// 키 입력에 대한 처리를 담당하는 클래스가 선언된 파일
// ====================================================================================================
import controller from "./controller"; // 컨트롤러 클래스를 불러옴



export class Keyboard {
    // 현재 눌려있는 키를 저장하는 Set 객체 (중복된 값을 허용하지 않음)
    private _keymap:Array<KeyboardEvent["code"]> = [];      // 눌린 키
    private _keymap_hold:Array<KeyboardEvent["code"]> = []; // 꾹 눌리고 있는 키
    private _time:Array<number> = [];                       // 눌린 시간

    get keymap() { return this._keymap; }
    get keymap_hold() { return this._keymap_hold; }
    get time() { return this._time; }

    // 특정 key가 눌려있는지 확인
    isKeyDown(key:KeyboardEvent["code"]): boolean { return this._keymap.indexOf(key) !== -1; }
    isKeyHold(key:KeyboardEvent["code"]): boolean { return this._keymap_hold.indexOf(key) !== -1; }
    // index
    indexOf(key:KeyboardEvent["code"]): number { return this._keymap.indexOf(key); }
      

    // 키보드 이벤트 리스너
    keydown(e: KeyboardEvent) {
        // 키 감지하는 부분
        if (this._keymap.indexOf(e.code) === -1) { // 눌린 키가 _keymap에 없다면 keydown 판정
            // keymap에 해당 키 추가
            this._keymap.push(e.code);
            // 시간도 추가
            this._time.push(e.timeStamp);

            // keydown 실행
            controller.run('keydown', e);
        } else { // 중복된 값이 있으면
            if (this._keymap_hold.indexOf(e.code) === -1) { // _keymap_hold에 중복된 값이 없으면
                // holdStart 판정
                this._keymap_hold.push(e.code);

                controller.run('holdStart', e);
            } else {
                // holding 판정
                controller.run('holding', e);
            }
        }
    }
    keyup(e: KeyboardEvent) {
        // keymap에서 키 제거
        const index = this._keymap.indexOf(e.code);
        const index_hold = this._keymap_hold.indexOf(e.code);
        this._keymap.splice(index, 1);
        this._keymap_hold.splice(index_hold, 1);

        // 시간도 제거
        this._time.splice(index, 1);

        controller.run('keyup', e);
    }
}

const $keyboard = new Keyboard(); // 인스턴스 생성
export default $keyboard; // 인스턴스를 export