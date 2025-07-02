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

export default function DriverSignup() {
  const router = useRouter();
  const [form, setForm] = useState<DriverUser>({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const { name, email, phone, username, password } = form;

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      newErrors.email = 'Use a valid Gmail address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Minimum 8 characters';
    }

    const existingUsers = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    if (existingUsers.find((u) => u.username === username)) {
      newErrors.username = 'Username already taken';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validate()) return;

    const users = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    users.push(form);
    localStorage.setItem('driver-users', JSON.stringify(users));
    localStorage.setItem('driver-user', JSON.stringify(form));
    router.push('/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-800/90 p-10 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md text-white">
        <h2 className="text-4xl font-bold text-center mb-8 text-indigo-400">Driver Sign Up</h2>

        <div className="space-y-5">
          {[
            { label: 'Full Name', name: 'name', placeholder: 'John Doe' },
            { label: 'Email (Gmail only)', name: 'email', placeholder: 'you@gmail.com' },
            { label: 'Phone Number', name: 'phone', placeholder: '10-digit number' },
            { label: 'Username', name: 'username', placeholder: 'Choose a username' },
            { label: 'Password', name: 'password', placeholder: 'At least 8 characters', type: 'password' },
          ].map(({ label, name, placeholder, type = 'text' }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name as keyof DriverUser]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              {errors[name] && <p className="text-red-400 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}

          <button
            onClick={handleSignup}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Already registered?{' '}
            <span
              className="text-indigo-400 hover:underline cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}