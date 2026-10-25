const round = (value: number, digits = 3) => Number(value.toFixed(digits));

const candidates = [
  { id: "A₂", label: "신발", relation: "same-source", exponentialScore: 8 },
  { id: "B₁", label: "신발", relation: "same-label", exponentialScore: 4 },
  { id: "B₂", label: "신발", relation: "same-label", exponentialScore: 2 },
  { id: "C₁", label: "가방", relation: "different-label", exponentialScore: 1 },
  { id: "C₂", label: "가방", relation: "different-label", exponentialScore: 1 },
] as const;

const partition = candidates.reduce(
  (sum, candidate) => sum + candidate.exponentialScore,
  0,
);
const positives = candidates.filter(
  (candidate) => candidate.label === "신발",
);
const positiveProbabilitySum = positives.reduce(
  (sum, candidate) => sum + candidate.exponentialScore / partition,
  0,
);

export const SUPCON_BATCH_FIXTURE = {
  sourceCount: 3,
  viewCount: 6,
  anchor: "A₁",
  anchorLabel: "신발",
  views: [
    { id: "A₁", source: "A", label: "신발" },
    { id: "A₂", source: "A", label: "신발" },
    { id: "B₁", source: "B", label: "신발" },
    { id: "B₂", source: "B", label: "신발" },
    { id: "C₁", source: "C", label: "가방" },
    { id: "C₂", source: "C", label: "가방" },
  ] as const,
  candidates,
  candidateCount: candidates.length,
  positiveCount: positives.length,
  negativeCount: candidates.length - positives.length,
  partition,
  outsideLogLoss: round(
    -positives.reduce(
      (sum, candidate) =>
        sum + Math.log(candidate.exponentialScore / partition),
      0,
    ) / positives.length,
  ),
  insideLogLoss: round(
    -Math.log(positiveProbabilitySum / positives.length),
  ),
  outsideTargetWeights: positives.map(() => round(1 / positives.length)),
  insideTargetWeights: positives.map((candidate) =>
    round(
      candidate.exponentialScore /
        positives.reduce((sum, positive) => sum + positive.exponentialScore, 0),
    ),
  ),
} as const;
