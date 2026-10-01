import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

import { colors, type ColorToken } from './tokens';

type Scheme = keyof typeof colors;

/** Token as an `rgb()` string, for APIs that do not accept className (navigation, icons). */
export function tokenColor(scheme: Scheme, token: ColorToken) {
  const [r, g, b] = colors[scheme][token];
  return `rgb(${r}, ${g}, ${b})`;
}

function navigationTheme(scheme: Scheme): Theme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: tokenColor(scheme, 'primary'),
      background: tokenColor(scheme, 'background'),
      card: tokenColor(scheme, 'background'),
      text: tokenColor(scheme, 'foreground'),
      border: tokenColor(scheme, 'border'),
      notification: tokenColor(scheme, 'danger'),
    },
  };
}

export const navigationThemes = {
  light: navigationTheme('light'),
  dark: navigationTheme('dark'),
} as const;
