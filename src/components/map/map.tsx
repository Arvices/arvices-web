import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoiZG9sYXAyMjIzIiwiYSI6ImNtZDdtdjVnbjBnb2IybHFzY3FzbDZxNWsifQ.7j9U6NZY86YV4oIxdLwb3Q";
interface MapViewInterface {
  long?: number;
  lat?: number;
  className?: string;
  style?: React.CSSProperties;
}
const MapView: React.FC<MapViewInterface> = ({
  long = 0,
  lat = 0,
  className = "",
  style = {},
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [long, lat],
      zoom: 10,
    });
    return () => {
      mapRef.current?.remove();
    };
  }, []);
  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full ${className}`}
      style={style}
    />
  );
};
export default MapView;
