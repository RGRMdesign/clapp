---
name: supabase
description: Work with the Supabase backend — database schema changes (migrations), Row Level Security, generated types, auth, and data access from features via TanStack Query. Use for any task that stores or reads server data, changes tables/policies, or touches authentication.
---

# Supabase

Backend = Supabase (Postgres + Auth). Client: `supabase` from `@/lib/supabase` (typed with `Database`). Config: `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_KEY` (public values; see `.env.example`, `src/lib/env.ts`). Never use or commit a service-role key in the app.

## Schema change (migration)

1. Create a migration: `pnpm db:new <snake_name>` → `supabase/migrations/<timestamp>_<name>.sql` (or create the file by hand with a later timestamp than the existing ones).
2. Write SQL. Every new table in `public`:
   - `alter table … enable row level security;` + explicit policies per operation, `to authenticated` (or `anon` only when truly public).
   - Use `(select auth.uid())` in policies (cached per statement — faster than bare `auth.uid()`).
   - Foreign keys to `auth.users(id)` with `on delete cascade` for user-owned rows; add indexes on FK / filter columns.
   - Functions: `set search_path = ''` and fully-qualified names; `security definer` only when required.
3. Add pgTAP tests in `supabase/tests/<name>.test.sql` for every policy (allowed **and** denied cases). In tests, impersonate users with
   `set local role authenticated; set local request.jwt.claims = '{"sub": "<uuid>"}'; set local request.jwt.claim.sub = '<uuid>';`
4. Run: `pnpm db:test:docker` (throwaway Postgres container — works in the cloud sandbox) or `pnpm db:start && pnpm db:test` (full local stack).
5. Update types: `pnpm db:types` with a running local stack. If the stack can't run (cloud sandbox), edit `src/lib/supabase/database.types.ts` by hand **in the generated format** (Row/Insert/Update per table) and say so in the PR.
6. Never edit a migration that has been merged to main — add a new one.
7. Deploying migrations to the hosted project (`pnpm db:push`) is done by a human or CI, not by you.

## Data access in a feature

- `api.ts` in the feature: query-key factory + hooks.
  ```ts
  export const profileKeys = {
    all: ['profile'] as const,
    byId: (id: string) => ['profile', id] as const,
  };

  export function useProfile(id: string) {
    return useQuery({
      queryKey: profileKeys.byId(id),
      queryFn: async () => {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) throw error;
        return data; // typed from Database
      },
    });
  }
  ```
- Mutations: `useMutation` + `queryClient.invalidateQueries({ queryKey: profileKeys.all })` on success.
- Always `if (error) throw error` so TanStack Query handles error state; show translated messages.
- Validate JSON columns / RPC results with zod; table rows are already typed.

## Auth

- Session state: `useAuthStore` from `@/features/auth` (`status`, `session`). Only `useAuthListener` (root layout) writes it.
- Routes are protected in `src/app/_layout.tsx` with `Stack.Protected` — new signed-in screens go under `(tabs)` or another protected group; public screens under `(auth)`.
- Map Supabase `AuthError.code` to i18n keys (see `authErrorKey` in `src/features/auth/api.ts`).

## Testing

- Unit tests: `jest.mock('@/lib/supabase', () => ({ supabase: { … } }))` with only the methods you use; wrap with `QueryWrapper` from `@/test-utils`.
- Web E2E: the app falls back to `http://127.0.0.1:54321`; `e2e/web/support/supabase.ts` mocks the Auth API with `page.route`. For new REST endpoints, add mocks there (`/rest/v1/<table>`) rather than requiring a backend.
