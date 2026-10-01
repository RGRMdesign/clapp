import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import nl from './locales/nl.json';

export const resources = {
  en: { translation: en },
  nl: { translation: nl },
} as const;

export type Language = keyof typeof resources;
export const languages = Object.keys(resources) as Language[];
export const defaultLanguage: Language = 'en';

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && value in resources;
}

export function getDeviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return isLanguage(code) ? code : defaultLanguage;
}

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: defaultLanguage,
  interpolation: { escapeValue: false },
});

export { i18n };
