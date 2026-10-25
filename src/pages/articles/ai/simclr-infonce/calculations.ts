const round = (value: number, digits = 3) => Number(value.toFixed(digits));

export const SIMCLR_BATCH_FIXTURE = {
  sourceCount: 3,
  viewCount: 6,
  anchorCount: 6,
  candidateCountPerAnchor: 5,
  negativeCountPerAnchor: 4,
} as const;

const similarity = [0.8, 0.4, 0.1, -0.1, 0] as const;
const temperature = 0.5;
const logits = similarity.map((value) => round(value / temperature, 1));
const exponentialScores = logits.map((value) => round(Math.exp(value), 3));
const partition = exponentialScores.reduce((sum, value) => sum + value, 0);
const positiveProbability = exponentialScores[0] / partition;

export const NT_XENT_FIXTURE = {
  anchor: "A₁",
  positive: "A₂",
  candidates: ["A₂", "B₁", "B₂", "C₁", "C₂"] as const,
  similarity,
  temperature,
  logits,
  exponentialScores,
  partition: round(partition, 3),
  positiveProbability: round(positiveProbability, 3),
  loss: round(-Math.log(positiveProbability), 3),
} as const;

export const TEMPERATURE_RATIO_FIXTURE = {
  similarityGap: 0.1,
  broadTemperature: 1,
  broadRatio: round(Math.exp(0.1 / 1), 2),
  sharpTemperature: 0.1,
  sharpRatio: round(Math.exp(0.1 / 0.1), 2),
} as const;
