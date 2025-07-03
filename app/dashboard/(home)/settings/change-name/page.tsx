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

  return (
    <div className="min-h-screen bg-[#111827] text-white flex justify-center items-start pt-24 px-4 relative">
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

      <div className="w-full max-w-md bg-[#1f2937] border border-gray-700 rounded-xl p-6 space-y-6">
        {/* Back Arrow Only */}
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
          className={`w-full py-2 rounded-md font-semibold transition ${
            isInvalid
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
          }`}
        >
          Save Name
        </button>
      </div>
    </div>
  );
}