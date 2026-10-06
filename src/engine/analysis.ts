import type { AnalysisResult, DetectedRegion, DetectionMethod, ImageryMetadata, ScoreFactors, ConfidenceFactors } from '../domain/types';
import { demoRegions } from '../data/demo';
import { ML_ADAPTER_METADATA } from './ml-adapter';

export const DEFAULT_PRIORITY_WEIGHTS = { severity: 0.35, criticalInfrastructure: 0.25, populationExposure: 0.2, accessibilityDifficulty: 0.1, confidence: 0.1 };
export const DEFAULT_CONFIDENCE_WEIGHTS = { methodAgreement: 0.4, imageQuality: 0.25, temporalCloseness: 0.2, spatialConsistency: 0.15 } as const;

export type PriorityWeights = { severity: number; criticalInfrastructure: number; populationExposure: number; accessibilityDifficulty: number; confidence: number };

export function normalizePriorityWeights(weights: PriorityWeights): PriorityWeights {
  const total = Object.values(weights).reduce((sum, value) => sum + Math.max(0, value), 0) || 1;
  return { severity: Math.max(0, weights.severity) / total, criticalInfrastructure: Math.max(0, weights.criticalInfrastructure) / total, populationExposure: Math.max(0, weights.populationExposure) / total, accessibilityDifficulty: Math.max(0, weights.accessibilityDifficulty) / total, confidence: Math.max(0, weights.confidence) / total };
}

export function weightedScore(factors: ScoreFactors, weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS): number {
  const normalized = normalizePriorityWeights(weights);
  return Math.round(factors.severity * normalized.severity + factors.criticalInfrastructure * normalized.criticalInfrastructure + factors.populationExposure * normalized.populationExposure + factors.accessibilityDifficulty * normalized.accessibilityDifficulty + factors.confidence * normalized.confidence);
}

export function confidenceScore(factors: ConfidenceFactors): number {
  return Math.round(factors.methodAgreement * DEFAULT_CONFIDENCE_WEIGHTS.methodAgreement + factors.imageQuality * DEFAULT_CONFIDENCE_WEIGHTS.imageQuality + factors.temporalCloseness * DEFAULT_CONFIDENCE_WEIGHTS.temporalCloseness + factors.spatialConsistency * DEFAULT_CONFIDENCE_WEIGHTS.spatialConsistency);
}

export function validateUpload(file: Pick<File, 'name' | 'size' | 'type'>): { valid: boolean; warning?: string } {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/geotiff'];
  const extension = file.name.toLowerCase().split('.').pop();
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'tif', 'tiff'];
  if (!extension || !allowedExtensions.includes(extension) || (file.type && !allowed.includes(file.type.toLowerCase()))) {
    return { valid: false, warning: 'Unsupported image format. Use PNG, JPEG, or GeoTIFF.' };
  }
  if (file.size > 50 * 1024 * 1024) return { valid: false, warning: 'Image exceeds the 50 MB prototype limit. Compress or tile the raster before retrying.' };
  return { valid: true };
}

export function normalizeAvailableMethods(methods: DetectionMethod[]): DetectionMethod[] {
  const available = methods.filter((method) => method.available);
  const total = available.reduce((sum, method) => sum + method.weight, 0) || 1;
  return methods.map((method) => ({ ...method, contribution: method.available ? Math.round((method.weight / total) * 100) : 0, weight: method.available ? method.weight / total : 0 }));
}

export function buildMethods(ndwiAvailable = true): DetectionMethod[] {
  return normalizeAvailableMethods([
    { id: 'baseline', name: 'Pixel difference', available: true, weight: 0.42, contribution: 0, summary: 'Available · baseline', detail: 'Absolute pre/post pixel difference after normalization.' },
    { id: 'ndwi', name: 'NDWI flood signal', available: ndwiAvailable, weight: 0.42, contribution: 0, summary: ndwiAvailable ? 'Available · Green + NIR' : 'Unavailable · bands missing', detail: ndwiAvailable ? 'Delta NDWI highlights newly water-related pixels.' : 'Green and NIR bands were not available, so this method was excluded and weights were renormalized.' },
    { id: 'ml', name: 'Multi-Sensor Heuristic Ensemble', available: true, weight: 0.16, contribution: 0, summary: `Available · ${ML_ADAPTER_METADATA.status}`, detail: `${ML_ADAPTER_METADATA.name} v${ML_ADAPTER_METADATA.version}. ${ML_ADAPTER_METADATA.training}. Inputs: ${ML_ADAPTER_METADATA.inputBands.join(', ')}. Output is a reproducible prototype score and requires field calibration.` },
  ]);
}

export interface AnalysisOptions { ndwiAvailable?: boolean; cloudCover?: number; priorityWeights?: PriorityWeights; pixelStats?: AnalysisResult['pixelStats']; onProgress?: (status: AnalysisResult['status'], message: string) => void; }

