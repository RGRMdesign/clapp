import { z } from 'zod';

/**
 * Public, build-time configuration. Only `EXPO_PUBLIC_*` variables are inlined into the app bundle,
 * and only when accessed literally as `process.env.EXPO_PUBLIC_X` — so list each one explicitly.
 * Never put secrets here: everything in this object ships to every user.
 *
 * In development and tests, missing values fall back to a local Supabase (`pnpm db:start`).
 * Production builds fail fast when they are missing, so a release can never point at localhost.
 * (`pnpm build:web` sets them explicitly for E2E/verification; `build:web:prod` requires real ones.)
 */
export const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321';

const allowLocalDefaults = __DEV__ || process.env.NODE_ENV === 'test';

const schema = z.object({
  supabaseUrl: z.url(),
  supabaseKey: z.string().min(1),
});

export const env = schema.parse({
  supabaseUrl:
    process.env.EXPO_PUBLIC_SUPABASE_URL || (allowLocalDefaults ? LOCAL_SUPABASE_URL : undefined),
  supabaseKey:
    process.env.EXPO_PUBLIC_SUPABASE_KEY || (allowLocalDefaults ? 'local-dev-key' : undefined),
});
