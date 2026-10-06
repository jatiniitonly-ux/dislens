import { jsPDF } from 'jspdf';
<<<<<<< HEAD
import type { EventRecord, ReportPayload } from '../domain/types';

export const DISCLAIMER = 'AI-generated decision support. Results require independent field verification.';

export function createReportPayload(event: EventRecord, selectedZoneId = event.result.regions[0]?.id ?? 'PENDING'): ReportPayload {
  const regions = event.result.regions;
  const infrastructure = regions.reduce((sum, region) => sum + region.infrastructure.buildings + region.infrastructure.hospitals + region.infrastructure.shelters + region.infrastructure.bridges, 0);
  const exposedPopulation = regions.reduce((sum, region) => sum + region.exposedPopulation, 0);
=======
import type { EventRecord, PopulationExposureResult, ReportPayload } from '../domain/types';

function datasetIdForEvent(event: EventRecord): string {
  if (event.synthetic) return 'SYNTHETIC-KOSI-DEMO';
  if (event.preImagery.id.startsWith('LOCAL-MUMBAI-')) return 'LOCAL-MUMBAI-SATELLITE-001';
  if (event.preImagery.source === 'Local demonstration dataset') return 'LOCAL-BENCHMARK-ST04-V2';
  return 'LIVE-ADAPTER-PENDING';
}

function dataModeForEvent(event: EventRecord): 'synthetic' | 'local' | 'live' {
  if (event.synthetic) return 'synthetic';
  if (event.preImagery.id.startsWith('LOCAL-MUMBAI-') || event.preImagery.source === 'Local demonstration dataset') return 'local';
  return 'live';
}

export const DISCLAIMER = 'AI-generated decision support. Results require independent field verification.';

export function createReportPayload(event: EventRecord, selectedZoneId = event.result.regions[0]?.id ?? 'PENDING', populationExposure = event.populationExposure): ReportPayload {
  const regions = event.result.regions;
  const infrastructure = regions.reduce((sum, region) => sum + region.infrastructure.buildings + region.infrastructure.hospitals + region.infrastructure.shelters + region.infrastructure.bridges, 0);
  const fixturePopulation = regions.reduce((sum, region) => sum + region.exposedPopulation, 0);
  const exposedPopulation = populationExposure?.status === 'available' ? populationExposure.estimatedPopulation ?? 0 : populationExposure?.status === 'blocked' ? 0 : fixturePopulation;
>>>>>>> a8a4f96 (final update)
  const averageConfidence = Math.round(regions.reduce((sum, region) => sum + region.confidence, 0) / Math.max(regions.length, 1));
  const affectedAreaByCategory = regions.reduce<Record<string, number>>((categories, region) => { categories[region.changeType] = (categories[region.changeType] ?? 0) + region.polygon.areaKm2; return categories; }, {});
  return {
    reportVersion: '1.0-mvp', generatedAt: new Date().toISOString(), disclaimer: DISCLAIMER,
<<<<<<< HEAD
    event: { id: event.id, name: event.name, type: event.type, region: event.region, eventDate: event.eventDate, synthetic: event.synthetic, datasetId: event.synthetic ? 'SYNTHETIC-KOSI-DEMO' : event.preImagery.source === 'Local demonstration dataset' ? 'LOCAL-BENCHMARK-ST04-V2' : 'LIVE-ADAPTER-PENDING', dataMode: event.synthetic ? 'synthetic' : event.preImagery.source === 'Local demonstration dataset' ? 'local' : 'live' },
=======
    event: { id: event.id, name: event.name, type: event.type, region: event.region, eventDate: event.eventDate, synthetic: event.synthetic, datasetId: datasetIdForEvent(event), dataMode: dataModeForEvent(event) },
>>>>>>> a8a4f96 (final update)
    imagery: { pre: event.preImagery, post: event.postImagery },
    processing: { status: event.result.status, methods: event.result.methods, warnings: event.result.warnings, baselineAgreement: event.result.baselineAgreement, steps: ['Validate file type, size and metadata', 'Align imagery to a common ROI and apply quality masks', 'Run baseline pixel difference', 'Run NDWI flood signal when Green and NIR bands are available', 'Run Multi-Sensor Heuristic Ensemble reproducible adapter', 'Clean detections, polygonize regions and compute spatial overlays', 'Score priority, confidence and uncertainty'], priorityWeights: { severity: 0.35, criticalInfrastructure: 0.25, populationExposure: 0.2, accessibilityDifficulty: 0.1, confidence: 0.1 }, pixelStats: event.result.pixelStats, modelProvenance: event.result.modelProvenance },
    summary: { affectedAreaKm2: event.result.improvedAffectedAreaKm2, affectedAreaByCategory, criticalZones: regions.filter((region) => region.priorityLevel === 'Critical').length, infrastructure, exposedPopulation, averageConfidence, baselineAreaKm2: event.result.baselineAffectedAreaKm2, improvedAreaKm2: event.result.improvedAffectedAreaKm2 },
    mapSnapshot: { view: event.synthetic ? 'Synthetic Kosi floodplain cartographic surface' : 'Uploaded imagery-derived change surface', selectedZoneId, layers: ['Change evidence', 'Roads', 'Hospitals', 'Shelters', 'Uncertain regions'], comparison: `Baseline ${event.result.baselineAffectedAreaKm2.toFixed(1)} km² vs improved ${event.result.improvedAffectedAreaKm2.toFixed(1)} km²` },
    recommendedInspectionZones: regions.slice().sort((a, b) => b.priority - a.priority).map((region) => region.id),
    regions,
<<<<<<< HEAD
=======
    populationExposure,
>>>>>>> a8a4f96 (final update)
    knownLimitations: ['Synthetic demonstration data is not a live satellite observation.', 'Overlap indicates potentially affected infrastructure and requires field verification.', 'No field, drone, or human-verified evidence is included in this report.'],
  };
}

<<<<<<< HEAD
export function downloadJson(event: EventRecord, selectedZoneId?: string) {
  const payload = createReportPayload(event, selectedZoneId);
=======
export function downloadJson(event: EventRecord, selectedZoneId?: string, populationExposure?: PopulationExposureResult) {
  const payload = createReportPayload(event, selectedZoneId, populationExposure);
>>>>>>> a8a4f96 (final update)
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = `${event.id}-incident-report.json`; link.click();
  URL.revokeObjectURL(url);
}

<<<<<<< HEAD
export function downloadCsv(event: EventRecord) {
  const headers = ['run_id', 'dataset_id', 'zone_id', 'location', 'change_type', 'priority', 'priority_level', 'confidence', 'affected_area_km2', 'exposed_population', 'hospitals', 'affected_road_km', 'review_status'];
  const rows = event.result.regions.map((region) => [event.result.runId, event.synthetic ? 'SYNTHETIC-KOSI-DEMO' : event.preImagery.source === 'Local demonstration dataset' ? 'LOCAL-BENCHMARK-ST04-V2' : 'LIVE-ADAPTER-PENDING', region.id, region.location, region.changeType, region.priority, region.priorityLevel, region.confidence, region.polygon.areaKm2.toFixed(2), region.exposedPopulation, region.infrastructure.hospitals, region.infrastructure.affectedRoadKm.toFixed(2), region.reviewStatus]);
=======
export function downloadCsv(event: EventRecord, populationExposure?: PopulationExposureResult) {
  const headers = ['run_id', 'dataset_id', 'population_source', 'population_year', 'population_status', 'zone_id', 'location', 'change_type', 'priority', 'priority_level', 'confidence', 'affected_area_km2', 'estimated_population_within_detected_flood_extent', 'hospitals', 'affected_road_km', 'review_status'];
  const activePopulation = populationExposure ?? event.populationExposure;
  const rows = event.result.regions.map((region) => [event.result.runId, datasetIdForEvent(event), region.id, region.location, region.changeType, activePopulation?.source ?? 'local-fixture', activePopulation?.provenance?.year ?? '', activePopulation?.status ?? 'available', region.priority, region.priorityLevel, region.confidence, region.polygon.areaKm2.toFixed(2), activePopulation?.status === 'blocked' ? '' : region.exposedPopulation, region.infrastructure.hospitals, region.infrastructure.affectedRoadKm.toFixed(2), region.reviewStatus]);
>>>>>>> a8a4f96 (final update)
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${event.id}-priority-zones.csv`; link.click(); URL.revokeObjectURL(url);
}

<<<<<<< HEAD
export function createGeoJson(event: EventRecord) {
  const features = event.result.regions.map((region) => {
    const coordinates = region.polygon.points.split(' ').map((point) => point.split(',').map(Number) as [number, number]).filter((point) => point.length === 2 && point.every(Number.isFinite));
    const ring: [number, number][] = coordinates.length >= 3 ? [...coordinates, coordinates[0]] : [[region.polygon.centroid.x, region.polygon.centroid.y], [region.polygon.centroid.x + 1, region.polygon.centroid.y], [region.polygon.centroid.x, region.polygon.centroid.y + 1], [region.polygon.centroid.x, region.polygon.centroid.y]];
    return { type: 'Feature', id: region.id, properties: { zoneId: region.id, location: region.location, changeType: region.changeType, priority: region.priority, confidence: region.confidence, reviewStatus: region.reviewStatus, source: event.synthetic ? 'synthetic-demo' : event.result.pixelStats?.source ?? 'uploaded-analysis', datasetId: event.synthetic ? 'SYNTHETIC-KOSI-DEMO' : event.preImagery.source === 'Local demonstration dataset' ? 'LOCAL-BENCHMARK-ST04-V2' : 'LIVE-ADAPTER-PENDING', dataMode: event.synthetic ? 'synthetic' : event.preImagery.source === 'Local demonstration dataset' ? 'local' : 'live', coordinateSpace: 'dashboard-local coordinates; not longitude/latitude unless imagery CRS is configured' }, geometry: { type: 'Polygon', coordinates: [ring] } };
  });
  return { type: 'FeatureCollection', features, properties: { eventId: event.id, runId: event.result.runId, generatedAt: new Date().toISOString(), model: event.result.modelProvenance, disclaimer: DISCLAIMER } };
}

export function downloadGeoJson(event: EventRecord) {
  const blob = new Blob([JSON.stringify(createGeoJson(event), null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${event.id}-change-zones.geojson`; link.click(); URL.revokeObjectURL(url);
}

export function createModelCard(event: EventRecord) {
  return { model: event.result.modelProvenance ?? null, analysisId: event.result.runId, datasetId: event.synthetic ? 'SYNTHETIC-KOSI-DEMO' : event.preImagery.source === 'Local demonstration dataset' ? 'LOCAL-BENCHMARK-ST04-V2' : 'LIVE-ADAPTER-PENDING', dataMode: event.synthetic ? 'synthetic' : event.preImagery.source === 'Local demonstration dataset' ? 'local' : 'live', generatedAt: new Date().toISOString(), source: event.synthetic ? 'Synthetic demo' : 'Real uploaded-data analysis', limitations: ['No trained weights are bundled unless explicitly stated in model provenance.', 'Metrics remain unavailable without a ground-truth mask.', 'Uploaded GeoTIFF comparison is not a substitute for CRS-aware production raster processing.'] };
}

export function downloadModelCard(event: EventRecord) {
  const blob = new Blob([JSON.stringify(createModelCard(event), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${event.id}-model-card.json`; link.click(); URL.revokeObjectURL(url);
}

export function downloadPdf(event: EventRecord, selectedZoneId?: string) {
  const payload = createReportPayload(event, selectedZoneId);
=======
export function createGeoJson(event: EventRecord, populationExposure?: PopulationExposureResult) {
  const activePopulation = populationExposure ?? event.populationExposure;
  const features = event.result.regions.map((region) => {
    const coordinates = region.polygon.points.split(' ').map((point) => point.split(',').map(Number) as [number, number]).filter((point) => point.length === 2 && point.every(Number.isFinite));
    const ring: [number, number][] = coordinates.length >= 3 ? [...coordinates, coordinates[0]] : [[region.polygon.centroid.x, region.polygon.centroid.y], [region.polygon.centroid.x + 1, region.polygon.centroid.y], [region.polygon.centroid.x, region.polygon.centroid.y + 1], [region.polygon.centroid.x, region.polygon.centroid.y]];
    return { type: 'Feature', id: region.id, properties: { zoneId: region.id, location: region.location, changeType: region.changeType, priority: region.priority, confidence: region.confidence, reviewStatus: region.reviewStatus, populationSource: activePopulation?.source ?? 'local-fixture', populationStatus: activePopulation?.status ?? 'available', populationYear: activePopulation?.provenance?.year ?? null, estimatedPopulationWithinDetectedFloodExtent: activePopulation?.status === 'blocked' ? null : region.exposedPopulation, source: event.synthetic ? 'synthetic-demo' : event.result.pixelStats?.source ?? 'uploaded-analysis', datasetId: datasetIdForEvent(event), dataMode: dataModeForEvent(event), coordinateSpace: 'dashboard-local coordinates; not longitude/latitude unless imagery CRS is configured' }, geometry: { type: 'Polygon', coordinates: [ring] } };
  });
  return { type: 'FeatureCollection', features, properties: { eventId: event.id, runId: event.result.runId, generatedAt: new Date().toISOString(), model: event.result.modelProvenance, disclaimer: DISCLAIMER, populationExposure: activePopulation ?? null } };
}

export function downloadGeoJson(event: EventRecord, populationExposure?: PopulationExposureResult) {
  const blob = new Blob([JSON.stringify(createGeoJson(event, populationExposure), null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${event.id}-change-zones.geojson`; link.click(); URL.revokeObjectURL(url);
}

export function createModelCard(event: EventRecord, populationExposure?: PopulationExposureResult) {
  const activePopulation = populationExposure ?? event.populationExposure;
  return { model: event.result.modelProvenance ?? null, analysisId: event.result.runId, datasetId: datasetIdForEvent(event), dataMode: dataModeForEvent(event), generatedAt: new Date().toISOString(), populationExposure: activePopulation ?? null, source: event.synthetic ? 'Synthetic demo' : 'Real uploaded-data analysis', limitations: ['No trained weights are bundled unless explicitly stated in model provenance.', 'Metrics remain unavailable without a ground-truth mask.', 'Uploaded GeoTIFF comparison is not a substitute for CRS-aware production raster processing.'] };
}

export function downloadModelCard(event: EventRecord, populationExposure?: PopulationExposureResult) {
  const blob = new Blob([JSON.stringify(createModelCard(event, populationExposure), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${event.id}-model-card.json`; link.click(); URL.revokeObjectURL(url);
}

export function downloadPdf(event: EventRecord, selectedZoneId?: string, populationExposure?: PopulationExposureResult) {
  const payload = createReportPayload(event, selectedZoneId, populationExposure);
>>>>>>> a8a4f96 (final update)
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const left = 42; let y = 48;
  const line = (text: string, size = 10, color = '#334155') => { doc.setFontSize(size); doc.setTextColor(color); const lines = doc.splitTextToSize(text, 510); doc.text(lines, left, y); y += lines.length * (size + 4) + 8; };
  doc.setFillColor(11, 17, 27); doc.rect(0, 0, 595, 110, 'F');
  doc.setTextColor(84, 214, 210); doc.setFontSize(22); doc.text('DISASTERLENS AI', left, 52);
  doc.setTextColor(224, 231, 239); doc.setFontSize(10); doc.text(`INCIDENT INTELLIGENCE REPORT · ${payload.event.synthetic ? 'SYNTHETIC DEMO' : 'UPLOADED ANALYSIS'}`, left, 76);
  y = 140; line(payload.disclaimer, 11, '#c05a32'); line(`${payload.event.name} · ${payload.event.region} · ${payload.event.eventDate}`, 14, '#0f172a');
<<<<<<< HEAD
  line(`Affected area: ${payload.summary.affectedAreaKm2.toFixed(1)} km²  |  Critical zones: ${payload.summary.criticalZones}  |  Exposed population: ${payload.summary.exposedPopulation.toLocaleString()}  |  Average evidence score: ${payload.summary.averageConfidence}%`, 10);
=======
  line(`Affected area: ${payload.summary.affectedAreaKm2.toFixed(1)} km²  |  Critical zones: ${payload.summary.criticalZones}  |  Estimated population within detected flood extent: ${payload.populationExposure?.status === 'blocked' ? 'Unavailable' : payload.summary.exposedPopulation.toLocaleString()}  |  Average evidence score: ${payload.summary.averageConfidence}%`, 10);
  if (payload.populationExposure) line(`Population source: ${payload.populationExposure.source} · status ${payload.populationExposure.status} · year ${payload.populationExposure.provenance?.year ?? 'local fixture'} · ${payload.populationExposure.blocker ?? payload.populationExposure.inclusionMethod}`, 9);
>>>>>>> a8a4f96 (final update)
  line(`Baseline vs improved: ${payload.summary.baselineAreaKm2.toFixed(1)} km² → ${payload.summary.improvedAreaKm2.toFixed(1)} km²  |  Selected zone: ${payload.mapSnapshot.selectedZoneId}`, 10);
  if (payload.processing.modelProvenance) { line(`Model: ${payload.processing.modelProvenance.name} v${payload.processing.modelProvenance.version} · ${payload.processing.modelProvenance.status} · ${payload.processing.modelProvenance.trainingData}`, 9); line(`Dataset: ${payload.processing.modelProvenance.dataset ?? 'Not specified'} · Metrics: IoU ${payload.processing.modelProvenance.metrics?.iou ?? 'N/A'}, precision ${payload.processing.modelProvenance.metrics?.precision ?? 'N/A'}, recall ${payload.processing.modelProvenance.metrics?.recall ?? 'N/A'}, F1 ${payload.processing.modelProvenance.metrics?.f1 ?? 'N/A'}`, 9); }
  if (payload.processing.pixelStats) line(`Uploaded pixels: ${payload.processing.pixelStats.width}×${payload.processing.pixelStats.height} · changed ${(payload.processing.pixelStats.changeRatio * 100).toFixed(1)}% · mean RGB difference ${payload.processing.pixelStats.meanAbsoluteDifference.toFixed(1)} · ${payload.processing.pixelStats.processingMs} ms`, 9);
  y += 4; doc.setDrawColor(203, 213, 225); doc.line(left, y, 552, y); y += 22; line('Imagery metadata', 13, '#0f172a'); line(`Pre-event: ${payload.imagery.pre.label} · ${payload.imagery.pre.acquisitionDate} · ${payload.imagery.pre.crs} · ${payload.imagery.pre.resolution} · ${payload.imagery.pre.cloudCover}% cloud`, 9); line(`Post-event: ${payload.imagery.post.label} · ${payload.imagery.post.acquisitionDate} · ${payload.imagery.post.crs} · ${payload.imagery.post.resolution} · ${payload.imagery.post.cloudCover}% cloud`, 9); line('Map snapshot equivalent', 13, '#0f172a'); line(`${payload.mapSnapshot.view}. Layers: ${payload.mapSnapshot.layers.join(', ')}. ${payload.mapSnapshot.comparison}.`, 9);
  line('Affected area by category', 13, '#0f172a'); Object.entries(payload.summary.affectedAreaByCategory).forEach(([category, area]) => line(`${category}: ${area.toFixed(1)} km²`, 9));
  line('Recommended inspection zones', 13, '#0f172a'); line(payload.recommendedInspectionZones.join(' → '), 9);
  y += 4; doc.setDrawColor(203, 213, 225); doc.line(left, y, 552, y); y += 22; line('Ranked priority zones', 13, '#0f172a');
  payload.regions.forEach((region, index) => { line(`${index + 1}. ${region.id} · ${region.priorityLevel} · priority ${region.priority}/100 · confidence ${region.confidence}%`, 11, '#0f172a'); line(`${region.changeType}. ${region.recommendedAction}`, 9); });
  if (y > 690) { doc.addPage(); y = 48; }
  line('Processing steps and quality notes', 13, '#0f172a'); payload.processing.steps.forEach((step, index) => line(`${index + 1}. ${step}`, 9)); payload.processing.methods.forEach((method) => line(`${method.name}: ${method.available ? `${method.contribution}% contribution` : 'unavailable'} — ${method.detail}`, 9)); payload.processing.warnings.forEach((warning) => line(`Warning: ${warning}`, 9, '#a16207'));
  line('Known limitations', 13, '#0f172a'); payload.knownLimitations.forEach((item) => line(`• ${item}`, 9));
  doc.setFontSize(8); doc.setTextColor('#64748b'); doc.text(`Generated ${new Date(payload.generatedAt).toLocaleString()} · DisasterLens AI · ${DISCLAIMER}`, left, 800);
  doc.save(`${event.id}-incident-report.pdf`);
}
