'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type DriverUser = {
  name?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
};

export default function AboutPage() {
  const router = useRouter();
  const [user, setUser] = useState<DriverUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState('simple');

  useEffect(() => {
    const stored = localStorage.getItem('driver-user');
    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const confirmLogout = () => {
    localStorage.removeItem('driver-user');
    router.push('/login');
  };

  if (loading || !user) return null;

  const boxArrowClasses =
    theme === 'dark'
      ? 'bg-black text-white hover:bg-white hover:text-black focus:bg-black focus:text-white cursor-pointer'
      : theme === 'bright'
      ? 'bg-white text-black hover:bg-black hover:text-white focus:bg-white focus:text-black cursor-pointer'
      : 'bg-[var(--button-bg)] text-[var(--text-color)] border border-[var(--border-color)] transition-colors duration-300 hover:bg-[var(--text-color)] hover:text-[#1f2937] cursor-pointer';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bg-color)] text-[var(--text-color)] relative transition-colors duration-300">
      {/* Main Box */}
      <div className="w-full max-w-md bg-[var(--card-bg)] rounded-2xl shadow-2xl p-8 border border-[var(--border-color)] backdrop-blur space-y-8 transition-all">
        <h1 className="text-2xl font-semibold text-center text-[var(--primary-color)]">Driver Info</h1>

        {/* Profile Info */}
        <div className="space-y-5 text-base text-[var(--text-muted)]">
          <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--placeholder-color)]">Full Name</span>
            <span className="font-medium text-[var(--text-color)]">{user.name}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--placeholder-color)]">Email</span>
            <span className="font-medium text-[var(--text-color)]">{user.email}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
            <span className="text-[var(--placeholder-color)]">Phone</span>
            <span className="font-medium text-[var(--text-color)]">{user.phone}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 space-y-3">
          {/* Open Settings Button */}
          <button
            onClick={() => router.push('/dashboard/settings')}
            className={`w-full py-3 rounded-lg font-semibold ${boxArrowClasses}`}
          >
            Open Settings
          </button>

          {/* Logout Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 text-red-500 hover:text-red-600 font-medium text-sm underline transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Custom Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-[var(--primary-color)]">Confirm Logout</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--text-color)] hover:text-[var(--primary-color)] transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-[var(--text-muted)] text-sm">
              Are you sure you want to log out from your account?
            </p>

            <div className="flex justify-end gap-3 pt-4">
              {/* Cancel Button */}
              <button
                onClick={() => setShowModal(false)}
                className={`px-4 py-2 rounded-md ${boxArrowClasses}`}
              >
                Cancel
              </button>

              {/* Logout Button */}
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
