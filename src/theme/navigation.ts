import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

import { type ColorScheme, tokenColor } from './colors';

function navigationTheme(scheme: ColorScheme): Theme {
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
