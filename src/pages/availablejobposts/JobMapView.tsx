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
      if (!position) return;
      const [lng, lat] = parsePosition(position);
      const el = document.createElement("div");
      el.className = "job-marker";
      el.innerHTML = `
        <div class="category">Job Category</div>
        <div class="address">${job?.description}</div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({
            offset: 25,
          }).setHTML(`<div style="text-align:center">
                <strong>${job?.address || ""}</strong><br/>
                <small>${job?.category?.name || ""}</small>
              </div>`),
        )
        .addTo(map);
      markers.push(marker);
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
