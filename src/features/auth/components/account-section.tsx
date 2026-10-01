import { useTranslation } from 'react-i18next';

import { Button, Card, Text } from '@/components/ui';

import { authErrorKey, useSignOut } from '../api';
import { useAuthStore } from '../store';

/** Shows the signed-in account and a sign-out button. Rendered on the settings screen. */
export function AccountSection() {
  const { t } = useTranslation();
  const email = useAuthStore((s) => s.session?.user.email);
  const signOut = useSignOut();

  return (
    <Card>
      <Text variant="heading">{t('auth.account.title')}</Text>
      {email ? <Text variant="muted">{t('auth.account.signedInAs', { email })}</Text> : null}
      {signOut.error ? (
        <Text role="alert" className="text-danger">
          {t(authErrorKey(signOut.error))}
        </Text>
      ) : null}
      <Button
        variant="secondary"
        className="self-start"
        label={t('auth.account.signOut')}
        disabled={signOut.isPending}
        onPress={() => signOut.mutate()}
      />
    </Card>
  );
}
