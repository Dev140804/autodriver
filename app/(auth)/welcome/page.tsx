'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


type DriverUser = {
  name?: string;
};

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<DriverUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('driver-user');

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      const timeout = setTimeout(() => {
        router.push('/dashboard/home');
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-4">
      <div className="max-w-md w-full text-center p-10 rounded-3xl shadow-2xl bg-gray-900/80 border border-gray-800 backdrop-blur animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-indigo-500 mb-4 animate-pulse-slow">Welcome</h1>
        <p className="text-lg sm:text-xl text-gray-300">
          Hello <span className="font-semibold text-white">{user?.name || 'Driver'}</span>, we’re preparing your dashboard.
        </p>

        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500">Redirecting in a moment...</span>
          <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}