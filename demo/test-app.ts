import { html, css, LitElement, customElement } from 'lit-element';
import { searchProperty, URLSearchPropertyMixin } from '../src/url-search-property.js';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import './test-table.js';

@customElement('test-app')
export class TestApp extends URLSearchPropertyMixin(LitElement) {

  @searchProperty({ type: Number, name: 'active-tab' })
  activeIndex = 1;

  static styles = css`
    :host {
      display: block;
      padding: 25px;
    }
  `;

  render() {
    return html`
      <mwc-tab-bar activeIndex=${this.activeIndex} @MDCTabBar:activated=${(e: CustomEvent<{index: number}>) => this.activeIndex = e.detail.index}>
        <mwc-tab label="Example Page"></mwc-tab>
        <mwc-tab label="Table"></mwc-tab>
      </mwc-tab-bar>
      ${this.activeIndex === 0 ? html`Example Page`: html`<test-table></test-table>`}
    `;
  }
}
