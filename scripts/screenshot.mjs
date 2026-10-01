#!/usr/bin/env node
/**
 * Visual check for Claude (and humans): screenshots routes of the web export
 * on mobile + desktop viewports, in light + dark mode.
 *
 *   pnpm screenshot                 # all default routes
 *   pnpm screenshot / /settings     # specific routes
 *
 * Requires a fresh `pnpm build:web`. Output: screenshots/<route>-<viewport>-<scheme>.png
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

import { chromium } from '@playwright/test';

const PORT = Number(process.env.SCREENSHOT_PORT ?? 8082);
const BASE = `http://localhost:${PORT}`;
const OUT = 'screenshots';
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/settings'];
const viewports = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1280, height: 800 },
};
const schemes = ['light', 'dark'];

if (!existsSync('dist/index.html')) {
  console.error('dist/ not found — run `pnpm build:web` first.');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const server = spawn('npx', ['expo', 'serve', '--port', String(PORT)], {
  stdio: 'ignore',
  env: { ...process.env, EXPO_NO_TELEMETRY: '1' },
});

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await sleep(500);
  }
  throw new Error(`Server did not start on ${BASE}`);
}

const preinstalled = '/opt/pw-browsers/chromium';
const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ?? (existsSync(preinstalled) ? preinstalled : undefined);

try {
  await waitForServer();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    for (const colorScheme of schemes) {
      const page = await browser.newPage({ viewport, colorScheme });
      for (const route of routes) {
        await page.goto(BASE + route, { waitUntil: 'networkidle' });
        const name =
          (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_')) || 'home';
        const file = `${OUT}/${name}-${viewportName}-${colorScheme}.png`;
        await page.screenshot({ path: file, fullPage: true });
        console.log(file);
      }
      await page.close();
    }
  }
  await browser.close();
} finally {
  server.kill();
}
