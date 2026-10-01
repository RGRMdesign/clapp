#!/bin/bash
# SessionStart: make every Claude Code session ready to build, lint and test.
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

# Everything below is for Claude Code on the web only; locally the developer manages their setup.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Session-wide env vars: the cloud sandbox blocks *.expo.dev, so skip telemetry and resolve
# `expo install` versions offline (from the installed SDK); reuse the preinstalled Chromium.
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  {
    echo 'export EXPO_NO_TELEMETRY=1'
    echo 'export EXPO_OFFLINE=1'
    if [ -x /opt/pw-browsers/chromium ]; then
      echo 'export PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium'
    fi
  } >> "$CLAUDE_ENV_FILE"
fi

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || npm install -g pnpm@10 >/dev/null 2>&1
fi

# `pnpm install` (not --frozen-lockfile) so the cached container state is reused and stays idempotent.
pnpm install --prefer-offline >&2

echo "clapp: dependencies installed. Run \`pnpm check\` before declaring work done." >&2
