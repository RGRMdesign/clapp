# Clapp

Cross-platform app for **iOS, Android and web** from one codebase: Expo SDK 57, Expo Router, TypeScript, NativeWind.
The repo is set up for **agentic development with Claude Code**. See [CLAUDE.md](./CLAUDE.md).

## Quick start

```bash
corepack enable          # provides pnpm (version pinned in package.json)
pnpm install
pnpm start               # then: w = web, i = iOS simulator, a = Android emulator
```

Native modules beyond Expo Go need a development build: `npx eas-cli@latest build --profile development`.

## Scripts

| Script                                              | What it does                                                    |
| --------------------------------------------------- | --------------------------------------------------------------- |
| `pnpm check`                                        | everything below except native — the definition of done         |
| `pnpm typecheck` / `lint` / `format:check` / `test` | static checks + Jest                                            |
| `pnpm build:web`                                    | static web export → `dist/`                                     |
| `pnpm e2e:web`                                      | Playwright E2E against `dist/`                                  |
| `pnpm screenshot [routes]`                          | screenshots (mobile/desktop × light/dark) → `screenshots/`      |
| `pnpm e2e:native`                                   | Maestro flows (needs a running simulator/emulator with the app) |

## Working with Claude

- **In Claude Code** (CLI, desktop, web): describe a feature or point to an issue; Claude uses the `new-feature` skill: spec → tests → implementation → `pnpm check` → screenshots → review.
- **On GitHub**: open an issue with the _Feature_ template and add the `claude` label, or comment `@claude …` on an issue/PR. Requires the Claude GitHub App (`/install-github-app` in Claude Code) or the `CLAUDE_CODE_OAUTH_TOKEN` secret.
- Guardrails: hooks auto-format/lint every edit and block Claude from finishing while typecheck or tests fail; CI runs the same checks.

Project layout, conventions and gotchas: [CLAUDE.md](./CLAUDE.md) · decisions: [docs/decisions](./docs/decisions) · feature spec template: [docs/features/\_template.md](./docs/features/_template.md).

## CI/CD

- `CI` (every PR): typecheck, lint, format, unit tests, web build, Playwright, screenshots as artifacts.
- `Native` (main, PRs labeled `native`, manual): Android release build + Maestro on an emulator; iOS simulator build.
- `EAS` (manual): OTA updates, cloud builds, web deploy. Needs the `EXPO_TOKEN` secret.
- `Claude`: `@claude` mentions / `claude` label.
