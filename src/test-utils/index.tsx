import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

/**
 * Test wrapper with a fresh QueryClient per test: no retries (failures surface immediately)
 * and no garbage-collection timers (so Jest exits cleanly).
 *
 *   await render(<MyScreen />, { wrapper: QueryWrapper });
 */
export function QueryWrapper({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity },
          mutations: { retry: false, gcTime: Infinity },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
