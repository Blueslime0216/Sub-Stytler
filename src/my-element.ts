import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement("lit-tomato")
class Tomato extends LitElement {
  @property({ type: String }) name: string;

  constructor() {
    super();
    this.name = "tomato1";
  }

  render() {
    return html`
      <h1>Hello ${this.name}!</h1>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-tomato": Tomato;
  }
}
