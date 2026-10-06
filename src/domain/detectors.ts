import type { AnalysisResult, EventRecord } from './types';

export type DisasterType = 'Flood' | 'Wildfire' | 'Landslide' | 'Cyclone' | 'Unknown';

export interface DetectorContext {
  event: EventRecord;
  threshold: number;
  minimumRegionSizeKm2: number;
}

export interface DisasterDetector {
  type: DisasterType;
  name: string;
  status: 'prototype-active' | 'extension-available';
  requiredSignals: string[];
  detect(context: DetectorContext): AnalysisResult;
}

export const detectorCatalog: Array<Pick<DisasterDetector, 'type' | 'name' | 'status' | 'requiredSignals'>> = [
  { type: 'Flood', name: 'Flood change detector', status: 'prototype-active', requiredSignals: ['NDWI change', 'pixel difference', 'water expansion', 'infrastructure overlap'] },
  { type: 'Wildfire', name: 'Wildfire change detector', status: 'extension-available', requiredSignals: ['NDVI reduction', 'NBR change', 'thermal anomaly'] },
  { type: 'Landslide', name: 'Landslide change detector', status: 'extension-available', requiredSignals: ['bare-earth change', 'texture change', 'slope and elevation'] },
  { type: 'Cyclone', name: 'Cyclone impact detector', status: 'extension-available', requiredSignals: ['flooding', 'vegetation loss', 'building and road change'] },
  { type: 'Unknown', name: 'Generic change detector', status: 'extension-available', requiredSignals: ['multi-temporal pixel change'] },
];

export function activeDataMode(event: Pick<EventRecord, 'synthetic' | 'preImagery' | 'postImagery' | 'layers'>): 'Demo mode' | 'Uploaded-data mode' | 'Mixed-data mode' | 'Real-analysis mode' {
  const uploadedImagery = Boolean(event.preImagery.fileName || event.postImagery.fileName);
  const uploadedLayer = event.layers.some((layer) => layer.status === 'validated');
  if (!uploadedImagery && !uploadedLayer) return 'Demo mode';
  if (uploadedImagery && uploadedLayer && !event.synthetic) return 'Real-analysis mode';
  return uploadedImagery ? 'Uploaded-data mode' : 'Mixed-data mode';
}
