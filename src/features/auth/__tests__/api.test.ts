import { AuthError, AuthRetryableFetchError } from '@supabase/supabase-js';

import { authErrorKey } from '../api';

jest.mock('@/lib/supabase', () => ({ supabase: { auth: {} } }));

describe('authErrorKey', () => {
  it.each([
    ['invalid_credentials', 'auth.errors.invalidCredentials'],
    ['user_already_exists', 'auth.errors.emailTaken'],
    ['email_exists', 'auth.errors.emailTaken'],
    ['weak_password', 'auth.errors.weakPassword'],
    ['email_not_confirmed', 'auth.errors.emailNotConfirmed'],
    ['over_request_rate_limit', 'auth.errors.rateLimited'],
    ['over_email_send_rate_limit', 'auth.errors.rateLimited'],
  ])('maps %s to %s', (code, key) => {
    expect(authErrorKey(new AuthError('x', 400, code))).toBe(key);
  });

  it('maps network failures to the network message', () => {
    expect(authErrorKey(new AuthRetryableFetchError('Failed to fetch', 0))).toBe(
      'auth.errors.network',
    );
  });

  it('falls back to the generic message', () => {
    expect(authErrorKey(new AuthError('x', 500, 'unexpected_failure'))).toBe('auth.errors.unknown');
    expect(authErrorKey(new Error('boom'))).toBe('auth.errors.unknown');
  });
});
