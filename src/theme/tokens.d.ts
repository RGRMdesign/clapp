type Rgb = readonly [number, number, number];
export type ColorToken =
  | 'background'
  | 'foreground'
  | 'surface'
  | 'muted'
  | 'muted-foreground'
  | 'border'
  | 'primary'
  | 'primary-foreground'
  | 'danger'
  | 'danger-foreground';
export declare const colors: Record<'light' | 'dark', Record<ColorToken, Rgb>>;
