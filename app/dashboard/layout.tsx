'use client';

import { usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import './transition.css'; // ✅ Import custom transition styles

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (prevPath.current) {
      setDirection(pathname > prevPath.current ? 'left' : 'right');
    }
    prevPath.current = pathname;
    setIsAnimating(true);

    const timeout = setTimeout(() => setIsAnimating(false), 350);
    return () => clearTimeout(timeout);
  }, [pathname]);

  const animationClass =
    isAnimating && direction === 'left'
      ? 'slide-left'
      : isAnimating && direction === 'right'
      ? 'slide-right'
      : '';

  return (
    <div className={`page-slide ${animationClass}`}>
      {children}
    </div>
  );
}