import { evaluateBinaryMask, type ConfusionMetrics } from './metrics';
import { preprocessOptical } from './optical';
import { runPixelDifference, type PixelDifferenceResult } from './pixel-difference';

export interface BenchmarkResult { label: string; source: 'Local demonstration dataset'; width: number; height: number; pixelSizeM: number; opticalMask: boolean[]; sarMask: boolean[]; fusedMask: boolean[]; groundTruth: boolean[]; opticalMetrics: ConfusionMetrics; sarMetrics: ConfusionMetrics; fusedMetrics: ConfusionMetrics; opticalAffectedAreaKm2: number; sarAffectedAreaKm2: number; fusedAffectedAreaKm2: number; opticalProcessingTimeline: string[]; pixelDifference: PixelDifferenceResult; sar: { vvPre: number[]; vvPost: number[]; vhPre: number[]; vhPost: number[]; vvChange: number[]; vhChange: number[]; ratioChange: number[]; threshold: number; speckleMethod: string }; limitations: string[]; }

const preGreen = [0.20, 0.22, 0.21, 0.25, 0.24, 0.23, 0.21, 0.22, 0.20, 0.24, 0.25, 0.23, 0.22, 0.21, 0.24, 0.23];
const postGreen = [0.20, 0.22, 0.48, 0.52, 0.24, 0.23, 0.46, 0.50, 0.20, 0.24, 0.47, 0.51, 0.22, 0.21, 0.24, 0.23];
const preNir = [0.42, 0.43, 0.44, 0.45, 0.42, 0.43, 0.44, 0.45, 0.42, 0.43, 0.44, 0.45, 0.42, 0.43, 0.44, 0.45];
const postNir = [0.43, 0.44, 0.20, 0.18, 0.43, 0.44, 0.21, 0.19, 0.43, 0.44, 0.20, 0.18, 0.43, 0.44, 0.44, 0.45];
const sarPreVV = [-10, -10, -11, -10, -10, -10, -11, -10, -10, -10, -11, -10, -10, -10, -11, -10];
const sarPostVV = [-10, -10, -15, -14, -10, -10, -14, -15, -10, -10, -15, -14, -10, -10, -11, -10];
const sarPreVH = [-16, -16, -17, -16, -16, -16, -17, -16, -16, -16, -17, -16, -16, -16, -17, -16];
const sarPostVH = [-16, -16, -21, -20, -16, -16, -20, -21, -16, -16, -21, -20, -16, -16, -17, -16];
const truth = [false, false, true, true, false, false, true, true, false, false, true, true, false, false, false, false];

export function runLocalBenchmark(ndwiThreshold = 0.25): BenchmarkResult {
  const optical = preprocessOptical({ width: 4, height: 4, preGreen, postGreen, preNir, postNir, preSwir: preGreen.map((value) => value * 0.7), postSwir: postGreen.map((value) => value * 0.7), pixelSizeM: 10, crs: 'EPSG:4326' }, ndwiThreshold);
  const pixelDifference = runPixelDifference({ width: 4, height: 4, pixelSizeM: 10, threshold: Math.max(0.05, ndwiThreshold * 0.8), bands: [{ name: 'Green', pre: preGreen, post: postGreen }, { name: 'NIR', pre: preNir, post: postNir }] });
  const opticalMask = optical.ndwiMask;
  const vvChange = sarPostVV.map((value, i) => value - sarPreVV[i]); const vhChange = sarPostVH.map((value, i) => value - sarPreVH[i]);
  const ratioChange = sarPostVV.map((value, i) => (value / sarPostVH[i]) - (sarPreVV[i] / sarPreVH[i]));
  const sarMask = vvChange.map((value, i) => value < -2 && vhChange[i] < -2); const fusedMask = opticalMask.map((value, i) => value || sarMask[i] || pixelDifference.cleanedMask[i]);
  const area = (mask: boolean[]) => Number((mask.filter(Boolean).length * 0.01 * 0.01).toFixed(4));
  return { label: 'Local demonstration dataset — reproducible benchmark, not operational satellite data.', source: 'Local demonstration dataset', width: 4, height: 4, pixelSizeM: 10, opticalMask, sarMask, fusedMask, groundTruth: truth, opticalMetrics: evaluateBinaryMask(opticalMask, truth), sarMetrics: evaluateBinaryMask(sarMask, truth), fusedMetrics: evaluateBinaryMask(fusedMask, truth), opticalAffectedAreaKm2: area(opticalMask), sarAffectedAreaKm2: area(sarMask), fusedAffectedAreaKm2: area(fusedMask), opticalProcessingTimeline: optical.processingTimeline, pixelDifference, sar: { vvPre: sarPreVV, vvPost: sarPostVV, vhPre: sarPreVH, vhPost: sarPostVH, vvChange, vhChange, ratioChange, threshold: -2, speckleMethod: '3×3 median-equivalent fixture smoothing' }, limitations: [...optical.warnings, 'Bundled arrays are a demonstration benchmark, not operational Sentinel-1 or Sentinel-2 imagery.', 'Metrics are valid only for this fixed 4×4 labelled mask.'] };
}
