---
name: ui-component
description: Create or extend a design-system primitive in src/components/ui (buttons, inputs, lists, badges, etc.) with variants, dark mode, accessibility and a test. Use when a screen needs a reusable UI element that doesn't exist yet.
---

# UI component

Primitives live in `src/components/ui/` and are exported from `src/components/ui/index.ts`. Look at `button.tsx` and `segmented-control.tsx` as reference.

## Rules

- File `kebab-name.tsx`, named export `PascalName`, props type `PascalNameProps` exported too.
- Built on React Native core components (`View`, `Pressable`, `TextInput`, …) + NativeWind `className`.
- Variants as `const` maps of class strings (`const variants = { primary: '…' } as const`), combined with `cn()`; accept and merge a `className` prop last; spread remaining props.
- Only semantic color tokens (`bg-surface`, `text-foreground`, …). If a new token is needed, add it to `src/theme/tokens.js` for **both** light and dark.
- Accessibility: correct `role`, `aria-label` (or visible text), state via `aria-checked` / `aria-disabled` / `aria-selected` / `aria-expanded`. Touch targets `min-h-11` (44px).
- No hardcoded user-facing strings — take them as props.
- Works on web: hover/focus states via `hover:` / `focus:` / `active:` classes where useful; no native-only APIs without a `.web.tsx` alternative.

## Test

Add `src/components/ui/__tests__/<name>.test.tsx` covering: renders with accessible role+name, each interactive behavior (async RNTL v14 API, `userEvent`), disabled state.

## Verify

`pnpm typecheck && pnpm lint && pnpm test`, then use the component on a screen and run `pnpm build:web && pnpm screenshot <route>`; inspect light + dark.
