'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type DriverUser = {
  name?: string;
};

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<DriverUser | null>(null);
  const [theme, setTheme] = useState('simple');

  useEffect(() => {
    // Get stored user
    const storedUser = localStorage.getItem('driver-user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      // Redirect after 3s
      const timeout = setTimeout(() => {
        router.push('/dashboard/home');
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      router.push('/login');
    }

    // Get theme
    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [router]);

  // 🎨 Theme-based Colors
  const bgClasses =
    theme === 'dark'
      ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white'
      : theme === 'bright'
      ? 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-900'
      : 'bg-[var(--bg-color)] text-[var(--text-color)]';

  const cardClasses =
    theme === 'dark'
      ? 'bg-gray-900/80 border border-gray-800 text-white'
      : theme === 'bright'
      ? 'bg-white/90 border border-gray-300 text-gray-800'
      : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)]';

  const headingClasses =
    theme === 'dark'
      ? 'text-indigo-500'
      : theme === 'bright'
      ? 'text-black'
      : 'text-[var(--primary-color)]';

  const spinnerBorder =
    theme === 'dark'
      ? 'border-indigo-500 border-t-transparent'
      : theme === 'bright'
      ? 'border-gray-800 border-t-transparent'
      : 'border-[var(--primary-color)] border-t-transparent';

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClasses} transition-colors duration-300 px-4`}>
      <div className={`max-w-md w-full text-center p-10 rounded-3xl shadow-2xl ${cardClasses} backdrop-blur animate-fade-in-up`}>
        <h1 className={`text-4xl font-extrabold mb-4 animate-pulse-slow ${headingClasses}`}>Welcome</h1>
        <p className="text-lg sm:text-xl">
          Hello <span className="font-semibold">{user?.name || 'Driver'}</span>, we’re preparing your dashboard.
        </p>

        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Redirecting in a moment...</span>
          <div className={`h-8 w-8 border-4 ${spinnerBorder} rounded-full animate-spin`} />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
