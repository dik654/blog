export interface VideoFrameScore {
  timestamp: string;
  cropId: string;
  score: number;
}

export const CANDIDATE_TIMESTAMPS = [
  "00:00",
  "00:01",
  "00:02",
  "00:03",
  "00:04",
  "00:05",
  "00:06",
  "00:07",
  "00:08",
  "00:09",
] as const;

export const VIDEO_FRAME_SCORES: readonly VideoFrameScore[] = [
  { timestamp: "00:00", cropId: "crop-00-a1", score: 0.12 },
  { timestamp: "00:01", cropId: "crop-01-a1", score: 0.18 },
  { timestamp: "00:03", cropId: "crop-03-a1", score: 0.35 },
  { timestamp: "00:04", cropId: "crop-04-a1", score: 0.82 },
  { timestamp: "00:06", cropId: "crop-06-a1", score: 0.76 },
  { timestamp: "00:09", cropId: "crop-09-a1", score: 0.14 },
] as const;

export const SORTED_VIDEO_FRAME_SCORES = [...VIDEO_FRAME_SCORES].sort(
  (left, right) => right.score - left.score,
);

const SCORE_SUM = VIDEO_FRAME_SCORES.reduce((sum, row) => sum + row.score, 0);

export const VIDEO_DECISION_TRACE = {
  candidateCount: CANDIDATE_TIMESTAMPS.length,
  validCount: VIDEO_FRAME_SCORES.length,
  scoreSum: SCORE_SUM,
  mean: SCORE_SUM / VIDEO_FRAME_SCORES.length,
  max: SORTED_VIDEO_FRAME_SCORES[0].score,
  top2:
    (SORTED_VIDEO_FRAME_SCORES[0].score + SORTED_VIDEO_FRAME_SCORES[1].score) /
    2,
  coverage: VIDEO_FRAME_SCORES.length / CANDIDATE_TIMESTAMPS.length,
  calibratedTop2: 0.72,
  scoreThreshold: 0.7,
  minimumCoverage: 0.7,
} as const;

export const PARITY_RECEIPT = [
  {
    label: "원본 묶음",
    spatial: "같은 split",
    temporal: "같은 split",
  },
  {
    label: "평가 시각",
    spatial: "10개",
    temporal: "10개",
  },
  {
    label: "유효 입력",
    spatial: "같은 crop 6개",
    temporal: "같은 crop 6개",
  },
  {
    label: "집계",
    spatial: "상위 2개 평균",
    temporal: "상위 2개 평균",
  },
  {
    label: "보정",
    spatial: "같은 검증 split·방법",
    temporal: "같은 검증 split·방법",
  },
  {
    label: "측정",
    spatial: "같은 장비·지표",
    temporal: "같은 장비·지표",
  },
] as const;
