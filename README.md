# @marksmits/url-search-property

This project provides `UrlSearchQueryMixin` and a decorator `@searchProperty`. Through this decorator it is very easy to link properties to url search params.

This will create a two way bind between the property and the url search param. If you update the url param the property will update and trigger a re-render like other properties do. Also if you update the property the url will auto update to reflect the new property value. 

## Installation
```sh
npm install @marksmits/url-search-property
```

## Example Usage
```ts
import { searchProperty, URLSearchPropertyMixin } from '@marksmits/url-search-property/dist';

@customElement('test-app')
export class TestApp extends URLSearchPropertyMixin(LitElement) {
  @searchProperty({ type: Number, name: 'active-tab' })
  activeIndex = 1;

  @searchProperty({ type: Boolean })
  enable = 1;

  @searchProperty({ type: String })
  searchValue?: string;
}
```

## Demo
 - [Glitch](https://url-search-property.glitch.me)

## Using a `@searchProperty` decorator

Important information when using the `@searchProperty`:

- Supported property types are number, string and boolean
- When property is available in url on create teh value will be used as default
- searchProperty default values will be added to the url on element creation (if not already available in URL)
- Supports having multiple elements listening to same param
- properties are cleared from url when element is destroyed
- Supports browser history control on a per element base

## Browser History API

It is also possible to enable the ability to push the url to the browser history. This can be done by setting the `enablePushState` property to true. By default this property is set to false.

```ts
  constructor() {
    super();
    this.enablePushState = true;
  }
```

## Updating properties

When adjusting url search params through `history.replaceState` or `history.pushState` elements will not be notified of these changes automatically. To notify elements you could manualy trigger a `search-property-changed` event on the document window.

```ts
  window.dispatchEvent(
    new CustomEvent('search-property-changed', {
      detail: {url},
    }),
  );
```

## Support for URLSearchParams and History API

This project uses the `URLSearchParams`. Make sure to check if you need to load a polyfill for older browsers.

The [URLSearchParams](https://github.com/ungap/url-search-params) Polyfill.

For browser support of the [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
