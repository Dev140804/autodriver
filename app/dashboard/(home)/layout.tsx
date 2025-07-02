'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const navItems = [
  { name: 'Home', path: '/dashboard/home' },
  { name: 'Rides', path: '/dashboard/rides' },
  { name: 'Earnings', path: '/dashboard/earnings' },
  { name: 'About', path: '/dashboard/about' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">{children}</div>

      <nav className="flex justify-around bg-gray-800 text-white p-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`text-sm ${
              pathname === item.path ? 'text-blue-400 font-bold' : 'text-white'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}