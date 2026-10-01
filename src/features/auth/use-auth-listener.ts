import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from './store';

/**
 * Keeps `useAuthStore` in sync with Supabase. Mount once, inside `QueryClientProvider`.
 * `onAuthStateChange` emits INITIAL_SESSION (restored from storage) right after subscribing.
 * When the user changes (sign-out, or another account signs in) the query cache is cleared,
 * so no data from the previous user can leak into the next session.
 */
export function useAuthListener() {
  const setSession = useAuthStore((s) => s.setSession);
  const queryClient = useQueryClient();
  const userId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUserId = session?.user.id ?? null;
      if (userId.current !== undefined && userId.current !== nextUserId) {
        queryClient.clear();
      }
      userId.current = nextUserId;
      setSession(session);
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient, setSession]);
}
