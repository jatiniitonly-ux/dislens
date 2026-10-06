import type { DetectedRegion, ImageryMetadata } from '../domain/types';

export const ML_ADAPTER_METADATA = {
  name: 'Multi-Sensor Heuristic Ensemble',
  version: '1.0-heuristic',
  status: 'heuristic-fallback' as const,
  training: 'No trained weights loaded; deterministic decision-stump estimate',
  dataset: 'No labeled training dataset bundled; calibration pending field-verified flood masks',
  metrics: { iou: null as number | null, precision: null as number | null, recall: null as number | null, f1: null as number | null, note: 'Metrics are unavailable until a held-out labeled evaluation set is configured.' },
  inputBands: ['Green', 'NIR', 'Red', 'pre/post normalized difference features'],
  output: 'Change evidence mask score (0–100)',
};

export interface MlInference {
  score: number;
  confidence: number;
  explanation: string;
}

/**
 * Reproducible local adapter. The fixed decision stumps are a transparent
 * fallback until serialized random-forest weights and labeled training data
 * are configured in a server-side inference service.
 */
export function inferHeuristicChange(region: DetectedRegion, pre: ImageryMetadata, post: ImageryMetadata): MlInference {
  const bandSupport = pre.bands.includes('Green') && pre.bands.includes('NIR') && post.bands.includes('Green') && post.bands.includes('NIR') ? 1 : 0.72;
  const quality = Math.max(0, Math.min(1, (100 - post.cloudCover) / 100));
  const trees = [
    region.severity >= 70 ? 0.84 : 0.28,
    region.confidence >= 70 ? 0.78 : 0.34,
    bandSupport === 1 ? 0.82 : 0.42,
    quality >= 0.8 ? 0.76 : 0.38,
  ];
  const raw = trees.reduce((sum, value) => sum + value, 0) / trees.length * 100;
  const score = Math.round(Math.max(0, Math.min(100, raw)));
  const confidence = Math.round(Math.max(35, Math.min(88, 42 + quality * 28 + bandSupport * 18)));
  return { score, confidence, explanation: `Reproducible four-tree decision-stump ensemble combines severity, quality-adjusted confidence, spectral-band support (${bandSupport === 1 ? 'Green + NIR available' : 'limited bands'}), and cloud quality. It is not field-calibrated.` };
}
