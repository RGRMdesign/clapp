import { ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';

export type ScreenProps = ViewProps & {
  /** Wrap content in a ScrollView (default true). */
  scroll?: boolean;
  className?: string;
};

/**
 * Root container for every screen: background, safe areas, centered max-width column
 * (so the layout also works on wide web/tablet screens).
 */
export function Screen({ scroll = true, className, children, ...props }: ScreenProps) {
  const content = (
    <View className={cn('w-full max-w-content gap-4 self-center p-4', className)} {...props}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background">
      {scroll ? (
        <ScrollView contentContainerClassName="grow" keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
