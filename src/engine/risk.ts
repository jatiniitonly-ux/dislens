import type { DetectedRegion } from '../domain/types';

export type RiskBand = 'Extreme' | 'High' | 'Moderate' | 'Low';

export interface RiskIndex {
  overall: number;
  band: RiskBand;
  hazard: number;
  exposure: number;
  vulnerability: number;
  evacuationDifficulty: number;
  explanation: string;
  actions: string[];
}

const bandFor = (score: number): RiskBand => score >= 80 ? 'Extreme' : score >= 60 ? 'High' : score >= 35 ? 'Moderate' : 'Low';

export function calculateRiskIndex(region: DetectedRegion): RiskIndex {
  const hazard = Math.round(region.severity * 0.65 + region.confidence * 0.35);
  const exposure = Math.round(Math.min(100, region.exposedPopulation / 220) * 0.7 + Math.min(100, (region.infrastructure.buildings + region.infrastructure.hospitals * 20 + region.infrastructure.shelters * 10) / 2) * 0.3);
  const vulnerability = Math.round(Math.min(100, 35 + (region.infrastructure.isolated ? 25 : 0) + (region.infrastructure.majorRoute ? 15 : 0) + (region.uncertainty.length * 5)));
  const evacuationDifficulty = Math.round(Math.min(100, region.infrastructure.isolated ? 88 : 35 + region.infrastructure.affectedRoadKm * 8 + region.infrastructure.nearestShelterKm * 7));
  const overall = Math.round(hazard * 0.35 + exposure * 0.3 + vulnerability * 0.2 + evacuationDifficulty * 0.15);
  const actions = [
    overall >= 60 ? 'Prioritize field verification and evacuation-route assessment.' : 'Maintain monitoring and verify before escalation.',
    region.infrastructure.isolated ? 'Check alternate access and emergency transport routes.' : 'Confirm road access and nearest shelter capacity.',
    region.exposedPopulation > 10000 ? 'Coordinate population messaging for the exposed area.' : 'Review local population and facility data before dispatch.',
  ];
  return { overall, band: bandFor(overall), hazard, exposure, vulnerability, evacuationDifficulty, explanation: `Risk combines ${hazard}/100 hazard signal, ${exposure}/100 exposure, ${vulnerability}/100 location vulnerability, and ${evacuationDifficulty}/100 evacuation difficulty. It is an AI-assisted prioritization estimate, not a confirmed safety determination.`, actions };
}
