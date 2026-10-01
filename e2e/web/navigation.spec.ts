import { expect, test } from '@playwright/test';

test.describe('app shell', () => {
  test('home renders and links to settings', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to Clapp' })).toBeVisible();

    await page.getByRole('link', { name: 'Open settings' }).click();

    await expect(page).toHaveURL(/\/settings$/);
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });

  test('theme and language preferences apply and persist', async ({ page }) => {
    await page.goto('/settings');

    await page.getByRole('radio', { name: 'Dark' }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.getByRole('radio', { name: 'Nederlands' }).click();
    await expect(page.getByRole('heading', { name: 'Instellingen' })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Instellingen' })).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
