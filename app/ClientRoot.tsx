'use client';

import { RideProvider } from '@/context/RideContext';
import { Providers } from './providers';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <RideProvider>
      <Providers>{children}</Providers>
    </RideProvider>
  );
}