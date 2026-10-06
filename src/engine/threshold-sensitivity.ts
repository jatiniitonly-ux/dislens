import { evaluateBinaryMask, type ConfusionMetrics } from './metrics';
import { runLocalBenchmark } from './local-benchmark';

export interface ThresholdPoint { threshold: number; affectedPixels: number; affectedAreaKm2: number; metrics: ConfusionMetrics; }
export function evaluateThresholdSensitivity(thresholds = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4]): ThresholdPoint[] { const truth = runLocalBenchmark(0.25).groundTruth; return thresholds.map((threshold) => { const run = runLocalBenchmark(threshold); return { threshold, affectedPixels: run.opticalMask.filter(Boolean).length, affectedAreaKm2: run.opticalAffectedAreaKm2, metrics: evaluateBinaryMask(run.opticalMask, truth) }; }); }
