import { type Session } from '@supabase/supabase-js';
import { render, screen, userEvent } from '@testing-library/react-native';

import { i18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { QueryWrapper } from '@/test-utils';

import { AccountSection } from '../components/account-section';
import { useAuthStore } from '../store';

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { signOut: jest.fn() } },
}));

describe('AccountSection', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    useAuthStore.getState().setSession({ user: { id: 'u1', email: 'ada@example.com' } } as Session);
    jest.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });
  });

  it('shows the signed-in email', async () => {
    await render(<AccountSection />, { wrapper: QueryWrapper });

    expect(screen.getByText('Signed in as ada@example.com')).toBeOnTheScreen();
  });

  it('signs out', async () => {
    const user = userEvent.setup();
    await render(<AccountSection />, { wrapper: QueryWrapper });

    await user.press(screen.getByRole('button', { name: 'Sign out' }));

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
