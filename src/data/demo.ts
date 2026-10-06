import type { EventRecord, LayerMetadata, DetectedRegion } from '../domain/types';

export const layerCatalog: LayerMetadata[] = [
  { id: 'roads', name: 'Road network', type: 'roads', featureCount: 128, status: 'synthetic', detail: '128 road segments · GeoJSON' },
  { id: 'buildings', name: 'Buildings', type: 'buildings', featureCount: 2140, status: 'synthetic', detail: '2,140 footprints · GeoJSON' },
  { id: 'hospitals', name: 'Hospitals', type: 'hospitals', featureCount: 4, status: 'synthetic', detail: '4 facilities · GeoJSON' },
  { id: 'shelters', name: 'Shelters', type: 'shelters', featureCount: 11, status: 'synthetic', detail: '11 facilities · GeoJSON' },
  { id: 'bridges', name: 'Bridges', type: 'bridges', featureCount: 9, status: 'synthetic', detail: '9 crossings · GeoJSON' },
  { id: 'population', name: 'Population density', type: 'population', featureCount: 18, status: 'synthetic', detail: '1 km grid · synthetic estimates' },
];

const preImagery = {
  id: 'img-pre-01', label: 'Pre-event baseline', acquisitionDate: '24 Sep 2026 · 05:42 UTC', source: 'Sentinel-2 L2A · Copernicus', sensor: 'MSI', resolution: '10 m', coverage: '26.41°N–26.57°N / 87.19°E–87.42°E', crs: 'EPSG:4326', cloudCover: 3, quality: 'Good' as const, bands: ['Green', 'NIR', 'Red', 'SWIR'], validation: 'validated' as const,
};
const postImagery = {
  id: 'img-post-01', label: 'Post-event observation', acquisitionDate: '06 Oct 2026 · 05:36 UTC', source: 'Sentinel-2 L2A · Copernicus', sensor: 'MSI', resolution: '10 m', coverage: '26.41°N–26.57°N / 87.19°E–87.42°E', crs: 'EPSG:4326', cloudCover: 8, quality: 'Good' as const, bands: ['Green', 'NIR', 'Red', 'SWIR'], validation: 'validated' as const,
};

