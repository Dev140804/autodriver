'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const navItems = [
  { name: 'Home', path: '/dashboard/home' },
  { name: 'Rides', path: '/dashboard/rides' },
  { name: 'Earnings', path: '/dashboard/earnings' },
  { name: 'About', path: '/dashboard/about' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Load Google Maps JS
  useEffect(() => {
    const scriptId = 'google-maps-script';
    const isAlreadyPresent = document.getElementById(scriptId);

    if (!isAlreadyPresent) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Bottom Navigation */}
      <nav className="flex justify-around border-t border-gray-700 bg-gray-900 py-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={`text-sm font-medium transition-colors ${
                isActive ? 'text-indigo-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}