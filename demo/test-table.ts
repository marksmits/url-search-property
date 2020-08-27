import { html, css, LitElement, customElement, query } from 'lit-element';
import { searchProperty, URLSearchPropertyMixin } from '../src/url-search-property.js';

@customElement('test-table')
export class TestTable extends URLSearchPropertyMixin(LitElement) {

  @query('#pageSizeSelect')
  pageSizeSelect?: HTMLSelectElement;

  @query('#enabledChechbox')
  enabledChechbox?: HTMLInputElement;

  @searchProperty({ type: Number, name: 'page-index' })
  pageIndex = 1;

  @searchProperty({ type: Number })
  pageSize = 25;

  @searchProperty({ type: Boolean })
  enabled = false;

  static styles = css`
    :host {
      display: block;
      padding: 25px;
    }
  `;

  render() {
    return html`
      enabled: ${this.enabled}<br>
      page: ${this.pageIndex}<br>
      pageSize: ${this.pageSize}<br>
      <br>

      <p>Example of options used in a data grid</p>

      <button @click=${() => this.pageIndex += 1}>NEXT PAGE</button>
      <select id="pageSizeSelect" @change=${() => {
        this.pageSize = parseInt(this.pageSizeSelect!.value, 10);
      }}>
        ${[5, 10, 25].map(s => html`<option value="${s}" ?selected=${s === this.pageSize}>${s}</option>`)}
      </select>
      <div>
        <input type="checkbox" id="enabledChechbox" name="enabled" value="true" @click=${() => {
        this.enabled = this.enabledChechbox!.checked;
      }} ?checked=${this.enabled}>
        <label for="enabledChechbox"> Enabled</label><br>
      </div>
    `;
  }
}
