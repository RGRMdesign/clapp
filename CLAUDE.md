# Clapp

Cross-platform app (iOS, Android, web) built with **Expo SDK 57**, React Native 0.86 (New Architecture), React 19, **Expo Router**, TypeScript (strict), **NativeWind v4** (Tailwind 3). Backend: **Supabase** (Postgres + Auth). Package manager: **pnpm**.

This repo is set up for autonomous feature work by Claude. Follow the workflow below; the hooks and `pnpm check` enforce most of it.

## Commands

```bash
pnpm install                 # install deps
pnpm start                   # dev server (press w for web; Expo Go / dev build for native)
pnpm typecheck               # tsc --noEmit
pnpm lint                    # eslint, zero warnings allowed
pnpm format                  # prettier --write (format:check in CI)
pnpm test                    # jest (unit + component), jest-expo preset
pnpm build:web               # static web export → dist/
pnpm e2e:web                 # playwright against dist/ (run build:web first)
pnpm screenshot [routes…]    # screenshots of dist/ → screenshots/*.png (mobile+desktop, light+dark)
pnpm check                   # ALL of the above — the definition of done
npx expo install <pkg>       # ALWAYS use this to add runtime deps (SDK-compatible versions)
pnpm db:new <name>           # new SQL migration in supabase/migrations
pnpm db:test:docker          # apply migrations + run pgTAP tests in a throwaway Postgres (works in cloud)
pnpm db:start / db:test / db:types   # full local Supabase stack (Docker), tests, regenerate types
```

## Definition of done

A task is done only when:

1. `pnpm check` passes (typecheck, lint, format, unit tests, web build, web E2E). Database changes: `pnpm db:test:docker` passes too.
2. New behavior has tests: unit/component tests next to the code, and a Playwright spec in `e2e/web/` for user-facing flows.
3. For UI changes: you ran `pnpm screenshot <routes>` and **looked at the images** (light + dark, mobile + desktop) with the Read tool.
4. All user-facing strings are in `src/lib/i18n/locales/en.json` **and** `nl.json`.
5. Docs are updated when behavior/architecture changes (`docs/`, this file).

## Workflow for a feature

Use the `new-feature` skill. In short: read the spec (issue or `docs/features/*.md`) → plan → write tests from acceptance criteria → implement → `pnpm check` → screenshots → `reviewer` subagent → commit/PR.

When requirements are ambiguous, pick the simplest reasonable interpretation, note the assumption in the PR description, and continue — don't stop to ask unless it's a product decision with real trade-offs.

## Architecture

```
src/
  app/                  # Expo Router routes ONLY. Thin: import a screen from a feature, add layout/options.
    _layout.tsx         # root providers (QueryClient, theme, gestures, safe area)
    (tabs)/             # tab navigator
  features/<name>/      # vertical slice: components/, hooks, store.ts, api.ts, schema.ts, __tests__/
    index.ts            # PUBLIC API — the only thing routes may import
  components/ui/        # design system primitives (Text, Button, Card, Screen, SegmentedControl…)
  hooks/                # shared hooks (platform-specific via .web.ts)
  lib/                  # framework-agnostic infra: i18n, storage, query client, cn(), env, supabase client
  test-utils/           # shared test helpers (QueryWrapper)
  theme/                # tokens.js (single source for colors), navigation theme
e2e/web/                # Playwright specs (run against static web export); support/supabase.ts mocks the Auth API
e2e/native/             # Maestro flows (CI / local simulator only)
docs/                   # architecture, decisions (ADRs), feature specs
supabase/               # config.toml, migrations/ (SQL), tests/ (pgTAP)
```

Auth: `src/app/_layout.tsx` guards routes with `Stack.Protected` — `(tabs)` requires a session, `(auth)` (sign-in/up) is for signed-out users. Session state lives in `useAuthStore` (`@/features/auth`). Routes compose features (e.g. the settings route renders `<SettingsScreen><AccountSection /></SettingsScreen>`).

Import rules (enforced by ESLint `no-restricted-imports`):

- Routes import features only via `@/features/<name>`, never deep paths.
- Features never import other features. Shared code → `src/components`, `src/hooks` or `src/lib`.
- `components`, `hooks`, `lib`, `theme` never import features or routes.
- Inside a feature use relative imports; across layers use the `@/` alias.

## Conventions

**TypeScript**: strict + `noUncheckedIndexedAccess`. No `any` (use `unknown` + narrowing / zod). Use `import { type X }` for types. File names kebab-case; components PascalCase; hooks `use-*.ts` exporting `useX`.

