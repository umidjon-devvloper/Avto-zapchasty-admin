'use client';

import { useEffect, useState } from 'react';

export interface Coords {
  lat: number;
  lng: number;
}

// Brauzer sessiyasida bir marta so'raladi va keshda saqlanadi
let cached: Coords | null = null;
let pending: Promise<Coords | null> | null = null;

export function getCoords(): Promise<Coords | null> {
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;
  if (typeof navigator === 'undefined' || !navigator.geolocation) return Promise.resolve(null);
  pending = new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        cached = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        resolve(cached);
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  });
  return pending;
}

// Sahifa ochilganda (mehmon ham) joylashuvni so'raydigan hook
export function useGeo(): Coords | null {
  const [coords, setCoords] = useState<Coords | null>(cached);
  useEffect(() => {
    getCoords().then(setCoords);
  }, []);
  return coords;
}

// "1.2 km" / "800 m"
export function formatDistance(km?: number): string {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}
