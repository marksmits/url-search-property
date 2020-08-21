# @marksmits/url-search-property

This project provides `UrlSearchQueryMixin` and a decorator `@searchProperty`.

```ts
@customElement('test-app')
export class TestApp extends URLSearchPropertyMixin(LitElement) {
  @searchProperty({ type: Number, name: 'active-tab' })
  activeIndex = 1;
}
```

## Support URLSearchParams

This project uses the `URLSearchParams`. Make sure to check if you need to load a polyfill for older browsers.

The [URLSearchParams](https://github.com/ungap/url-search-params) Polyfill.

## Using a `@searchProperty` decorator

Important information when using the `@searchProperty`:

- property types that are supported are number, string and boolean
- property default values will always be added to the url on element create 
- default property is used when no override is available in initial url param
- property is read-only so manual modifications are ignored
- default property value set by the user is also ignored
- properties are cleared from url when element is destroyed

## TODO

- Write tests

