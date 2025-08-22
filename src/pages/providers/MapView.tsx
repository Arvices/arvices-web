import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { UserAccount } from "../../api-services/auth";
import { mapBoxPublickKey } from "./mapbox.util";
import "./MapView.css";
import { useNavigate } from "react-router-dom";

mapboxgl.accessToken = mapBoxPublickKey;
interface MapViewProps {
  position: string;
  users: UserAccount[];
}
const parsePosition = (position: string): [number, number] => {
  const [lat, lng] = position.split(",").map(Number);
  return [lng, lat];
};
const MapView: React.FC<MapViewProps> = ({ position, users }) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapRef.current) {
      console.log({
        position,
      });
      const [lng, lat] = position ? parsePosition(position) : [0, 0];
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: 10,
      });
    }
    const map = mapRef.current;
    const markers: mapboxgl.Marker[] = [];
    users.forEach((user) => {
      if (!user.position) return;
      const [lng, lat] = position ? parsePosition(user.position) : [0, 0];
      const el = document.createElement("div");
      el.className = "profile-marker";
      el.innerHTML = `
  <div class="marker-card">
    ${
      user.picture
        ? `<img class="marker-avatar" src="${user.picture}" alt="${user.fullName}" />`
        : `<div class="marker-initials">${user.fullName?.[0] ?? "?"}</div>`
    }
    <div class="marker-name">${user.fullName}</div>
    <button class="marker-button" data-user-id="${user.id}">
      View Provider
    </button>
  </div>
`;
      // Attach click listener to button
      const button = el.querySelector(".marker-button");
      button?.addEventListener("click", () => {
        navigate(`/user-profile/${user.id}`);
      });
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="popup-card">
        <img class="popup-avatar" src="${user.picture ?? "/default-avatar.png"}" alt="${user.fullName}" />
        <h3 class="popup-name">${user.fullName}</h3>
        <p class="popup-business">${user.businessName ?? user.username}</p>
        ${user.email ? `<p class="popup-email">${user.email}</p>` : ""}
        ${user.phoneNumber ? `<p class="popup-phone">${user.phoneNumber}</p>` : ""}
      </div>
    `),
        )
        .addTo(map);
      markers.push(marker);
    });
    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [position, users]);
  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "600px",
        borderRadius: "12px",
      }}
    />
  );
};
export default MapView;
