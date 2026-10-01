import { useEffect } from 'react';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from './store';

/**
 * Keeps `useAuthStore` in sync with Supabase. Mount once, in the root layout.
 * `onAuthStateChange` emits INITIAL_SESSION (restored from storage) right after subscribing.
 */
export function useAuthListener() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => data.subscription.unsubscribe();
  }, [setSession]);
}
