'use client';

import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useMap, ZoomControl } from 'react-leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

// Fix Leaflet icon issue
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  });
}

interface LiveMapProps {
  theme: 'dark' | 'bright' | 'simple';
}

function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  const handleClick = () => {
    map.flyTo([lat, lng], 15, { animate: true, duration: 1.3 });
  };

  return <Marker position={[lat, lng]} eventHandlers={{ click: handleClick }} />;
}

export default function LiveMap({ theme }: LiveMapProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Load fast fallback on first render
  useEffect(() => {
    const stored = localStorage.getItem('last-known-location');
    if (stored) {
      setLocation(JSON.parse(stored));
    }
  }, []);

  // Start live tracking in background
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        localStorage.setItem('last-known-location', JSON.stringify(newLoc));
        setLocation(newLoc);
      },
      (err) => {
        console.error('Geolocation error:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!location) return null;

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={15}
      scrollWheelZoom={true}
      attributionControl={false} // ✅ removes Leaflet text
      zoomControl={false} // ✅ disables default top-left zoom buttons
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url={
          theme === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : theme === 'bright'
              ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        }
        attribution="" // ✅ hide attribution text
      />
      <FlyToMarker lat={location.lat} lng={location.lng} />
      <ZoomControl position="bottomright" /> {/* ✅ new zoom control position */}
    </MapContainer>
  );
}