import { type KeyValueStorage } from './types';

/**
 * Web: localStorage. Not encrypted — never store secrets here.
 * Guarded because localStorage is unavailable during static rendering and may throw in private mode.
 */
export const storage: KeyValueStorage = {
  getItem: async (key) => {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // ignore: storage is a best-effort convenience on web
    }
  },
  removeItem: async (key) => {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export type { KeyValueStorage } from './types';
