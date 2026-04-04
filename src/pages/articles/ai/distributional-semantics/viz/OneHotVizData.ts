import type { StepDef } from '@/components/ui/step-viz';

export const WORDS = ['고양이', '강아지', '사과', '바나나'];
export const V = WORDS.length;

export const ONE_HOT: number[][] = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

export const DENSE: number[][] = [
  [0.82, -0.15, 0.41],
  [0.79, -0.21, 0.38],
  [-0.12, 0.88, 0.05],
  [-0.09, 0.91, 0.11],
];

export const STEPS: StepDef[] = [
  { label: 'One-Hot: 각 단어에 고유 위치 1', body: 'V차원 희소 벡터 — 자기 위치만 1, 나머지 0' },
  { label: 'One-Hot 유사도 = 0', body: '모든 단어 쌍이 직교 — 의미적 거리 구분 불가' },
  { label: 'Dense: 저차원 밀집 벡터', body: '3차원 연속 벡터 — 유사 단어가 가까운 값' },
  { label: 'Dense 유사도로 의미 비교', body: '고양이·강아지 cos=0.98 / 사과·바나나 cos=0.99' },
];

export const CELL = 28;
export const GAP = 3;
