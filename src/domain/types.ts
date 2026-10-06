export type Role = 'Emergency Analyst' | 'Response Coordinator' | 'Administrator';
export type AnalysisStatus = 'idle' | 'uploading' | 'validating' | 'reading-metadata' | 'queued' | 'preprocessing' | 'reprojecting' | 'aligning' | 'masking-clouds' | 'calculating-indices' | 'detecting' | 'generating-polygons' | 'intersecting-infrastructure' | 'estimating-population' | 'postprocessing' | 'scoring' | 'calculating-confidence' | 'generating-report' | 'completed' | 'failed' | 'cancelled';
export type ChangeType = 'Possible flood change' | 'Strong detected change signal' | 'Uncertain change';
export type ReviewStatus = 'Needs review' | 'Reviewed — field verification pending';

<<<<<<< HEAD
=======
export type IndianLocation = {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  regionType: 'city' | 'region';
  defaultZoom: number;
  datasetStatus: 'local' | 'available' | 'not-configured';
  preImage?: string;
  postImage?: string;
  source?: string;
  sourceUrl?: string;
};

export type RegionalFeatureKind = 'road' | 'building' | 'hospital' | 'shelter' | 'water';
export interface RegionalFeature { id: string; kind: RegionalFeatureKind; name?: string; coordinates: Array<{ latitude: number; longitude: number }>; }
export interface RegionalIndicatorSnapshot {
  city: string;
  ward: string;
  zone: string;
  month: string;
  populationEst: number;
  pm25Ugm3: number;
  aqiAvg: number;
  avgTempC: number;
  totalRainfallMm: number;
  waterSupplyLpcd: number;
  powerOutageHours: number;
  reportedDengue: number;
  unlabelledNumericValues: number[];
  source: string;
}
export interface RegionalDataset {
  locationId: string;
  center: { latitude: number; longitude: number };
  bbox: { minLatitude: number; minLongitude: number; maxLatitude: number; maxLongitude: number };
  source: string;
  sourceUrl?: string;
  fetchedAt: string;
  features: RegionalFeature[];
  imageryStatus: 'configured' | 'not-configured';
  preImage?: string;
  postImage?: string;
  imagerySource?: string;
  isFallback?: boolean;
  indicatorSnapshots?: RegionalIndicatorSnapshot[];
  indicatorDatasetId?: string;
  indicatorCaveat?: string;
}

export type PopulationSource = 'local-fixture' | 'worldpop-india';
export interface PopulationProvenance {
  product: string;
  productUrl: string;
  year: number;
  release: string;
  version: string;
  downloadedAt: string;
  licence: string;
  crs: string;
  pixelSize: string;
  nodata: number;
  checksumSha256: string;
  inclusionMethod: string;
}
export interface PopulationExposureResult {
  source: PopulationSource;
  status: 'available' | 'blocked' | 'loading' | 'error';
  estimatedPopulation?: number;
  selectedZonePopulation?: number;
  provenance?: PopulationProvenance;
  aoiCoverage?: number;
  excludedPixels?: number;
  excludedFraction?: number;
  zoneTotalsReconcile?: boolean;
  inclusionMethod?: string;
  blocker?: string;
}

>>>>>>> a8a4f96 (final update)
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
  fileSizeBytes?: number;
  mimeType?: string;
  sha256?: string;
  catalogSceneId?: string;
  catalogAssetHref?: string;
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
  pixelStats?: { width: number; height: number; comparedPixels: number; changedPixels: number; changeRatio: number; meanAbsoluteDifference: number; processingMs: number; source: 'uploaded-pixels' | 'uploaded-geotiff' | 'demo-fallback'; warnings: string[]; crs?: string; bands?: number };
  modelProvenance?: { name: string; version: string; trainingData: string; dataset?: string; status: string; inputFeatures: string[]; output: string; metrics?: { iou: number | null; precision: number | null; recall: number | null; f1: number | null; note: string } };
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
<<<<<<< HEAD
=======
  populationExposure?: PopulationExposureResult;
>>>>>>> a8a4f96 (final update)
}
export interface AnalysisRun {
  runId: string;
  datasetId: string;
  dataMode: 'synthetic' | 'local' | 'live';
  eventId: string;
  eventName: string;
  aoi: string;
  preScene: ImageryMetadata;
  postScene: ImageryMetadata;
  groundTruthDataset: string;
  processingConfig: { ndwiThreshold: number; pixelDifferenceThreshold: number; sarThreshold: number; minimumComponentSize: number };
  result: AnalysisResult;
  provenance: { source: string; operationalStatus: string; algorithmVersion: string; processedAt: string };
}

export interface ReportPayload {
  reportVersion: string;
  generatedAt: string;
  disclaimer: string;
  event: Pick<EventRecord, 'id' | 'name' | 'type' | 'region' | 'eventDate' | 'synthetic'> & { datasetId: string; dataMode: 'synthetic' | 'local' | 'live'; };
  imagery: { pre: ImageryMetadata; post: ImageryMetadata };
  processing: { status: AnalysisStatus; methods: DetectionMethod[]; warnings: string[]; baselineAgreement: number; steps: string[]; priorityWeights: Record<string, number>; pixelStats?: AnalysisResult['pixelStats']; modelProvenance?: AnalysisResult['modelProvenance'] };
  summary: { affectedAreaKm2: number; affectedAreaByCategory: Record<string, number>; criticalZones: number; infrastructure: number; exposedPopulation: number; averageConfidence: number; baselineAreaKm2: number; improvedAreaKm2: number };
  mapSnapshot: { view: string; selectedZoneId: string; layers: string[]; comparison: string };
  recommendedInspectionZones: string[];
  regions: DetectedRegion[];
  knownLimitations: string[];
<<<<<<< HEAD
=======
  populationExposure?: PopulationExposureResult;
>>>>>>> a8a4f96 (final update)
}
