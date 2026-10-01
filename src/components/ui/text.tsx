import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/cn';

const variants = {
  title: 'text-3xl font-bold text-foreground',
  heading: 'text-xl font-semibold text-foreground',
  body: 'text-base text-foreground',
  muted: 'text-sm text-muted-foreground',
  label: 'text-sm font-medium text-foreground',
} as const;

export type TextVariant = keyof typeof variants;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  className?: string;
};

export function Text({ variant = 'body', className, ...props }: TextProps) {
  return (
    <RNText
      role={variant === 'title' || variant === 'heading' ? 'heading' : undefined}
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}
