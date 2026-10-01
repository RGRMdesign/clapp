import { AuthError } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

import { type SignInInput, type SignUpInput } from './schema';

/** i18n keys for auth errors shown to the user. */
export type AuthErrorKey =
  | 'auth.errors.invalidCredentials'
  | 'auth.errors.emailTaken'
  | 'auth.errors.weakPassword'
  | 'auth.errors.emailNotConfirmed'
  | 'auth.errors.rateLimited'
  | 'auth.errors.network'
  | 'auth.errors.unknown';

export function authErrorKey(error: unknown): AuthErrorKey {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'invalid_credentials':
        return 'auth.errors.invalidCredentials';
      case 'user_already_exists':
      case 'email_exists':
        return 'auth.errors.emailTaken';
      case 'weak_password':
        return 'auth.errors.weakPassword';
      case 'email_not_confirmed':
        return 'auth.errors.emailNotConfirmed';
      case 'over_request_rate_limit':
      case 'over_email_send_rate_limit':
        return 'auth.errors.rateLimited';
    }
    if (error.status === 0 || error.name === 'AuthRetryableFetchError')
      return 'auth.errors.network';
  }
  return 'auth.errors.unknown';
}

export function useSignIn() {
  return useMutation({
    mutationFn: async ({ email, password }: SignInInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
  });
}

export type SignUpResult = { needsEmailConfirmation: boolean };

export function useSignUp() {
  return useMutation({
    mutationFn: async ({ email, password }: SignUpInput): Promise<SignUpResult> => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // With email confirmation enabled (default on hosted projects) there is no session yet.
      return { needsEmailConfirmation: !data.session };
    },
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  });
}
