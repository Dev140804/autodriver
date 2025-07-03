'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl text-white">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        <label className="block text-sm mb-1">Username or Phone Number</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none"
        />

        <label className="block text-sm mb-1">Registered Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none"
        />

        <button
          onClick={handleRecover}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold"
        >
          Recover Password
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-indigo-400">{message}</p>
        )}

        <p
          onClick={() => router.push('/login')}
          className="mt-6 text-center text-indigo-400 cursor-pointer hover:underline text-sm"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}