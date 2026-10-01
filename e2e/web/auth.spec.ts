import { expect, test } from '@playwright/test';

import { mockSupabaseAuth, signIn, TEST_ACCOUNT } from './support/supabase';

test.describe('authentication', () => {
  test('signed-out users are sent to sign in', async ({ page }) => {
    await mockSupabaseAuth(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('shows validation errors before contacting the server', async ({ page }) => {
    await mockSupabaseAuth(page);
    await page.goto('/sign-in');

    await page.getByLabel('Email').fill('nope');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Enter a valid email address')).toBeVisible();
    await expect(page.getByText('Enter your password')).toBeVisible();
  });

  test('wrong credentials show an error', async ({ page }) => {
    await mockSupabaseAuth(page, { accounts: [TEST_ACCOUNT] });
    await page.goto('/sign-in');

    await page.getByLabel('Email').fill(TEST_ACCOUNT.email);
    await page.getByLabel('Password').fill('wrong password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Incorrect email or password')).toBeVisible();
  });

  test('sign in, stay signed in after reload, sign out', async ({ page }) => {
    await mockSupabaseAuth(page, { accounts: [TEST_ACCOUNT] });
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Welcome to Clapp' })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Welcome to Clapp' })).toBeVisible();

    await page.goto('/settings');
    await expect(page.getByText(`Signed in as ${TEST_ACCOUNT.email}`)).toBeVisible();
    await page.getByRole('button', { name: 'Sign out' }).click();

    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('sign up with email confirmation shows the check-your-email step', async ({ page }) => {
    await mockSupabaseAuth(page, { requireEmailConfirmation: true });
    await page.goto('/sign-in');
    await page.getByRole('link', { name: 'No account yet? Sign up' }).click();

    await page.getByLabel('Email').fill('new@example.com');
    await page.getByLabel('Password').fill('long enough');
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  });

  test('sign up without email confirmation signs the user in', async ({ page }) => {
    await mockSupabaseAuth(page);
    await page.goto('/sign-up');

    await page.getByLabel('Email').fill('new@example.com');
    await page.getByLabel('Password').fill('long enough');
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByRole('heading', { name: 'Welcome to Clapp' })).toBeVisible();
  });

  test('sign up with an existing email shows an error', async ({ page }) => {
    await mockSupabaseAuth(page, { accounts: [TEST_ACCOUNT] });
    await page.goto('/sign-up');

    await page.getByLabel('Email').fill(TEST_ACCOUNT.email);
    await page.getByLabel('Password').fill('long enough');
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText('An account with this email already exists')).toBeVisible();
  });
});
