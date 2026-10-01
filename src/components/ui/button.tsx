import { Pressable, type PressableProps } from 'react-native';

import { cn } from '@/lib/cn';

import { Text } from './text';

const containerVariants = {
  primary: 'bg-primary',
  secondary: 'bg-surface border border-border',
  ghost: 'bg-transparent',
  danger: 'bg-danger',
} as const;

const labelVariants = {
  primary: 'text-primary-foreground',
  secondary: 'text-foreground',
  ghost: 'text-primary',
  danger: 'text-danger-foreground',
} as const;

export type ButtonVariant = keyof typeof containerVariants;

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  className?: string;
};

export function Button({ label, variant = 'primary', disabled, className, ...props }: ButtonProps) {
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={!!disabled}
      disabled={disabled}
      className={cn(
        'min-h-11 items-center justify-center rounded px-4 py-2 active:opacity-80',
        containerVariants[variant],
        disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      <Text className={cn('font-semibold', labelVariants[variant])}>{label}</Text>
    </Pressable>
  );
}
