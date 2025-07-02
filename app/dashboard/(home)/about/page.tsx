'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const localUser = localStorage.getItem('driver-user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      router.push('/login'); // Redirect if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    localStorage.removeItem('driver-user');
    router.push('/login');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed || !user || !user.username) return;

    const existingUsers = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    const updatedUsers = existingUsers.filter((u) => u.username !== user.username);

    localStorage.setItem('driver-users', JSON.stringify(updatedUsers));
    localStorage.removeItem('driver-user');

    alert('Account deleted successfully.');
    router.push('/driver-signup');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800/90 rounded-2xl p-8 shadow-2xl backdrop-blur-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">👤 Driver Profile</h2>

        <div className="space-y-4 text-gray-300">
          <p><span className="font-semibold text-white">Name:</span> {user.name || 'N/A'}</p>
          <p><span className="font-semibold text-white">Email:</span> {user.email || 'N/A'}</p>
          <p><span className="font-semibold text-white">Phone:</span> {user.phone || 'N/A'}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          🚪 Logout
        </button>

        <button
          onClick={handleDeleteAccount}
          className="mt-4 w-full bg-gray-700 hover:bg-gray-800 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          ❌ Delete Account
        </button>
      </div>
    </div>
  );
}