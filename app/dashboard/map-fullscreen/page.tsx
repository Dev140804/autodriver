'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

// Lazy load the map with suspense fallback
const LiveMap = dynamic(() => import('@/components/LiveMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-sm opacity-60">
      Loading map...
    </div>
  ),
});

export default function FullscreenMapPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [theme, setTheme] = useState<'dark' | 'bright' | 'simple'>('simple');
  const router = useRouter();

  // On mount: load theme + fallback location + start live tracking
  useEffect(() => {
    const savedTheme = (localStorage.getItem('driver-theme') as 'dark' | 'bright' | 'simple') || 'simple';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);

    const stored = localStorage.getItem('last-known-location');
    if (stored) {
      setLocation(JSON.parse(stored));
    }

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const current = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(current);
          localStorage.setItem('last-known-location', JSON.stringify(current));
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 7000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] relative">
      {/* Back Arrow */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-[1000] p-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full shadow-md text-[var(--text-muted)] hover:text-[var(--primary-color)]"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Map */}
      <div className="w-full h-screen">
        {location ? (
          <LiveMap lat={location.lat} lng={location.lng} theme={theme} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm opacity-70">
            Fetching current location...
          </div>
        )}
      </div>
    </div>
  );
}