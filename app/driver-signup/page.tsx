'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DriverSignup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    if (!form.name || !form.email || !form.phone || !form.username || !form.password) {
      alert('Please fill all fields');
      return;
    }

    // Later: verify Gmail/Phone here (Google/Truecaller APIs)

    localStorage.setItem('driver-user', JSON.stringify(form));
    alert('Signup successful! Please login.');
    router.push('/driver-login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Driver Sign Up</h2>
        {['name', 'email', 'phone', 'username', 'password'].map((field) => (
          <input
            key={field}
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(form as any)[field]}
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded bg-gray-700"
          />
        ))}
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-semibold"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/driver-login')}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}