**Styling**: NativeWind `className` only — no `StyleSheet.create` and no inline colors. Use semantic tokens (`bg-background`, `text-foreground`, `bg-surface`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-danger`). Never raw palette classes (`bg-blue-500`). New tokens go in `src/theme/tokens.js` (light **and** dark). For APIs that need a color string (icons, navigation), use `tokenColor(scheme, token)` from `@/theme`. Merge classes with `cn()` from `@/lib/cn`. Wrap every screen in `<Screen>`; it handles safe area, scroll and max-width on web.

**Components**: build from `@/components/ui` first; add a new primitive there (with a test) rather than one-off styling in features. Accept `className` and spread remaining props.

**Accessibility**: use ARIA props (`role`, `aria-label`, `aria-checked`, `aria-disabled`), not `accessibility*` props. Touch targets ≥ 44px (`min-h-11`). Every interactive element needs an accessible name — tests query by role + name, so this is enforced in practice.

**Backend**: use the `supabase` skill. Every table has RLS + pgTAP tests. Data access lives in the feature's `api.ts` (TanStack Query hooks around the typed `supabase` client from `@/lib/supabase`). Only `EXPO_PUBLIC_*` values go in the app — never service-role keys.

**State**: server data → TanStack Query (`useQuery`/`useMutation`, query keys as const arrays per feature). Client/UI state → `useState`; shared client state → a Zustand store in the feature (`store.ts`); persist with `persist` + `createJSONStorage(() => storage)` from `@/lib/storage`. Forms → react-hook-form + zod (`@hookform/resolvers/zod`). Validate all external data with zod schemas in `schema.ts`; derive types with `z.infer`.

**i18n**: `const { t } = useTranslation()`; keys are type-checked against `en.json`. Add keys to both `en.json` and `nl.json`.

**Platform differences**: prefer one implementation. When needed, use `file.web.ts(x)` / `file.native.ts(x)` (or `.ios`/`.android`) with the same exports — not `Platform.OS` branches spread through components. Web is statically rendered: never read `window`/`localStorage`/`matchMedia` during render; do it in effects or behind `useSyncExternalStore` (see `src/hooks/use-color-scheme.web.ts`).

**Navigation**: `Link`, `router`, `useLocalSearchParams` from `expo-router`. Tabs: `import { Tabs } from 'expo-router/js-tabs'` (the `expo-router` export is deprecated). Use `<Link asChild>` around buttons for navigation so web gets real `<a>` links.

**Testing** (React Native Testing Library v14 — the API is async):

- `await render(...)`, `await user.press(...)` with `const user = userEvent.setup()`; tests are `async`.
- Query by role + name first (`getByRole('button', { name: 'Save' })`); `findBy*` for async; `queryBy*` only for absence.
- Use matchers like `toBeOnTheScreen()`, `toBeChecked()`, `toBeDisabled()`.
- Full guide: `node_modules/@testing-library/react-native/docs/guides/llm-guidelines.md`.
- Global mocks in `jest.setup.ts` (safe-area, secure-store). Reset Zustand stores in `beforeEach` with `useXStore.setState(...)`.
- Components using TanStack Query: `await render(<X />, { wrapper: QueryWrapper })` (`@/test-utils`). Mock `@/lib/supabase` per test file. When mocking `expo-router`, spread `jest.requireActual('expo-router')`.
- Playwright: `getByRole`/`getByLabel` locators; links rendered by `<Link asChild>` have role `link`. Signed-in flows: `mockSupabaseAuth(page, { accounts: [TEST_ACCOUNT] })` + `signIn(page)` from `e2e/web/support/supabase.ts`.

**Dependencies**: prefer Expo SDK modules. Add runtime deps with `npx expo install` (keeps versions SDK-compatible). Every new runtime dependency needs a short ADR in `docs/decisions/` (use the `add-dependency` skill). Never edit `ios/` or `android/` — they are generated (CNG); configure via `app.json` and config plugins.

## Getting current docs (your training data is outdated for Expo/RN)

Expo ships breaking changes every SDK. Before using an Expo/RN/library API you're not sure about:

1. Check the installed type definitions and bundled docs in `node_modules/<pkg>` — they are always the exact installed version (look for `@deprecated` tags).
2. Expo docs: `https://docs.expo.dev/versions/v57.0.0/` and `https://docs.expo.dev/llms.txt` (may be unreachable from the cloud sandbox — fall back to step 1).
3. The `expo` plugin (enabled in `.claude/settings.json`) provides Expo-specific skills — use them.

Known gotchas in this setup:

- `expo-router` `Tabs` export is deprecated → `expo-router/js-tabs`.
- RNTL v14: `render`, `fireEvent`, `userEvent` are async.
- ESLint is pinned to v9 (eslint-plugin-react breaks on v10).
- NativeWind is v4 (Tailwind **3**). Don't follow Tailwind v4 / NativeWind v5 docs.
- Static web hosting must serve `+not-found.html` for unknown paths; `expo serve` returns a plain 404 for direct hits.
- NativeWind can't style `placeholderTextColor` — use `tokenColor()` from `@/theme/colors` (import that file directly in `components/`, not `@/theme`, to avoid pulling in expo-router).
- Navigating between sibling auth screens: `<Link replace>` so screens don't stack (on web hidden stacked screens stay in the DOM and duplicate labels).
- RLS tests: Postgres images differ in how `auth.uid()` reads the JWT; set both `request.jwt.claims` and `request.jwt.claim.sub`. Migrations must run as `postgres` so default grants apply.

## Claude Code environment notes

- Cloud sessions (`CLAUDE_CODE_REMOTE=true`): no iOS/Android simulators. Verify UI through the web build (`pnpm build:web && pnpm e2e:web && pnpm screenshot`). Native-specific code is verified in CI (EAS build + Maestro).
- `*.expo.dev` may be blocked; the SessionStart hook sets `EXPO_OFFLINE=1` so `npx expo install` resolves versions locally.
- Docker is installed but the daemon may not be running; `pnpm db:test:docker` starts it. The full `supabase start` stack can't pull all images in the sandbox — use `db:test:docker` and hand-edit types in the generated format.
- Hooks (`.claude/hooks/`): Prettier + ESLint run after every edit (lint errors are reported back to you); a Stop hook runs typecheck + related tests and blocks finishing while they fail.
- Skills in `.claude/skills/`, subagents in `.claude/agents/`.

## Git

- Branch per feature: `feat/<short-name>`, `fix/<short-name>`.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- Small, focused commits. Never commit secrets or `.env` files.
