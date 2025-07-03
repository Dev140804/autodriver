'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function ThemeSettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('driver-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const switchTheme = (selected: string) => {
    setTheme(selected);
    localStorage.setItem('driver-theme', selected);
    document.documentElement.setAttribute('data-theme', selected);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex justify-center items-start pt-24 px-4">
      <div className="max-w-md w-full bg-[#1f2937] p-6 rounded-xl shadow-xl border border-gray-700 space-y-6 relative">
        
        {/* Back Arrow Inside Theme Box */}
        <button
          onClick={() => router.push('/dashboard/settings')}
          title="Back to Settings"
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Heading */}
        <h1 className="text-xl font-semibold text-center text-indigo-400">Theme Settings</h1>

        {/* Theme Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => switchTheme('dark')}
            className={`flex-1 py-2 rounded-md font-medium cursor-pointer ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => switchTheme('bright')}
            className={`flex-1 py-2 rounded-md font-medium cursor-pointer ${
              theme === 'bright' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Light
          </button>
        </div>
      </div>
    </div>
  );
}