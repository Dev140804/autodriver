'use client';

import { useEffect, useRef, useState } from 'react';

type DriverUser = {
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
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
        console.error('Geolocation error:', err);
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
        title: 'Your Location',
      });
    }
  }, [location]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-indigo-400">
          Welcome, {user.name?.split(' ')[0] || 'Driver'} 👋
        </h1>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">📍 Current Location</h2>
          <div
            ref={mapRef}
            className="w-full h-[400px] rounded-lg border border-gray-700"
          />
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">👤 Driver Info</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}