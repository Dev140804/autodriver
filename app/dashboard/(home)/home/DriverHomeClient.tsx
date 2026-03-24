'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Expand } from 'lucide-react';

type DriverUser = {
  name?: string;
};

const ONLINE_KEY = 'driver-online';

const LiveMap = dynamic(() => import('@/components/maps/LiveMap'), {
  ssr: false,
});

export default function DriverHomePage() {
  const [user, setUser] = useState<DriverUser | null>(null);
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [theme, setTheme] = useState<'dark' | 'bright' | 'simple'>('simple');
  const [loaded, setLoaded] = useState(false);

  const [online, setOnline] = useState(false);

  const [pickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Load user + theme + online
  useEffect(() => {
    const localUser = localStorage.getItem('driver-user');
    if (localUser) setUser(JSON.parse(localUser));

    const savedTheme =
      (localStorage.getItem('driver-theme') as 'dark' | 'bright' | 'simple') ||
      'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const onlineRaw = localStorage.getItem(ONLINE_KEY);
    setOnline(onlineRaw === 'true');

    setLoaded(true);
  }, []);

  // Sync from other tabs / logout
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'driver-user') {
        const raw = localStorage.getItem('driver-user');
        const hasUser = !!raw;
        setUser(hasUser ? JSON.parse(raw!) : null);

        if (!hasUser) {
          localStorage.setItem(ONLINE_KEY, 'false');
          setOnline(false);
        }
      }
      if (e.key === ONLINE_KEY) {
        const v = localStorage.getItem(ONLINE_KEY) === 'true';
        setOnline(v);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleOnline = () => {
    const next = !online;
    setOnline(next);
    localStorage.setItem(ONLINE_KEY, String(next));
  };

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn('Geolocation error:', err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn('Watch geolocation error:', err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
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
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-[var(--primary-color)]">
            Hey, {user.name?.split(' ')[0] || 'Driver'} 👋
          </h1>
          <p className="text-sm mt-2 text-[var(--text-muted)]">
            Ready to hit the road?
          </p>
        </div>

        {/* Online / Offline Slide Button with text INSIDE */}
        <div className="flex items-center justify-center">
          <button
            onClick={toggleOnline}
            aria-pressed={online}
            aria-label="Toggle online status"
            className={`relative inline-flex h-9 w-28 items-center rounded-full transition-colors focus:outline-none select-none ${
              online ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {/* Text inside the button */}
            <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium pointer-events-none">
              {online ? 'Online' : 'Offline'}
            </span>

            {/* Handle/Knob */}
            <span
              className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-white transition-transform ${
                online ? 'translate-x-[76px]' : 'translate-x-0'
              }`}
              style={{ willChange: 'transform' }}
            />
          </button>
        </div>

        <section className="rounded-2xl shadow-2xl backdrop-blur-xl p-6 transition-colors duration-300 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[var(--primary-color-light)]">
              📍 Live Location
            </h2>
            <a
              href="/dashboard/map-fullscreen"
              title="Open Fullscreen Map"
              className="p-2 rounded-md hover:bg-[var(--hover-bg)] hover:opacity-80 transition"
            >
              <Expand size={20} className="text-[var(--primary-color)]" />
            </a>
          </div>

          <div className="w-full h-[400px] rounded-lg border overflow-hidden border-[var(--border-color)]">
            <LiveMap
              center={mapCenter}
              theme={theme}
              pickupLat={pickupCoords?.lat}
              pickupLng={pickupCoords?.lng}
              destinationLat={dropCoords?.lat}
              destinationLng={dropCoords?.lng}
            />
          </div>
        </section>
      </div>
    </main>
  );
}