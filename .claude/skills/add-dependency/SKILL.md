---
name: add-dependency
description: Safely add a new npm dependency (runtime or dev) with SDK-compatible versions, web+native support check, and an ADR. Use whenever a task seems to need a new package.
---

# Add a dependency

## 1. Do we need it?

- Check if Expo SDK modules, React Native core, or existing deps already cover it (`package.json`).
- Prefer Expo modules (`expo-*`) — they support iOS, Android and web and are versioned with the SDK.
- Small utility? Write it in `src/lib/` instead.

## 2. Evaluate

- `npm view <pkg> version time.modified peerDependencies repository.url`
- Must support **iOS, Android and web** (or have a clear web fallback). Native code means a new dev build is required (not Expo Go) — note this.
- Maintained (recent releases), TypeScript types included, compatible license (MIT/Apache/BSD).
- Check the New Architecture compatibility for native modules.

## 3. Install

- Runtime: `npx expo install <pkg>` (picks SDK-compatible versions; works offline in the sandbox via `EXPO_OFFLINE=1`).
- Dev-only: `pnpm add -D <pkg>`.
- If it ships a config plugin, `expo install` adds it to `app.json`; verify.

## 4. Record (runtime deps only)

Create `docs/decisions/NNNN-<pkg>.md` from `docs/decisions/0000-template.md`: context, decision, alternatives considered, consequences (bundle size, native build needed, web support).

## 5. Verify

`pnpm check`. If it has native code, CI's native build must pass too.
