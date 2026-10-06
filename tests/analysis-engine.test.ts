import { describe, expect, it } from 'vitest';
import { buildMethods, imageryHasNdwiBands, imageryPairHasNdwiBands, normalizeAvailableMethods, validateUpload } from '../src/engine/analysis';

describe('analysis engine contracts', () => {
  it('renormalizes available methods when NDWI is missing', () => {
    const methods = buildMethods(false);
    expect(methods.find((method) => method.id === 'ndwi')?.available).toBe(false);
    expect(methods.find((method) => method.id === 'baseline')?.contribution).toBe(100);
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
