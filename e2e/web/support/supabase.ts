import { type Page, type Route } from '@playwright/test';

/**
 * Mock of the Supabase Auth REST API (GoTrue) for web E2E tests, so flows run without a backend.
 * The app falls back to http://127.0.0.1:54321 when EXPO_PUBLIC_SUPABASE_URL is unset (see src/lib/env.ts).
 */
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';

type Account = { email: string; password: string };

type MockOptions = {
  /** Existing accounts that can sign in. */
  accounts?: Account[];
  /** When true, sign-up returns a user without a session (email confirmation on). */
  requireEmailConfirmation?: boolean;
};

const base64url = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

function fakeJwt(sub: string, email: string) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url({ sub, email, exp, role: 'authenticated', aud: 'authenticated' })}.signature`;
}

function user(email: string) {
  const id = `00000000-0000-4000-8000-${Buffer.from(email).toString('hex').padEnd(12, '0').slice(0, 12)}`;
  const now = new Date().toISOString();
  return {
    id,
    aud: 'authenticated',
    role: 'authenticated',
    email,
    email_confirmed_at: now,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    identities: [],
    created_at: now,
    updated_at: now,
  };
}

function session(email: string) {
  const u = user(email);
  return {
    access_token: fakeJwt(u.id, email),
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: `refresh-${u.id}`,
    user: u,
  };
}

const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(body),
  });

export async function mockSupabaseAuth(page: Page, options: MockOptions = {}) {
  const accounts = [...(options.accounts ?? [])];

  await page.route(`${SUPABASE_URL}/auth/v1/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace('/auth/v1', '');

    if (request.method() === 'OPTIONS') {
      return route.fulfill({
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-headers': '*',
          'access-control-allow-methods': '*',
        },
      });
    }

    const body = (request.postDataJSON() ?? {}) as Partial<Account> & { refresh_token?: string };

    if (path === '/token' && url.searchParams.get('grant_type') === 'password') {
      const account = accounts.find((a) => a.email === body.email && a.password === body.password);
      return account
        ? json(route, 200, session(account.email))
        : json(route, 400, {
            code: 400,
            error_code: 'invalid_credentials',
            msg: 'Invalid login credentials',
          });
    }

    if (path === '/signup') {
      if (accounts.some((a) => a.email === body.email)) {
        return json(route, 422, {
          code: 422,
          error_code: 'user_already_exists',
          msg: 'User already registered',
        });
      }
      accounts.push({ email: body.email ?? '', password: body.password ?? '' });
      return options.requireEmailConfirmation
        ? json(route, 200, { ...user(body.email ?? ''), email_confirmed_at: null })
        : json(route, 200, session(body.email ?? ''));
    }

    if (path === '/logout')
      return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } });

    if (path === '/user') return json(route, 200, user(accounts[0]?.email ?? 'user@example.com'));

    return json(route, 404, {
      code: 404,
      msg: `Unmocked auth endpoint: ${request.method()} ${path}`,
    });
  });
}

export const TEST_ACCOUNT: Account = {
  email: 'ada@example.com',
  password: 'correct horse battery',
};

/** Signs in through the UI with the mock. Call `mockSupabaseAuth` first. */
export async function signIn(page: Page, account: Account = TEST_ACCOUNT) {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill(account.email);
  await page.getByLabel('Password').fill(account.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL((url) => url.pathname === '/');
}
