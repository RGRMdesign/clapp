import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type Language } from '@/lib/i18n';
import { storage } from '@/lib/storage';

export type ThemePreference = 'system' | 'light' | 'dark';

type SettingsState = {
  theme: ThemePreference;
  /** null = follow the device language */
  language: Language | null;
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: Language | null) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: null,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings',
      version: 1,
      storage: createJSONStorage(() => storage),
      partialize: ({ theme, language }) => ({ theme, language }),
    },
  ),
);
