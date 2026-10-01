import { useColorScheme } from 'nativewind';
import { type Ref } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { cn } from '@/lib/cn';
import { tokenColor } from '@/theme/colors';

import { Text } from './text';

export type TextFieldProps = Omit<TextInputProps, 'placeholderTextColor'> & {
  label: string;
  /** Validation message; also marks the field invalid. */
  error?: string;
  /** Helper text shown below the field when there is no error. */
  hint?: string;
  className?: string;
  ref?: Ref<TextInput>;
};

export function TextField({
  label,
  error,
  hint,
  className,
  editable = true,
  ref,
  ...props
}: TextFieldProps) {
  const { colorScheme } = useColorScheme();
  const message = error ?? hint;

  return (
    <View className={cn('gap-1.5', className)}>
      <Text variant="label">{label}</Text>
      <TextInput
        ref={ref}
        aria-label={label}
        aria-invalid={!!error}
        aria-disabled={!editable}
        editable={editable}
        // NativeWind cannot style placeholders, so resolve the token to a color string.
        placeholderTextColor={tokenColor(colorScheme ?? 'light', 'muted-foreground')}
        className={cn(
          'min-h-11 rounded border bg-background px-3 py-2 text-base text-foreground',
          error ? 'border-danger' : 'border-border',
          !editable && 'opacity-50',
        )}
        {...props}
      />
      {message ? (
        <Text
          role={error ? 'alert' : undefined}
          // Announce validation errors on native screen readers (Android live region / iOS).
          aria-live={error ? 'polite' : undefined}
          variant="muted"
          className={error ? 'text-danger' : undefined}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}
