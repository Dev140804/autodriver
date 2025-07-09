'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Expand } from 'lucide-react';
import RidePopup from '@/components/RidePopup';

type DriverUser = {
  name?: string;
};

type RideRequest = {
  device: string;
  pickup: string;
  destination: string;
  fare: string;
  lat?: number;
  lng?: number;
  type?: 'private' | 'shared'; // ✅ New: ride type
};

const LiveMap = dynamic(() => import('@/components/LiveMap'), { ssr: false });

export default function DriverHomePage() {
  const [user, setUser] = useState<DriverUser | null>(null);
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi
  const [theme, setTheme] = useState<'dark' | 'bright' | 'simple'>('simple');
  const [loaded, setLoaded] = useState(false);
  const [incomingRide, setIncomingRide] = useState<RideRequest | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  console.log('🌐 API Base URL:', apiBase);

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
      console.warn('Geolocation is not available');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn('Initial geolocation error:', err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn('Watching geolocation error:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!apiBase) {
      console.error('❌ API Base URL is not set');
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${apiBase}/api/latest-ride`);
        if (res.status === 200) {
          const data = await res.json();
          console.log('📥 Incoming ride:', data);
          setIncomingRide(data);
        } else if (res.status === 204) {
          setIncomingRide(null);
          console.log('ℹ️ No new ride available.');
        } else {
          console.warn(`⚠️ Unexpected response: ${res.status}`);
          setIncomingRide(null);
        }
      } catch (err) {
        console.error('❌ Failed to fetch latest ride:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [apiBase]);

  const handleAccept = async () => {
    if (!incomingRide?.device || !apiBase) return;

    alert('✅ Ride accepted');

    try {
      await fetch(`${apiBase}/api/ride-accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device: incomingRide.device }),
      });
    } catch (err) {
      console.error('❌ Failed to notify backend (accept):', err);
    }

    const origin = `${location.lat},${location.lng}`;
    const destination = incomingRide.lat && incomingRide.lng
      ? `${incomingRide.lat},${incomingRide.lng}`
      : encodeURIComponent(incomingRide.pickup || '');

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(mapsUrl, '_blank');

    setIncomingRide(null);
  };

  const handleReject = async () => {
    if (!incomingRide?.device || !apiBase) return;

    alert('❌ Ride rejected');

    try {
      await fetch(`${apiBase}/api/ride-reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device: incomingRide.device }),
      });
    } catch (err) {
      console.error('❌ Failed to notify backend (reject):', err);
    }

    setIncomingRide(null);
  };

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
          <p className="text-sm mt-2 text-[var(--text-muted)]">Ready to hit the road?</p>
        </div>

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

      {incomingRide && (
        <RidePopup
          pickup={incomingRide.pickup}
          destination={incomingRide.destination}
          fare={incomingRide.fare}
          type={incomingRide.type} // ✅ Pass type to popup
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </main>
  );
}