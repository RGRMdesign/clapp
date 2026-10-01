import { type AuthChangeEvent, type Session } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import { type ReactNode } from 'react';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from '../store';
import { useAuthListener } from '../use-auth-listener';

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { onAuthStateChange: jest.fn() } },
}));

type Listener = (event: AuthChangeEvent, session: Session | null) => void;

const session = (userId: string) => ({ user: { id: userId, email: `${userId}@x.nl` } }) as Session;

describe('useAuthListener', () => {
  let emit: Listener;
  const unsubscribe = jest.fn();
  let queryClient: QueryClient;

  function Providers({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  beforeEach(() => {
    useAuthStore.setState({ status: 'loading', session: null });
    queryClient = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
    unsubscribe.mockReset();
    jest.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
      emit = callback as Listener;
      return { data: { subscription: { id: '1', callback, unsubscribe } } } as never;
    });
  });

  it('mirrors the restored session into the store', async () => {
    await renderHook(() => useAuthListener(), { wrapper: Providers });

    await act(() => emit('INITIAL_SESSION', session('alice')));
    expect(useAuthStore.getState()).toMatchObject({ status: 'signedIn' });

    await act(() => emit('SIGNED_OUT', null));
    expect(useAuthStore.getState()).toMatchObject({ status: 'signedOut', session: null });
  });

  it('marks the user signed out when there is no stored session', async () => {
    await renderHook(() => useAuthListener(), { wrapper: Providers });

    await act(() => emit('INITIAL_SESSION', null));

    expect(useAuthStore.getState().status).toBe('signedOut');
  });

  it('clears cached queries when the user changes, but not on token refresh', async () => {
    await renderHook(() => useAuthListener(), { wrapper: Providers });
    await act(() => emit('INITIAL_SESSION', session('alice')));
    queryClient.setQueryData(['profile'], { name: 'Alice' });

    await act(() => emit('TOKEN_REFRESHED', session('alice')));
    expect(queryClient.getQueryData(['profile'])).toEqual({ name: 'Alice' });

    await act(() => emit('SIGNED_OUT', null));
    expect(queryClient.getQueryData(['profile'])).toBeUndefined();
  });

  it('unsubscribes on unmount', async () => {
    const { unmount } = await renderHook(() => useAuthListener(), { wrapper: Providers });

    await unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
