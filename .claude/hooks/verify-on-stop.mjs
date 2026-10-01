#!/usr/bin/env node
// Stop: before Claude finishes, typecheck and run tests related to changed files.
// On failure, block the stop so Claude keeps working until it is green.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
if (input.stop_hook_active) process.exit(0); // already continuing because of this hook — avoid loops

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const sh = (cmd, args) =>
  execFileSync(cmd, args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });

let changed = [];
try {
  changed = [
    ...sh('git', ['diff', '--name-only', 'HEAD']).split('\n'),
    ...sh('git', ['ls-files', '--others', '--exclude-standard']).split('\n'),
  ].filter((f) => /\.(ts|tsx|js|jsx|json)$/.test(f) && !f.startsWith('e2e/'));
} catch {
  process.exit(0); // not a git checkout or no HEAD yet
}
if (changed.length === 0) process.exit(0);

const failures = [];
const attempt = (label, cmd, args) => {
  try {
    sh(cmd, args);
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`
      .trim()
      .split('\n')
      .slice(-60)
      .join('\n');
    failures.push(`## ${label} failed\n${output}`);
  }
};

attempt('pnpm typecheck', 'pnpm', ['typecheck']);
attempt('jest (related tests)', 'pnpm', [
  'exec',
  'jest',
  '--ci',
  '--passWithNoTests',
  '--findRelatedTests',
  ...changed,
]);

if (failures.length > 0) {
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: `Verification failed for your changes. Fix these before finishing:\n\n${failures.join('\n\n')}`,
    }),
  );
}
