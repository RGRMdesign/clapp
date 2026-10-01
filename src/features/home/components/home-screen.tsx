import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button, Card, Screen, Text } from '@/components/ui';

export function HomeScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Card>
        <Text variant="title">{t('home.title')}</Text>
        <Text variant="muted">{t('home.subtitle')}</Text>
        <Link href="/settings" asChild>
          <Button label={t('home.cta')} variant="secondary" className="self-start" />
        </Link>
      </Card>
    </Screen>
  );
}
