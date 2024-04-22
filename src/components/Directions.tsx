import { useEffect, useState } from "react";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const Directions = () => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  // Use directions service
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: { lat: -1.939826787816454, lng: 30.0445426438232 },
        destination: { lat: -1.9365670876910166, lng: 30.13020167024439 },
        waypoints: [
          { location: { lat: -1.9355377074007851, lng: 30.060163829002217 } },
          { location: { lat: -1.9358808342336546, lng: 30.08024820994666 } },
          { location: { lat: -1.9489196023037583, lng: 30.092607828989397 } },
          { location: { lat: -1.9592132952818164, lng: 30.106684061788073 } },
          { location: { lat: -1.9487480402200394, lng: 30.126596781356923 } },
        ],
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer]);

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <div className="directions">
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>

      <h2>Other Routes</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={index}>
            <button onClick={() => setRouteIndex(index)}>{route.summary}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Directions;
