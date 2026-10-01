# 0002. Agentic development workflow

- Status: accepted
- Date: 2026-10-01

## Context

Claude Code should implement features autonomously with high quality and minimal human intervention.

## Decision

- **CLAUDE.md** is the single source of conventions (AGENTS.md points to it).
- **Deterministic guardrails over instructions**: hooks format/lint after every edit and block finishing while typecheck or related tests fail; ESLint enforces architecture import rules; `pnpm check` is the definition of done; CI runs the same checks.
- **Self-verification**: Claude builds the web app, runs Playwright, and inspects screenshots (light/dark, mobile/desktop).
- **Skills** encode repeatable workflows (new-feature, new-screen, ui-component, verify-web, add-dependency, release); **subagents** for review, tests and API research.
- **Specs as input**: feature issues/`docs/features/*.md` with acceptance criteria.
- **GitHub integration**: `@claude` in issues/PRs via the Claude Code GitHub Action.

## Consequences

- Conventions must be kept current in CLAUDE.md/skills when the stack changes.
- Native-only behavior needs CI (EAS + Maestro) or a human device check.
