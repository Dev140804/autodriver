'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import './transition.css';

// ✅ Move outside component to prevent rerenders
const routeOrder = [
  '/dashboard/home',
  '/dashboard/rides',
  '/dashboard/earnings',
  '/dashboard/about',
];

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
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // ✅ Load animation setting
  useEffect(() => {
    const setting = localStorage.getItem('driver-animations') || 'on';
    setAnimationsEnabled(setting !== 'off');
  }, []);

  // ✅ Swipe gesture detection
  useEffect(() => {
    let startX = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startTime = new Date().getTime();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endTime = new Date().getTime();
      const diff = startX - endX;
      const elapsed = endTime - startTime;

      const threshold = 60;
      const maxTime = 500;
      const currentIndex = routeOrder.indexOf(pathname);

      if (elapsed < maxTime) {
        if (diff > threshold && currentIndex < routeOrder.length - 1) {
          router.push(routeOrder[currentIndex + 1]);
        } else if (diff < -threshold && currentIndex > 0) {
          router.push(routeOrder[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pathname, router]);

  // ✅ Directional animation logic
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

    const timeout = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timeout);
  }, [pathname]);

  const animationClass =
    animationsEnabled && isAnimating && direction === 'left'
      ? 'slide-left'
      : animationsEnabled && isAnimating && direction === 'right'
      ? 'slide-right'
      : '';

  return <div className={`page-slide ${animationClass}`}>{children}</div>;
}