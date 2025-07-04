'use client'; // ✅ make this a client component

import dynamic from 'next/dynamic';

const DriverHomeClient = dynamic(() => import('./DriverHomeClient'), {
  ssr: false,
});

export default function Page() {
  return <DriverHomeClient />;
}