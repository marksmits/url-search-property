
export interface LocationChangedEventDetail {
  url: string;
}

export interface SearchDeclaration<TypeHint = unknown> {
  readonly search?: boolean; // only used to distinguish SearchProperty from plain Property
  readonly name?: string | null;
  readonly type?: TypeHint;
}

export type SupportedPropertyTypes = string | number | boolean | null | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...args: any[]) => T;
