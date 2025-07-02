'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page on load
    router.replace('/login');
  }, [router]);

  return null; // Don't render anything
}