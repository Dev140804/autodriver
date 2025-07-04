'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function ThemeSettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('driver-theme') || 'simple';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const switchTheme = (selected: string) => {
    setTheme(selected);
    localStorage.setItem('driver-theme', selected);
    document.documentElement.setAttribute('data-theme', selected);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex justify-center items-start pt-24 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-[var(--card-bg)] p-6 rounded-xl shadow-xl border border-[var(--border-color)] space-y-6 relative">
        
        {/* Back Arrow */}
        <button
          onClick={() => router.push('/dashboard/settings')}
          title="Back to Settings"
          className="absolute top-4 left-4 text-[var(--text-color)] hover:text-indigo-400 transition cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-xl font-semibold text-center text-[var(--primary-color)]">Theme Settings</h1>

        {/* Theme Buttons */}
        <div className="flex flex-col gap-4">
          {/* Dark Theme */}
          <button
            onClick={() => switchTheme('dark')}
            className={`w-full py-2 rounded-md font-medium border transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-white text-black border-gray-300' // Active Dark Theme
                : 'bg-gray-700 text-[var(--text-color)] hover:bg-gray-600 border-transparent'
            }`}
          >
            Dark Theme
          </button>

          {/* Simple Theme */}
          <button
            onClick={() => switchTheme('simple')}
            className={`w-full py-2 rounded-md font-medium border transition-colors duration-200 ${
              theme === 'simple'
                ? 'bg-indigo-600 text-white border-indigo-700' // Active Simple Theme
                : 'bg-gray-700 text-[var(--text-color)] hover:bg-gray-600 border-transparent'
            }`}
          >
            Simple Theme
          </button>

          {/* Bright Theme */}
          <button
            onClick={() => switchTheme('bright')}
            className={`w-full py-2 rounded-md font-medium border transition-colors duration-200 ${
              theme === 'bright'
                ? 'bg-black text-white border-gray-800' // Active Bright Theme
                : 'bg-gray-700 text-[var(--text-color)] hover:bg-gray-600 border-transparent'
            }`}
          >
            Bright Theme
          </button>
        </div>
      </div>
    </div>
  );
}
