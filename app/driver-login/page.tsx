'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type DriverUser = {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
};

export default function DriverLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    const matchedUser = users.find(
      (user) => user.username === username && user.password === password
    );
    if (matchedUser) {
      localStorage.setItem('driver-user', JSON.stringify(matchedUser));
      router.push('/dashboard/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">Driver Login</h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg"
          >

            Log In
          </button>
          

          <p className="text-center text-gray-400 text-sm mt-4">
            Don’t have an account?{' '}
            <span
              onClick={() => router.push('/driver-signup')}
              className="text-indigo-400 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}