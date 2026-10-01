import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribe = () => () => {};

/**
 * Web pages are statically rendered without knowing the user's color scheme.
 * Return 'light' while hydrating so the first client render matches the server HTML;
 * otherwise React keeps mismatched server styles (e.g. a light tab bar in dark mode).
 */
export function useColorScheme() {
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const colorScheme = useRNColorScheme();

  return isHydrated ? colorScheme : 'light';
}
