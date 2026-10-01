import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { type z } from 'zod';

import { Button, Text, TextField } from '@/components/ui';

import { isValidationKey, type signInSchema, type signUpSchema } from '../schema';

type CredentialsSchema = typeof signInSchema | typeof signUpSchema;
type Credentials = z.infer<CredentialsSchema>;

type CredentialsFormProps = {
  /** Sign-up asks password managers to generate/save a new password. */
  mode: 'signIn' | 'signUp';
  schema: CredentialsSchema;
  submitLabel: string;
  passwordHint?: string;
  /** Translated error from the last submit attempt. */
  submitError?: string;
  isSubmitting: boolean;
  onSubmit: (values: Credentials) => void;
};

export function CredentialsForm({
  mode,
  schema,
  submitLabel,
  passwordHint,
  submitError,
  isSubmitting,
  onSubmit,
}: CredentialsFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit, formState } = useForm<Credentials>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });
  // Validation messages are i18n keys (see schema.ts).
  const fieldError = (name: keyof Credentials) => {
    const key = formState.errors[name]?.message;
    if (!key) return undefined;
    return isValidationKey(key) ? t(key) : key;
  };

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            label={t('auth.email')}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldError('email')}
            autoCapitalize="none"
            autoComplete="email"
            inputMode="email"
            textContentType="emailAddress"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField
            label={t('auth.password')}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldError('password')}
            hint={passwordHint}
            secureTextEntry
            autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
            textContentType={mode === 'signUp' ? 'newPassword' : 'password'}
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />
      {submitError ? (
        <Text role="alert" className="text-danger">
          {submitError}
        </Text>
      ) : null}
      <Button
        label={isSubmitting ? t('auth.submitting') : submitLabel}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
