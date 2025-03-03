/**
 * 경계(Border) 클래스
 * - 영역의 경계 역할을 수행하며, 마우스 드래그 이벤트를 통해 크기와 위치를 조절합니다.
 * - 임시(temp) 값을 사용해 이동 전 상태를 보관하므로, 취소 시 원래 상태로 복원할 수 있습니다.
 * - 같은 선상(수평 또는 수직)에 있는 다른 경계와 함께 이동하도록 처리합니다.
 */
import $keyboard from '../../sys/keyboard';
import $mouse from '../../sys/mouse';
import $g from '../../utils/$g';
import { px2vh, px2vw } from '../../utils/unit';
import { Area } from './Area';

export class Border {
  // 고유 ID (외부에서는 읽기 전용)
  _id: string;
  // 경계의 방향: 'top', 'bottom', 'left', 'right'
  side: 'top' | 'bottom' | 'left' | 'right';
  // 이 경계가 속한 부모 Area 객체
  area: Area;
  // 초기 좌표 및 크기 (vw, vh 단위)
  _x: number;
  _y: number;
  _size: number;
  // 드래그 시 임시 저장되는 변화량 (temp 값)
  _temp_x: number = 0;
  _temp_y: number = 0;
  _temp_size: number = 0;
  // 마우스 이벤트 콜백 함수들
  mousedragstart: mouseFuncSet[] = [];
  mousedrag: mouseFuncSet[] = [];
  mousedragend: mouseFuncSet[] = [];
  mousedown: mouseFuncSet[] = [];
  // 크기 조절 상태 플래그
  _is_resizing: boolean = false;
  _is_canceled: boolean = false;
  // 같이 움직여야 할 같은 선상의 다른 Border들을 저장
  private _linked_borders: Border[] = [];

  // 외부에서 읽기 전용으로 제공되는 getter
  get id() { return this._id; }
  get x() { return this._x + this._temp_x; }
  get y() { return this._y + this._temp_y; }
  get size() { return this._size + this._temp_size; }

  /**
   * 생성자
   * @param id - 경계의 고유 ID
   * @param side - 경계 방향 ('top' | 'bottom' | 'left' | 'right')
   * @param x - 초기 X 좌표 (vw 단위)
   * @param y - 초기 Y 좌표 (vh 단위)
   * @param size - 경계의 길이 또는 크기 (vw 또는 vh 단위)
   * @param area - 이 경계가 속한 부모 Area 객체
   */
  constructor({ id, side, x, y, size, area }: BorderProps) {
    this._id = id;
    this.side = side;
    this._x = x;
    this._y = y;
    this._size = size;
    this.area = area;
  }

  /**
   * HTML 상에 경계(Border)를 나타내는 DIV 요소를 생성하는 메소드
   * - 경계의 위치, 크기 및 CSS 클래스를 설정합니다.
   * @returns 생성된 HTMLDivElement
   */
  createElement(): HTMLDivElement {
    const thickness = $g.AreaBorderThickness;
    const borderElement = document.createElement('div');
    borderElement.id = this.id;
    borderElement.classList.add('border', this.side);
    // 공통 함수를 사용하여 초기 스타일을 설정합니다.
    this.updateElementStyle(borderElement, thickness);
    // 생성된 경계 객체를 전역 관리($g.elements)에 등록합니다.
    $g.elements.set(this.id, this);
    // 마우스 관련 이벤트 리스너들을 초기화합니다.
    this.init();
    return borderElement;
  }

  /**
   * 마우스 이벤트 리스너들을 초기화하는 메소드
   * - 드래그 시작, 진행, 종료 및 우클릭(취소) 이벤트에 대한 콜백을 등록합니다.
   */
  init() {
    this.mousedragstart.push({
      mouse: 'left',
      func: this.startResize.bind(this)
    });
    this.mousedrag.push({
      mouse: 'left',
      func: this.resize.bind(this)
    });
    this.mousedragend.push({
      mouse: 'left',
      func: this.endResize.bind(this)
    });
    this.mousedown.push({
      mouse: 'right',
      func: this.cancelResize.bind(this)
    });
  }

  /**
   * HTML 요소의 스타일을 업데이트하는 공통 함수
   * @param element - 업데이트할 HTML 요소
   * @param thickness - 경계 두께 (픽셀 단위)
   */
  private updateElementStyle(element: HTMLElement, thickness: number) {
    element.style.left = `calc(${this.x}vw - ${this.side === 'right' ? thickness : 0}px)`;
    element.style.top = `calc(${this.y}vh - ${this.side === 'bottom' ? thickness : 0}px)`;
    element.style.width = (this.side === 'left' || this.side === 'right')
      ? `${thickness}px`
      : `${this.size}vw`;
    element.style.height = (this.side === 'top' || this.side === 'bottom')
      ? `${thickness}px`
      : `${this.size}vh`;
  }

