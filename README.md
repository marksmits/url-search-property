# @marksmits/url-search-property

This project provides `UrlSearchQueryMixin` and a decorator `@searchProperty`. Through this decorator it is very easy to add properties to the URL search params.

```ts
@customElement('test-app')
export class TestApp extends URLSearchPropertyMixin(LitElement) {
  @searchProperty({ type: Number, name: 'active-tab' })
  activeIndex = 1;
}
```

## Using a `@searchProperty` decorator

Important information when using the `@searchProperty`:

- Supported property types are number, string and boolean
- property default values will always be added to the url on element creation
- Supports having multiple elements listening to same params
- default property is used when no override is available in initial url param
- property is read-only so manual modifications are ignored
- default property value set by the user is also ignored
- properties are cleared from url when element is destroyed

## Using 

It is also possible to enable/disable ability to push the url to the browser history. This can be done by setting the `enablePushState` property to true. 

```ts
  constructor() {
    super();
    this.enablePushState = true;
  }
```

## Updating properties

when adjusting url params though `history.replaceState` or `history.pushState` elements will not be notified of these changes. To notify you could trigger a `search-property-changed` event on the window.

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

For browser supprt of the [MDN History API] (https://developer.mozilla.org/en-US/docs/Web/API/History_API)
