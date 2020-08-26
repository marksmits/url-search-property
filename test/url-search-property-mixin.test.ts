import { LitElement, customElement } from 'lit-element';
import { html, fixture, expect } from '@open-wc/testing';
import { URLSearchPropertyMixin, searchProperty } from '../index.js';
import { getSearchParamValue } from '../src/url-search-property.js';

@customElement('test-element')
class TestElement extends URLSearchPropertyMixin(LitElement) {
  @searchProperty({ type: Number, name: 'page-index' })
  pageIndex = 2;

  @searchProperty({ type: Boolean })
  enabled = true;

  @searchProperty({ type: String })
  test = 'yes';

  render() {
    return html``;
  }
}

const delay = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

describe('URLSearchPropertyMixin', () => {
  let element: TestElement;

  beforeEach(async () => {
    element = await fixture(html`<test-element></test-element>`);
  });

  describe('searchProperty decorator', () => {
    it('should test default value of type number', () => {
      expect(element.pageIndex).equal(2);
    });

    it('should test default value of type boolean', () => {
      expect(element.enabled).to.be.true;
    });

    it('should test default value of type string', () => {
      expect(element.test).equal('yes');
    });
  });

  describe('searchProperty in url ', () => {
    it('should test pageindex property in url', () => {
      const pageIndex = getSearchParamValue('page-index', Number);
      expect(pageIndex).equal(2);
    });

    it('should test element property value after updating url', async () => {
      const searchParams = new URLSearchParams(window.location.search.slice(1));
      searchParams.set('page-index', '3');
      window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
      await delay(10);
      console.log(window.location.href);
      expect(element.pageIndex).equal(3);
    });

  });
});
