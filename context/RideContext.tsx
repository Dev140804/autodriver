// context/RideContext.tsx ✅ FIXED
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a ride request
export type RideRequest = {
  device: string;
  pickup: string;
  destination: string;
  fare: string;
};

// Define the context type
export type RideContextType = {
  request: RideRequest | null;
  setRequest: (request: RideRequest | null) => void;
};

// Create the context
const RideContext = createContext<RideContextType | undefined>(undefined);

// Provider component
export function RideProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<RideRequest | null>(null);

  return (
    <RideContext.Provider value={{ request, setRequest }}>
      {children}
    </RideContext.Provider>
  );
}

// Hook to use the ride context
export function useRide() {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
}