import { z } from 'zod';

/**
 * Public, build-time configuration. Only `EXPO_PUBLIC_*` variables are inlined into the app bundle,
 * and only when accessed literally as `process.env.EXPO_PUBLIC_X` — so list each one explicitly.
 * Never put secrets here: everything in this object ships to every user.
 *
 * Defaults point at a local Supabase (`supabase start`), which is also what web E2E tests mock.
 */
const schema = z.object({
  supabaseUrl: z.url(),
  supabaseKey: z.string().min(1),
});

export const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321';

export const env = schema.parse({
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || LOCAL_SUPABASE_URL,
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY || 'local-dev-publishable-key',
});
