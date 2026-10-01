import { existsSync } from 'node:fs';

import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 8081);

/**
 * Use a preinstalled Chromium when present (e.g. Claude Code cloud sessions, where
 * `playwright install` cannot download browsers). Override with PLAYWRIGHT_CHROMIUM_PATH.
 */
const PREINSTALLED_CHROMIUM = '/opt/pw-browsers/chromium';
const chromiumPath =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  (existsSync(PREINSTALLED_CHROMIUM) ? PREINSTALLED_CHROMIUM : undefined);

/**
 * Web E2E tests run against the static web export (`pnpm build:web` → dist/).
 * This is the main way to verify UI changes in environments without iOS/Android simulators.
 */
export default defineConfig({
  testDir: './e2e/web',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: chromiumPath ? { executablePath: chromiumPath } : {},
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `npx expo serve --port ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
