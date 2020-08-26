import { html, css, LitElement, customElement, query } from 'lit-element';
import { searchProperty, URLSearchPropertyMixin } from '../src/url-search-property.js';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import './test-table.js';
import './test-multi.js';

@customElement('test-app')
export class TestApp extends URLSearchPropertyMixin(LitElement) {

  @searchProperty({ type: Number, name: 'active-tab' })
  activeIndex = 1;

  @query('#searchValue')
  searchValue?: HTMLInputElement;

  static styles = css`
    :host {
      display: block;
      padding: 25px;
    }
  `;

  constructor() {
    super();
    this.enablePushState = true;
  }

  render() {
    return html`
      <mwc-tab-bar activeIndex=${this.activeIndex} @MDCTabBar:activated=${(e: CustomEvent<{index: number}>) => this.activeIndex = e.detail.index}>
        <mwc-tab label="Example Page"></mwc-tab>
        <mwc-tab label="Table"></mwc-tab>
      </mwc-tab-bar>
      ${this.activeIndex === 0 ? html`
        <div>
          <input id="searchValue" type="text">
          <button @click=${() => {
            const searchParams = new URLSearchParams(window.location.search.slice(1));
            searchParams.set('searchValue', this.searchValue!.value)
            const url = `${location.pathname}?${searchParams}`;
            history.replaceState({}, '', url);
            window.dispatchEvent(
              new CustomEvent('location-changed', {
                detail: {url},
              }),
            );
          }}>Update search value</button>
        </div>
        <test-multi></test-multi>
        <test-multi></test-multi>
      `: html`
        <test-table></test-table>
      `}
    `;
  }
}
