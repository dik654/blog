import type { StepDef } from '@/components/ui/step-viz';

export const C = { dot: '#6366f1', general: '#10b981', scaled: '#f59e0b' };

export const STEPS: StepDef[] = [
  { label: 'Dot-Product Attention', body: 's·h = 0.7×0.8 + 0.3×0.2 = 0.62. 디코더 상태와 인코더 상태의 내적으로 유사도를 측정.' },
  { label: 'General (Bilinear) Attention', body: 's^T W h — 학습 가능한 가중치 행렬 W가 유사도 함수를 학습. 더 유연한 비교.' },
  { label: 'Scaled Dot-Product', body: 'score / sqrt(d_k). d_k=64이면 sqrt(64)=8로 나눔. 내적 값이 커지면 softmax가 포화되는 것을 방지.' },
];

export const S_VEC = [0.7, 0.3];
export const H_VEC = [0.8, 0.2];
export const DOT_RESULT = 0.62;
