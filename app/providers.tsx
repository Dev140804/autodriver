'use client';

import { ThemeProvider } from './theme-provider';
import { RideProvider } from '@/context/RideContext'; // ✅ import RideProvider

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RideProvider>{children}</RideProvider>
    </ThemeProvider>
  );
}