'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

type DriverUser = {
  name?: string;
  username?: string;
};

export default function ChangeNamePage() {
  const router = useRouter();
  const [user, setUser] = useState<DriverUser | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
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
    if (!user) return;

    const updatedUser = { ...user, name };
    localStorage.setItem('driver-user', JSON.stringify(updatedUser));

    const allUsers = JSON.parse(localStorage.getItem('driver-users') || '[]');
    const updatedUsers = allUsers.map((u: DriverUser) =>
  u.username === user.username ? updatedUser : u
);
    localStorage.setItem('driver-users', JSON.stringify(updatedUsers));

    alert('Name updated!');
    router.push('/dashboard/settings');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white px-4">
      <div className="w-full max-w-md bg-[#1f2937] border border-gray-700 rounded-xl p-6 space-y-6">
        
        {/* Back Icon Only */}
        <button
          onClick={() => router.push('/dashboard/settings')}
          className="text-gray-400 hover:text-white transition cursor-pointer"
          title="Back to Settings"
        >
          <ChevronLeft size={24} />
        </button>

        <h2 className="text-xl font-semibold text-center text-indigo-400">Change Display Name</h2>

        {/* Name Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none"
        />

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md font-semibold cursor-pointer"
        >
          Save Name
        </button>
      </div>
    </div>
  );
}