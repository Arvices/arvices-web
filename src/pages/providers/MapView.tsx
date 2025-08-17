import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { UserAccount } from "../../api-services/auth";
import { mapBoxPublickKey } from "./mapbox.util";
import "./MapView.css"

mapboxgl.accessToken = mapBoxPublickKey;

interface MapViewProps {
  position: string; // "lat,long"
  users: UserAccount[];
}

const parsePosition = (position: string): [number, number] => {
  const [lat, lng] = position.split(",").map(Number);
  return [lng, lat]; // Mapbox expects [lng, lat]
};

const MapView: React.FC<MapViewProps> = ({ position, users }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the map only once
    if (!mapRef.current) {
      console.log({ position });
      const [lng, lat] = parsePosition(position);

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: 11,
      });
    }

    const map = mapRef.current;

    // Clear old markers
    const markers: mapboxgl.Marker[] = [];

    users.forEach((user) => {
      if (!user.position) return;

      const [lng, lat] = position ? parsePosition(user.position) : [0, 0];

// Create custom marker element
const el = document.createElement("div");
el.className = "profile-marker";

el.innerHTML = `
  <img src="${user.picture ?? null}" alt="${user.fullName}" />
  <div class="name">${user.fullName}</div>
`;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="text-align:center">
               <strong>${user.fullName}</strong><br/>
               <small>${user.businessName ?? user.username}</small>
             </div>`,
          ),
        )
        .addTo(map);

      markers.push(marker);
    });

    // Cleanup markers on re-render
    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [position, users]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "600px", borderRadius: "12px" }}
    />
  );
};

export default MapView;
