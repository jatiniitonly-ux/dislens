export interface ConfusionMetrics {
  truePositive: number; falsePositive: number; falseNegative: number; trueNegative: number;
  iou: number | null; precision: number | null; recall: number | null; f1: number | null; accuracy: number | null; falsePositiveRate: number | null; falseNegativeRate: number | null;
}

const ratio = (numerator: number, denominator: number) => denominator > 0 ? numerator / denominator : null;

export function evaluateBinaryMask(predicted: ArrayLike<boolean | number>, truth: ArrayLike<boolean | number>): ConfusionMetrics {
  if (predicted.length !== truth.length) throw new Error('Prediction and ground-truth masks must have the same length.');
  let truePositive = 0; let falsePositive = 0; let falseNegative = 0; let trueNegative = 0;
  for (let i = 0; i < predicted.length; i += 1) {
    const p = Boolean(predicted[i]); const t = Boolean(truth[i]);
    if (p && t) truePositive += 1; else if (p && !t) falsePositive += 1; else if (!p && t) falseNegative += 1; else trueNegative += 1;
  }
  const precision = ratio(truePositive, truePositive + falsePositive); const recall = ratio(truePositive, truePositive + falseNegative);
  return { truePositive, falsePositive, falseNegative, trueNegative, iou: ratio(truePositive, truePositive + falsePositive + falseNegative), precision, recall, f1: precision !== null && recall !== null ? ratio(2 * precision * recall, precision + recall) : null, accuracy: ratio(truePositive + trueNegative, predicted.length), falsePositiveRate: ratio(falsePositive, falsePositive + trueNegative), falseNegativeRate: ratio(falseNegative, falseNegative + truePositive) };
}
