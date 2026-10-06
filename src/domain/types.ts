export type Role = 'Emergency Analyst' | 'Response Coordinator' | 'Administrator';
export type AnalysisStatus = 'idle' | 'queued' | 'preprocessing' | 'detecting' | 'postprocessing' | 'scoring' | 'completed' | 'failed' | 'cancelled';
export type ChangeType = 'Possible flood change' | 'High-probability flood change' | 'Uncertain change';
export type ReviewStatus = 'Needs review' | 'Reviewed — field verification pending';

export interface ImageryMetadata {
  id: string;
  label: string;
  acquisitionDate: string;
  source: string;
  sensor: string;
  resolution: string;
  coverage: string;
  crs: string;
  cloudCover: number;
  quality: 'Good' | 'Watch' | 'Poor';
  bands: string[];
  fileName?: string;
  validation?: 'validated' | 'warning' | 'error';
  warning?: string;
}

export interface LayerMetadata {
  id: string;
  name: string;
  type: 'roads' | 'buildings' | 'hospitals' | 'shelters' | 'bridges' | 'population';
  featureCount: number;
  status: 'validated' | 'synthetic' | 'missing';
  detail: string;
}

export interface EvidenceItem { label: string; detail: string; tone?: 'positive' | 'neutral' | 'warning'; }
export interface UncertaintyItem { label: string; detail: string; }

export interface InfrastructureExposure {
  buildings: number;
  hospitals: number;
  schools: number;
  shelters: number;
  bridges: number;
  affectedRoadKm: number;
  nearestHospitalKm: number;
  nearestShelterKm: number;
  majorRoute: boolean;
  isolated: boolean;
}

export interface ScoreFactors {
  severity: number;
  criticalInfrastructure: number;
  populationExposure: number;
  accessibilityDifficulty: number;
  confidence: number;
}

export interface ConfidenceFactors {
  methodAgreement: number;
  imageQuality: number;
  temporalCloseness: number;
  spatialConsistency: number;
}

export interface GeoPolygon {
  points: string;
  centroid: { x: number; y: number };
  areaKm2: number;
}

export interface DetectedRegion {
  id: string;
  shortLabel: string;
  location: string;
  changeType: ChangeType;
  polygon: GeoPolygon;
  severity: number;
  confidence: number;
  priority: number;
  priorityLevel: 'Critical' | 'High' | 'Medium';
  exposedPopulation: number;
  infrastructure: InfrastructureExposure;
  scoreFactors: ScoreFactors;
  confidenceFactors: ConfidenceFactors;
  evidence: EvidenceItem[];
  uncertainty: UncertaintyItem[];
  recommendedAction: string;
  reviewStatus: ReviewStatus;
  color: string;
}

export interface DetectionMethod {
  id: 'baseline' | 'ndwi' | 'ml';
  name: string;
  available: boolean;
  weight: number;
  contribution: number;
  summary: string;
  detail: string;
}

export interface AnalysisResult {
  runId: string;
  startedAt: string;
  completedAt: string;
  processingMs: number;
  warnings: string[];
  methods: DetectionMethod[];
  regions: DetectedRegion[];
  baselineAffectedAreaKm2: number;
  improvedAffectedAreaKm2: number;
  baselineAgreement: number;
  status: AnalysisStatus;
}

export interface EventRecord {
  id: string;
  name: string;
  type: 'Flood';
  region: string;
  eventDate: string;
  status: 'Analysis ready' | 'Needs imagery';
  synthetic: boolean;
  preImagery: ImageryMetadata;
  postImagery: ImageryMetadata;
  layers: LayerMetadata[];
  result: AnalysisResult;
}

export interface ReportPayload {
  reportVersion: string;
  generatedAt: string;
  disclaimer: string;
  event: Pick<EventRecord, 'id' | 'name' | 'type' | 'region' | 'eventDate' | 'synthetic'>;
  imagery: { pre: ImageryMetadata; post: ImageryMetadata };
  processing: { status: AnalysisStatus; methods: DetectionMethod[]; warnings: string[]; baselineAgreement: number; steps: string[]; priorityWeights: Record<string, number> };
  summary: { affectedAreaKm2: number; affectedAreaByCategory: Record<string, number>; criticalZones: number; infrastructure: number; exposedPopulation: number; averageConfidence: number; baselineAreaKm2: number; improvedAreaKm2: number };
  mapSnapshot: { view: string; selectedZoneId: string; layers: string[]; comparison: string };
  recommendedInspectionZones: string[];
  regions: DetectedRegion[];
  knownLimitations: string[];
}
