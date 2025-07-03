'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  // Temporary change to trigger redeploy

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p>Redirecting to login...</p>
    </div>
  );
}