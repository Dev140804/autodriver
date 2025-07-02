'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const sessionUser = localStorage.getItem('driver-session');
    if (!sessionUser) {
      router.push('/driver-login');
    } else {
      setUsername(sessionUser);
      setTimeout(() => {
        router.push('/dashboard/home');
      }, 2500); // wait 2.5 seconds before going to dashboard
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center animate-fadeIn">
        <h1 className="text-4xl font-bold mb-2">Welcome,</h1>
        <h2 className="text-3xl font-semibold text-blue-400">{username}</h2>
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-in-out;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}