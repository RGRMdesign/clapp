import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button, Screen, Text } from '@/components/ui';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <Screen className="items-center justify-center">
        <Text variant="title">{t('notFound.title')}</Text>
        <Link href="/" asChild>
          <Button label={t('notFound.back')} variant="ghost" />
        </Link>
      </Screen>
    </>
  );
}
