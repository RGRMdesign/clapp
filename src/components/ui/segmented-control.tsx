import { Pressable, View } from 'react-native';

import { cn } from '@/lib/cn';

import { Text } from './text';

export type SegmentedOption<T extends string> = { value: T; label: string };

export type SegmentedControlProps<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the whole group. */
  label: string;
  className?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View
      role="radiogroup"
      aria-label={label}
      className={cn('flex-row gap-1 rounded bg-muted p-1', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            role="radio"
            aria-label={option.label}
            aria-checked={selected}
            onPress={() => onChange(option.value)}
            className={cn(
              'min-h-9 flex-1 items-center justify-center rounded px-3',
              selected && 'bg-background',
            )}
          >
            <Text
              variant="label"
              className={selected ? 'text-foreground' : 'text-muted-foreground'}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
