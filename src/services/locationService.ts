export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface AddressResult {
  displayName: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface ProximityTarget {
  id: string;
  name: string;
  type: 'safe-route' | 'disaster-zone';
  latitude: number;
  longitude: number;
  status?: string;
  detail?: string;
}

export interface ProximityMatch extends ProximityTarget {
  distanceKm: number;
}

interface RouteManifest {
  geospatialTargets?: ProximityTarget[];
}

export function getCurrentLocation(options: PositionOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Location services are not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy }),
      (error) => {
        const message = error.code === error.PERMISSION_DENIED ? 'Location permission was denied. Enable it in your browser settings and try again.' : error.code === error.TIMEOUT ? 'Location detection timed out. Check your GPS or network connection and try again.' : 'Unable to determine your current location.';
        reject(new Error(message));
      },
      options,
    );
  });
}

export async function reverseGeocode({ latitude, longitude }: Coordinates, signal?: AbortSignal): Promise<AddressResult> {
  const query = new URLSearchParams({ format: 'jsonv2', lat: latitude.toString(), lon: longitude.toString(), zoom: '18' });
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${query.toString()}`, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Reverse geocoding failed (${response.status}).`);
  const data = await response.json() as { display_name?: string; address?: Record<string, string> };
  return { displayName: data.display_name ?? 'Address unavailable', city: data.address?.city ?? data.address?.town ?? data.address?.village, state: data.address?.state, country: data.address?.country };
}

export async function loadRoutingTargets(signal?: AbortSignal): Promise<ProximityTarget[]> {
  const response = await fetch('/manus-routes.json', { signal });
  if (!response.ok) throw new Error(`Routing dataset could not be loaded (${response.status}).`);
  const manifest = await response.json() as RouteManifest;
  return (manifest.geospatialTargets ?? []).filter((target) => Number.isFinite(target.latitude) && Number.isFinite(target.longitude));
}

function toRadians(value: number) { return value * Math.PI / 180; }
export function distanceKm(from: Coordinates, to: Pick<ProximityTarget, 'latitude' | 'longitude'>): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestTarget(location: Coordinates, targets: ProximityTarget[]): ProximityMatch | null {
  if (!targets.length) return null;
  return targets.map((target) => ({ ...target, distanceKm: distanceKm(location, target) })).sort((a, b) => a.distanceKm - b.distanceKm)[0] ?? null;
}
