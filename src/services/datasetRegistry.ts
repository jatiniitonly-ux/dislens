import type { IndianLocation } from '../domain/types';

export type DatasetMode = 'synthetic' | 'local' | 'live';
export type DatasetSourceType = 'synthetic-demo' | 'local-fixture' | 'public-satellite-plus-rainfall' | 'live-provider';
export type DatasetEvidenceType = 'flood-evidence' | 'rainfall-supporting-data' | 'satellite-plus-rainfall';
export type DatasetValidationStatus = 'validated' | 'not-flood-mask' | 'local-analysis-only';

export interface DatasetRegistryEntry {
  id: string;
  mode: DatasetMode;
  locationKey: string;
  displayName: string;
  bbox: [number, number, number, number];
  sourceType: DatasetSourceType;
  operational: boolean;
  evidenceType?: DatasetEvidenceType;
  datasetUrl?: string;
  validationStatus?: DatasetValidationStatus;
  evidenceStatus?: 'verified' | 'requires-processing';
  manifest?: string;
  aoi?: { bbox: [number, number, number, number]; crs: string };
  evidenceEndpoint?: string;
}

export interface UnavailableDataset {
  status: 'unavailable';
  mode: DatasetMode;
  location: string;
  datasetId: null;
  reason: string;
}

const datasetRegistry: Record<DatasetMode, Record<string, DatasetRegistryEntry>> = {
  synthetic: {
    'kosi-bihar': { id: 'SYNTHETIC-KOSI-DEMO', mode: 'synthetic', locationKey: 'kosi-bihar', displayName: 'Kosi River Corridor, Bihar', bbox: [87.2, 26.4, 87.4, 26.6], sourceType: 'synthetic-demo', operational: false },
  },
  local: {
    'kosi-bihar': { id: 'SYNTHETIC-KOSI-DEMO', mode: 'local', locationKey: 'kosi-bihar', displayName: 'Kosi River Corridor, Bihar', bbox: [87.2, 26.4, 87.4, 26.6], sourceType: 'local-fixture', operational: false },
    mumbai: { id: 'LOCAL-MUMBAI-SATELLITE-001', mode: 'local', locationKey: 'mumbai', displayName: 'Mumbai Satellite and Rainfall Dataset', bbox: [72.75, 18.85, 73.05, 19.35], sourceType: 'public-satellite-plus-rainfall', operational: false, evidenceType: 'satellite-plus-rainfall', datasetUrl: 'https://data.opencity.in/dataset/mumbai-rainfall-data', validationStatus: 'local-analysis-only', evidenceStatus: 'requires-processing', manifest: '/data/mumbai/manifest.json', aoi: { bbox: [72.75, 18.85, 73.05, 19.35], crs: 'EPSG:4326' } },
  },
  live: {
    mumbai: { id: 'mumbai-live', mode: 'live', locationKey: 'mumbai', displayName: 'Mumbai regional evidence', bbox: [72.75, 18.85, 73.05, 19.35], sourceType: 'live-provider', operational: true, evidenceEndpoint: '/api/evidence/mumbai' },
  },
};

export function normalizeDatasetLocation(location: IndianLocation | string): string {
  const value = typeof location === 'string' ? location : location.id;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '-').replace(/,.*$/, '');
  return ({ 'mumbai-city': 'mumbai', 'mumbai-maharashtra': 'mumbai', 'mumbai,-maharashtra': 'mumbai' } as Record<string, string>)[normalized] ?? normalized;
}

export function resolveDataset(mode: DatasetMode, location: IndianLocation | string): DatasetRegistryEntry | UnavailableDataset {
  const locationKey = normalizeDatasetLocation(location);
  const entry = datasetRegistry[mode][locationKey];
  if (entry) return entry;
  return { status: 'unavailable', mode, location: locationKey, datasetId: null, reason: `No ${mode} regional evidence dataset configured for ${locationKey}` };
}

export function validateDatasetLocation(entry: DatasetRegistryEntry, location: IndianLocation): string | null {
  return entry.locationKey === normalizeDatasetLocation(location) ? null : `Dataset location ${entry.locationKey} does not match selected location ${normalizeDatasetLocation(location)}.`;
}

export { datasetRegistry };
