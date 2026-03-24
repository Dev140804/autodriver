'use client';

import { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from '@react-google-maps/api';

type LiveMapProps = {
  center?: { lat: number; lng: number };
  theme?: 'simple' | 'dark' | 'bright';
  pickupLat?: number;
  pickupLng?: number;
  destinationLat?: number;
  destinationLng?: number;
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const libraries: Array<'places' | 'geometry' | 'drawing' | 'visualization'> = ['places'];

export default function LiveMap({
  center,
  theme = 'simple',
  pickupLat,
  pickupLng,
  destinationLat,
  destinationLng,
}: LiveMapProps) {
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [hasAcceptedRide, setHasAcceptedRide] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  // 🧭 Watch location and re-route if navigating
  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentLocation(newLoc);

          // 🚗 Auto-pan only before ride is accepted
          if (mapRef.current && !hasAcceptedRide && !center) {
            mapRef.current.panTo(newLoc);
          }

          // 🚀 Auto reroute if ride accepted
          if (hasAcceptedRide && pickupLat && pickupLng) {
            fetchRoute(newLoc);
          }
        },
        (err) => console.error('Geolocation error:', err.message),
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 5000 }
      );
    }

    return () => navigator.geolocation.clearWatch(watchId);
  }, [hasAcceptedRide, pickupLat, pickupLng]);

  // 🔁 Fetch route (reused in start + live update)
  const fetchRoute = (fromLocation: google.maps.LatLngLiteral) => {
    if (!fromLocation || !pickupLat || !pickupLng) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: fromLocation,
        destination: { lat: pickupLat, lng: pickupLng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  const handleStartNavigation = () => {
    if (!currentLocation) return;
    setHasAcceptedRide(true);
    fetchRoute(currentLocation);
  };

  if (!isLoaded || !currentLocation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full theme-${theme}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || currentLocation}
        zoom={15}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        <Marker position={currentLocation} label="You" />
        {hasAcceptedRide && pickupLat && pickupLng && (
          <Marker position={{ lat: pickupLat, lng: pickupLng }} label="Pickup" />
        )}
        {hasAcceptedRide && destinationLat && destinationLng && (
          <Marker position={{ lat: destinationLat, lng: destinationLng }} label="Drop" />
        )}
        {hasAcceptedRide && directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {!hasAcceptedRide && (
        <button
          onClick={handleStartNavigation}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700"
        >
          Start Navigation
        </button>
      )}
    </div>
  );
}