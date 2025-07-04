'use client';


import { useEffect, useState } from 'react';
// ... rest of imports
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's missing marker icon issue in Next.js
delete (L.Icon.Default as unknown as { prototype: { _getIconUrl?: () => string } }).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

type DriverUser = {
  name?: string;
};

export default function DriverHomePage() {
  const [user, setUser] = useState<DriverUser | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [theme, setTheme] = useState('simple');

  // Load user and theme
  useEffect(() => {
    const localUser = localStorage.getItem('driver-user');
    if (localUser) setUser(JSON.parse(localUser));

    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Track location continuously
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!user) {
    return (
      <main
        className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-black text-white'
            : theme === 'bright'
            ? 'bg-white text-black'
            : 'bg-[var(--bg-color)] text-[var(--text-color)]'
        }`}
      >
        <p className="text-center opacity-70">You are not logged in.</p>
      </main>
    );
  }

  // Theme-based classes
  const bgClasses =
    theme === 'dark'
      ? 'bg-black text-white'
      : theme === 'bright'
      ? 'bg-white text-black'
      : 'bg-[var(--bg-color)] text-[var(--text-color)]';

  const cardClasses =
    theme === 'dark'
      ? 'bg-black border border-gray-700 text-white'
      : theme === 'bright'
      ? 'bg-gray-50 border border-gray-300 text-black'
      : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)]';

  const heyDriverClasses =
    theme === 'dark'
      ? 'text-indigo-400'
      : theme === 'bright'
      ? 'text-indigo-600'
      : 'text-[var(--primary-color)]';

  const subTextClasses =
    theme === 'dark'
      ? 'text-gray-400'
      : theme === 'bright'
      ? 'text-gray-600'
      : 'text-[var(--text-muted)]';

  const sectionHeadingClasses =
    theme === 'dark'
      ? 'text-white'
      : theme === 'bright'
      ? 'text-black'
      : 'text-[var(--primary-color-light)]';

  const borderClasses =
    theme === 'dark'
      ? 'border-gray-700'
      : theme === 'bright'
      ? 'border-gray-300'
      : 'border-[var(--border-color)]';

  return (
    <main className={`min-h-screen transition-colors duration-300 px-6 py-10 ${bgClasses}`}>
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className={`text-3xl font-semibold ${heyDriverClasses}`}>
            Hey, {user.name?.split(' ')[0] || 'Driver'} 👋
          </h1>
          <p className={`text-sm mt-2 ${subTextClasses}`}>Ready to hit the road?</p>
        </div>

        {/* Location Card */}
        <section
          className={`rounded-2xl shadow-2xl backdrop-blur-xl p-6 transition-colors duration-300 ${cardClasses}`}
        >
          <h2 className={`text-lg font-medium mb-4 ${sectionHeadingClasses}`}>📍 Live Location</h2>

          <div className={`w-full h-[400px] rounded-lg border overflow-hidden ${borderClasses}`}>
            {location ? (
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>You are here</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-500">
                Loading map...
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}