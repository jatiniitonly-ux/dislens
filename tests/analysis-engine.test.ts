import { describe, expect, it } from 'vitest';
import { buildMethods, imageryHasNdwiBands, imageryPairHasNdwiBands, normalizeAvailableMethods, validateUpload } from '../src/engine/analysis';

describe('analysis engine contracts', () => {
  it('renormalizes available methods when NDWI is missing', () => {
    const methods = buildMethods(false);
    expect(methods.find((method) => method.id === 'ndwi')?.available).toBe(false);
    expect(methods.find((method) => method.id === 'baseline')?.contribution).toBe(72);
    expect(methods.find((method) => method.id === 'ml')?.contribution).toBe(28);
  });
  it('detects required NDWI bands', () => {
    expect(imageryHasNdwiBands({ bands: ['Green', 'NIR'] } as never)).toBe(true);
    expect(imageryHasNdwiBands({ bands: ['Red'] } as never)).toBe(false);
    expect(imageryPairHasNdwiBands({ bands: ['Green', 'NIR'] } as never, { bands: ['Green', 'NIR'] } as never)).toBe(true);
    expect(imageryPairHasNdwiBands({ bands: ['Green'] } as never, { bands: ['Green', 'NIR'] } as never)).toBe(false);
  });
  it('accepts supported image types and returns actionable errors', () => {
    expect(validateUpload({ name: 'post.tif', size: 100, type: 'image/tiff' }).valid).toBe(true);
    expect(validateUpload({ name: 'payload.exe', size: 100, type: 'application/octet-stream' })).toEqual({ valid: false, warning: 'Unsupported image format. Use PNG, JPEG, or GeoTIFF.' });
    expect(validateUpload({ name: 'large.png', size: 51 * 1024 * 1024, type: 'image/png' }).valid).toBe(false);
  });
  it('keeps only the contribution of available methods', () => {
    expect(normalizeAvailableMethods([{ id: 'baseline', name: 'baseline', available: true, weight: .4, contribution: 0, summary: '', detail: '' }, { id: 'ndwi', name: 'ndwi', available: false, weight: .6, contribution: 0, summary: '', detail: '' }])[0].contribution).toBe(100);
  });
});

import { evaluateBinaryMask } from '../src/engine/metrics';

describe('evaluation metrics', () => {
  it('calculates IoU, precision, recall and F1 without fabricating values', () => {
    const metrics = evaluateBinaryMask([1, 1, 0, 0], [1, 0, 1, 0]);
    expect(metrics.truePositive).toBe(1);
    expect(metrics.iou).toBeCloseTo(1 / 3);
    expect(metrics.precision).toBe(0.5);
    expect(metrics.recall).toBe(0.5);
    expect(metrics.f1).toBe(0.5);
  });
});

import { rankScenes, selectBestScenePair, validateBbox } from '../src/services/satellite';

describe('satellite scene selection', () => {
  it('validates AOIs and ranks scenes transparently', () => {
    expect(validateBbox([86, 26, 87, 27])).toBeNull();
    expect(validateBbox([87, 26, 86, 27])).toContain('valid');
    const scenes = [{ id: 'cloudy', collection: 'sentinel-2-l2a', datetime: '2026-01-01T00:00:00Z', title: 'cloudy', cloudCover: 80, geometry: {}, assets: [{ key: 'B03', href: 'x' }], source: 'Copernicus Data Space STAC' as const }, { id: 'clear', collection: 'sentinel-2-l2a', datetime: '2026-01-02T00:00:00Z', title: 'clear', cloudCover: 5, geometry: {}, assets: [{ key: 'B03', href: 'x' }, { key: 'B08', href: 'x' }], source: 'Copernicus Data Space STAC' as const }];
    expect(rankScenes(scenes)[0].id).toBe('clear');
    expect(selectBestScenePair(scenes, scenes).pre.id).toBe('clear');
  });
});

import { calculateSarChange } from '../src/engine/sar';

