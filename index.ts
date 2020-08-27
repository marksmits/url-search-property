import { LocationChangedEventDetail } from './src/types.js';

export { URLSearchPropertyMixin, searchProperty } from './src/url-search-property.js';

declare global {
  interface HTMLElementEventMap {
    'search-property-changed': CustomEvent<LocationChangedEventDetail>;
  }
}
