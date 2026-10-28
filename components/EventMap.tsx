"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export type EventMapProps = {
  latitude: number | null;
  longitude: number | null;
  isInteractive: boolean;
  onChange?: (latitude: number, longitude: number) => void;
  className?: string;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

function isNominatimResult(value: unknown): value is NominatimResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.place_id === "number" &&
    typeof result.display_name === "string" &&
    typeof result.lat === "string" &&
    typeof result.lon === "string"
  );
}

const EventMapCanvas = dynamic(() => import("@/components/EventMapCanvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Loading map"
      className="h-full min-h-48 w-full animate-pulse bg-primary-dark"
    />
  ),
});

export default function EventMap({
  latitude,
  longitude,
  isInteractive,
  onChange,
  className,
}: EventMapProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!isInteractive || trimmedQuery.length < 3) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const searchUrl = new URL(
          "https://nominatim.openstreetmap.org/search",
        );
        searchUrl.searchParams.set("format", "jsonv2");
        searchUrl.searchParams.set("limit", "5");
        searchUrl.searchParams.set("q", trimmedQuery);

        const response = await fetch(searchUrl, {
          signal: controller.signal,
          headers: { "Accept-Language": "en" },
        });
        if (!response.ok) {
          throw new Error(`Location search failed (${response.status}).`);
        }

        const responseData: unknown = await response.json();
        if (!Array.isArray(responseData)) {
          throw new Error("Location search returned an invalid response.");
        }

        setResults(responseData.filter(isNominatimResult));
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to search locations.", error);
        setResults([]);
        setSearchError("Location search is unavailable. Please try again.");
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isInteractive, query]);

  function selectLocation(result: NominatimResult) {
    const selectedLatitude = Number(result.lat);
    const selectedLongitude = Number(result.lon);
    if (
      !Number.isFinite(selectedLatitude) ||
      selectedLatitude < -90 ||
      selectedLatitude > 90 ||
      !Number.isFinite(selectedLongitude) ||
      selectedLongitude < -180 ||
      selectedLongitude > 180
    ) {
      setSearchError("The selected location has invalid coordinates.");
      return;
    }

    setQuery("");
    setResults([]);
    setIsSearching(false);
    setSearchError(null);
    onChange?.(selectedLatitude, selectedLongitude);
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    if (value.trim().length < 3) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
    }
  }

  return (
    <div
      className={`relative z-0 ${
        isInteractive
          ? "overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm"
          : ""
      } ${className ?? ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setResults([]);
        }
      }}
    >
      {isInteractive && (
        <div className="relative z-20 border-b border-slate-200/80 bg-white p-2.5">
          <label htmlFor="event-location-search" className="sr-only">
            Search location
          </label>
          <input
            id="event-location-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search location (e.g., Senayan City)..."
            className="block min-h-11 w-full rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-primary-dark placeholder:text-secondary-dark/60 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30"
          />
          {isSearching && (
            <p className="px-4 pb-2 text-xs text-secondary-dark" role="status">
              Searching locations...
            </p>
          )}
          {searchError && (
            <p className="px-4 pb-2 text-xs text-red-700" role="alert">
              {searchError}
            </p>
          )}
          {results.length > 0 && (
            <ul
              aria-label="Location search results"
              className="absolute left-2.5 right-2.5 top-full z-30 max-h-56 overflow-y-auto rounded-lg border border-slate-200/80 bg-white shadow-lg"
            >
              {results.map((result) => (
                <li key={result.place_id}>
                  <button
                    type="button"
                    onClick={() => selectLocation(result)}
                    className="min-h-11 w-full px-4 py-3 text-left text-sm text-primary-dark hover:bg-secondary-light/50 focus:bg-secondary-light/50 focus:outline-none"
                  >
                    {result.display_name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!isSearching &&
            !searchError &&
            query.trim().length >= 3 &&
            results.length === 0 && (
              <p className="px-4 pb-2 text-xs text-secondary-dark" role="status">
                No matching locations found.
              </p>
            )}
        </div>
      )}
      <div className="relative z-0 h-48 w-full overflow-hidden rounded-b-xl">
        <EventMapCanvas
          latitude={latitude}
          longitude={longitude}
          isInteractive={isInteractive}
          onChange={onChange}
          className="h-full w-full"
        />
      </div>
      <p className="sr-only">
        Location search provided by OpenStreetMap contributors.
      </p>
    </div>
  );
}
