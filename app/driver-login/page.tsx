'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DriverLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Check localStorage for saved user OR fallback to demo
    const saved = localStorage.getItem('driver-user');
    const savedUser = saved ? JSON.parse(saved) : null;

    if (
      (username === 'driver' && password === '1234') ||
      (savedUser && savedUser.username === username && savedUser.password === password)
    ) {
      localStorage.setItem('driver-session', username);
router.push('/welcome');
    } else {
      alert('Invalid login credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Driver Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
        >
          Sign In
        </button>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <span
            onClick={() => router.push('/driver-signup')}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}