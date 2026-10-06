import { describe, expect, it } from 'vitest';
import { demoRegions } from '../src/data/demo';
import { calculateRiskIndex } from '../src/engine/risk';

describe('location risk index', () => {
  it('returns bounded explainable components', () => {
    const risk = calculateRiskIndex(demoRegions[0]);
    expect(risk.overall).toBeGreaterThanOrEqual(0);
    expect(risk.overall).toBeLessThanOrEqual(100);
    expect(risk.explanation).toContain('hazard signal');
    expect(risk.actions.length).toBe(3);
  });
});
