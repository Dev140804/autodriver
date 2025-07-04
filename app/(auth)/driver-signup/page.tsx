'use client';
export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState('simple');

  useEffect(() => {
    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Only allow digits for phone
    if (name === 'phone' && value && !/^\d*$/.test(value)) return;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const { name, email, phone, username, password } = form;

    const users = JSON.parse(localStorage.getItem('driver-users') || '[]') as DriverUser[];

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      newErrors.email = 'Only valid Gmail addresses allowed';
    } else if (users.some((u) => u.email === email)) {
      newErrors.email = 'This Gmail is already registered';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    } else if (users.some((u) => u.phone === phone)) {
      newErrors.phone = 'This phone number is already registered';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (users.some((u) => u.username === username)) {
      newErrors.username = 'Username already exists';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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

  // 🔥 Box Arrow Button Styles
  const boxArrowClasses =
    theme === 'dark'
      ? 'bg-black text-white hover:bg-white hover:text-black cursor-pointer'
      : theme === 'bright'
      ? 'bg-white text-black hover:bg-black hover:text-white cursor-pointer'
      : 'bg-[var(--primary-color)] text-[var(--button-text)] hover:bg-[var(--primary-hover)] cursor-pointer';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300 px-4 py-10">
      <div className="w-full max-w-lg bg-[var(--card-bg)] backdrop-blur-md p-10 rounded-2xl shadow-lg border border-[var(--border-color)]">
        <h1 className="text-3xl font-semibold text-center text-[var(--primary-color)] mb-8">
          Create Driver Account
        </h1>

        <div className="space-y-6">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="bhawna"
              className="w-full px-4 py-2 bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            {errors.name && <span className="text-sm text-red-500 mt-1">{errors.name}</span>}
          </div>

          {/* Gmail */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm mb-1">Gmail Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            {errors.email && <span className="text-sm text-red-500 mt-1">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm mb-1">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit number"
              className="w-full px-4 py-2 bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            {errors.phone && <span className="text-sm text-red-500 mt-1">{errors.phone}</span>}
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm mb-1">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-full px-4 py-2 bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            {errors.username && <span className="text-sm text-red-500 mt-1">{errors.username}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2 pr-10 bg-[var(--card-bg)] text-[var(--text-color)] rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--text-color)] hover:text-[var(--primary-color)] cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="text-sm text-red-500 mt-1">{errors.password}</span>}
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSignup}
            className={`w-full py-3 rounded-lg font-semibold border border-[var(--border-color)] transition-colors duration-300 ${boxArrowClasses}`}
          >
            Sign Up
          </button>

          {/* Already have account */}
          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <span
              onClick={() => router.push('/login')}
              className="text-[var(--primary-color)] cursor-pointer hover:underline"
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
