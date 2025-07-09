'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type RideRequest = {
  device: string;
  pickup: string;
  destination: string;
  fare: string;
};

type RideContextType = {
  request: RideRequest | null;
  setRequest: (request: RideRequest | null) => void;
};

const RideContext = createContext<RideContextType | undefined>(undefined);

export function RideProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<RideRequest | null>(null);

  return (
    <RideContext.Provider value={{ request, setRequest }}>
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
}