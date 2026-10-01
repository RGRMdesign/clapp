import { z } from 'zod';

/**
 * Validation messages are i18n keys (see `auth.validation.*` in the locale files);
 * components translate them with `t()`.
 */
export const signInSchema = z.object({
  email: z.email('auth.validation.email'),
  password: z.string().min(1, 'auth.validation.passwordRequired'),
});

export const signUpSchema = z.object({
  email: z.email('auth.validation.email'),
  password: z.string().min(8, 'auth.validation.passwordTooShort'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
