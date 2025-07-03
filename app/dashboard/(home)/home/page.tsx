'use client';

import { useEffect, useRef, useState } from 'react';

type DriverUser = {
  name?: string;
};

export default function DriverHomePage() {
  const [user, setUser] = useState<DriverUser | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const localUser = localStorage.getItem('driver-user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('Geolocation permission denied or unavailable:', err.message);
      }
    );
  }, []);

  useEffect(() => {
    if (location && window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        disableDefaultUI: true,
      });

      new window.google.maps.Marker({
        position: location,
        map,
        title: 'You are here',
      });
    }
  }, [location]);

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-black text-white px-4">
        <p className="text-center text-gray-400">You are not logged in.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-indigo-400">
            Hey, {user.name?.split(' ')[0] || 'Driver'} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-2">Ready to hit the road?</p>
        </div>

        <section className="bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-xl p-6">
          <h2 className="text-lg font-medium mb-4 text-indigo-300">📍 Live Location</h2>
          <div
            ref={mapRef}
            className="w-full h-[400px] rounded-lg border border-gray-700"
          />
        </section>
      </div>
    </main>
  );
}