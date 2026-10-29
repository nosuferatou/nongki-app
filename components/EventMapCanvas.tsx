"use client";

import * as L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useMap } from "react-leaflet";
import type { EventMapProps } from "@/components/EventMap";

const defaultCenter: [number, number] = [-6.2, 106.816666];

const pinIcon = L.divIcon({
  className: "",
  html: '<span style="display:block;width:18px;height:18px;border:3px solid #202734;border-radius:50%;background:#B7D894;box-shadow:0 0 0 4px rgba(183,216,148,.28)"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function MapCenterUpdater({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (
      !map ||
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      return;
    }

    const container = map.getContainer();
    if (!container?.isConnected) return;

    let isCancelled = false;
    let timeoutId: number | undefined;
    let frameId: number | undefined;

    map.whenReady(() => {
      if (isCancelled) return;
      timeoutId = window.setTimeout(() => {
        if (isCancelled) return;
        frameId = window.requestAnimationFrame(() => {
          const mapPane = map.getPane("mapPane");
          const containerSize = container.getBoundingClientRect();
          if (
            isCancelled ||
            !container.isConnected ||
            map.getContainer() !== container ||
            !mapPane?.isConnected ||
            containerSize.width === 0 ||
            containerSize.height === 0
          ) {
            return;
          }

          map.invalidateSize({ pan: false });
          if (map.getSize().x === 0 || map.getSize().y === 0) return;
          map.setView([latitude, longitude], map.getZoom(), {
            animate: true,
          });
        });
      }, 50);
    });

    return () => {
      isCancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });

    // Beri jeda 150ms agar Next.js selesai merender kotak HTML
    // sebelum Leaflet diizinkan melakukan appendChild
    const timerId = window.setTimeout(() => {
      setMounted(true);
    }, 150);

    // CLEANUP: Matikan Leaflet seketika saat user klik pindah tab lain
    return () => {
      window.clearTimeout(timerId);
      setMounted(false);
    };
  }, []);

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

  if (!mounted) {
    return <div className="w-full h-48 bg-slate-100 animate-pulse rounded-xl" />;
  }

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
        <MapCenterUpdater
          latitude={hasCoordinates ? latitude : null}
          longitude={hasCoordinates ? longitude : null}
        />
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
