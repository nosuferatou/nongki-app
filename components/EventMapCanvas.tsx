"use client";

import { divIcon } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useMap } from "react-leaflet";
import type { EventMapProps } from "@/components/EventMap";

const defaultCenter: [number, number] = [-6.2, 106.816666];

const pinIcon = divIcon({
  className: "",
  html: '<span style="display:block;width:18px;height:18px;border:3px solid #202734;border-radius:50%;background:#B7D894;box-shadow:0 0 0 4px rgba(183,216,148,.28)"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function MapCenterUpdater({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [map, latitude, longitude]);

  return null;
}

function MapClickHandler({
  isInteractive,
  onChange,
}: Pick<EventMapProps, "isInteractive" | "onChange">) {
  useMapEvents({
    click(event) {
      if (isInteractive) {
        onChange?.(event.latlng.lat, event.latlng.lng);
      }
    },
  });

  return null;
}

export default function EventMapCanvas({
  latitude,
  longitude,
  isInteractive,
  onChange,
  className,
}: EventMapProps) {
  const hasCoordinates =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180;
  const position: [number, number] = hasCoordinates
    ? [latitude, longitude]
    : defaultCenter;

  return (
    <div className={className ?? "h-48 w-full overflow-hidden"}>
      <MapContainer
        center={position}
        zoom={hasCoordinates ? 15 : 11}
        scrollWheelZoom={isInteractive}
        doubleClickZoom={isInteractive}
        dragging={isInteractive}
        touchZoom={isInteractive}
        zoomControl={isInteractive}
        keyboard={isInteractive}
        boxZoom={isInteractive}
        className="h-full w-full bg-primary-dark"
      >
        <MapCenterUpdater latitude={position[0]} longitude={position[1]} />
        <TileLayer
          className="dark-map-tiles"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler isInteractive={isInteractive} onChange={onChange} />
        {hasCoordinates && (
          <Marker position={position} icon={pinIcon} />
        )}
      </MapContainer>
    </div>
  );
}