export const demoRegions: DetectedRegion[] = [
  {
    id: 'ZONE-001', shortLabel: 'North embankment', location: 'Kosi North embankment', changeType: 'Strong detected change signal', polygon: { points: '205,176 293,145 386,161 419,219 382,268 285,257 223,229', centroid: { x: 312, y: 209 }, areaKm2: 18.4 }, severity: 95, confidence: 91, priority: 94, priorityLevel: 'Critical', exposedPopulation: 18420,
    infrastructure: { buildings: 284, hospitals: 1, schools: 2, shelters: 3, bridges: 1, affectedRoadKm: 12.6, nearestHospitalKm: 1.8, nearestShelterKm: 0.6, majorRoute: true, isolated: true },
    scoreFactors: { severity: 95, criticalInfrastructure: 93, populationExposure: 88, accessibilityDifficulty: 95, confidence: 91 }, confidenceFactors: { methodAgreement: 95, imageQuality: 91, temporalCloseness: 98, spatialConsistency: 89 },
    evidence: [{ label: '74% of pixels show water-related spectral change', detail: 'Delta NDWI +0.42 across the coherent core.', tone: 'positive' }, { label: 'Baseline and NDWI methods agree', detail: 'Ensemble agreement is 95% in the region.', tone: 'positive' }, { label: 'Hospital access road overlap', detail: 'Potentially affected major route within the polygon.', tone: 'warning' }, { label: 'Dense settlement edge', detail: 'Estimated 18,420 people in the exposure grid.', tone: 'neutral' }],
    uncertainty: [{ label: 'Cloud-covered pixels', detail: '8% of the post-event image is cloud-covered.' }, { label: 'Northern boundary', detail: 'Low-quality pixels soften the northern edge.' }], recommendedAction: 'Verify the northern boundary and hospital access route using drone, ground, or newer satellite imagery.', reviewStatus: 'Needs review', color: '#ff806b',
  },
  {
    id: 'ZONE-002', shortLabel: 'East settlement', location: 'East settlement corridor', changeType: 'Strong detected change signal', polygon: { points: '514,292 599,258 682,282 704,338 673,388 581,377 528,349', centroid: { x: 609, y: 323 }, areaKm2: 11.7 }, severity: 86, confidence: 84, priority: 87, priorityLevel: 'High', exposedPopulation: 12860,
    infrastructure: { buildings: 196, hospitals: 0, schools: 1, shelters: 2, bridges: 2, affectedRoadKm: 8.2, nearestHospitalKm: 4.6, nearestShelterKm: 1.1, majorRoute: true, isolated: false },
    scoreFactors: { severity: 86, criticalInfrastructure: 82, populationExposure: 81, accessibilityDifficulty: 72, confidence: 84 }, confidenceFactors: { methodAgreement: 86, imageQuality: 86, temporalCloseness: 98, spatialConsistency: 78 },
    evidence: [{ label: '61% of pixels show water-related spectral change', detail: 'Delta NDWI +0.31 around the settlement edge.', tone: 'positive' }, { label: 'Coherent polygon after noise removal', detail: 'Connected-component filter removed 22 small detections.', tone: 'positive' }, { label: 'Two bridge approaches nearby', detail: 'Potentially affected routes need inspection.', tone: 'warning' }],
    uncertainty: [{ label: 'Temporal gap', detail: 'Post-event image is 9 hours after the event window.' }, { label: 'Road layer vintage', detail: 'Synthetic road layer may not reflect temporary closures.' }], recommendedAction: 'Prioritise route reconnaissance along the two bridge approaches and confirm shelter access.', reviewStatus: 'Needs review', color: '#f4b35f',
  },
  {
    id: 'ZONE-003', shortLabel: 'South farms', location: 'South agricultural plain', changeType: 'Uncertain change', polygon: { points: '284,420 364,396 459,416 482,469 433,512 336,505 291,474', centroid: { x: 384, y: 452 }, areaKm2: 9.2 }, severity: 55, confidence: 76, priority: 48, priorityLevel: 'Medium', exposedPopulation: 3640,
    infrastructure: { buildings: 72, hospitals: 0, schools: 0, shelters: 1, bridges: 0, affectedRoadKm: 2.7, nearestHospitalKm: 9.3, nearestShelterKm: 3.5, majorRoute: false, isolated: false },
    scoreFactors: { severity: 55, criticalInfrastructure: 42, populationExposure: 48, accessibilityDifficulty: 38, confidence: 76 }, confidenceFactors: { methodAgreement: 70, imageQuality: 78, temporalCloseness: 95, spatialConsistency: 65 },
    evidence: [{ label: 'Agricultural water expansion signal', detail: 'Delta NDWI +0.18 along low-lying fields.', tone: 'neutral' }, { label: 'Baseline and NDWI partially agree', detail: 'Agreement is weaker at the southern boundary.', tone: 'warning' }, { label: 'Low infrastructure overlap', detail: 'No hospitals or major routes intersect the zone.', tone: 'neutral' }],
    uncertainty: [{ label: 'Possible seasonal water', detail: 'Agricultural irrigation can mimic flood expansion.' }, { label: 'Low spatial consistency', detail: 'Patchy detections remain after morphology cleanup.' }], recommendedAction: 'Verify with newer imagery or a quick ground survey before dispatching heavy response assets.', reviewStatus: 'Needs review', color: '#f4d35e',
  },
];

export const demoEvent: EventRecord = {
  id: 'evt-kosi-2026', name: 'Kosi Delta Flood', type: 'Flood', region: 'Kosi river corridor · Bihar, India', eventDate: '06 Oct 2026', status: 'Analysis ready', synthetic: true,
  preImagery, postImagery, layers: layerCatalog,
  result: { runId: 'run-20261006-0542', startedAt: '2026-10-06T05:42:00Z', completedAt: '2026-10-06T05:42:47Z', processingMs: 47000, warnings: ['Synthetic demonstration event. Imagery and layer values require independent field verification.', '8% cloud cover in post-event observation; northern boundary confidence reduced.'], methods: [
    { id: 'baseline', name: 'Pixel difference', available: true, weight: 0.42, contribution: 42, summary: 'Available · baseline', detail: 'Absolute pre/post pixel difference after normalization.' },
    { id: 'ndwi', name: 'NDWI flood signal', available: true, weight: 0.42, contribution: 42, summary: 'Available · Green + NIR', detail: 'Delta NDWI highlights newly water-related pixels.' },
    { id: 'ml', name: 'ML model adapter', available: false, weight: 0.16, contribution: 0, summary: 'Not configured', detail: 'A pluggable model interface is ready; no external weights are loaded in this MVP.' },
  ], regions: demoRegions, baselineAffectedAreaKm2: 31.8, improvedAffectedAreaKm2: 39.3, baselineAgreement: 68, status: 'completed' },
};

export const eventOptions = [demoEvent, { ...demoEvent, id: 'evt-bagmati-2026', name: 'Bagmati Flash Flood', region: 'Bagmati basin · Kathmandu Valley, Nepal', status: 'Needs imagery' as const }];
