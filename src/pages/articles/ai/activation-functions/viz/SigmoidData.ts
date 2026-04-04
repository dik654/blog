import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'σ(x) 곡선 + σ\'(x) 미분 곡선',
    body: 'σ\'(x) 최댓값은 0.25 (x=0). 양 끝에서 기울기가 0에 수렴',
  },
  {
    label: 'Vanishing Gradient — 5층 통과 시 기울기 소실',
    body: '각 층 최대 기울기 0.25 → 5층: 0.25⁵ ≈ 0.001. 앞쪽 층은 거의 학습 불가',
  },
  {
    label: 'Non-zero centered — w₁-w₂ 평면 지그재그',
    body: '출력 항상 양수 → ∂L/∂w 부호가 같아짐 → 1,3사분면으로만 이동 가능',
  },
];

/* σ(x) curve points, x from -6 to 6 */
export function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export function sigmoidDeriv(x: number) {
  const s = sigmoid(x);
  return s * (1 - s);
}

export const COLORS = {
  fn: '#6366f1',
  deriv: '#ef4444',
  bar: '#10b981',
  zigzag: '#f59e0b',
};
