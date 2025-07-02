'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  // Inject demo user into localStorage silently if not present
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
      router.push('/dashboard/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 px-4 py-10">
      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur p-8 rounded-2xl shadow-2xl text-white border border-gray-800">
        <h2 className="text-4xl font-bold text-center mb-8 text-indigo-400">Driver Login</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold transition duration-200"
          >
            Log In
          </button>

          <p className="text-sm text-center mt-6 text-gray-400">
            Don’t have an account?{' '}
            <span
              onClick={() => router.push('/driver-signup')}
              className="text-indigo-400 hover:underline cursor-pointer font-medium"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}