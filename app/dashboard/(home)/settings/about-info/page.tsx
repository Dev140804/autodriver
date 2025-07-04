'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function AboutInfoPage() {
  const router = useRouter();

  useEffect(() => {
    // ✅ Apply saved theme directly without remapping
    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex justify-center items-start pt-24 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-[var(--card-bg)] p-6 rounded-xl shadow-xl border border-[var(--border-color)] space-y-4 relative">
        
        {/* Back Arrow */}
        <button
          onClick={() => router.push('/dashboard/settings')}
          title="Back to Settings"
          className="absolute top-4 left-4 text-[var(--text-muted)] hover:text-[var(--primary-color)] transition cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center text-[var(--primary-color)]">About the App</h1>

        {/* Info List */}
        <ul className="text-[var(--text-muted)] text-sm space-y-2 mt-2">
          <li><span className="text-[var(--text-color)]">Version:</span> 1.0.0</li>
          <li><span className="text-[var(--text-color)]">Built With:</span> Next.js 15, TailwindCSS, TypeScript</li>
          <li><span className="text-[var(--text-color)]">Storage:</span> LocalStorage Based</li>
          <li><span className="text-[var(--text-color)]">Mode:</span> Driver-side Demo Version</li>
          <li><span className="text-[var(--text-color)]">Features:</span> Offline UI, Ride Management, Earnings Tracking</li>
        </ul>
      </div>
    </div>
  );
}
