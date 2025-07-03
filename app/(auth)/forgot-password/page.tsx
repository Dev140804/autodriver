'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

type DriverUser = {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
};

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRecover = () => {
    const users = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];

    const found = users.find(
      (user) =>
        (user.username === identifier || user.phone === identifier) &&
        user.email === email
    );

    if (found) {
      setMessage(`Your password is: ${found.password}`);
    } else {
      setMessage('No matching account found. Please check the details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl text-white space-y-6 relative">
        
        {/* Top-left Back Arrow */}
        <button
          onClick={() => router.push('/login')}
          className="absolute top-4 left-4 text-indigo-400 hover:text-indigo-500 transition cursor-pointer"
          title="Back to Login"
        >
          <ChevronLeft size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

        {/* Form Inputs */}
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm mb-1">Username or Phone Number</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Registered Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none"
            />
          </div>

          {/* Recover Button */}
          <button
            onClick={handleRecover}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold cursor-pointer"
          >
            Recover Password
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <p className="mt-4 text-center text-sm text-indigo-400">{message}</p>
        )}

        {/* Bottom "Back to Login" Link */}
        <p
          onClick={() => router.push('/login')}
          className="mt-6 text-center text-indigo-400 cursor-pointer hover:underline text-sm flex items-center justify-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Login
        </p>
      </div>
    </div>
  );
}