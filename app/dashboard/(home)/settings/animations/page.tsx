'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function AnimationSettingsPage() {
  const [animations, setAnimations] = useState<'on' | 'off'>('on');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('driver-animations') || 'on';
    setAnimations(saved === 'off' ? 'off' : 'on');
  }, []);

  const toggleAnimations = (value: 'on' | 'off') => {
    setAnimations(value);
    localStorage.setItem('driver-animations', value);
    window.dispatchEvent(new Event('driver-animation-toggle')); // ✅ Trigger layout to update
  };

  const baseClasses =
    'flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all duration-300';

  const selectedClasses =
    'border-[var(--primary-color)] bg-[var(--primary-faded)] ring-2 ring-[var(--primary-color)] shadow';

  const unselectedClasses =
    'border-[var(--border-color)] hover:border-[var(--primary-color)]';

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      <div className="w-full max-w-lg bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-xl space-y-6">
        {/* Top Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            title="Back"
            className="text-[var(--text-color)] hover:text-[var(--primary-color)] cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-[var(--primary-color)]">Animation Settings</h1>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--text-muted)]">
          Control transition animations when navigating the dashboard.
        </p>

        {/* Animation Options */}
        <div className="space-y-4">
          {/* Enable */}
          <label
            className={`${baseClasses} ${
              animations === 'on' ? selectedClasses : unselectedClasses
            }`}
          >
            <span className="text-sm font-medium">Enable Animations (Smooth Transitions)</span>
            <input
              type="radio"
              name="animations"
              value="on"
              checked={animations === 'on'}
              onChange={() => toggleAnimations('on')}
              className="accent-[var(--primary-color)] cursor-pointer"
            />
          </label>

          {/* Disable */}
          <label
            className={`${baseClasses} ${
              animations === 'off' ? selectedClasses : unselectedClasses
            }`}
          >
            <span className="text-sm font-medium">Disable Animations (Instant Navigation)</span>
            <input
              type="radio"
              name="animations"
              value="off"
              checked={animations === 'off'}
              onChange={() => toggleAnimations('off')}
              className="accent-[var(--primary-color)] cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
}