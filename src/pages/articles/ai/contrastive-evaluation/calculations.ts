const round = (value: number, digits = 3) => Number(value.toFixed(digits));

function wilsonInterval(successes: number, sampleSize: number, z = 1.959963984540054) {
  const rate = successes / sampleSize;
  const denominator = 1 + (z * z) / sampleSize;
  const center = (rate + (z * z) / (2 * sampleSize)) / denominator;
  const halfWidth =
    (z * Math.sqrt(
      (rate * (1 - rate)) / sampleSize + (z * z) / (4 * sampleSize * sampleSize),
    )) /
    denominator;

  return [round((center - halfWidth) * 100, 1), round((center + halfWidth) * 100, 1)] as const;
}

const buckets = [
  { id: "high", label: "높은 유사도", population: 100, reviewed: 20, hiddenPositives: 8 },
  { id: "medium", label: "중간 유사도", population: 900, reviewed: 20, hiddenPositives: 2 },
  { id: "low", label: "낮은 유사도", population: 9000, reviewed: 20, hiddenPositives: 0 },
] as const;

const enrichedBuckets = buckets.map((bucket) => ({
  ...bucket,
  observedRate: bucket.hiddenPositives / bucket.reviewed,
  wilson95: wilsonInterval(bucket.hiddenPositives, bucket.reviewed),
}));

const population = enrichedBuckets.reduce((sum, bucket) => sum + bucket.population, 0);
const reviewed = enrichedBuckets.reduce((sum, bucket) => sum + bucket.reviewed, 0);
const hiddenPositives = enrichedBuckets.reduce(
  (sum, bucket) => sum + bucket.hiddenPositives,
  0,
);

const seedGains = [0.02, -0.01, 0, 0.01, -0.02] as const;

export const CONTRASTIVE_EVALUATION_FIXTURE = {
  baselineRevision: "encoder-v7",
  candidateRevision: "encoder-v8",
  minerRevision: "miner-v5",
  indexRevision: "catalog-2026-10-24",
  buckets: enrichedBuckets,
  population,
  reviewed,
  hiddenPositives,
  naiveSampleRate: round(hiddenPositives / reviewed, 4),
  weightedPopulationRate: round(
    enrichedBuckets.reduce(
      (sum, bucket) => sum + bucket.population * bucket.observedRate,
      0,
    ) / population,
    4,
  ),
  seedGains,
  meanSeedGain: round(
    seedGains.reduce<number>((sum, gain) => sum + gain, 0) / seedGains.length,
    4,
  ),
  decision: "REVISE",
} as const;
