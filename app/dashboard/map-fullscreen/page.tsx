'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const LiveMap = dynamic(() => import('@/components/maps/LiveMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-sm opacity-60">
      Loading map...
    </div>
  ),
});

export default function FullscreenMapPage() {
  const router = useRouter();
  const [pickup, setPickup] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('driver-theme') as 'dark' | 'bright' | 'simple') || 'simple';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const storedPickup = localStorage.getItem('last-pickup');
    if (storedPickup) {
      setPickup(JSON.parse(storedPickup));
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-color)] relative">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-[1000] p-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full shadow-md text-[var(--text-muted)] hover:text-[var(--primary-color)]"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="w-full h-screen">
        {pickup ? (
          <LiveMap pickupLat={pickup.lat} pickupLng={pickup.lng} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm opacity-70">
            Fetching pickup location...
          </div>
        )}
      </div>
    </div>
  );
}
