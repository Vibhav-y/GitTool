'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FeatureFlagsProvider } from '@/contexts/FeatureFlagsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FeatureFlagsProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#12121a',
                    color: '#e8e8ed',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '0.625rem',
                    fontSize: '0.85rem',
                  },
                }}
              />
              {children}
            </WorkspaceProvider>
          </AuthProvider>
        </FeatureFlagsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}