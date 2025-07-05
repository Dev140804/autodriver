'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  const isBack = pathname < prevPath.current;
  prevPath.current = pathname;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          x: isBack ? -50 : 50,
          opacity: 0.6,
          scale: 0.98,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        exit={{
          x: isBack ? 50 : -50,
          opacity: 0,
          scale: 0.96,
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1], // Smooth professional cubic bezier
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}