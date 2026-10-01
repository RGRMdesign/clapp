import { colors, type ColorToken } from './tokens';

export type ColorScheme = keyof typeof colors;

/** Token as an `rgb()` string, for APIs that do not accept className (navigation, icons, placeholders). */
export function tokenColor(scheme: ColorScheme, token: ColorToken) {
  const [r, g, b] = colors[scheme][token];
  return `rgb(${r}, ${g}, ${b})`;
}
