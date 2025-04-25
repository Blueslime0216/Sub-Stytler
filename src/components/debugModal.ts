import $g from '../utils/$g';
import '../styles/debugModal.css';

class DebugModal {
    modalElement: HTMLElement;
    modalContentElement: HTMLElement;
    modalOverlayElement: HTMLElement;
    isOpen: boolean = false;

    constructor() {
        // 모달 오버레이 생성
        this.modalOverlayElement = document.createElement('div');
        this.modalOverlayElement.className = 'debug-modal-overlay';

        // 모달 컨테이너 생성
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'debug-modal';

        // 모달 헤더 생성
        const modalHeader = document.createElement('div');
        modalHeader.className = 'debug-modal-header';

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = '디버그 설정';
        modalTitle.className = 'debug-modal-title';

        // 닫기 버튼 생성
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.className = 'debug-modal-close';
        closeButton.addEventListener('click', () => this.close());

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // 모달 콘텐츠 영역 생성
        this.modalContentElement = document.createElement('div');
        this.modalContentElement.className = 'debug-modal-content';

        // 모달 요소 조립
        this.modalElement.appendChild(modalHeader);
        this.modalElement.appendChild(this.modalContentElement);

        // 오버레이에 모달 추가
        this.modalOverlayElement.appendChild(this.modalElement);

        // 오버레이 클릭 시 모달 닫기
        this.modalOverlayElement.addEventListener('click', (e) => {
            if (e.target === this.modalOverlayElement) {
                this.close();
            }
        });

        // ESC 키 누를 때 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    // 모달 열기
    open() {
        // 모달 콘텐츠 업데이트
        this.updateModalContent();
        
        // 모달 표시
        document.body.appendChild(this.modalOverlayElement);
        this.modalOverlayElement.style.display = 'block';
        this.isOpen = true;
    }

    // 모달 닫기
    close() {
        this.modalOverlayElement.style.display = 'none';
        if (this.modalOverlayElement.parentNode) {
            document.body.removeChild(this.modalOverlayElement);
        }
        this.isOpen = false;
    }

    // 툴팁 생성 함수
    createTooltip(key: string, tooltipContent: string): HTMLElement | null {
        // 툴팁 내용이 'empty'인 경우 null 반환
        if (tooltipContent === 'empty') {
            return null;
        }

        // 툴팁 요소 생성
        const tooltip = document.createElement('div');
        tooltip.className = 'debug-setting-tooltip';
        tooltip.textContent = '?';

        // 툴팁 내용 요소 생성
        const tooltipContent_elem = document.createElement('div');
        tooltipContent_elem.className = 'debug-setting-tooltip-content';
        tooltipContent_elem.textContent = tooltipContent;

        // 툴팁에 툴팁 내용 추가
        tooltip.appendChild(tooltipContent_elem);

        return tooltip;
    }

    // 모달 콘텐츠 업데이트
    updateModalContent() {
        // 기존 내용 제거
        this.modalContentElement.innerHTML = '';

        // 설정 섹션 생성
        const settingsSection = document.createElement('div');
        settingsSection.className = 'debug-category';

        // 각 디버그 설정 추가
        Object.keys($g.debug).forEach(key => {
            // 툴팁 키는 건너뛰기 (xx_tooltip)
            if (key.endsWith('_tooltip')) return;
            
            const settingRow = document.createElement('div');
            settingRow.className = 'debug-setting-row';

            const labelContainer = document.createElement('div');
            labelContainer.className = 'debug-label-container';
            labelContainer.style.display = 'flex';
            labelContainer.style.alignItems = 'center';
            labelContainer.style.flex = '1';

            const label = document.createElement('label');
            label.className = 'debug-setting-label';
            label.textContent = key;

            labelContainer.appendChild(label);

            // 툴팁 추가
            const tooltipKey = `${key}_tooltip`;
            const tooltipContent = ($g.debug as Record<string, any>)[tooltipKey];
            const tooltip = this.createTooltip(key, tooltipContent);
            if (tooltip) {
                labelContainer.appendChild(tooltip);
            }

            settingRow.appendChild(labelContainer);

            // 값 타입에 따라 다른 입력 요소 생성
            const value = ($g.debug as Record<string, any>)[key];
            const valueType = typeof value;

            if (valueType === 'boolean') {
                // 불리언 값에는 토글 스위치 사용
                const toggleContainer = document.createElement('div');
                toggleContainer.className = 'debug-toggle-container';

                const toggleInput = document.createElement('input');
                toggleInput.className = 'debug-toggle-input';
                toggleInput.type = 'checkbox';
                toggleInput.id = `toggle-${key}`;
                toggleInput.checked = value;
                
                // 토글 이벤트 핸들러
                toggleInput.addEventListener('change', (event) => {
                    const isChecked = (event.target as HTMLInputElement).checked;
                    ($g.debug as Record<string, any>)[key] = isChecked;
                    console.log(`디버그 설정 [${key}]: ${isChecked ? '켜짐' : '꺼짐'}`);
                });

                const toggleSlider = document.createElement('label');
                toggleSlider.className = 'debug-toggle-slider';
                toggleSlider.htmlFor = toggleInput.id;

                toggleContainer.appendChild(toggleInput);
                toggleContainer.appendChild(toggleSlider);
                settingRow.appendChild(toggleContainer);

                // 라벨 클릭 시 토글 작동
                label.htmlFor = toggleInput.id;
            } else if (valueType === 'string' && key.includes('color')) {
                // 색상 값에는 컬러 피커 사용
                const colorPicker = document.createElement('input');
                colorPicker.type = 'color';
                colorPicker.className = 'debug-color-picker';
                
                // RGBA 값을 HEX로 변환
                const rgbaToHex = (rgba: string) => {
                    const rgbaValues = rgba.match(/\d+\.?\d*/g);
                    if (rgbaValues && rgbaValues.length >= 3) {
                        const r = parseInt(rgbaValues[0]);
                        const g = parseInt(rgbaValues[1]);
                        const b = parseInt(rgbaValues[2]);
                        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                    }
                    return '#000000';
                };
                
                colorPicker.value = rgbaToHex(value);
                
                // 투명도 슬라이더 추가
                const opacityContainer = document.createElement('div');
                opacityContainer.className = 'debug-opacity-container';
                
                const opacityLabel = document.createElement('span');
                opacityLabel.textContent = '투명도:';
                opacityLabel.className = 'debug-opacity-label';
                
                const opacitySlider = document.createElement('input');
                opacitySlider.type = 'range';
                opacitySlider.className = 'debug-opacity-slider';
                opacitySlider.min = '0';
                opacitySlider.max = '1';
                opacitySlider.step = '0.1';
                
                // RGBA에서 알파 값 추출
                const getAlphaFromRgba = (rgba: string) => {
                    const alphaMatch = rgba.match(/\d+\.?\d*\s*\)/);
                    if (alphaMatch) {
                        const alphaStr = alphaMatch[0].replace(')', '').trim();
                        return parseFloat(alphaStr);
                    }
                    return 1;
                };
                
                opacitySlider.value = getAlphaFromRgba(value).toString();
                
                // 값 변경 시 처리
                const updateColor = () => {
                    const hex = colorPicker.value;
                    const opacity = parseFloat(opacitySlider.value);
                    
                    // HEX에서 RGB 추출
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    
                    // 새 RGBA 값 설정
                    ($g.debug as Record<string, any>)[key] = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                    console.log(`디버그 설정 [${key}]: rgba(${r}, ${g}, ${b}, ${opacity})`);
                };
                
                // input 이벤트를 통해 실시간으로 값 업데이트
                colorPicker.addEventListener('input', updateColor);
                opacitySlider.addEventListener('input', updateColor);
                
                opacityContainer.appendChild(opacityLabel);
                opacityContainer.appendChild(opacitySlider);
                
                const colorContainer = document.createElement('div');
                colorContainer.className = 'debug-color-container';
                
                colorContainer.appendChild(colorPicker);
                colorContainer.appendChild(opacityContainer);
                
                settingRow.appendChild(colorContainer);
            } else if (valueType === 'number') {
                // 숫자 값에는 숫자 입력 필드 사용
                const numInput = document.createElement('input');
                numInput.type = 'number';
                numInput.className = 'debug-input debug-input-number';
                numInput.value = value.toString();
                
                // 지연 시간인 경우 단위 표시
                if (key.includes('time') || key.includes('delay')) {
                    const unitSpan = document.createElement('span');
                    unitSpan.textContent = 'ms';
                    unitSpan.className = 'debug-unit';
                    
                    const inputContainer = document.createElement('div');
                    inputContainer.className = 'debug-input-container';
                    
                    inputContainer.appendChild(numInput);
                    inputContainer.appendChild(unitSpan);
                    
                    settingRow.appendChild(inputContainer);
                } else {
                    settingRow.appendChild(numInput);
                }
                
                // input 이벤트를 통해 실시간으로 값 업데이트
                numInput.addEventListener('input', (event) => {
                    const newValue = Number((event.target as HTMLInputElement).value);
                    ($g.debug as Record<string, any>)[key] = newValue;
                    console.log(`디버그 설정 [${key}]: ${newValue}`);
                });
            } else {
                // 기타 타입에는 기본 텍스트 입력 필드 사용
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.className = 'debug-input debug-input-text';
                textInput.value = value.toString();
                settingRow.appendChild(textInput);
                
                textInput.addEventListener('change', (event) => {
                    ($g.debug as Record<string, any>)[key] = (event.target as HTMLInputElement).value;
                });
            }

            settingsSection.appendChild(settingRow);
        });

        this.modalContentElement.appendChild(settingsSection);
    }

    // 디버그 버튼 생성
    createDebugButton() {
        const debugButton = document.createElement('button');
        debugButton.textContent = '디버그 설정';
        debugButton.className = 'debug-button';
        
        debugButton.addEventListener('click', () => this.open());
        
        document.body.appendChild(debugButton);
    }
}

export default DebugModal; 