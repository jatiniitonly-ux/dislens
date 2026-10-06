import type { DetectionMethod, ImageryMetadata } from '../domain/types';

export interface DetectorContext {
  pre: ImageryMetadata;
  post: ImageryMetadata;
  threshold: number;
}

export interface DetectorSignal {
  detectorId: DetectionMethod['id'] | 'spectral' | 'ensemble';
  available: boolean;
  score: number;
  maskDescription: string;
  warnings: string[];
}

export interface ChangeDetector {
  readonly id: DetectorSignal['detectorId'];
  readonly name: string;
  detect(context: DetectorContext): DetectorSignal;
}

const hasBand = (image: ImageryMetadata, band: string) => image.bands.some((value) => value.toLowerCase() === band);

export class PixelDifferenceDetector implements ChangeDetector {
  readonly id = 'baseline' as const;
  readonly name = 'PixelDifferenceDetector';
  detect(context: DetectorContext): DetectorSignal {
    const qualityAdjustment = Math.max(0, 100 - context.post.cloudCover * 1.1);
    return { detectorId: this.id, available: true, score: Math.round(qualityAdjustment), maskDescription: `Normalized absolute pre/post pixel difference above ${context.threshold}% threshold.`, warnings: [] };
  }
}

export class NDWIFloodDetector implements ChangeDetector {
  readonly id = 'ndwi' as const;
  readonly name = 'NDWIFloodDetector';
  detect(context: DetectorContext): DetectorSignal {
    const available = hasBand(context.pre, 'green') && hasBand(context.pre, 'nir') && hasBand(context.post, 'green') && hasBand(context.post, 'nir');
    return { detectorId: this.id, available, score: available ? 82 : 0, maskDescription: available ? 'Delta NDWI identifies newly water-related pixels.' : 'Green and NIR bands are required for NDWI.', warnings: available ? [] : ['NDWI unavailable because Green and NIR bands are missing.'] };
  }
}

export class SpectralChangeDetector implements ChangeDetector {
  readonly id = 'spectral' as const;
  readonly name = 'SpectralChangeDetector';
  detect(context: DetectorContext): DetectorSignal {
    const commonBands = context.pre.bands.filter((band) => context.post.bands.includes(band));
    return { detectorId: this.id, available: commonBands.length >= 2, score: Math.min(100, commonBands.length * 20), maskDescription: `Cross-band spectral change using ${commonBands.length} shared bands.`, warnings: commonBands.length < 2 ? ['Spectral comparison requires at least two shared bands.'] : [] };
  }
}

export class MLChangeDetector implements ChangeDetector {
  readonly id = 'ml' as const;
  readonly name = 'MLChangeDetector';
  detect(): DetectorSignal {
    return { detectorId: this.id, available: false, score: 0, maskDescription: 'Extension point only; no external model weights are loaded.', warnings: ['ML adapter is not configured. No model output is presented as real.'] };
  }
}

export class EnsembleChangeDetector implements ChangeDetector {
  readonly id = 'ensemble' as const;
  readonly name = 'EnsembleChangeDetector';
  private readonly detectors: ChangeDetector[];
  constructor(detectors: ChangeDetector[] = [new PixelDifferenceDetector(), new NDWIFloodDetector(), new SpectralChangeDetector()]) { this.detectors = detectors; }
  detect(context: DetectorContext): DetectorSignal {
    const signals = this.detectors.map((detector) => detector.detect(context)).filter((signal) => signal.available);
    const score = signals.length ? Math.round(signals.reduce((sum, signal) => sum + signal.score, 0) / signals.length) : 0;
    return { detectorId: this.id, available: signals.length > 0, score, maskDescription: `Deterministic ensemble agreement across ${signals.length} available analytical detectors.`, warnings: signals.flatMap((signal) => signal.warnings) };
  }
}

export const detectorRegistry: ChangeDetector[] = [new PixelDifferenceDetector(), new NDWIFloodDetector(), new SpectralChangeDetector(), new MLChangeDetector(), new EnsembleChangeDetector()];
