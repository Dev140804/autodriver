'use client';

export default function RidesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md bg-gray-900/70 p-8 rounded-2xl shadow-lg border border-gray-800">
        <div className="mb-6">
          <svg
            className="mx-auto h-20 w-20 text-indigo-500"
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
        <h1 className="text-2xl font-bold mb-2 text-indigo-400">No Rides Yet</h1>
        <p className="text-gray-400 text-sm">
          You haven’t completed any rides yet. Once you start accepting rides, they will appear here.
        </p>
      </div>
    </div>
  );
}