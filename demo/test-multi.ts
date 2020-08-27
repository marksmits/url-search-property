import { html, css, LitElement, customElement } from 'lit-element';
import { searchProperty, URLSearchPropertyMixin } from '../src/url-search-property.js';

@customElement('test-multi')
export class TestMulti extends URLSearchPropertyMixin(LitElement) {

  @searchProperty({ type: String })
  searchValue?: string;

  static styles = css`
    :host {
      display: block;
      padding: 25px;
    }
  `;

  render() {
    return html`
      <div @click=${() => this.searchValue = `${Date.now()}`}>[CLICK TO UPDATE]searchValue: ${this.searchValue}</div>
    `;
  }
}
