import { describe, expect, it } from 'vitest';
import { confidenceScore, weightedScore } from '../src/engine/analysis';

describe('transparent scoring', () => {
  it('computes the default priority formula', () => {
    expect(weightedScore({ severity: 95, criticalInfrastructure: 93, populationExposure: 88, accessibilityDifficulty: 95, confidence: 91 })).toBe(93);
  });
  it('computes confidence with quality-adjusted factors', () => {
    expect(confidenceScore({ methodAgreement: 95, imageQuality: 91, temporalCloseness: 98, spatialConsistency: 89 })).toBe(94);
  });
  it('supports configurable weights', () => {
    expect(weightedScore({ severity: 100, criticalInfrastructure: 0, populationExposure: 0, accessibilityDifficulty: 0, confidence: 0 }, { severity: 1, criticalInfrastructure: 0, populationExposure: 0, accessibilityDifficulty: 0, confidence: 0 })).toBe(100);
  });
});
