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
  const [theme, setTheme] = useState('simple');

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

    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
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

  const isDemoLogin = username === 'driver' && password === '1234';
  const isValidLogin = username.trim() !== '' && password.length >= 8;
  const canLogin = isDemoLogin || isValidLogin;

  // 🔥 Box Arrow Button Style
  const boxArrowClasses = canLogin
    ? theme === 'dark'
      ? 'bg-black text-white hover:bg-white hover:text-black cursor-pointer'
      : theme === 'bright'
      ? 'bg-white text-black hover:bg-black hover:text-white cursor-pointer'
      : 'bg-[var(--primary-color)] text-[var(--button-text)] hover:bg-[var(--primary-hover)] cursor-pointer'
    : 'bg-[var(--card-bg)] text-[var(--text-color)] border-[var(--border-color)] cursor-not-allowed opacity-50';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300 px-4 py-12">
      <div className="w-full max-w-md bg-[var(--card-bg)] backdrop-blur-md p-8 rounded-2xl shadow-lg border border-[var(--border-color)]">
        <h1 className="text-3xl font-semibold text-center text-[var(--primary-color)] mb-6">
          Welcome Back
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              className="w-full px-4 py-2 bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <p
            onClick={() => router.push('/forgot-password')}
            className="text-sm text-[var(--primary-color)] text-right mt-1 cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>

          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            disabled={!canLogin}
            className={`w-full mt-3 py-2.5 rounded-lg font-semibold border border-[var(--border-color)] transition-colors duration-300 ${boxArrowClasses}`}
          >
            Sign In
          </button>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{' '}
            <span
              onClick={() => router.push('/driver-signup')}
              className="text-[var(--primary-color)] cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
