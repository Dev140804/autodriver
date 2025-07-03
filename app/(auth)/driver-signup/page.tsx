'use client';
export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';

// Type for user
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
      newErrors.email = 'Only valid Gmail addresses allowed';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Enter a 10-digit number';
    }

    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    const existingUsers = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];
    if (existingUsers.some((u) => u.username === username)) {
      newErrors.username = 'Username already exists';
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

  const handleGoogleSignUp = async () => {
    await signIn('google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#1f2937] px-4 py-10">
      <div className="w-full max-w-lg bg-[#1f2937]/90 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-700 text-white">
        <h1 className="text-3xl font-semibold text-center mb-8 text-indigo-400">Create Driver Account</h1>

        <div className="space-y-6">
          {[
            { label: 'Full Name', name: 'name', placeholder: 'John Doe' },
            { label: 'Gmail Address', name: 'email', placeholder: 'example@gmail.com' },
            { label: 'Phone Number', name: 'phone', placeholder: '10-digit number' },
            { label: 'Username', name: 'username', placeholder: 'Choose a username' },
            { label: 'Password', name: 'password', placeholder: 'Minimum 8 characters', type: 'password' },
          ].map(({ label, name, placeholder, type = 'text' }) => (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={name} className="text-sm text-gray-300">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name as keyof DriverUser]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              />
              {errors[name] && <span className="text-sm text-red-400 mt-1">{errors[name]}</span>}
            </div>
          ))}

          <button
            onClick={handleSignup}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-md font-semibold transition duration-200"
          >
            Sign Up
          </button>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px bg-gray-600 w-full" />
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px bg-gray-600 w-full" />
          </div>

          <button
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center gap-3 w-full border border-gray-600 py-3 rounded-md text-sm hover:bg-gray-800 transition"
          >
            <FcGoogle className="text-xl" /> Sign up with Google
          </button>

          <p className="text-sm text-center text-gray-400 mt-4">
            Already have an account?{' '}
            <span
              onClick={() => router.push('/login')}
              className="text-indigo-400 cursor-pointer hover:underline"
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
