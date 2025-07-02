'use client';

import { useEffect, useState } from 'react';

type DriverUser = {
  name?: string;
};

export default function EarningsPage() {
  const [user, setUser] = useState<DriverUser | null>(null);

  useEffect(() => {
    const localUser = localStorage.getItem('driver-user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800/90 rounded-2xl p-8 shadow-xl backdrop-blur border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">📊 Today's Earnings</h2>

        <div className="text-center text-gray-300 space-y-3">
          <p className="text-xl">Hi {user?.name?.split(' ')[0] || 'Driver'},</p>
          <p className="text-lg">You haven’t earned anything yet today.</p>
          <p className="text-sm text-gray-400">Start accepting rides to begin earning!</p>
        </div>

        <div className="mt-8 text-center">
          <span className="text-4xl font-bold text-white">₹0.00</span>
        </div>
      </div>
    </div>
  );
}