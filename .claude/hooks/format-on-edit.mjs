#!/usr/bin/env node
// PostToolUse (Edit|Write|MultiEdit): format + autofix the edited file, report remaining lint errors to Claude.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { relative } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const file = input.tool_input?.file_path;
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

if (!file || !existsSync(file) || relative(root, file).startsWith('..')) process.exit(0);
if (/(^|\/)(node_modules|dist|\.expo|ios|android)\//.test(file)) process.exit(0);

const run = (cmd, args) =>
  execFileSync(cmd, args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });

if (/\.(ts|tsx|js|jsx|mjs|cjs|json|md|css|ya?ml)$/.test(file)) {
  try {
    run('pnpm', ['exec', 'prettier', '--write', '--log-level', 'warn', file]);
  } catch {
    // ignore: unparsable files are reported by lint/typecheck
  }
}

if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(file)) {
  try {
    run('pnpm', ['exec', 'eslint', '--fix', '--max-warnings=0', file]);
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
    if (output) {
      process.stderr.write(`ESLint found problems in ${relative(root, file)}:\n${output}\n`);
      process.exit(2); // exit 2 → stderr is fed back to Claude
    }
  }
}
