import { z } from 'zod';

/** i18n keys used as zod messages; components translate them with `t()`. */
export const validationKeys = [
  'auth.validation.email',
  'auth.validation.passwordRequired',
  'auth.validation.passwordTooShort',
] as const;
export type ValidationKey = (typeof validationKeys)[number];

export function isValidationKey(value: unknown): value is ValidationKey {
  return validationKeys.includes(value as ValidationKey);
}

const message = (key: ValidationKey) => key;

export const signInSchema = z.object({
  email: z.email(message('auth.validation.email')),
  password: z.string().min(1, message('auth.validation.passwordRequired')),
});

export const signUpSchema = z.object({
  email: z.email(message('auth.validation.email')),
  password: z.string().min(8, message('auth.validation.passwordTooShort')),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
