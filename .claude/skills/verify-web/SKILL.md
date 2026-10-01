---
name: verify-web
description: Visually and functionally verify the app in a real browser (web build + Playwright + screenshots in light/dark, mobile/desktop). Use after any UI change, before declaring UI work done, or when asked to check/screenshot/demo the app.
---

# Verify on web

The cloud sandbox has no iOS/Android simulators — the web build is how you see your work.

## Steps

1. Build: `pnpm build:web` (static export to `dist/`, ~1 min).
2. Functional: `pnpm e2e:web` (Playwright, mobile + desktop projects). For a single spec: `pnpm e2e:web e2e/web/<file>.spec.ts`.
3. Visual: `pnpm screenshot / /settings /<your-route>` → `screenshots/<route>-<mobile|desktop>-<light|dark>.png`.
4. **Read every relevant screenshot with the Read tool** and check:
   - layout: nothing clipped/overflowing, sensible spacing, content centered with max width on desktop
   - both color schemes: readable contrast, no hardcoded white/black surfaces
   - text: no raw i18n keys (e.g. `settings.title`) visible
   - states: empty / loading / error look intentional
5. For interactions not covered by a spec, write a quick Playwright spec (prefer adding it permanently to `e2e/web/`).
6. Fix issues and repeat.

## Debugging

- Failed Playwright tests write `test-results/<test>/error-context.md` (page snapshot as ARIA tree) and a screenshot — read those first.
- Hydration issues (web looks right on navigation but wrong on first load): something reads browser-only state during render. Move it into an effect or `useSyncExternalStore` with a server snapshot.
- The preinstalled Chromium is used automatically (`/opt/pw-browsers/chromium`); never run `playwright install` in the cloud sandbox.

## Limits

Native-only behavior (haptics, secure store, native modules, platform UI) can't be seen here — cover it with unit tests and mention it in the PR so it's checked on a device / in the Maestro CI run.
