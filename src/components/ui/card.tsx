import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/cn';

export type CardProps = ViewProps & { className?: string };

export function Card({ className, ...props }: CardProps) {
  return <View className={cn('gap-3 rounded-lg bg-surface p-4', className)} {...props} />;
}
