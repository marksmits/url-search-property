import { LitElement, property } from 'lit-element';
import { PropertyDeclaration } from 'lit-element/lib/updating-element.js';
import { SearchDeclaration, SupportedPropertyTypes, Constructor } from './types.js';

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
    try {
      if(type === Number) {
        return parseInt(propertyValue, 10);
      } if(type === Boolean) {
        return stringToBoolean(propertyValue)
      } else {
        return propertyValue;
      }
    } catch (error) {
      throw Error(`Unable to parse type for value ${propertyValue} and type ${type}`);
    }
  }
}

export interface URLSearchPropertyInterface {
  enablePushState: boolean;
}

export const URLSearchPropertyMixin = <T extends Constructor<LitElement>>(
  base: T
): T & Constructor<URLSearchPropertyInterface> => {
  class URLSearchProperty extends base {
    private static _searchParams: {
      [prop: string]: { name?: string | null; type?: unknown };
    } = {};

    /*  */
    private connectStarted = false;

    private self = this as {} as { [key: string]: SupportedPropertyTypes };

    public enablePushState = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boundLocationChanged?: any;
    //boundPopState?: (event: CustomEvent<LocationChangedEventDetail>) => void;  // TODO: fix typing

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(args);
      this.boundLocationChanged = this._handleLocationChanged.bind(this);
    }

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
            return (this as { [key: string]: SupportedPropertyTypes })[key];
          },
          set(this: URLSearchProperty, value: SupportedPropertyTypes) {
            const oldValue = this.self[prop];
            const searchValue = getSearchParamValue(URLSearchProperty._searchParams[prop].name || prop, URLSearchProperty._searchParams[prop].type);

            if(searchValue !== value && this.connectStarted) {
              const searchParams = new URLSearchParams(window.location.search.slice(1));
              searchParams.set(URLSearchProperty._searchParams[prop].name || prop, String(value));
              this.updateUrl(searchParams);
            }

            this.self[key] = value;
            this.requestUpdate(propertyKey, oldValue);
          },
          configurable: true,
          enumerable: true
        });
      }
    }

    private _handleLocationChanged() {
      this._updatePropertiesFromUrl();
    }

    private updateUrl(searchParams: URLSearchParams) {
      const url = `${location.pathname}?${searchParams}`;
      if(this.enablePushState) {
        window.history.pushState({}, '', url);
      } else {
        window.history.replaceState({}, '', url);
      }

      window.dispatchEvent(
        new CustomEvent('search-property-changed', {
          detail: {url},
        }),
      );
    }

    _updatePropertiesFromUrl(updateUrl = false) {
      /* Search properties */
      const params = URLSearchProperty._searchParams;

      /* Url Search params */
      const searchParams = new URLSearchParams(window.location.search.slice(1));

      for (const searchProperty of Object.keys(params)) {
        const _searchParam = params[searchProperty];
        if (searchParams.has(_searchParam.name || searchProperty)) {
          this.self[searchProperty] = getSearchParamValue(_searchParam.name || searchProperty, _searchParam.type);
        } else if(updateUrl) {
          const val = this.self[searchProperty];

          if (val !== null && val !== undefined) {
            searchParams.set(_searchParam.name || searchProperty, String(val));
            this.updateUrl(searchParams);
          }
        }
      }
    }

    connectedCallback() {
      super.connectedCallback();

      /* Add listener for search params changed */
      window.addEventListener('search-property-changed', this.boundLocationChanged);
      window.addEventListener('popstate', this.boundLocationChanged);

      /* Needed to determine init value */
      this.connectStarted = true;

      /* Also update url on initial setup element when param not available */
      this._updatePropertiesFromUrl(true);
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
      this.updateUrl(searchParams);

      /* Cleaup listener */
      window.removeEventListener('search-property-changed', this.boundLocationChanged);
      window.removeEventListener('popstate', this.boundLocationChanged);

      super.disconnectedCallback();
    }
  }

  return URLSearchProperty;
};
