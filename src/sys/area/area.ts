// ====================================================================================================
// Area 컴포넌트
// ====================================================================================================
// Lit 관련
import { LitElement, html, css, unsafeCSS } from 'lit';
import { property, customElement } from 'lit/decorators.js';



/**
 * ## Area
 * - **x** : (0.00 ~ 100.00)
 * - **y** : (0.00 ~ 100.00)
 * - **width** : (0.00 ~ 100.00)
 * - **height** : (0.00 ~ 100.00)
 * - **moduleType** : 'none''
 */
@customElement("lit-area")
class Area extends LitElement {
    @property({ type: Number }) x:number = 0;
    @property({ type: Number }) y:number = 0;
    @property({ type: Number }) width:number = 100;
    @property({ type: Number }) height:number = 100;
    @property({ type: String }) moduleType:string = 'none';

    static styles = css`
        .area {
            display: block;
            padding: 16px;
            border: 1px solid #ccc;
            border-radius: 8px;
            position: absolute
        }

        .handle {
            position: absolute;
            background-color: #f00;
            width: 10px;
            height: 10px;
        }
        .top {
            top: 0;
            left: 0;
            width: 100%;
        }
        .right {
            top: 0;
            right: 0;
            height: 100%;
        }
        .bottom {
            bottom: 0;
            left: 0;
            width: 100%;
        }
        .left {
            top: 0;
            left: 0;
            height: 100%;
        }
    `;
  
    render() {
        return html`
            <div class="area" style="
                left: ${this.x}dvw;
                top: ${this.y}dvh;
                width: ${this.width}dvw;
                height: ${this.height}dvh;"
            >
                <h3>Module Type: ${this.moduleType}</h3>

                <!-- 4방향 모서리 -->
                ${['top', 'right', 'bottom', 'left'].map(position => html`
                    <div class="handle ${position}"></div>
                `)}
            </div>
        `;
    }

    resize(direction: string, diffX: number, diffY: number) {
        if (direction === 'top') {
            this.y += diffY;
            this.height -= diffY;
        } else if (direction === 'right') {
            this.width += diffX;
        } else if (direction === 'bottom') {
            this.height += diffY;
        } else if (direction === 'left') {
            this.x += diffX;
            this.width -= diffX;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
            "lit-area": Area;
    }
}