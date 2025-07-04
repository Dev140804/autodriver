'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Expand } from 'lucide-react'; // ✅ Fullscreen box icon

type DriverUser = {
  name?: string;
};

const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false });

export default function DriverHomePage() {
  const [user, setUser] = useState<DriverUser | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 28.6139,
    lng: 77.209,
  });
  const [theme, setTheme] = useState<'dark' | 'bright' | 'simple'>('simple');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem('driver-user');
    if (localUser) setUser(JSON.parse(localUser));

    const savedTheme = (localStorage.getItem('driver-theme') as 'dark' | 'bright' | 'simple') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('Initial geolocation error:', err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('Watching geolocation error:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const mapCenter = useMemo(() => location, [location]);

  if (!loaded || !user) {
    return (
      <main className="flex items-center justify-center min-h-screen transition-colors duration-300 bg-[var(--bg-color)] text-[var(--text-color)]">
        <p className="text-center opacity-70">Loading user...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen transition-colors duration-300 px-6 py-10 bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Greeting */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-[var(--primary-color)]">
            Hey, {user.name?.split(' ')[0] || 'Driver'} 👋
          </h1>
          <p className="text-sm mt-2 text-[var(--text-muted)]">Ready to hit the road?</p>
        </div>

        {/* Live Map Section */}
        <section className="rounded-2xl shadow-2xl backdrop-blur-xl p-6 transition-colors duration-300 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[var(--primary-color-light)]">📍 Live Location</h2>
            <a
              href="/dashboard/map-fullscreen"
              title="Open Fullscreen Map"
              className="p-2 rounded-md hover:bg-[var(--hover-bg)] hover:opacity-80 transition"
            >
              <Expand size={20} className="text-[var(--primary-color)]" />
            </a>
          </div>

          <div className="w-full h-[400px] rounded-lg border overflow-hidden border-[var(--border-color)]">
            <LiveMap lat={mapCenter.lat} lng={mapCenter.lng} theme={theme} />
          </div>
        </section>
      </div>
    </main>
  );
}