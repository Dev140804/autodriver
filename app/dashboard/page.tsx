'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type DriverUser = {
  name?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DriverUser | null>(null);
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('driver-user');
    if (!stored) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(pos.coords),
        (err) => console.error('Geolocation error:', err)
      );
    }
  }, [router]);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">
        Welcome, {user?.name?.split(' ')[0] || 'Driver'} 👋
      </h1>

      <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">📍 Your Location</h2>
        {location ? (
          <p className="text-sm text-gray-300">
            Latitude: <strong>{location.latitude}</strong> <br />
            Longitude: <strong>{location.longitude}</strong>
          </p>
        ) : (
          <p className="text-sm text-gray-400">Fetching location...</p>
        )}
      </div>

      <div className="h-64 w-full bg-gray-700 flex items-center justify-center rounded-lg border border-gray-600">
        <p className="text-gray-400">[Map Placeholder]</p>
      </div>
    </div>
  );
}