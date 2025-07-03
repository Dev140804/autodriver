'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

type DriverUser = {
  name?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
};

export default function AboutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [user, setUser] = useState<DriverUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('driver-user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    if (!window.confirm('Log out from your account?')) return;

    // Local logout
    localStorage.removeItem('driver-user');

    // If signed in via Google
    if (session) {
      signOut({ callbackUrl: '/login' });
    } else {
      router.push('/login');
    }
  };

  const handleDelete = () => {
    if (!user?.username || !window.confirm('Permanently delete this account?')) return;

    const users = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    const updated = users.filter((u) => u.username !== user.username);

    localStorage.setItem('driver-users', JSON.stringify(updated));
    localStorage.removeItem('driver-user');

    alert('Account deleted successfully.');
    router.push('/driver-signup');
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-black to-[#1f2937] px-4 py-12 text-white">
      <div className="w-full max-w-md bg-[#1f2937]/90 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-md">
        <h1 className="text-3xl font-semibold text-center text-indigo-400 mb-8">Driver Profile</h1>

        <div className="space-y-4 text-sm sm:text-base text-gray-300">
          <div><span className="font-medium text-white">Name:</span> {user.name || 'Not provided'}</div>
          <div><span className="font-medium text-white">Email:</span> {user.email || 'Not provided'}</div>
          <div><span className="font-medium text-white">Phone:</span> {user.phone || 'Not provided'}</div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition"
          >
            Logout
          </button>

          <button
            onClick={handleDelete}
            className="w-full bg-gray-700 hover:bg-gray-800 py-3 rounded-lg font-medium transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}