  /**
   * 같은 선상(수평 또는 수직)에 있는 Border들을 찾아 반환하는 함수
   * @returns 연결된 Border 배열
   */
  private getLinkedBorders(): Border[] {
    const tolerance = 1; // 좌표 오차 허용 범위
    if (this.side === 'left' || this.side === 'right') {
      return Array.from($g.elements.values()).filter((elem): elem is Border => {
        return (elem instanceof Border) &&
               (elem.area !== this.area) &&
               ((elem.side === 'left' || elem.side === 'right') && Math.abs(elem.x - this.x) <= tolerance);
      });
    } else if (this.side === 'top' || this.side === 'bottom') {
      return Array.from($g.elements.values()).filter((elem): elem is Border => {
        return (elem instanceof Border) &&
               (elem.area !== this.area) &&
               ((elem.side === 'top' || elem.side === 'bottom') && Math.abs(elem.y - this.y) <= tolerance);
      });
    }
    return [];
  }

  /**
   * 드래그 시작 시 호출되는 함수
   * - 같은 선상의 다른 Border들을 찾아 _linked_borders에 저장하여 함께 이동하도록 준비합니다.
   */
  startResize() {
    this._linked_borders = this.getLinkedBorders();
  }

  /**
   * 마우스 드래그 중에 호출되는 함수
   * - 자신의 임시(temp) 이동량을 갱신하고, HTML 요소와 부모 Area를 업데이트합니다.
   * - 같은 선상의 연결된 Border에도 동일한 임시 이동량을 적용합니다.
   * @param event - 마우스 이벤트 객체
   */
  resize(event: MouseEvent) {
    if (this._is_canceled) return;
    this._is_resizing = true;

    // 자신의 임시 이동량 업데이트 (픽셀 값을 vw 또는 vh 단위로 변환)
    if (this.side === 'left' || this.side === 'right') {
      this._temp_x = px2vw($mouse.draggedSize.left.width);
    }
    if (this.side === 'top' || this.side === 'bottom') {
      this._temp_y = px2vh($mouse.draggedSize.left.height);
    }

    // 자신의 HTML 요소 스타일 업데이트
    const borderElement = document.getElementById(this.id);
    if (!borderElement) return;
    const thickness = $g.AreaBorderThickness;
    this.updateElementStyle(borderElement, thickness);

    // 부모 Area의 크기 조절을 호출하여 영역 전체 업데이트
    this.area.resize(this.side);
    // 연결된 Border들도 동일한 임시 이동량을 적용하여 업데이트합니다.
    if (!$keyboard.isKeyDown('ControlLeft')){
        this._linked_borders.forEach(border => {
          if (border.side === 'left' || border.side === 'right') {
            border._temp_x = px2vw($mouse.draggedSize.left.width);
          }
          if (border.side === 'top' || border.side === 'bottom') {
            border._temp_y = px2vh($mouse.draggedSize.left.height);
          }
          border.update();
          border.area.resize(border.side);
        });
    }
  }

  /**
   * 임시(temp) 이동량을 실제 좌표에 반영하고, temp 값을 초기화하는 함수
   * - 자신의 좌표를 갱신한 후 HTML 스타일도 업데이트합니다.
   */
  private applyTempChange() {
    this._x += this._temp_x;
    this._y += this._temp_y;
    this._temp_x = 0;
    this._temp_y = 0;
    this.update();
  }

  /**
   * 드래그 종료 시 호출되는 함수
   * - 자신의 임시 이동량은 물론, 함께 이동한 연결된 Border들의 임시 이동량도 실제 값으로 반영합니다.
   */
  endResize() {
    this._is_resizing = false;
    if (this._is_canceled) {
      this._is_canceled = false;
      return;
    }
    // 자신의 임시 이동량을 적용
    this.applyTempChange();

    // 연결된 Border들도 임시 이동량을 적용하고, 각 Border의 부모 Area를 업데이트합니다.
    this._linked_borders.forEach(border => {
      border.applyTempChange();
      border.area.resize(border.side);
    });
  }

  /**
   * 우클릭 등으로 크기 조절을 취소할 때 호출되는 함수
   * - 임시 이동량을 초기화하고, 현재 상태를 HTML에 업데이트합니다.
   */
  cancelResize() {
    if (this._is_resizing) {
      this._is_canceled = true;
    }
    this._temp_x = 0;
    this._temp_y = 0;
    this.update();
    this.area.resize(this.side);
  }

  /**
   * 현재 Border의 HTML 요소 스타일을 갱신하여 변경된 위치와 크기를 반영하는 함수
   */
  update() {
    const borderElement = document.getElementById(this.id);
    if (!borderElement) return;
    const thickness = $g.AreaBorderThickness;
    this.updateElementStyle(borderElement, thickness);
  }
}
