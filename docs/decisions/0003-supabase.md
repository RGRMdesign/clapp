# 0003. Supabase as backend

- Status: accepted
- Date: 2026-10-01

## Context

The app needs authentication and a database, on iOS, Android and web, with a workflow where Claude writes most of the code.

## Decision

- **Supabase** (Postgres, Auth, Row Level Security) via `@supabase/supabase-js` — one JS client for all platforms.
- Schema as code: SQL migrations in `supabase/migrations`, pgTAP tests in `supabase/tests`, TypeScript types generated into `src/lib/supabase/database.types.ts`.
- Session storage: AsyncStorage on native (SecureStore's ~2KB limit is too small for Supabase sessions), localStorage on web. Tokens are short-lived; refresh only while the app is in the foreground.
- Auth state mirrored in a Zustand store; navigation guarded with Expo Router `Stack.Protected`.
- Public config via `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_KEY`; defaults to a local stack (`http://127.0.0.1:54321`).

## Alternatives considered

- Firebase — larger mobile install base, but NoSQL without schema/migrations, rules in a separate language, platform-specific SDKs and strong vendor lock-in.
- Own API — more to build and operate.

## Consequences

- Every table needs RLS policies + tests (enforced by the `supabase` skill and review).
- Web E2E tests mock the Auth REST API (`e2e/web/support/supabase.ts`); native E2E in CI runs against a local Supabase stack.
- Encrypting the native session at rest (e.g. AES key in SecureStore) is a possible follow-up if required.
