import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'L2 정규화: Loss에 가중치 제곱합을 더함',
    body: 'L_total = L_data + (λ/2)‖w‖² — gradient에 λw가 추가되어 가중치가 커지는 것을 억제.',
  },
  {
    label: 'Weight Decay: 업데이트 시 가중치를 직접 축소',
    body: 'w ← w - lr·∇L - lr·λ·w — Adam 같은 적응형 옵티마이저에서 L2와 효과가 달라짐.',
  },
  {
    label: 'Adam + L2 vs AdamW: Decoupled Weight Decay',
    body: 'Adam에서 L2 → gradient에 λw 추가 → 적응 학습률로 나눠져 효과 약화.\nAdamW → 가중치 축소를 gradient 밖에서 직접 수행 → 의도대로 동작.',
  },
  {
    label: '적절한 λ 범위와 효과',
    body: 'λ = 1e-4 ~ 1e-2 범위 탐색. 너무 크면 underfitting(가중치 전부 0), 너무 작으면 효과 없음.',
  },
];

export const COLORS = {
  l2: '#3b82f6',
  wd: '#10b981',
  adamw: '#8b5cf6',
  warn: '#ef4444',
};
