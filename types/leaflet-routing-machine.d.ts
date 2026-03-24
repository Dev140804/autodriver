declare module 'leaflet-routing-machine' {
  import * as L from 'leaflet';

  namespace Routing {
    interface RoutingOptions {
      waypoints: L.LatLng[];
      routeWhileDragging?: boolean;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      showAlternatives?: boolean;
      fitSelectedRoutes?: boolean;
      createMarker?: (
        i: number,
        waypoint: { latLng: L.LatLng }
      ) => L.Marker;
    }

    interface RoutingPlan {
      // Add minimal typing to satisfy TypeScript
      getWaypoints: () => L.LatLng[];
    }

    class Control extends L.Control {
      constructor(options?: RoutingOptions);
      getPlan(): RoutingPlan;
    }

    function control(options?: RoutingOptions): Control;
  }

  export = Routing;
}