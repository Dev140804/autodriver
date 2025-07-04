'use client';

import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 28.6139, // Delhi
  lng: 77.2090,
};

const Map = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md border border-[var(--border-color)] bg-[var(--card-bg)]">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
        >
          {/* Add markers/directions here */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;