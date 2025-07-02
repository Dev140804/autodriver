'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    const sessionUser = localStorage.getItem('driver-session');
    if (sessionUser) setUsername(sessionUser);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(pos.coords);
      });
    }
  }, []);

  return (
    <div className="p-4 text-white bg-gray-900 h-full">
      <h1 className="text-2xl mb-4">Welcome, {username}</h1>

      <div className="mb-4 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Your Location</h2>
        {location ? (
          <p>Lat: {location.latitude} | Lng: {location.longitude}</p>
        ) : (
          <p>Fetching location...</p>
        )}
      </div>

      <div className="h-64 w-full bg-gray-x700 flex items-center justify-center rounded">
        <p className="text-gray-400">[Map Placeholder]</p>
      </div>
    </div>
  );
}