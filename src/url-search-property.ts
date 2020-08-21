import { LitElement, property } from 'lit-element';
import { PropertyDeclaration } from 'lit-element/lib/updating-element.js';

export const stringToBoolean = (s: string) => {
  return /^\s*(true|1|on)\s*$/i.test(s);
}

const defaultSearchDeclaration: SearchDeclaration = {
  search: true,
  type: String,
  name: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchProperty(opts?: SearchDeclaration): (proto: object, name?: PropertyKey) => any {
  return property({...defaultSearchDeclaration, ...opts} as PropertyDeclaration);
}

export interface SearchDeclaration<TypeHint = unknown> {
  readonly search?: boolean; // only used to distinguish SearchProperty from plain Property
  readonly name?: string | null;
  readonly type?: TypeHint;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...args: any[]) => T;

export const getSearchParamValue = (propertyName?: string | null, type?: unknown) => {
  if (!propertyName) {
    return;
  }
  /* Url Search params */
  const searchParams = new URLSearchParams(window.location.search.slice(1));
  if (searchParams.has(propertyName)) {
    const propertyValue: string | null = searchParams.get(propertyName);
    if(!propertyValue) {
      return;
    }
    if(type === Number) {
      try {
        return parseInt(propertyValue);
      } catch (error) {
        throw Error('type error')
      }
    } if(type === Boolean) {
      try {
        return stringToBoolean(propertyValue)
      } catch (error) {
        throw Error('type error')
      }
    } else {
      return propertyValue;
    }

  }
}

export const URLSearchPropertyMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<LitElement> => {
  class URLSearchProperty extends base {
    private static _searchParams: {
      [prop: string]: { name?: string | null; type?: unknown };
    } = {};

    private connectStarted = false;

    /**
     * Extend the LitElement `createProperty` method to watch for search properties
     */
    static createProperty(propertyKey: PropertyKey, options: PropertyDeclaration) {
      const { search, name, type } = options as SearchDeclaration;
      const prop = propertyKey as string;

      const isSearchProperty = typeof search === 'boolean';

      const opts = isSearchProperty
        ? {
            ...{
              type: Boolean,
              attribute: false,
              noAccessor: true,
            }, ...options
          }
        : options;

      ((base as unknown) as typeof LitElement).createProperty(propertyKey, opts);

      if (isSearchProperty) {
        this._searchParams[prop] = { name, type };

        // Create custom accessors to disallow external property modifications. See original code at
        // https://github.com/Polymer/lit-element/blob/41e9fd3/src/lib/updating-element.ts#L306-L320
        const key = `__${prop}`;
        Object.defineProperty(this.prototype, prop, {
          get() {
            return (this as { [key: string]: string | number | boolean | null | undefined })[key];
          },
          set(this: URLSearchProperty, value: string | number | boolean | null | undefined) {
            const oldValue = ((this as {}) as { [key: string]: unknown })[prop];
            const searchValue = getSearchParamValue(URLSearchProperty._searchParams[prop].name || prop, URLSearchProperty._searchParams[prop].type);

            if(searchValue !== value && this.connectStarted) {
              const searchParams = new URLSearchParams(window.location.search.slice(1));
              searchParams.set(URLSearchProperty._searchParams[prop].name || prop, String(value));
              window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
            }

            ((this as {}) as { [key: string]: unknown })[key] = value;
            this.requestUpdate(propertyKey, oldValue);
          },
          configurable: true,
          enumerable: true
        });
      }
    }

    connectedCallback() {
      super.connectedCallback();

      /* Search properties */
      const params = URLSearchProperty._searchParams;

      /* Url Search params */
      const searchParams = new URLSearchParams(window.location.search.slice(1));

      /* Needed to determine init value */
      this.connectStarted = true;

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      for (const searchProperty of Object.keys(params)) {
        const _searchParam = params[searchProperty];
        if (searchParams.has(_searchParam.name || searchProperty)) {
          ((this as {}) as { [key: string]: unknown })[searchProperty] = getSearchParamValue(_searchParam.name || searchProperty, _searchParam.type);
        } else {
          const val = ((this as {}) as { [key: string]: unknown })[searchProperty];

          if (val !== null && val !== undefined) {
            searchParams.set(_searchParam.name || searchProperty, String(val));
            window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
          }
        }
      }
    }

    disconnectedCallback() {
      const params = URLSearchProperty._searchParams;
      const searchParams = new URLSearchParams(window.location.search.slice(1));

      /* delete params from url when element is destroyed */
      for (const searchProperty of Object.keys(params)) {
        const _searchParam = params[searchProperty];
        searchParams.delete(_searchParam.name || searchProperty);
      }

      /* Update url search params */
      window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);

      super.disconnectedCallback();
    }
  }

  return URLSearchProperty;
};
