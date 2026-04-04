import type { StepDef } from '@/components/ui/step-viz';

export const C = { enc: '#6366f1', dec: '#10b981', score: '#f59e0b' };

export const H_VECS = [[0.8, 0.2], [0.1, 0.9], [0.5, 0.5], [0.3, 0.7]];
export const S_VEC = [0.4, 0.8];
export const SCORES = [2.1, 3.5, 1.0, 0.4];
export const PROBS = [0.30, 0.50, 0.12, 0.08];
export const CTX = [0.33, 0.56];

export const STEPS: StepDef[] = [
  { label: '1단계: 정렬 점수 계산 (MLP)', body: `e = v^T tanh(W·s + U·h). 디코더 s=[${S_VEC}]과 각 인코더 h의 유사도를 MLP로 계산.` },
  { label: '2단계: Softmax → 가중치', body: `softmax([${SCORES.join(', ')}]) = [${PROBS.join(', ')}]. h₂에 가장 높은 가중치 0.50 부여.` },
  { label: '3단계: 컨텍스트 벡터 생성', body: `c = 0.30×h₁ + 0.50×h₂ + 0.12×h₃ + 0.08×h₄ = [${CTX.map(v => v.toFixed(2)).join(', ')}]` },
];
