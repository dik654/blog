const round = (value: number, digits = 3) => Number(value.toFixed(digits));

export const UNIT_GEOMETRY_FIXTURE = {
  cosine: 0.8,
  squaredDistance: round(2 - 2 * 0.8, 1),
  anchor: [1, 0] as const,
  positive: [0.8, 0.6] as const,
} as const;

const positiveSquaredDistance = UNIT_GEOMETRY_FIXTURE.squaredDistance;
const margin = 0.2;

const candidates = [
  {
    id: "B₁",
    catalogId: "catalog-817",
    relation: "hidden-positive",
    squaredDistance: 0.35,
    legalNegative: false,
    difficulty: "관계 필터에서 제외",
  },
  {
    id: "C₁",
    catalogId: "catalog-205",
    relation: "negative",
    squaredDistance: 0.3,
    legalNegative: true,
    difficulty: "hard",
  },
  {
    id: "D₁",
    catalogId: "catalog-344",
    relation: "negative",
    squaredDistance: 0.5,
    legalNegative: true,
    difficulty: "semi-hard",
  },
  {
    id: "E₁",
    catalogId: "catalog-902",
    relation: "negative",
    squaredDistance: 0.9,
    legalNegative: true,
    difficulty: "easy",
  },
] as const;

export const TRIPLET_MARGIN_FIXTURE = {
  anchor: "A₁",
  positive: "A₂",
  positiveSquaredDistance,
  margin,
  upperBoundary: round(positiveSquaredDistance + margin, 1),
  candidates: candidates.map((candidate) => ({
    ...candidate,
    loss: round(
      Math.max(
        0,
        positiveSquaredDistance - candidate.squaredDistance + margin,
      ),
      2,
    ),
    semiHard:
      candidate.legalNegative &&
      positiveSquaredDistance < candidate.squaredDistance &&
      candidate.squaredDistance < positiveSquaredDistance + margin,
  })),
  generatedCount: candidates.length,
  legalCount: candidates.filter((candidate) => candidate.legalNegative).length,
  semiHardCount: candidates.filter(
    (candidate) =>
      candidate.legalNegative &&
      positiveSquaredDistance < candidate.squaredDistance &&
      candidate.squaredDistance < positiveSquaredDistance + margin,
  ).length,
  selected: "D₁",
} as const;
