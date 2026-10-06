import { jsPDF } from 'jspdf';
import type { EventRecord, ReportPayload } from '../domain/types';

export const DISCLAIMER = 'AI-generated decision support. Results require independent field verification.';

export function createReportPayload(event: EventRecord, selectedZoneId = event.result.regions[0]?.id ?? 'PENDING'): ReportPayload {
  const regions = event.result.regions;
  const infrastructure = regions.reduce((sum, region) => sum + region.infrastructure.buildings + region.infrastructure.hospitals + region.infrastructure.shelters + region.infrastructure.bridges, 0);
  const exposedPopulation = regions.reduce((sum, region) => sum + region.exposedPopulation, 0);
  const averageConfidence = Math.round(regions.reduce((sum, region) => sum + region.confidence, 0) / Math.max(regions.length, 1));
  const affectedAreaByCategory = regions.reduce<Record<string, number>>((categories, region) => { categories[region.changeType] = (categories[region.changeType] ?? 0) + region.polygon.areaKm2; return categories; }, {});
  return {
    reportVersion: '0.1-demo', generatedAt: new Date().toISOString(), disclaimer: DISCLAIMER,
    event: { id: event.id, name: event.name, type: event.type, region: event.region, eventDate: event.eventDate, synthetic: event.synthetic },
    imagery: { pre: event.preImagery, post: event.postImagery },
    processing: { status: event.result.status, methods: event.result.methods, warnings: event.result.warnings, baselineAgreement: event.result.baselineAgreement, steps: ['Validate file type, size and metadata', 'Align imagery to a common ROI and apply quality masks', 'Run baseline pixel difference', 'Run NDWI flood signal when Green and NIR bands are available', 'Clean detections, polygonize regions and compute spatial overlays', 'Score priority, confidence and uncertainty'], priorityWeights: { severity: 0.35, criticalInfrastructure: 0.25, populationExposure: 0.2, accessibilityDifficulty: 0.1, confidence: 0.1 } },
    summary: { affectedAreaKm2: event.result.improvedAffectedAreaKm2, affectedAreaByCategory, criticalZones: regions.filter((region) => region.priorityLevel === 'Critical').length, infrastructure, exposedPopulation, averageConfidence, baselineAreaKm2: event.result.baselineAffectedAreaKm2, improvedAreaKm2: event.result.improvedAffectedAreaKm2 },
    mapSnapshot: { view: 'Synthetic Kosi floodplain cartographic surface', selectedZoneId, layers: ['Change probability', 'Roads', 'Hospitals', 'Shelters', 'Uncertain regions'], comparison: `Baseline ${event.result.baselineAffectedAreaKm2.toFixed(1)} km² vs improved ${event.result.improvedAffectedAreaKm2.toFixed(1)} km²` },
    recommendedInspectionZones: regions.slice().sort((a, b) => b.priority - a.priority).map((region) => region.id),
    regions,
    knownLimitations: ['Synthetic demonstration data is not a live satellite observation.', 'Overlap indicates potentially affected infrastructure and requires field verification.', 'No field, drone, or human-verified evidence is included in this report.'],
  };
}

export function downloadJson(event: EventRecord, selectedZoneId?: string) {
  const payload = createReportPayload(event, selectedZoneId);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = `${event.id}-incident-report.json`; link.click();
  URL.revokeObjectURL(url);
}

export function downloadPdf(event: EventRecord, selectedZoneId?: string) {
  const payload = createReportPayload(event, selectedZoneId);
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const left = 42; let y = 48;
  const line = (text: string, size = 10, color = '#334155') => { doc.setFontSize(size); doc.setTextColor(color); const lines = doc.splitTextToSize(text, 510); doc.text(lines, left, y); y += lines.length * (size + 4) + 8; };
  doc.setFillColor(11, 17, 27); doc.rect(0, 0, 595, 110, 'F');
  doc.setTextColor(84, 214, 210); doc.setFontSize(22); doc.text('DISASTERLENS AI', left, 52);
  doc.setTextColor(224, 231, 239); doc.setFontSize(10); doc.text('INCIDENT INTELLIGENCE REPORT · SYNTHETIC DEMO', left, 76);
  y = 140; line(payload.disclaimer, 11, '#c05a32'); line(`${payload.event.name} · ${payload.event.region} · ${payload.event.eventDate}`, 14, '#0f172a');
  line(`Affected area: ${payload.summary.affectedAreaKm2.toFixed(1)} km²  |  Critical zones: ${payload.summary.criticalZones}  |  Exposed population: ${payload.summary.exposedPopulation.toLocaleString()}  |  Average confidence: ${payload.summary.averageConfidence}%`, 10);
  line(`Baseline vs improved: ${payload.summary.baselineAreaKm2.toFixed(1)} km² → ${payload.summary.improvedAreaKm2.toFixed(1)} km²  |  Selected zone: ${payload.mapSnapshot.selectedZoneId}`, 10);
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
