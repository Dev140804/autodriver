'use client';

import React, { useEffect } from 'react';

type RidePopupProps = {
  pickup: string;
  destination: string;
  fare: string;
  type?: string; // "private", "shared", or "sharing"
  onAccept: () => void;
  onReject: () => void;
};

export default function RidePopup({
  pickup,
  destination,
  fare,
  type,
  onAccept,
  onReject,
}: RidePopupProps) {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onReject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReject]);

  // Normalize and format ride type
  const normalizedType = type?.toLowerCase();
  const rideTypeText =
    normalizedType === 'private'
      ? '🔴 Private Auto'
      : normalizedType === 'shared' || normalizedType === 'sharing'
      ? '🟢 Shared Auto'
      : undefined;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ride-popup-title"
    >
      <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl space-y-5 border border-gray-200 dark:border-gray-700 animate-scale-in">
        <h2
          id="ride-popup-title"
          className="text-2xl font-bold text-center text-[var(--primary-color)]"
        >
          🚖 New Ride Request
        </h2>

        <div className="space-y-2 text-base sm:text-lg">
          <p>
            <strong>Pickup:</strong> {pickup}
          </p>
          <p>
            <strong>Destination:</strong> {destination}
          </p>
          <p>
            <strong>Fare:</strong>{' '}
            <span className="text-green-600 dark:text-green-400 font-semibold">
              {fare}
            </span>
          </p>
          {rideTypeText && (
            <p>
              <strong>Ride Type:</strong>{' '}
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {rideTypeText}
              </span>
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-between pt-4">
          <button
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-lg font-medium transition-colors"
            onClick={onReject}
          >
            ❌ Reject
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-lg font-medium transition-colors"
            onClick={onAccept}
          >
            ✅ Accept
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}