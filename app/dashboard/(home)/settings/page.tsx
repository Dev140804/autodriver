'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  User,
  SunMoon,
  MessageCircle,
  Info,
  Trash2,
  X,
} from 'lucide-react';

type DriverUser = {
  name?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<DriverUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('driver-user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const confirmDelete = () => {
    if (!user?.username) return;
    const users = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    const updated = users.filter((u) => u.username !== user.username);
    localStorage.setItem('driver-users', JSON.stringify(updated));
    localStorage.removeItem('driver-user');
    setShowDeleteModal(false);
    alert('Account deleted successfully.');
    router.push('/driver-signup');
  };

  if (loading || !user) return null;

  const settings = [
  {
    label: 'Change Display Name',
    icon: <User className="w-5 h-5 mr-3" />,
    route: '/dashboard/settings/change-name',
    key: 'display name',
  },
  {
  label: 'Theme',
  icon: <SunMoon className="w-5 h-5 mr-3" />,
  route: '/dashboard/settings/theme',
  key: 'theme',
},
  {
    label: 'Help Assistant',
    icon: <MessageCircle className="w-5 h-5 mr-3" />,
    route: '/dashboard/settings/help-assistant',
    key: 'help assistant',
  },
  {
    label: 'About',
    icon: <Info className="w-5 h-5 mr-3" />,
    route: '/dashboard/settings/about-info',
    key: 'about',
  },
];

  return (
    <div className="min-h-screen bg-[#111827] px-4 py-10 text-white flex justify-center items-start">
      <div className="w-full max-w-lg bg-[#1f2937] rounded-2xl shadow-xl border border-gray-700 p-6 space-y-6">

        {/* Top Bar */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push('/dashboard/about')}
            className="text-gray-400 hover:text-white transition cursor-pointer"
            title="Back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-white">Settings</h1>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search settings..."
          value={q}
          onChange={(e) => setQ(e.target.value.toLowerCase())}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Settings Buttons */}
        <div className="space-y-3 pt-4">
          {settings
            .filter((s) => s.key.includes(q))
            .map((s, idx) => (
              <button
                key={idx}
                onClick={() => router.push(s.route)}
                className="w-full flex items-center px-4 py-3 rounded-md bg-gray-700 hover:bg-gray-600 transition cursor-pointer text-left font-medium"
              >
                {s.icon}
                {s.label}
              </button>
            ))}

          {/* Delete Account Button */}
          {q === '' || 'delete account'.includes(q) ? (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-red-600 hover:bg-red-700 font-medium transition cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          ) : null}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1f2937] border border-gray-700 rounded-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-white">Confirm Deletion</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-300 text-sm">
              Are you sure you want to permanently delete your account? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}