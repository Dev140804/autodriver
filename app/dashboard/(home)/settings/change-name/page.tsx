'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, AlertTriangle, CheckCircle } from 'lucide-react';

type DriverUser = {
  name?: string;
  username?: string;
};

export default function ChangeNamePage() {
  const router = useRouter();
  const [user, setUser] = useState<DriverUser | null>(null);
  const [name, setName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [theme, setTheme] = useState('simple');

  useEffect(() => {
    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const stored = localStorage.getItem('driver-user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setName(parsed.name || '');
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSave = () => {
    if (!user || name.trim().length < 3 || name === user.name) return;

    const updatedUser = { ...user, name };
    localStorage.setItem('driver-user', JSON.stringify(updatedUser));

    const allUsers = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    const updatedUsers = allUsers.map((u) =>
      u.username === user.username ? updatedUser : u
    );
    localStorage.setItem('driver-users', JSON.stringify(updatedUsers));

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.push('/dashboard/settings');
    }, 2000);
  };

  if (!user) return null;

  const isInvalid = name.trim().length < 3 || name === (user?.name || '');

  // 🔥 Conditional Button Styles
  const saveButtonClasses = isInvalid
    ? theme === 'dark'
      ? 'bg-black text-white/50 cursor-not-allowed'
      : theme === 'bright'
      ? 'bg-white text-black/50 cursor-not-allowed'
      : 'bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
    : theme === 'dark'
    ? 'bg-black text-white hover:bg-white hover:text-black cursor-pointer'
    : theme === 'bright'
    ? 'bg-white text-black hover:bg-black hover:text-white cursor-pointer'
    : 'bg-[var(--primary-color)] text-[var(--button-text)] hover:bg-[var(--primary-hover)] cursor-pointer';

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex justify-center items-start pt-24 px-4 transition-colors duration-300 relative">
      {/* Success Toast */}
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
          showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-lg border border-green-700 backdrop-blur-sm">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">Name updated successfully!</span>
        </div>
      </div>

      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 space-y-6 shadow-xl transition-colors duration-300">
        {/* Back Arrow */}
        <button
          onClick={() => router.push('/dashboard/settings')}
          className="text-[var(--text-muted)] hover:text-[var(--primary-color)] transition cursor-pointer"
          title="Back to Settings"
        >
          <ChevronLeft size={24} />
        </button>

        <h2 className="text-xl font-semibold text-center text-[var(--primary-color)]">Change Display Name</h2>

        {/* Name Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md text-[var(--text-color)] placeholder-[var(--placeholder-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-colors duration-300"
        />

        {/* Error Message */}
        {name.trim().length > 0 && name.trim().length < 3 && (
          <div className="flex items-center text-sm text-yellow-400 gap-2">
            <AlertTriangle size={16} />
            <span>Name must be at least 3 characters long.</span>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isInvalid}
          className={`w-full py-2 rounded-md font-semibold border border-[var(--border-color)] transition-colors duration-300 ${saveButtonClasses}`}
        >
          Save Name
        </button>
      </div>
    </div>
  );
}
