import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'L2 + Adam 문제 — λ·θ가 m, v에도 적응', body: 'L2: ∇L → ∇L + λ·θ → Adam이 이것에도 적응 → decay 약화' },
  { label: 'AdamW 분리 — decay를 Adam 밖으로', body: 'θ = θ − η·(m̂/(√v̂+ε) + λ·θ) — λ·θ가 적응과 독립' },
  { label: 'Weight 감소 비교 — AdamW가 일관적 decay', body: '큰 weight는 항상 λ만큼 감소, Adam 적응성과 무관' },
];

/* 4개 weight의 초기값 */
export const WEIGHTS = [
  { label: 'w₁', init: 5.0 },
  { label: 'w₂', init: 3.0 },
  { label: 'w₃', init: 1.5 },
  { label: 'w₄', init: 0.5 },
];

/* L2+Adam: 큰 weight에 불균등한 decay */
export const L2_DECAY = [
  [5.0, 3.0, 1.5, 0.5],   // t=0
  [4.5, 2.9, 1.3, 0.48],  // t=1 (적응 때문에 큰 w는 덜 감소)
  [4.2, 2.75, 1.15, 0.45],
  [4.0, 2.6, 1.0, 0.42],
];

/* AdamW: 일관적 비율 decay */
export const ADAMW_DECAY = [
  [5.0, 3.0, 1.5, 0.5],
  [4.3, 2.58, 1.29, 0.43],  // 모두 ~14% 감소
  [3.7, 2.22, 1.11, 0.37],
  [3.2, 1.91, 0.96, 0.32],
];

export const COLORS = {
  l2: '#ef4444',
  adamw: '#10b981',
  axis: '#64748b',
};
