import type { DetectedRegion, PopulationExposureResult, PopulationProvenance } from '../domain/types';

export const WORLDPOP_PRODUCT_URL = 'https://data.worldpop.org/GIS/Population/Global_2015_2030/R2025A/2025/IND/v1/100m/constrained/ind_pop_2025_CN_100m_R2025A_v1.tif';

export const WORLDPOP_PROVENANCE: PopulationProvenance = {
  product: 'WorldPop Global 2 R2025A v1 · India constrained population counts',
  productUrl: WORLDPOP_PRODUCT_URL,
  year: 2025,
  release: 'R2025A',
  version: 'v1',
  downloadedAt: '2026-10-06',
  licence: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
  crs: 'EPSG:4326 / WGS84',
  pixelSize: '0.0008333333° × 0.0008333333° (approximately 100 m)',
  nodata: -99999,
  checksumSha256: '',
  inclusionMethod: 'Pending georeferenced fused-mask pipeline; no WorldPop total is reported until mask alignment is verified.',
};

export function localPopulationExposure(regions: DetectedRegion[]): PopulationExposureResult {
  const estimatedPopulation = regions.reduce((sum, region) => sum + region.exposedPopulation, 0);
  return { source: 'local-fixture', status: 'available', estimatedPopulation, selectedZonePopulation: regions[0]?.exposedPopulation ?? 0, zoneTotalsReconcile: true, inclusionMethod: 'Local benchmark fixture intersection; deterministic fixture counts.' };
}

export function blockedWorldPopExposure(): PopulationExposureResult {
  return { source: 'worldpop-india', status: 'blocked', provenance: WORLDPOP_PROVENANCE, blocker: 'Real population exposure unavailable: georeferenced flood mask required. The active 4×4 benchmark mask has illustrative placement and cannot be overlaid on WorldPop as real exposure.', inclusionMethod: WORLDPOP_PROVENANCE.inclusionMethod };
}

export function sumPopulationCells(values: number[], coverage: number[], nodata = WORLDPOP_PROVENANCE.nodata) {
  if (values.length !== coverage.length) throw new Error('Population values and coverage arrays must have equal length.');
  let estimatedPopulation = 0;
  let validPixels = 0;
  let nodataPixels = 0;
  values.forEach((value, index) => {
    if (value === nodata || !Number.isFinite(value)) { nodataPixels += 1; return; }
    const fraction = Math.max(0, Math.min(1, coverage[index]));
    estimatedPopulation += value * fraction;
    validPixels += 1;
  });
  return { estimatedPopulation, validPixels, nodataPixels, excludedFraction: values.length ? nodataPixels / values.length : 0 };
}
