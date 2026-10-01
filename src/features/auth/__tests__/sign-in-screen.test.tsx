import { AuthError } from '@supabase/supabase-js';
import { render, screen, userEvent } from '@testing-library/react-native';
import { type ReactNode } from 'react';

import { i18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { QueryWrapper } from '@/test-utils';

import { SignInScreen } from '../components/sign-in-screen';

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { signInWithPassword: jest.fn() } },
}));
// Links need a navigation container; render their child (the button) directly.
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  Link: ({ children }: { children: ReactNode }) => children,
}));

const signInWithPassword = jest.mocked(supabase.auth.signInWithPassword);

describe('SignInScreen', () => {
  beforeEach(async () => {
    signInWithPassword.mockReset();
    await i18n.changeLanguage('en');
  });

  it('validates the fields before calling Supabase', async () => {
    const user = userEvent.setup();
    await render(<SignInScreen />, { wrapper: QueryWrapper });

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.press(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter a valid email address')).toBeOnTheScreen();
    expect(screen.getByText('Enter your password')).toBeOnTheScreen();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it('signs in with the entered credentials', async () => {
    const user = userEvent.setup();
    signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    } as never);
    await render(<SignInScreen />, { wrapper: QueryWrapper });

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'correct horse');
    await user.press(screen.getByRole('button', { name: 'Sign in' }));

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'correct horse',
    });
  });

  it('shows a friendly message for wrong credentials', async () => {
    const user = userEvent.setup();
    signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: new AuthError('Invalid login credentials', 400, 'invalid_credentials'),
    } as never);
    await render(<SignInScreen />, { wrapper: QueryWrapper });

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.press(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Incorrect email or password')).toBeOnTheScreen();
  });
});
