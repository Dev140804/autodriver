'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function Home() {
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    const sessionUser = localStorage.getItem('driver-session');
    if (sessionUser) setUsername(sessionUser);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (err) => console.error('Geolocation error:', err),
      { enableHighAccuracy: true }
    );
  }, []);

  if (!isLoaded) return <div className="text-white p-4">Loading Map...</div>;

  return (
    <div className="p-4 text-white bg-gray-900 h-full">
      <h1 className="text-2xl mb-4">Welcome, {username}</h1>

      <div className="mb-4">
        {location ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={location}
            zoom={15}
          >
            <Marker position={location} />
          </GoogleMap>
        ) : (
          <p>Fetching location...</p>
        )}
      </div>
    </div>
  );
}