'use client';

export default function AboutInfoPage() {
  return (
    <div className="min-h-screen bg-[#111827] text-white flex justify-center items-start pt-24 px-4">
      <div className="max-w-md w-full bg-[#1f2937] p-6 rounded-xl shadow-xl border border-gray-700 space-y-4">
        <h1 className="text-xl font-semibold text-center text-indigo-400">About the App</h1>
        <ul className="text-gray-300 text-sm space-y-2">
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