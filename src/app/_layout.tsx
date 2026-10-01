import '@/global.css';
import '@/lib/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthListener, useAuthStore } from '@/features/auth';
import { useApplySettings } from '@/features/settings';
import { createQueryClient } from '@/lib/query-client';
import { navigationThemes } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(createQueryClient);
  const scheme = useApplySettings();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={navigationThemes[scheme]}>
            <RootNavigator />
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  useAuthListener();
  const authStatus = useAuthStore((s) => s.status);
  const isSignedIn = authStatus === 'signedIn';

  useEffect(() => {
    if (authStatus !== 'loading') SplashScreen.hide();
  }, [authStatus]);

  // Until the stored session is restored, render nothing: the splash stays visible on native, and
  // statically rendered web pages are empty shells that hydrate on the client (see docs/architecture.md).
  if (authStatus === 'loading') return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
