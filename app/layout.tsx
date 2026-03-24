// app/layout.tsx ✅ SERVER COMPONENT
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import ThemeHydrator from '@/components/theme/theme-hydrator';
import ClientRoot from './ClientRoot';

// ⬇️ added
import { RideProvider } from '@/context/RideContext';
import GlobalRideWatcher from '@/components/GlobalRideWatcher';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Auto Driver App',
  description: 'Driver-side ride sharing app',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head />
      <body className="antialiased transition-colors duration-300">
        <ThemeHydrator />
        <ClientRoot>
          <RideProvider>
            {children}
            <GlobalRideWatcher />
          </RideProvider>
        </ClientRoot>
      </body>
    </html>
  );
}

export const viewport = { width: 'device-width', initialScale: 1.0 };