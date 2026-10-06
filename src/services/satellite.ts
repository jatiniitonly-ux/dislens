export type SatelliteCollection = 'sentinel-2-l2a' | 'sentinel-1-grd';

export interface SatelliteSearchRequest { collection: SatelliteCollection; bbox: [number, number, number, number]; start: string; end: string; maxCloud?: number; limit?: number; }
export interface SatelliteScene { id: string; collection: string; datetime: string; title: string; cloudCover: number | null; geometry: unknown; bbox?: number[]; assets: Array<{ key: string; href: string; type?: string; title?: string }>; source: 'Copernicus Data Space STAC'; }
export interface SatelliteSearchResponse { configured: boolean; source: string; scenes: SatelliteScene[]; searchedAt: string; message?: string; }

export function validateBbox(bbox: [number, number, number, number]): string | null { const [minLon, minLat, maxLon, maxLat] = bbox; if (![minLon, minLat, maxLon, maxLat].every(Number.isFinite)) return 'AOI coordinates must be numeric.'; if (minLon < -180 || maxLon > 180 || minLat < -90 || maxLat > 90 || minLon >= maxLon || minLat >= maxLat) return 'AOI must be a valid WGS84 bounding box.'; return null; }
export function sceneScore(scene: SatelliteScene, requiredBands = ['B03', 'B08']): number { const cloud = scene.cloudCover === null ? 50 : Math.min(100, scene.cloudCover); const cloudQuality = 100 - cloud; const bandCompleteness = requiredBands.length ? requiredBands.filter((band) => scene.assets.some((asset) => asset.key.includes(band))).length / requiredBands.length * 100 : 100; return Math.round((cloudQuality * 0.5 + bandCompleteness * 0.3 + (scene.geometry ? 100 : 0) * 0.2) * 100) / 100; }
export function rankScenes(scenes: SatelliteScene[], requiredBands?: string[]): Array<SatelliteScene & { selectionScore: number }> { return scenes.map((scene) => ({ ...scene, selectionScore: sceneScore(scene, requiredBands) })).sort((a, b) => b.selectionScore - a.selectionScore); }
export function selectBestScenePair(pre: SatelliteScene[], post: SatelliteScene[], requiredBands?: string[]) { const rankedPre = rankScenes(pre, requiredBands); const rankedPost = rankScenes(post, requiredBands); return { pre: rankedPre[0], post: rankedPost[0], rankedPre, rankedPost, reason: rankedPre[0] && rankedPost[0] ? 'Highest transparent score from cloud quality, band completeness, and spatial metadata.' : 'No suitable satellite-image pair found. Try expanding the date range, increasing the cloud limit, or enabling Sentinel-1 SAR fallback.' }; }

export async function searchCopernicusScenes(request: SatelliteSearchRequest): Promise<SatelliteSearchResponse> {
  const params = new URLSearchParams({ collection: request.collection, bbox: request.bbox.join(','), start: request.start, end: request.end, limit: String(request.limit ?? 10) });
  if (request.maxCloud !== undefined && request.collection === 'sentinel-2-l2a') params.set('maxCloud', String(request.maxCloud));
  const response = await fetch(`/api/satellite/search?${params.toString()}`);
  const body = await response.json() as SatelliteSearchResponse & { error?: string };
  if (!response.ok) throw new Error(body.error ?? body.message ?? `Satellite search failed with HTTP ${response.status}`);
  return body;
}
