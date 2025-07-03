'use client';

import { useEffect, useState } from 'react';

type DriverUser = {
  name?: string;
};

export default function EarningsPage() {
  const [user, setUser] = useState<DriverUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('driver-user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Driver';

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#0f0f0f] via-black to-[#1f1f1f] text-white">
      <section className="w-full max-w-md bg-[#1f2937]/90 rounded-2xl shadow-xl backdrop-blur border border-gray-700 p-8">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-indigo-400">Earnings Today</h1>
        </header>

        <div className="text-center space-y-2 text-gray-300">
          <p className="text-lg">Hey {firstName},</p>
          <p className="text-base">No earnings have been recorded yet today.</p>
          <p className="text-sm text-gray-500">Start driving to see your earnings here in real-time.</p>
        </div>

        <div className="mt-10 text-center">
          <div className="text-5xl font-bold tracking-tight text-white">₹0.00</div>
          <div className="mt-2 text-sm text-gray-400">Updated just now</div>
        </div>
      </section>
    </main>
  );
}