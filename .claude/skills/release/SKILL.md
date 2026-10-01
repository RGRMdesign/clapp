---
name: release
description: Build and ship the app with EAS (development/preview/production builds, OTA updates, web deploy). Use when asked to release, build for devices, publish an update or deploy the web version.
---

# Release with EAS

Requires an Expo account (`EXPO_TOKEN`) — this works in GitHub Actions; in the cloud sandbox `*.expo.dev` may be blocked, so prefer triggering the workflows in `.github/workflows/`.

| Goal                             | Command (CI or local)                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Dev build for a device/simulator | `npx eas-cli@latest build --profile development --platform ios                                                | android`                       |
| Internal test build              | `npx eas-cli@latest build --profile preview --platform all`                                                   |
| Store build                      | `npx eas-cli@latest build --profile production --platform all`                                                |
| OTA update (JS-only change)      | `npx eas-cli@latest update --channel <preview                                                                 | production> --message "<msg>"` |
| Web deploy (EAS Hosting)         | `pnpm build:web:prod && npx eas-cli@latest deploy` (needs `EXPO_PUBLIC_SUPABASE_*`) (`--prod` for production) |

Rules:

- JS-only changes → OTA update. Native changes (new native module, config plugin, `app.json` native fields) → new build; bump `version` in `app.json`.
- Never run `eas submit` without explicit user approval (store submission is outward-facing).
- Profiles live in `eas.json`. Runtime version policy is `appVersion`.
