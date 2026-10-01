import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button, Card, Screen, Text } from '@/components/ui';

import { authErrorKey, useSignIn } from '../api';
import { signInSchema } from '../schema';
import { CredentialsForm } from './credentials-form';

export function SignInScreen() {
  const { t } = useTranslation();
  const signIn = useSignIn();

  return (
    <Screen className="max-w-md">
      <Card className="gap-4">
        <Text variant="title">{t('auth.signIn.title')}</Text>
        <CredentialsForm
          mode="signIn"
          schema={signInSchema}
          submitLabel={t('auth.signIn.submit')}
          isSubmitting={signIn.isPending}
          submitError={signIn.error ? t(authErrorKey(signIn.error)) : undefined}
          onSubmit={(values) => signIn.mutate(values)}
        />
      </Card>
      <Link href="/sign-up" replace asChild>
        <Button variant="ghost" label={t('auth.signIn.toSignUp')} />
      </Link>
    </Screen>
  );
}
