import { describe, expect, it } from 'vitest';
import { indianLocations } from '../src/data/indian-locations';
import { normalizeDatasetLocation, resolveDataset } from '../src/services/datasetRegistry';
import { mumbaiLocalImageryUnavailable, mumbaiLocalManifest, validateMumbaiLocalManifest } from '../src/services/mumbaiLocalDataset';

describe('authoritative dataset registry', () => {
  it('normalizes Mumbai aliases to one location key', () => {
    expect(normalizeDatasetLocation('Mumbai')).toBe('mumbai');
    expect(normalizeDatasetLocation('Mumbai City')).toBe('mumbai');
    expect(normalizeDatasetLocation('Mumbai, Maharashtra')).toBe('mumbai');
  });

  it('never resolves Mumbai live mode to the Kosi demo', () => {
    const result = resolveDataset('live', indianLocations.find((location) => location.id === 'mumbai')!);
    expect(result).toMatchObject({ id: 'mumbai-live', locationKey: 'mumbai', sourceType: 'live-provider', operational: true });
  });

  it('registers Mumbai satellite and rainfall data separately in local mode', () => {
    const result = resolveDataset('local', indianLocations.find((location) => location.id === 'mumbai')!);
    expect(result).toMatchObject({
      id: 'LOCAL-MUMBAI-SATELLITE-001',
      locationKey: 'mumbai',
      mode: 'local',
      sourceType: 'public-satellite-plus-rainfall',
      operational: false,
      evidenceType: 'satellite-plus-rainfall',
      datasetUrl: 'https://data.opencity.in/dataset/mumbai-rainfall-data',
      validationStatus: 'local-analysis-only',
      manifest: '/data/mumbai/manifest.json',
    });
  });

  it('validates the verified Mumbai pair against the AOI and chronology', () => {
    expect(validateMumbaiLocalManifest(mumbaiLocalManifest)).toEqual([]);
    expect(mumbaiLocalManifest.imagery.pre.date < mumbaiLocalManifest.imagery.post.date).toBe(true);
  });

  it('does not claim local flood processing when VV/VH rasters are not bundled', () => {
    expect(mumbaiLocalImageryUnavailable(mumbaiLocalManifest)).toBe(true);
    expect(mumbaiLocalManifest.processing.localRasterPairAvailable).toBe(false);
  });

  it('returns structured unavailable data instead of falling back across modes', () => {
    const result = resolveDataset('live', indianLocations.find((location) => location.id === 'kosi-bihar')!);
    expect(result).toMatchObject({ status: 'unavailable', mode: 'live', location: 'kosi-bihar', datasetId: null });
  });
});
