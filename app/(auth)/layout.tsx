'use client';
export const dynamic = 'force-dynamic';
import { SessionProvider } from 'next-auth/react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}