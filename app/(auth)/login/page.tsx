'use client';
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    const demoExists = users.some((u) => u.username === 'driver');
    if (!demoExists) {
      const demoUser: DriverUser = {
        name: 'Demo Driver',
        email: 'demo@gmail.com',
        phone: '9999999999',
        username: 'driver',
        password: '1234',
      };
      localStorage.setItem('driver-users', JSON.stringify([...users, demoUser]));
    }
  }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    const matchedUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem('driver-user', JSON.stringify(matchedUser));
      router.push('/welcome');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#111827] to-[#1f2937] px-4 py-12">
      <div className="w-full max-w-md bg-[#1f2937]/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700 text-white">
        <h1 className="text-3xl font-semibold text-center text-indigo-400 mb-6">Welcome Back</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* ✅ Forgot Password Link */}
          <p
            onClick={() => router.push('/forgot-password')}
            className="text-sm text-indigo-400 text-right mt-1 cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>

          <button
            onClick={handleLogin}
            className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-lg font-semibold transition duration-200"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don’t have an account?{' '}
            <span
              onClick={() => router.push('/driver-signup')}
              className="text-indigo-400 cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}