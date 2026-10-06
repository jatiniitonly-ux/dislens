import type { IndianLocation, RegionalDataset, RegionalFeature, RegionalFeatureKind } from '../domain/types';
import { mumbaiRegionalEvidence, mumbaiRegionalEvidenceMetadata } from '../data/mumbai-regional-evidence';

interface OverpassElement {
  id: number;
  type: 'node' | 'way';
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
  geometry?: Array<{ lat: number; lon: number }>;
}

interface OverpassResponse { elements?: OverpassElement[]; }

function classify(tags: Record<string, string> | undefined): RegionalFeatureKind | null {
  if (!tags) return null;
  if (tags.highway) return 'road';
  if (tags.building) return 'building';
  if (tags.amenity === 'hospital' || tags.healthcare === 'hospital') return 'hospital';
  if (tags.amenity === 'shelter' || tags.emergency === 'shelter') return 'shelter';
  if (tags.natural === 'water' || tags.water) return 'water';
  return null;
}

function toFeature(element: OverpassElement): RegionalFeature | null {
  const kind = classify(element.tags);
  if (!kind) return null;
  const coordinates = element.geometry?.map((point) => ({ latitude: point.lat, longitude: point.lon })) ?? (element.lat !== undefined && element.lon !== undefined ? [{ latitude: element.lat, longitude: element.lon }] : []);
  return coordinates.length ? { id: `${element.type}-${element.id}`, kind, name: element.tags?.name, coordinates } : null;
}

function bboxFor(center: { latitude: number; longitude: number }, features: RegionalFeature[]) {
  const points = features.flatMap((feature) => feature.coordinates);
  if (!points.length) return { minLatitude: center.latitude - 0.045, minLongitude: center.longitude - 0.045, maxLatitude: center.latitude + 0.045, maxLongitude: center.longitude + 0.045 };
  return { minLatitude: Math.min(...points.map((point) => point.latitude), center.latitude - 0.01), minLongitude: Math.min(...points.map((point) => point.longitude), center.longitude - 0.01), maxLatitude: Math.max(...points.map((point) => point.latitude), center.latitude + 0.01), maxLongitude: Math.max(...points.map((point) => point.longitude), center.longitude + 0.01) };
}

export async function loadRegionalDataset(location: IndianLocation, coordinates: { latitude: number; longitude: number }, signal?: AbortSignal): Promise<RegionalDataset> {
  if (location.id === 'kosi-bihar') {
    return { locationId: location.id, center: coordinates, bbox: bboxFor(coordinates, []), source: location.source ?? 'Local benchmark dataset', sourceUrl: location.sourceUrl, fetchedAt: new Date().toISOString(), features: [], imageryStatus: location.preImage && location.postImage ? 'configured' : 'not-configured', preImage: location.preImage, postImage: location.postImage, imagerySource: location.source };
  }
  const query = `[out:json][timeout:20];(way(around:5000,${coordinates.latitude},${coordinates.longitude})[highway];way(around:5000,${coordinates.latitude},${coordinates.longitude})[building];node(around:5000,${coordinates.latitude},${coordinates.longitude})[amenity~"hospital|shelter"];way(around:5000,${coordinates.latitude},${coordinates.longitude})[natural=water];);out tags center geom;`;
  const endpoints = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
  let payload: OverpassResponse | null = null;
  let lastError = 'Regional spatial dataset request failed.';
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, { signal, headers: { Accept: 'application/json' } });
      if (!response.ok) { lastError = `Regional spatial dataset request failed (${response.status}).`; continue; }
      payload = await response.json() as OverpassResponse;
      break;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      lastError = error instanceof Error ? error.message : lastError;
    }
  }
  if (!payload) throw new Error(lastError);
  const features = (payload.elements ?? []).map(toFeature).filter((feature): feature is RegionalFeature => Boolean(feature));
  return { locationId: location.id, center: coordinates, bbox: bboxFor(coordinates, features), source: 'OpenStreetMap Overpass regional spatial dataset', sourceUrl: 'https://overpass-api.de/', fetchedAt: new Date().toISOString(), features, imageryStatus: location.preImage && location.postImage ? 'configured' : 'not-configured', preImage: location.preImage, postImage: location.postImage, imagerySource: location.source, indicatorSnapshots: location.id === 'mumbai' ? mumbaiRegionalEvidence : undefined, indicatorDatasetId: location.id === 'mumbai' ? mumbaiRegionalEvidenceMetadata.datasetId : undefined, indicatorCaveat: location.id === 'mumbai' ? mumbaiRegionalEvidenceMetadata.caveat : undefined };
}

export function normalizeLocation(location: IndianLocation | string): string {
  return (typeof location === 'string' ? location : location.id).trim().toLowerCase().replace(/\s+/g, '-');
}

export async function fetchRegionalDataset(key: string, location: IndianLocation, coordinates: { latitude: number; longitude: number }, signal?: AbortSignal): Promise<RegionalDataset> {
  if (key === 'local') {
    const localLocation: IndianLocation = { ...location, id: 'kosi-bihar', name: 'Local fallback', regionType: 'region', datasetStatus: 'local', source: 'Local fallback dataset', sourceUrl: 'local://disasterlens/local-fallback' };
    return { ...(await loadRegionalDataset(localLocation, coordinates, signal)), isFallback: true, source: 'Local fallback dataset' };
  }
  return loadRegionalDataset(location, coordinates, signal);
}

export async function loadRegionalEvidence(location: IndianLocation, coordinates: { latitude: number; longitude: number }, allowFallback = true, signal?: AbortSignal): Promise<RegionalDataset> {
  const key = normalizeLocation(location);
  try {
    return await fetchRegionalDataset(key, location, coordinates, signal);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    if (allowFallback) return fetchRegionalDataset('local', location, coordinates, signal);
    throw new Error(`Regional evidence unavailable for ${key}`);
  }
}