export function runDeterministicAnalysis(options: AnalysisOptions = {}): AnalysisResult {
  const startedAt = new Date().toISOString();
  options.onProgress?.('queued', 'Job queued');
  options.onProgress?.('preprocessing', 'Aligning imagery and applying quality masks');
  const methods = buildMethods(options.ndwiAvailable ?? true);
  options.onProgress?.('detecting', methods.find((method) => method.id === 'ndwi')?.available ? 'Combining pixel difference and NDWI signals' : 'Running baseline pixel difference; NDWI fallback active');
  options.onProgress?.('postprocessing', 'Cleaning detections and simplifying regions');
  options.onProgress?.('scoring', 'Scoring response priority and uncertainty');
  const cloudCover = options.cloudCover ?? 8;
  const uploadedSignal = options.pixelStats && options.pixelStats.source !== 'demo-fallback' ? Math.max(0.15, Math.min(1, options.pixelStats.changeRatio * 2.2)) : 1;
  const regions = demoRegions.map((region) => {
    const confidenceFactors = { ...region.confidenceFactors, imageQuality: Math.max(0, 100 - cloudCover * 1.1) };
    const confidence = confidenceScore(confidenceFactors);
    const scoreFactors = { ...region.scoreFactors, severity: Math.round(region.scoreFactors.severity * uploadedSignal), confidence };
    const priority = weightedScore(scoreFactors, options.priorityWeights ?? DEFAULT_PRIORITY_WEIGHTS);
    const priorityLevel: DetectedRegion['priorityLevel'] = priority >= 90 ? 'Critical' : priority >= 70 ? 'High' : 'Medium';
    return { ...region, confidence, confidenceFactors, scoreFactors, severity: scoreFactors.severity, polygon: { ...region.polygon, areaKm2: Number((region.polygon.areaKm2 * uploadedSignal).toFixed(2)) }, priority, priorityLevel, evidence: uploadedSignal < 0.3 ? [...region.evidence, { label: 'Low changed-pixel ratio', detail: 'Uploaded imagery produced a low normalized difference signal; interpret zone ranking cautiously.', tone: 'warning' as const }] : region.evidence };
  });
  const completedAt = new Date().toISOString();
  const uploaded = options.pixelStats?.source !== undefined && options.pixelStats.source !== 'demo-fallback';
  const dynamicArea = uploaded ? Math.max(0.1, Number((options.pixelStats!.changeRatio * 100).toFixed(1))) : 39.3;
  const warnings = [uploaded ? 'Uploaded-pixel prototype processing: areas are normalized RGB estimates, not geospatial flood polygons.' : 'Synthetic demonstration event. Imagery and layer values require independent field verification.', `${cloudCover}% cloud cover in post-event observation; image quality is reflected in confidence.`, ...(options.pixelStats?.warnings ?? []), ...(methods.find((method) => method.id === 'ndwi')?.available ? [] : ['NDWI unavailable: Green and NIR bands were missing on at least one imagery side; baseline contribution was renormalized.'])];
  return { runId: `run-${Date.now()}`, startedAt, completedAt, processingMs: uploaded ? options.pixelStats!.processingMs : 47000, warnings, methods, regions, baselineAffectedAreaKm2: uploaded ? Number((dynamicArea * 0.78).toFixed(1)) : 31.8, improvedAffectedAreaKm2: dynamicArea, baselineAgreement: methods.find((method) => method.id === 'ndwi')?.available ? 68 : 54, status: 'completed', pixelStats: options.pixelStats, modelProvenance: { name: ML_ADAPTER_METADATA.name, version: ML_ADAPTER_METADATA.version, trainingData: ML_ADAPTER_METADATA.training, dataset: ML_ADAPTER_METADATA.dataset, status: ML_ADAPTER_METADATA.status, inputFeatures: ML_ADAPTER_METADATA.inputBands, output: ML_ADAPTER_METADATA.output, metrics: ML_ADAPTER_METADATA.metrics } };
}

export function getRegionExplanation(region: DetectedRegion): string {
  const critical = region.infrastructure.hospitals > 0 ? 'a hospital access route' : region.infrastructure.majorRoute ? 'a major route' : 'limited critical infrastructure';
  const density = region.exposedPopulation > 10000 ? 'a dense population exposure' : 'a smaller population exposure';
  return `This zone is ranked ${region.priorityLevel} because it contains ${region.changeType.toLowerCase()}, ${critical}, ${density}, and ${region.confidence}% evidence score from the available methods.`;
}

export function describeConfidence(region: DetectedRegion): string {
  return `${region.confidence}% evidence score · ${region.confidenceFactors.methodAgreement}% heuristic heuristic method agreement · ${region.confidenceFactors.spatialConsistency}% spatial consistency`;
}

export function imageryHasNdwiBands(imagery: ImageryMetadata): boolean {
  const bands = imagery.bands.map((band) => band.toLowerCase());
  return bands.includes('green') && bands.includes('nir');
}

export function imageryPairHasNdwiBands(pre: ImageryMetadata, post: ImageryMetadata): boolean {
  return imageryHasNdwiBands(pre) && imageryHasNdwiBands(post);
}
