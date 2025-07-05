'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import './transition.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const prevPath = useRef<string | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isAnimating, setIsAnimating] = useState(true);

  // Ordered tab routes
  const routeOrder = [
    '/dashboard/home',
    '/dashboard/rides',
    '/dashboard/earnings',
    '/dashboard/about',
  ];

  // ✅ Swipe detection
  useEffect(() => {
    let startX: number;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      const threshold = 50; // Minimum swipe distance
      const currentIndex = routeOrder.indexOf(pathname);

      if (diff > threshold && currentIndex < routeOrder.length - 1) {
        // Swipe left
        router.push(routeOrder[currentIndex + 1]);
      } else if (diff < -threshold && currentIndex > 0) {
        // Swipe right
        router.push(routeOrder[currentIndex - 1]);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pathname, router, routeOrder]);

  // ✅ Animation direction
  useEffect(() => {
    const current = pathname;
    const previous = prevPath.current;

    if (previous) {
      const currentBase = current.split('/').slice(0, 3).join('/');
      const prevBase = previous.split('/').slice(0, 3).join('/');

      if (currentBase === prevBase) {
        const currentDepth = current.split('/').length;
        const prevDepth = previous.split('/').length;
        setDirection(currentDepth > prevDepth ? 'left' : 'right');
      } else {
        const currentIndex = routeOrder.indexOf(currentBase);
        const prevIndex = routeOrder.indexOf(prevBase);

        if (currentIndex !== -1 && prevIndex !== -1) {
          setDirection(currentIndex > prevIndex ? 'left' : 'right');
        } else {
          setDirection(current.length > previous.length ? 'left' : 'right');
        }
      }
    }

    prevPath.current = pathname;
    setIsAnimating(true);

    const timeout = setTimeout(() => setIsAnimating(false), 350);
    return () => clearTimeout(timeout);
  }, [pathname, routeOrder]);

  const animationClass =
    isAnimating && direction === 'left'
      ? 'slide-left'
      : isAnimating && direction === 'right'
      ? 'slide-right'
      : '';

  return <div className={`page-slide ${animationClass}`}>{children}</div>;
}