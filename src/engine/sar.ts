export interface SarChangeFeatures { vvDifference: number; vhDifference: number; vvVhRatioDifference: number; logRatioChange: number; detector: 'SARChangeDetector'; warnings: string[]; }

export function calculateSarChange(preVV: number, postVV: number, preVH?: number, postVH?: number): SarChangeFeatures {
  if (![preVV, postVV, preVH, postVH].filter((value) => value !== undefined).every(Number.isFinite)) throw new Error('SAR values must be finite numbers.');
  const vvDifference = postVV - preVV; const vhDifference = preVH !== undefined && postVH !== undefined ? postVH - preVH : 0;
  const preRatio = preVH !== undefined && Math.abs(preVH) > 1e-9 ? preVV / preVH : 0; const postRatio = postVH !== undefined && Math.abs(postVH) > 1e-9 ? postVV / postVH : 0;
  return { vvDifference, vhDifference, vvVhRatioDifference: postRatio - preRatio, logRatioChange: Math.log10(Math.max(Math.abs(postVV), 1e-9) / Math.max(Math.abs(preVV), 1e-9)), detector: 'SARChangeDetector', warnings: preVH === undefined || postVH === undefined ? ['VH unavailable; VV-only SAR change was calculated.'] : [] };
}
