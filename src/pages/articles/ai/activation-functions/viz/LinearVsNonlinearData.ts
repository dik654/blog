import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '선형 변환만 쌓으면 → 결국 하나의 직선',
    body: 'y = w₂(w₁x + b₁) + b₂ = (w₁w₂)x + (w₂b₁+b₂) — 아무리 깊어도 직선',
  },
  {
    label: '2층 예시: 층1(2x+1) → 층2(1.5z+2.5) = 3x+4',
    body: '합성해도 선형. XOR이나 곡선 경계를 절대 학습 불가',
  },
  {
    label: '활성화 함수를 넣으면 → 임의의 곡선을 학습 가능',
    body: '비선형 함수가 층 사이에 들어가면 Universal Approximation 성립',
  },
];

export const COLORS = {
  linear: '#6366f1',
  nonlinear: '#10b981',
};
