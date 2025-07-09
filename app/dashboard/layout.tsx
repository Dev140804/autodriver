'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import './transition.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const prevPath = useRef<string | null>(null);

  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const routeOrder = [
    '/dashboard/home',
    '/dashboard/rides',
    '/dashboard/earnings',
    '/dashboard/about',
  ];

  useEffect(() => {
    const saved = localStorage.getItem('driver-animations') || 'on';
    setAnimationsEnabled(saved !== 'off');

    const handleToggle = () => {
      const updated = localStorage.getItem('driver-animations') || 'on';
      setAnimationsEnabled(updated !== 'off');
    };

    window.addEventListener('driver-animation-toggle', handleToggle);
    return () => window.removeEventListener('driver-animation-toggle', handleToggle);
  }, []);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router]);

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

    if (animationsEnabled) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(timeout);
    } else {
      setIsAnimating(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, animationsEnabled]);

  const animationClass =
    animationsEnabled && isAnimating && direction === 'left'
      ? 'slide-left'
      : animationsEnabled && isAnimating && direction === 'right'
      ? 'slide-right'
      : '';

  return (
    <div className={`page-slide ${animationClass}`}>
      {children}
    </div>
  );
}
