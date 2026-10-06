export interface EonetGeometry {
  date: string;
  type: 'Point' | 'Polygon' | 'LineString';
  coordinates: number[] | number[][] | number[][][];
  magnitudeValue?: number;
  magnitudeUnit?: string;
}

export interface EonetEvent {
  id: string;
  title: string;
  description?: string | null;
  link: string;
  closed: string | null;
  categories: Array<{ id: string; title: string }>;
  sources: Array<{ id: string; url: string }>;
  geometry: EonetGeometry[];
}

interface EonetResponse { events: EonetEvent[]; }

export const EONET_EVENTS_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=20';

export async function fetchOpenEonetEvents(signal?: AbortSignal): Promise<EonetEvent[]> {
  const response = await fetch(EONET_EVENTS_URL, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`NASA EONET returned HTTP ${response.status}`);
  const payload = await response.json() as EonetResponse;
  return Array.isArray(payload.events) ? payload.events : [];
}

export function eonetCategoryLabel(event: EonetEvent): string {
  return event.categories.map((category) => category.title).join(', ') || 'Natural event';
}

export function eonetPoint(event: EonetEvent): [number, number] | null {
  const latest = event.geometry[event.geometry.length - 1];
  if (!latest || latest.type !== 'Point' || !Array.isArray(latest.coordinates) || latest.coordinates.length < 2 || typeof latest.coordinates[0] !== 'number' || typeof latest.coordinates[1] !== 'number') return null;
  return [latest.coordinates[0], latest.coordinates[1]];
}
