import { afterEach, describe, expect, it, vi } from 'vitest';
import { indianLocations } from '../src/data/indian-locations';
import { loadRegionalDataset, loadRegionalEvidence, normalizeLocation } from '../src/services/regionalDataset';

describe('regional dataset loader', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('keeps the local Kosi dataset location-specific without a network request', async () => {
    const dataset = await loadRegionalDataset(indianLocations.find((location) => location.id === 'kosi-bihar')!, { latitude: 26.49, longitude: 87.29 });
    expect(dataset.locationId).toBe('kosi-bihar');
    expect(dataset.imageryStatus).toBe('configured');
    expect(dataset.center).toEqual({ latitude: 26.49, longitude: 87.29 });
  });

  it('converts fetched Overpass ways and nodes into regional features', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ elements: [
      { type: 'way', id: 1, tags: { highway: 'primary', name: 'Test Road' }, geometry: [{ lat: 19, lon: 72 }, { lat: 19.01, lon: 72.02 }] },
      { type: 'node', id: 2, tags: { amenity: 'hospital', name: 'Test Hospital' }, lat: 19.02, lon: 72.03 },
    ] }), { status: 200, headers: { 'content-type': 'application/json' } })));
    const location = indianLocations.find((item) => item.id === 'mumbai')!;
    const dataset = await loadRegionalDataset(location, { latitude: location.latitude, longitude: location.longitude });
    expect(dataset.source).toContain('OpenStreetMap');
    expect(dataset.features.map((feature) => feature.kind)).toEqual(['road', 'hospital']);
    expect(dataset.features[0].name).toBe('Test Road');
  });

  it('uses a marked local fallback without presenting it as active regional evidence', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('provider unavailable')));
    const location = indianLocations.find((item) => item.id === 'mumbai')!;
    expect(normalizeLocation(location)).toBe('mumbai');
    const dataset = await loadRegionalEvidence(location, { latitude: location.latitude, longitude: location.longitude }, true);
    expect(dataset.isFallback).toBe(true);
    expect(dataset.source).toBe('Local fallback dataset');
    expect(dataset.locationId).toBe('kosi-bihar');
  });
});
