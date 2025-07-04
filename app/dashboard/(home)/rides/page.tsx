'use client';

import { useEffect, useState } from 'react';

export default function RidesPage() {
  const [theme, setTheme] = useState('simple');

  useEffect(() => {
    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // 🎨 Dynamic Classes
  const bgClasses =
    theme === 'dark'
      ? 'bg-black text-white'
      : theme === 'bright'
      ? 'bg-gray-50 text-gray-900'
      : 'bg-[var(--bg-color)] text-[var(--text-color)]';

  const cardClasses =
    theme === 'dark'
      ? 'bg-black border border-gray-700 text-white'
      : theme === 'bright'
      ? 'bg-white border border-gray-300 text-gray-800'
      : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)]';

  const headingClasses =
    theme === 'dark'
      ? 'text-white'
      : theme === 'bright'
      ? 'text-black'
      : 'text-[var(--primary-color)]';

  const subtitleClasses =
    theme === 'dark'
      ? 'text-gray-300'
      : theme === 'bright'
      ? 'text-gray-600'
      : 'text-[var(--text-muted)]';

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-6 py-12 transition-colors duration-300 ${bgClasses}`}
    >
      <section
        className={`w-full max-w-md p-10 rounded-2xl shadow-2xl backdrop-blur transition-colors duration-300 ${cardClasses}`}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-indigo-500/10 p-4 rounded-full">
            <svg
              className="w-14 h-14 text-indigo-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5h7.5m-10.5 3h13.5M3 9.75h18m-1.5 0v7.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 17.25v-7.5"
              />
            </svg>
          </div>

          <div className="text-center space-y-2">
            <h1 className={`text-2xl font-semibold ${headingClasses}`}>
              No Rides Completed
            </h1>
            <p className={`text-sm ${subtitleClasses}`}>
              When you start completing rides, they’ll appear here with details like pickup, drop, and fare.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