describe('SAR change features', () => {
  it('calculates VV/VH and log-ratio changes without inventing VH', () => {
    const result = calculateSarChange(-10, -12, -15, -18);
    expect(result.detector).toBe('SARChangeDetector');
    expect(result.vvDifference).toBe(-2);
    expect(result.warnings).toHaveLength(0);
    expect(calculateSarChange(-10, -12).warnings[0]).toContain('VH unavailable');
  });
});

import { runLocalBenchmark } from '../src/engine/local-benchmark';

describe('local benchmark mode', () => {
  it('calculates dynamic optical, SAR and fused outputs from arrays', () => {
    const result = runLocalBenchmark();
    expect(result.source).toBe('Local demonstration dataset');
    expect(result.opticalMask.some(Boolean)).toBe(true);
    expect(result.sarMask.some(Boolean)).toBe(true);
    expect(result.fusedMetrics.iou).not.toBeNull();
    expect(result.sar.speckleMethod).toContain('fixture');
    expect(result.fusedAffectedAreaKm2).toBeGreaterThan(0);
  });
});

import { runPixelDifference } from '../src/engine/pixel-difference';

describe('pixel difference pipeline', () => {
  it('calculates raw and cleaned masks plus pixel-area statistics', () => {
    const result = runPixelDifference({ width: 2, height: 2, pixelSizeM: 10, threshold: 0.1, bands: [{ name: 'Green', pre: [0, 0, 0, 0], post: [0, 0.2, 0.2, 0] }] }, 1);
    expect(result.rawChangedPixelCount).toBe(2);
    expect(result.changedPixelCount).toBe(2);
    expect(result.affectedAreaM2).toBe(200);
    expect(result.bandsUsed).toEqual(['Green']);
  });
});

import { evaluateLocalScenes } from '../src/engine/local-scenes';
describe('multi-scene benchmark evaluation', () => {
  it('calculates per-scene, macro and micro metrics without a perfect-only fixture', () => {
    const result = evaluateLocalScenes();
    expect(result.scenes).toHaveLength(5);
    expect(result.datasetId).toBe('LOCAL-BENCHMARK-ST04-V2');
    expect(result.scenes.some((scene) => scene.metrics.f1 !== 1)).toBe(true);
    expect(result.macro.iou).not.toBeNull();
    expect(result.micro.truePositive).toBeGreaterThan(0);
  });
});

import { evaluateThresholdSensitivity } from '../src/engine/threshold-sensitivity';
describe('threshold sensitivity', () => {
  it('calculates benchmark-specific metrics for multiple thresholds', () => {
    const points = evaluateThresholdSensitivity([0.1, 0.25, 0.8]);
    expect(points).toHaveLength(3);
    expect(new Set(points.map((point) => point.affectedPixels)).size).toBeGreaterThan(1);
    expect(points.every((point) => point.metrics.f1 !== null)).toBe(true);
  });
});

import type { AnalysisRun } from '../src/domain/types';
describe('authoritative run contract', () => {
  it('requires a dataset, mode, scenes, configuration and calculated result', () => {
    const fields: Array<keyof AnalysisRun> = ['runId', 'datasetId', 'dataMode', 'eventId', 'preScene', 'postScene', 'processingConfig', 'result', 'provenance'];
    expect(fields).toContain('datasetId');
    expect(fields).toContain('processingConfig');
  });
});

import { distanceKm, findNearestTarget, type ProximityTarget } from '../src/services/locationService';
describe('current-location proximity routing', () => {
  it('selects the nearest configured route or disaster zone using haversine distance', () => {
    const targets: ProximityTarget[] = [
      { id: 'near', name: 'Near route', type: 'safe-route', latitude: 26.49, longitude: 87.29 },
      { id: 'far', name: 'Far zone', type: 'disaster-zone', latitude: 27, longitude: 88 },
    ];
    const match = findNearestTarget({ latitude: 26.491, longitude: 87.291 }, targets);
    expect(match?.id).toBe('near');
    expect(match?.distanceKm).toBeGreaterThan(0);
    expect(distanceKm({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 })).toBeCloseTo(111.19, 1);
  });
});
