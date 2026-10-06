import { describe, expect, it } from 'vitest';
import { blockedWorldPopExposure, localPopulationExposure, sumPopulationCells, WORLDPOP_PROVENANCE } from '../src/engine/population';
import type { DetectedRegion } from '../src/domain/types';

const region = (population: number, id: string): DetectedRegion => ({
  id, shortLabel: id, location: id, changeType: 'Strong detected change signal', priority: 80, priorityLevel: 'High', severity: 80, scoreFactors: { severity: 80, criticalInfrastructure: 0, populationExposure: 0, accessibilityDifficulty: 0, confidence: 90 }, confidence: 90, color: '#d96555',
  exposedPopulation: population, evidence: [], uncertainty: [], recommendedAction: 'Review', reviewStatus: 'Needs review',
  confidenceFactors: { methodAgreement: 90, imageQuality: 90, spatialConsistency: 90, temporalCloseness: 90 },
  polygon: { areaKm2: 1, centroid: { x: 0, y: 0 }, points: '0,0 1,0 1,1' },
  infrastructure: { buildings: 0, hospitals: 0, shelters: 0, bridges: 0, schools: 0, affectedRoadKm: 0, nearestHospitalKm: 0, nearestShelterKm: 0, majorRoute: false, isolated: false },
});

describe('population exposure sources', () => {
  it('keeps the local fixture separate and reconciles zone totals', () => {
    const result = localPopulationExposure([region(12, 'A'), region(8, 'B')]);
    expect(result.source).toBe('local-fixture');
    expect(result.estimatedPopulation).toBe(20);
    expect(result.zoneTotalsReconcile).toBe(true);
  });

  it('blocks WorldPop when the active flood mask is not georeferenced', () => {
    const result = blockedWorldPopExposure();
    expect(result.source).toBe('worldpop-india');
    expect(result.status).toBe('blocked');
    expect(result.estimatedPopulation).toBeUndefined();
    expect(result.blocker).toContain('georeferenced flood mask required');
    expect(result.provenance?.productUrl).toBe(WORLDPOP_PROVENANCE.productUrl);
    expect(result.provenance?.nodata).toBe(-99999);
  });

  it('calculates a reproducible fractional zonal sum without converting NoData to zero', () => {
    const result = sumPopulationCells([10, 20, 0, WORLDPOP_PROVENANCE.nodata], [1, 0.5, 1, 1]);
    expect(result.estimatedPopulation).toBe(20);
    expect(result.validPixels).toBe(3);
    expect(result.nodataPixels).toBe(1);
    expect(result.excludedFraction).toBe(0.25);
  });
});
