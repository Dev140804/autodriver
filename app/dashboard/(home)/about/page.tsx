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

  useEffect(() => {
    const stored = localStorage.getItem('driver-user');
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#111827] text-white relative">
      {/* Main Box */}
      <div className="w-full max-w-md bg-[#1f2937]/90 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur space-y-8 transition-all">
        <h1 className="text-2xl font-semibold text-center text-indigo-400">Driver Info</h1>

        {/* Profile Info */}
        <div className="space-y-5 text-base text-gray-300">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Full Name</span>
            <span className="font-medium text-white">{user.name}</span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Email</span>
            <span className="font-medium text-white">{user.email}</span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Phone</span>
            <span className="font-medium text-white">{user.phone}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 space-y-3">
          <button
            onClick={() => router.push('/dashboard/settings')}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer shadow-md"
          >
            Open Settings
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 text-red-400 hover:text-red-500 font-medium text-sm underline transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Custom Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1f2937] border border-gray-700 rounded-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-white">Confirm Logout</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-300 text-sm">
              Are you sure you want to log out from your account?
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition cursor-pointer"
              >
                Cancel
              </button>
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