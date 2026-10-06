import type { RegionalIndicatorSnapshot } from '../domain/types';

/**
 * Starter dataset supplied in deliverables_2_items.pdf.
 * The source header was truncated after reported_dengue_; trailing numeric
 * fields are retained but deliberately not assigned invented indicator names.
 */
export const mumbaiRegionalEvidence: RegionalIndicatorSnapshot[] = [
  { city: 'Mumbai', ward: 'All Wards', zone: 'City', month: '2026-01', populationEst: 12500000, pm25Ugm3: 58, aqiAvg: 152, avgTempC: 24.8, totalRainfallMm: 1.2, waterSupplyLpcd: 135, powerOutageHours: 6.8, reportedDengue: 420, unlabelledNumericValues: [190, 3120, 410, 540, 78, 7100, 225, 7.4], source: 'Compiled municipal/open data' },
  { city: 'Mumbai', ward: 'All Wards', zone: 'City', month: '2026-02', populationEst: 12510000, pm25Ugm3: 54, aqiAvg: 145, avgTempC: 26.1, totalRainfallMm: 0.8, waterSupplyLpcd: 136, powerOutageHours: 6.1, reportedDengue: 380, unlabelledNumericValues: [175, 2980, 398, 515, 77, 7050, 230, 7.3], source: 'Compiled municipal/open data' },
  { city: 'Mumbai', ward: 'All Wards', zone: 'City', month: '2026-03', populationEst: 12520000, pm25Ugm3: 49, aqiAvg: 132, avgTempC: 28.4, totalRainfallMm: 3.4, waterSupplyLpcd: 137, powerOutageHours: 5.4, reportedDengue: 360, unlabelledNumericValues: [162, 3055, 402, 522, 79, 7120, 238, 7.2], source: 'Compiled municipal/open data' },
  { city: 'Mumbai', ward: 'All Wards', zone: 'City', month: '2026-04', populationEst: 12530000, pm25Ugm3: 46, aqiAvg: 125, avgTempC: 30.2, totalRainfallMm: 9.7, waterSupplyLpcd: 138, powerOutageHours: 5.0, reportedDengue: 405, unlabelledNumericValues: [170, 3180, 415, 548, 80, 7200, 242, 7.1], source: 'Compiled municipal/open data' },
  { city: 'Mumbai', ward: 'All Wards', zone: 'City', month: '2026-05', populationEst: 12540000, pm25Ugm3: 44, aqiAvg: 120, avgTempC: 31.1, totalRainfallMm: 28.5, waterSupplyLpcd: 139, powerOutageHours: 4.8, reportedDengue: 460, unlabelledNumericValues: [182, 3260, 420, 566, 81, 7280, 246, 7.0], source: 'Compiled municipal/open data' },
  { city: 'Mumbai', ward: 'All Wards', zone: 'City', month: '2026-06', populationEst: 12550000, pm25Ugm3: 39, aqiAvg: 108, avgTempC: 29.5, totalRainfallMm: 512.0, waterSupplyLpcd: 141, powerOutageHours: 4.2, reportedDengue: 690, unlabelledNumericValues: [260, 2940, 390, 620, 83, 7400, 210, 6.9], source: 'Compiled municipal/open data' },
];

export const mumbaiRegionalEvidenceMetadata = {
  datasetId: 'MUMBAI-REGIONAL-EVIDENCE-2026-STARTER',
  locationId: 'mumbai',
  retrievalSource: 'deliverables_2_items.pdf',
  retrievalDate: '2026-10-06',
  coverage: '2026-01 through 2026-06',
  granularity: 'city / all wards / monthly',
  caveat: 'The supplied CSV header was truncated. Eight trailing numeric fields are preserved as unlabelledNumericValues and must not be interpreted as named indicators.',
} as const;
