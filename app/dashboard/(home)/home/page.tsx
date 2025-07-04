'use client';

import { useEffect, useRef, useState } from 'react';

type DriverUser = {
  name?: string;
};

export default function DriverHomePage() {
  const [user, setUser] = useState<DriverUser | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [theme, setTheme] = useState('simple');
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const localUser = localStorage.getItem('driver-user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
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

  // 🎨 Dynamic Classes
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
          <div
            ref={mapRef}
            className={`w-full h-[400px] rounded-lg border ${borderClasses}`}
          />
        </section>
      </div>
    </main>
  );
}
