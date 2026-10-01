---
name: new-feature
description: Implement a complete feature end-to-end (spec → tests → code → verification → PR) following this repo's architecture. Use whenever asked to build, add or implement a feature, user story, or GitHub issue in this app.
---

# New feature

Work autonomously through these steps. Track them with a todo list.

## 1. Understand

- Read the spec: the GitHub issue, `docs/features/<name>.md`, or the user's message. Extract **acceptance criteria** as a checklist. If there are none, write them yourself (and put them in the PR description).
- Read `CLAUDE.md` sections Architecture + Conventions if not already in context.
- Look at an existing feature (`src/features/settings/`) as the reference pattern.
- For any Expo/RN/library API you haven't used in this repo: check its types/docs in `node_modules` first (see CLAUDE.md "Getting current docs").

## 2. Plan

Decide and write down (briefly, in your todo list):

- feature folder name (`src/features/<kebab-name>/`) and its public API (`index.ts`)
- routes to add/change in `src/app/` (see `new-screen` skill)
- data: zod schemas (`schema.ts`), queries/mutations (`api.ts` + TanStack Query hooks), client state (`store.ts`, Zustand) — only what's needed
- UI primitives needed — reuse `@/components/ui`; add missing primitives via the `ui-component` skill
- i18n keys (en + nl)
- whether a new dependency is needed (→ `add-dependency` skill; avoid if possible)

If the feature is large, split it into vertical increments that each pass `pnpm check`, and commit after each.

## 3. Tests first

- Component/unit tests in `src/features/<name>/__tests__/` from the acceptance criteria (RNTL v14: async API, query by role+name).
- A Playwright spec `e2e/web/<name>.spec.ts` for the main user flow.
- Run them and confirm they fail for the right reason.

## 4. Implement

- Follow the conventions in CLAUDE.md (NativeWind semantic tokens, `<Screen>`, ARIA props, i18n, no `any`).
- Keep route files thin: `export default SomeScreen` from `@/features/<name>`.
- Export only what routes need from `index.ts`.

## 5. Verify

```bash
pnpm typecheck && pnpm lint && pnpm test
pnpm build:web && pnpm e2e:web
pnpm screenshot <affected routes>
```

- **Open the screenshots with the Read tool** and check: layout on mobile + desktop, light + dark contrast, no overflow/clipping, text not in English on nl (if you switched), empty/loading/error states.
- Fix and repeat until everything passes and looks right. Finally run `pnpm check`.

## 6. Review

- Launch the `reviewer` subagent on your diff. Address every real finding.

## 7. Deliver

- Update docs if architecture or behavior changed (`docs/`, CLAUDE.md).
- Commit with Conventional Commits (`feat(<name>): …`).
- If asked to open a PR: fill in `.github/pull_request_template.md`, list acceptance criteria as a checked list, note assumptions, mention which screenshots you checked. Native-only behavior that you could not verify on web must be called out explicitly.
