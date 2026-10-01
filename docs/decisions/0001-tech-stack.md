# 0001. Tech stack

- Status: accepted
- Date: 2026-10-01

## Context

One app for iOS, Android and web, developed largely autonomously by Claude Code. The stack must be mainstream (well represented in model knowledge and docs), strictly typed, and verifiable without simulators (web).

## Decision

- **Expo SDK 57** (managed / CNG, New Architecture, React Compiler) with **Expo Router** (file-based routes, static web rendering).
- **TypeScript strict** + `noUncheckedIndexedAccess`.
- **NativeWind v4 / Tailwind 3** with CSS-variable color tokens from `src/theme/tokens.js`. NativeWind v5 (Tailwind 4) is still RC — revisit when stable.
- **TanStack Query** (server state), **Zustand** (client state), **react-hook-form + zod** (forms/validation).
- **i18next** + expo-localization (en, nl).
- **Jest (jest-expo) + React Native Testing Library v14**, **Playwright** (web E2E + screenshots), **Maestro** (native E2E in CI).
- **ESLint 9** (eslint-config-expo flat) + **Prettier**; pnpm with `node-linker=hoisted`.
- **EAS** for builds, OTA updates and web hosting.

## Alternatives considered

- Bare React Native CLI — more native maintenance, no web story out of the box.
- Tamagui / Unistyles — capable, but Tailwind classes are the most reliable for LLM-generated UI.
- Redux Toolkit — more boilerplate than needed.
- Detox — heavier native E2E setup than Maestro.

## Consequences

- The web build is the primary feedback loop in cloud sessions; native-only behavior is verified in CI.
- ESLint pinned to v9 until eslint-plugin-react supports v10.
