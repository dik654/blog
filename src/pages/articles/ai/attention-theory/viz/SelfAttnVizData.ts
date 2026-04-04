import type { StepDef } from '@/components/ui/step-viz';

export const C = { q: '#6366f1', k: '#10b981', v: '#f59e0b' };

export const STEPS: StepDef[] = [
  { label: 'Self-Attention: Q, K, V 생성', body: '입력 x=[0.8, 0.2]에 세 가지 가중치 행렬을 곱해 Q, K, V를 만든다. 같은 시퀀스 내에서 자기 자신을 참조.' },
  { label: 'Multi-Head Attention', body: '차원을 h개로 분할, 각 헤드가 독립적으로 어텐션. d_k=d_model/h. 서로 다른 관계를 병렬 학습.' },
  { label: 'Causal Mask (자기회귀)', body: '디코더에서 미래 토큰을 참조하지 못하도록 마스킹. 위치 j>i인 점수를 -inf로 설정 → softmax 후 0.' },
];

export const X_VEC = [0.8, 0.2];
export const Q_VEC = [0.7, 0.3];
export const K_VEC = [0.5, 0.6];
export const V_VEC = [0.4, 0.8];

export const QKV_ITEMS = [
  { label: 'Q', desc: '질의: 무엇을 찾을까', vec: [0.7, 0.3], c: C.q, x: 20 },
  { label: 'K', desc: '키: 참조 대상', vec: [0.5, 0.6], c: C.k, x: 170 },
  { label: 'V', desc: '값: 전달 정보', vec: [0.4, 0.8], c: C.v, x: 320 },
];

/** Pre-mask attention scores for causal mask demo (4x4) */
export const MASK_SCORES = [
  [0.5, 0.3, 0.1, 0.1],
  [0.2, 0.6, 0.1, 0.1],
  [0.1, 0.3, 0.4, 0.2],
  [0.1, 0.2, 0.3, 0.4],
];
