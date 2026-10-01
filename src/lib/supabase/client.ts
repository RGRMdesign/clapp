import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { env } from '@/lib/env';

import { authStorage } from './auth-storage';
import { type Database } from './database.types';

const isBrowser = typeof window !== 'undefined';

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseKey, {
  auth: {
    storage: authStorage,
    persistSession: true,
    // During static web rendering there is no browser: don't start timers or read the URL.
    autoRefreshToken: Platform.OS !== 'web' || isBrowser,
    detectSessionInUrl: Platform.OS === 'web' && isBrowser,
  },
});

// Native: only refresh tokens while the app is in the foreground (recommended by Supabase).
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
}
