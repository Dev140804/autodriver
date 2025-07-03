'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function AboutInfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#111827] text-white flex justify-center items-center px-4">
      <div className="max-w-md w-full bg-[#1f2937] p-6 rounded-xl shadow-xl border border-gray-700 space-y-4 relative">
        
        {/* Back Arrow */}
        <button
          onClick={() => router.push('/dashboard/settings')}
          title="Back to Settings"
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center text-indigo-400">About the App</h1>

        {/* Info List */}
        <ul className="text-gray-300 text-sm space-y-2 mt-2">
          <li><span className="text-white">Version:</span> 1.0.0</li>
          <li><span className="text-white">Built With:</span> Next.js 15, TailwindCSS, TypeScript</li>
          <li><span className="text-white">Storage:</span> LocalStorage Based</li>
          <li><span className="text-white">Mode:</span> Driver-side Demo Version</li>
          <li><span className="text-white">Features:</span> Offline UI, Ride Management, Earnings Tracking</li>
        </ul>
      </div>
    </div>
  );
}