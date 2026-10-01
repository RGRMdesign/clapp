import { useTranslation } from 'react-i18next';

import { Card, Screen, SegmentedControl, Text } from '@/components/ui';
import { defaultLanguage, isLanguage, type Language } from '@/lib/i18n';

import { type ThemePreference, useSettingsStore } from '../store';

const languageLabels: Record<Language, string> = { en: 'English', nl: 'Nederlands' };

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const themeOptions = [
    { value: 'system', label: t('settings.theme.system') },
    { value: 'light', label: t('settings.theme.light') },
    { value: 'dark', label: t('settings.theme.dark') },
  ] as const satisfies readonly { value: ThemePreference; label: string }[];

  const languageOptions = (Object.keys(languageLabels) as Language[]).map((value) => ({
    value,
    label: languageLabels[value],
  }));

  return (
    <Screen>
      <Text variant="title">{t('settings.title')}</Text>

      <Card>
        <Text variant="heading">{t('settings.appearance')}</Text>
        <SegmentedControl
          label={t('settings.appearance')}
          options={themeOptions}
          value={theme}
          onChange={setTheme}
        />
      </Card>

      <Card>
        <Text variant="heading">{t('settings.language')}</Text>
        <SegmentedControl
          label={t('settings.language')}
          options={languageOptions}
          value={isLanguage(i18n.language) ? i18n.language : defaultLanguage}
          onChange={setLanguage}
        />
      </Card>
    </Screen>
  );
}
