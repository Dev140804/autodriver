'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRide } from '@/context/RideContext';
import RidePopup from '@/components/maps/RidePopup';

type DriverUser = { name?: string };

type RideReq = {
  device: string;
  pickup: string;
  destination: string;
  fare: string;
  type?: 'private' | 'shared' | 'sharing';
  timestamp?: number;
  rideId?: string;
  offerExpiresAt?: number; // backend TTL
};

type QueuedRide = RideReq & { _id: string };

const ONLINE_KEY = 'driver-online';
const POLL_MS = 1000;
const POPUP_DURATION_MS = 5000;

export default function GlobalRideWatcher() {
  const _rideCtx = useRide();
  void _rideCtx;

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<DriverUser | null>(null);
  const [online, setOnline] = useState<boolean>(false);

  const [queue, setQueue] = useState<QueuedRide[]>([]);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastUserJSON = useRef<string | null>(null);

  // Track current offer key so we never enqueue the same one twice
  const currentKeyRef = useRef<string | null>(null);

  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, ''),
    []
  );

  useEffect(() => setMounted(true), []);

  // Keep user & online in sync (same-tab + cross-tab)
  useEffect(() => {
    const readState = () => {
      const rawUser = localStorage.getItem('driver-user');
      if (rawUser !== lastUserJSON.current) {
        lastUserJSON.current = rawUser;
        setUser(rawUser ? JSON.parse(rawUser) : null);
      }

      const onRaw = localStorage.getItem(ONLINE_KEY);
      const isOnline = onRaw === 'true';

      setOnline(!!rawUser && isOnline);
      if (!rawUser && isOnline) {
        localStorage.setItem(ONLINE_KEY, 'false');
      }
    };

    readState();

    const authCheck = setInterval(readState, 1000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'driver-user' || e.key === ONLINE_KEY) readState();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      clearInterval(authCheck);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Notify backend of driver online/offline
  useEffect(() => {
    if (!apiBase || !user?.name) return;
    fetch(`${apiBase}/api/driver-online`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverName: user.name, online }),
    }).catch((e) => console.error('online sync error', e));
  }, [apiBase, user, online]);

  // Poll only when logged in & online
  useEffect(() => {
    if (!apiBase || !user || !online) {
      stopPolling();
      setQueue([]);
      currentKeyRef.current = null;
      return;
    }

    const fetchLatest = async () => {
      try {
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        const url = `${apiBase}/api/latest-ride?driverName=${encodeURIComponent(
          user.name || ''
        )}`;
        const res = await fetch(url, {
          signal: abortRef.current.signal,
        });

        if (res.status === 204) {
          return; // keep polling
        }
        if (!res.ok) return;

        const data: RideReq = await res.json();
        const baseId = data.rideId ?? `${data.device}-${data.timestamp}`;
        if (!baseId) return;

        // Use offerExpiresAt to differentiate re-offers for the same ride
        const offerKey = `${baseId}-${data.offerExpiresAt ?? 0}`;

        // If it's the same offer we're already showing, ignore
        if (currentKeyRef.current === offerKey) return;

        currentKeyRef.current = offerKey;

        // Always keep only ONE popup in the queue
        setQueue([{ ...data, _id: offerKey }]);
      } catch (e: unknown) {
        const err = e as { name?: string };
        if (err?.name !== 'AbortError') console.error('poll error', e);
      }
    };

    fetchLatest();
    pollIntervalRef.current = setInterval(fetchLatest, POLL_MS);

    return () => stopPolling();
  }, [apiBase, user, online]);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
  };

  const clearCurrent = () => {
    setQueue([]);
    currentKeyRef.current = null;
  };

  const acceptTop = async () => {
    const current = queue[0];
    if (!current || !apiBase || !user?.name) return;

    clearCurrent();

    try {
      const res = await fetch(`${apiBase}/api/ride-accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device: current.device,
          driverName: user.name,
          rideId: current.rideId,
        }),
      });

      if (res.status === 408) {
        console.log('⏰ Offer already expired (408).');
      } else if (!res.ok) {
        console.error('❌ accept error', await res.text());
      }
    } catch (e: unknown) {
      console.error('❌ accept error', e);
    }
  };

  const rejectTop = async (timeout = false) => {
    const current = queue[0];
    if (!current || !apiBase || !user?.name) return;

    clearCurrent();

    try {
      const endpoint = timeout ? 'ride-timeout' : 'ride-reject';
      await fetch(`${apiBase}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device: current.device,
          rideId: current.rideId,
          driverName: user.name,
        }),
      });
    } catch (e: unknown) {
      console.error('❌ reject/timeout error', e);
    }
  };

  const canPortal =
    mounted && typeof window !== 'undefined' && typeof document !== 'undefined';

  if (!canPortal || !user || !online || queue.length === 0) return null;

  const active = queue[0];
  const waiting = queue.slice(1);

  const now = Date.now();
  const remainingMs =
    active.offerExpiresAt && active.offerExpiresAt > now
      ? active.offerExpiresAt - now
      : POPUP_DURATION_MS;

  return createPortal(
    <div className="fixed bottom-4 inset-x-0 z-[9999] flex flex-col items-center space-y-2">
      <RidePopup
        key={active._id}
        pickup={active.pickup}
        destination={active.destination}
        fare={active.fare}
        type={active.type}
        onAccept={acceptTop}
        onReject={() => rejectTop(false)}
        durationMs={remainingMs}
        onTimeout={() => rejectTop(true)}
        showBackdrop={waiting.length === 0}
      />
    </div>,
    document.body
  );
}