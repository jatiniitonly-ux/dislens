import { describe, expect, it } from 'vitest';
import { demoEvent } from '../src/data/demo';
import { createReportPayload, createGeoJson, DISCLAIMER } from '../src/export/reports';
import { getRegionExplanation, runDeterministicAnalysis } from '../src/engine/analysis';

describe('reports and deterministic results', () => {
  it('creates a report with the field-verification disclaimer and ranked regions', () => {
    const report = createReportPayload(demoEvent);
    expect(report.disclaimer).toBe(DISCLAIMER);
    expect(report.regions[0].id).toBe('ZONE-001');
    expect(report.summary.affectedAreaKm2).toBe(39.3);
  });
  it('runs an explainable deterministic analysis', () => {
    const result = runDeterministicAnalysis({ ndwiAvailable: true });
    expect(result.status).toBe('completed');
    expect(result.methods.filter((method) => method.available).length).toBe(3);
    expect(result.regions).toHaveLength(3);
    expect(getRegionExplanation(result.regions[0])).toContain('ranked Critical');
    expect(result.regions[0].priority).toBe(93);
  });
  it('falls back transparently when NDWI is unavailable', () => {
    const result = runDeterministicAnalysis({ ndwiAvailable: false });
    expect(result.methods.find((method) => method.id === 'ndwi')?.available).toBe(false);
    expect(result.warnings.join(' ')).toContain('NDWI unavailable');
    expect(result.methods.find((method) => method.id === 'baseline')?.contribution).toBe(72);
  });
<<<<<<< HEAD
=======

  it('keeps Mumbai local reports separate from the Kosi benchmark', () => {
    const mumbaiEvent = { ...demoEvent, synthetic: false, result: { ...demoEvent.result, regions: [] }, preImagery: { ...demoEvent.preImagery, id: 'LOCAL-MUMBAI-PRE-UNAVAILABLE', source: 'Copernicus Data Space Ecosystem' }, postImagery: { ...demoEvent.postImagery, id: 'LOCAL-MUMBAI-POST-UNAVAILABLE', source: 'Copernicus Data Space Ecosystem' } };
    const report = createReportPayload(mumbaiEvent, 'PENDING', { source: 'local-fixture', status: 'blocked', blocker: 'Verified raster unavailable' });
    expect(report.event.datasetId).toBe('LOCAL-MUMBAI-SATELLITE-001');
    expect(report.event.dataMode).toBe('local');
    expect(report.summary.exposedPopulation).toBe(0);
  });
>>>>>>> a8a4f96 (final update)
});

it('creates valid GeoJSON features with provenance', () => {
  const geojson = createGeoJson(demoEvent);
  expect(geojson.type).toBe('FeatureCollection');
  expect(geojson.features.length).toBe(3);
  expect(geojson.features[0].geometry.type).toBe('Polygon');
  expect(geojson.features[0].properties.source).toBe('synthetic-demo');
});
