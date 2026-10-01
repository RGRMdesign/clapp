import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button, Card, Screen, Text } from '@/components/ui';

import { authErrorKey, useSignUp } from '../api';
import { signUpSchema } from '../schema';
import { CredentialsForm } from './credentials-form';

export function SignUpScreen() {
  const { t } = useTranslation();
  const signUp = useSignUp();

  if (signUp.data?.needsEmailConfirmation) {
    return (
      <Screen className="max-w-md">
        <Card className="gap-3">
          <Text variant="title">{t('auth.signUp.checkEmailTitle')}</Text>
          <Text variant="muted">{t('auth.signUp.checkEmailBody')}</Text>
        </Card>
        <Link href="/sign-in" replace asChild>
          <Button variant="ghost" label={t('auth.signUp.toSignIn')} />
        </Link>
      </Screen>
    );
  }

  return (
    <Screen className="max-w-md">
      <Card className="gap-4">
        <Text variant="title">{t('auth.signUp.title')}</Text>
        <CredentialsForm
          mode="signUp"
          schema={signUpSchema}
          submitLabel={t('auth.signUp.submit')}
          passwordHint={t('auth.signUp.passwordHint')}
          isSubmitting={signUp.isPending}
          submitError={signUp.error ? t(authErrorKey(signUp.error)) : undefined}
          onSubmit={(values) => signUp.mutate(values)}
        />
      </Card>
      <Link href="/sign-in" replace asChild>
        <Button variant="ghost" label={t('auth.signUp.toSignIn')} />
      </Link>
    </Screen>
  );
}
