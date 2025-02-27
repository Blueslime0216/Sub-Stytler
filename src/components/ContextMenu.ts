// ====================================================================================================
// 우클릭 컨텍스트 메뉴 구현
// ====================================================================================================



export class ContextMenu {
    element: HTMLDivElement;
  
    constructor() {
      this.element = document.createElement('div');
      this.element.classList.add('context-menu');
      document.body.appendChild(this.element);
      this.hide();
    }
  
    show(x: number, y: number, options: { label: string; action: () => void }[]) {
      this.element.innerHTML = '';
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
      this.element.style.display = 'block';
  
      options.forEach(({ label, action }) => {
        const item = document.createElement('div');
        item.classList.add('context-menu-item');
        item.textContent = label;
        item.addEventListener('click', () => {
          action();
          this.hide();
        });
        this.element.appendChild(item);
      });
    }
  
    hide() {
      this.element.style.display = 'none';
    }
  
    init() {
      document.addEventListener('click', () => this.hide());
    }
  
    addSplitJoinOptions(areaId: string, splitCallback: (dir: 'Vertical' | 'Horizontal') => void, joinCallback: (dir: 'Up' | 'Down' | 'Left' | 'Right') => void) {
      this.show(0, 0, [
        { label: 'Split Vertical', action: () => splitCallback('Vertical') },
        { label: 'Split Horizontal', action: () => splitCallback('Horizontal') },
        { label: 'Join Up', action: () => joinCallback('Up') },
        { label: 'Join Down', action: () => joinCallback('Down') },
        { label: 'Join Left', action: () => joinCallback('Left') },
        { label: 'Join Right', action: () => joinCallback('Right') }
      ]);
    }
  }
  