import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./mapView.css";
import { mapBoxPublickKey } from "../providers/mapbox.util";
import { Job } from "../../components/cards/appcards";

mapboxgl.accessToken = mapBoxPublickKey;

interface JobMapViewProps {
  position: string;
  jobs: Job[];
}

const parsePosition = (
  position: string | null | undefined,
): [number, number] => {
  if (!position) {
    return [0, 0];
  }
  const [lat, lng] = position.split(",").map(Number);
  return [lng, lat];
};

const JobMapView: React.FC<JobMapViewProps> = ({ position, jobs }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  console.log({ jobs });

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

    jobs.forEach((job) => {
      if (!position) {
        console.log({ noPositionExtracted: job });
        return;
      }
      const [lng, lat] = parsePosition(position);
      const el = document.createElement("div");
      el.className = "job-marker";
      el.innerHTML = `
  <div class="marker-card">
    <div class="marker-category">Job Type: ${job?.category?.name || "Unknown"}</div>
    <button class="marker-button">View Job</button>
  </div>
`;

      const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);

      el.querySelector(".marker-button")?.addEventListener("click", () => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="text-align:left; max-width:250px;">
        <h3 style="margin:0;">Job Category -- ${job?.category?.name || ""}</h3>
        <p><strong>Address:</strong> ${job?.address || ""}</p>
        <p><strong>Description:</strong> ${job?.description || ""}</p>
        <p><strong>User:</strong> ${job?.user?.fullName || ""}</p>
      </div>
    `);
        marker.setPopup(popup).togglePopup();
      });
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [position, jobs]);

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

export default JobMapView;
