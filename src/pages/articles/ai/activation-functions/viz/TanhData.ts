import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Sigmoid vs Tanh — 곡선 비교',
    body: 'Sigmoid: 0~1, Tanh: −1~+1. tanh는 원점 대칭이라 zero-centered',
  },
  {
    label: 'w₁-w₂ 평면 — tanh는 직선 경로 가능',
    body: '출력이 음수도 가능 → ∂L/∂w 부호가 독립 → 대각선 이동 가능',
  },
];

export function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export function tanh(x: number) {
  return Math.tanh(x);
}

export const COLORS = {
  sigmoid: '#6366f180',
  tanh: '#10b981',
  path: '#10b981',
  zigzag: '#f59e0b',
};
