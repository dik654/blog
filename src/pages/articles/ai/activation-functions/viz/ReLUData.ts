import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'ReLU: f(x)=max(0,x) — 양수에서 기울기 1',
    body: 'x>0이면 기울기 항상 1. exp 연산 없이 비교 1회로 계산 완료',
  },
  {
    label: '깊은 층 기울기 전파 — Sigmoid vs ReLU',
    body: 'Sigmoid: 0.25⁵ ≈ 0.001 | ReLU: 1⁵ = 1. ReLU는 기울기가 그대로 전파',
  },
  {
    label: 'Dying ReLU — 음수 뉴런이 영구 비활성화',
    body: '입력 < 0 → 출력=0, 기울기=0 → 가중치 갱신 불가 → 뉴런 사망',
  },
];

export const COLORS = {
  relu: '#3b82f6',
  sigmoid: '#6366f180',
  dead: '#ef4444',
  alive: '#10b981',
};
