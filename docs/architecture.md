# Architecture

See [CLAUDE.md](../CLAUDE.md) for the folder structure, import rules and conventions; decisions are in [decisions/](./decisions/).

## Runtime overview

```
src/app/_layout.tsx
  GestureHandlerRootView → SafeAreaProvider → QueryClientProvider → ThemeProvider (navigation)
    └─ Stack  (rendered once the stored session is restored)
        ├─ Stack.Protected guard=signedIn  → (tabs)/_layout.tsx → Tabs: index (home), settings
        ├─ Stack.Protected guard=!signedIn → (auth)/ sign-in, sign-up
        └─ +not-found
```

- `useAuthListener()` (auth feature) subscribes to `supabase.auth.onAuthStateChange` and mirrors the session into `useAuthStore`.

- `useApplySettings()` (settings feature) applies the persisted theme (NativeWind `colorScheme` → `.dark` class / native appearance) and language (i18next).
- Persistence: `@/lib/storage` — SecureStore on native, localStorage on web.
- Colors: `src/theme/tokens.js` → Tailwind CSS variables (`bg-background`, …) and the React Navigation theme.

## Web

- `web.output = "static"`: every route is pre-rendered at build time (`pnpm build:web` → `dist/`). Browser-only APIs must not run during render.
- Hosting must serve `+not-found.html` for unknown paths (EAS Hosting does this automatically).
- The root navigator renders nothing until the stored session is restored, so statically rendered pages are empty shells that hydrate on the client. Fine for an auth-gated app; public marketing pages (SEO) would need routes outside the auth gate.
- After sign-in users land on `/` (no return to the originally requested deep link yet).
- Builds: `pnpm build:web` is the verification build (local/mocked Supabase URL); `pnpm build:web:prod` requires real `EXPO_PUBLIC_SUPABASE_*` values and fails without them.

## Testing pyramid

| Level            | Tool        | Location           | Runs                           |
| ---------------- | ----------- | ------------------ | ------------------------------ |
| Unit / component | Jest + RNTL | `src/**/__tests__` | every edit (Stop hook), CI     |
| Web E2E          | Playwright  | `e2e/web`          | `pnpm check`, CI               |
| Native E2E       | Maestro     | `e2e/native`       | CI (Android emulator), locally |
