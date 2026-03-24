'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

type RoutingProps = {
  from: [number, number];
  to: [number, number];
};

// Type guard to detect _routes on a layer
function hasRoutes(layer: L.Layer): layer is L.Layer & { _routes: unknown } {
  return '_routes' in layer;
}

export default function Routing({ from, to }: RoutingProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let routingControl: L.Control;

    const loadRouting = async () => {
      const LRM = await import('leaflet-routing-machine');

      routingControl = LRM.default.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        createMarker: (i, wp) =>
          L.marker(wp.latLng, {
            icon: L.icon({
              iconUrl:
                i === 0
                  ? 'https://cdn-icons-png.flaticon.com/512/684/684908.png'
                  : 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            }),
          }),
      });

      routingControl.addTo(map);
    };

    loadRouting();

    return () => {
      map.eachLayer((layer) => {
        if (hasRoutes(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [from, to, map]);

  return null;
}