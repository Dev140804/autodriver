'use client';

import { useEffect, useState } from 'react';
import PageWrapper from '@/components/PageWrapper'; // ⬅️ ✅ for transition animation

type DriverUser = {
  name?: string;
};

export default function EarningsPage() {
  const [user, setUser] = useState<DriverUser | null>(null);
  const [theme, setTheme] = useState('simple');

  useEffect(() => {
    const stored = localStorage.getItem('driver-user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Driver';

  const bgClasses =
    theme === 'dark'
      ? 'bg-black text-white'
      : theme === 'bright'
      ? 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900'
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

  const earningsClasses =
    theme === 'dark'
      ? 'text-white'
      : theme === 'bright'
      ? 'text-black'
      : 'text-[var(--text-color)]';

  const updateTextClasses =
    theme === 'dark'
      ? 'text-gray-400'
      : theme === 'bright'
      ? 'text-gray-500'
      : 'text-[var(--text-muted)]';

  return (
    <PageWrapper> {/* ✅ Added for smooth slide transition */}
      <main
        className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${bgClasses}`}
      >
        <section
          className={`w-full max-w-md rounded-2xl shadow-xl backdrop-blur p-8 transition-colors duration-300 ${cardClasses}`}
        >
          <header className="text-center mb-6">
            <h1 className={`text-3xl font-semibold ${headingClasses}`}>Earnings Today</h1>
          </header>

          <div className={`text-center space-y-2 ${subtitleClasses}`}>
            <p className="text-lg">Hey {firstName},</p>
            <p className="text-base">No earnings have been recorded yet today.</p>
            <p className="text-sm">{`Start driving to see your earnings here in real-time.`}</p>
          </div>

          <div className="mt-10 text-center">
            <div className={`text-5xl font-bold tracking-tight ${earningsClasses}`}>₹0.00</div>
            <div className={`mt-2 text-sm ${updateTextClasses}`}>Updated just now</div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}