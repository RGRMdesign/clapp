import { render, screen, userEvent } from '@testing-library/react-native';
import { type ReactNode } from 'react';

import { i18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { QueryWrapper } from '@/test-utils';

import { SignUpScreen } from '../components/sign-up-screen';

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { signUp: jest.fn() } },
}));
// Links need a navigation container; render their child (the button) directly.
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  Link: ({ children }: { children: ReactNode }) => children,
}));

const signUp = jest.mocked(supabase.auth.signUp);

describe('SignUpScreen', () => {
  beforeEach(async () => {
    signUp.mockReset();
    await i18n.changeLanguage('en');
  });

  it('requires a password of at least 8 characters', async () => {
    const user = userEvent.setup();
    await render(<SignUpScreen />, { wrapper: QueryWrapper });

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.press(screen.getByRole('button', { name: 'Sign up' }));

    expect(await screen.findByText('Use at least 8 characters')).toBeOnTheScreen();
    expect(signUp).not.toHaveBeenCalled();
  });

  it('asks to confirm the email when Supabase returns no session', async () => {
    const user = userEvent.setup();
    signUp.mockResolvedValue({ data: { user: null, session: null }, error: null } as never);
    await render(<SignUpScreen />, { wrapper: QueryWrapper });

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'long enough');
    await user.press(screen.getByRole('button', { name: 'Sign up' }));

    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeOnTheScreen();
    expect(signUp).toHaveBeenCalledWith({ email: 'ada@example.com', password: 'long enough' });
  });
});
