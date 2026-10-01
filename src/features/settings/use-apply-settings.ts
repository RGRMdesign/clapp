import { colorScheme } from 'nativewind';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { getDeviceLanguage, i18n } from '@/lib/i18n';

import { useSettingsStore } from './store';

/**
 * Applies persisted settings (theme + language) to the running app.
 * Mount once, in the root layout. Returns the resolved color scheme.
 */
export function useApplySettings(): 'light' | 'dark' {
  const theme = useSettingsStore((s) => s.theme);
  const language = useSettingsStore((s) => s.language);
  const system = useColorScheme();
  const resolved = theme === 'system' ? (system === 'dark' ? 'dark' : 'light') : theme;

  useEffect(() => {
    // Always set an explicit scheme: on web NativeWind's "system" does not toggle the .dark class.
    colorScheme.set(resolved);
  }, [resolved]);

  useEffect(() => {
    void i18n.changeLanguage(language ?? getDeviceLanguage());
  }, [language]);

  return resolved;
}
