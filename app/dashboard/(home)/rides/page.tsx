'use client';

export default function RidesPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-[#0f0f0f] via-black to-[#1a1a1a] text-white">
      <section className="w-full max-w-md bg-[#1f2937]/90 p-10 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-indigo-500/10 p-4 rounded-full">
            <svg
              className="w-14 h-14 text-indigo-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5h7.5m-10.5 3h13.5M3 9.75h18m-1.5 0v7.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 17.25v-7.5"
              />
            </svg>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-indigo-400">No Rides Completed</h1>
            <p className="text-sm text-gray-400">
              When you start completing rides, they’ll appear here with details like pickup, drop, and fare.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}