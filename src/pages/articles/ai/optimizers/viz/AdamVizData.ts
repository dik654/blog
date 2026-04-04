import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '고정 학습률의 문제 — 파라미터마다 최적 η가 다름', body: '큰 그래디언트 파라미터는 작은 η, 작은 그래디언트는 큰 η가 필요' },
  { label: '1차 모멘트 m — 그래디언트의 이동 평균', body: 'm_t = β₁·m_{t-1} + (1−β₁)·g_t  (β₁=0.9)' },
  { label: '2차 모멘트 v — 그래디언트² 이동 평균', body: 'v_t = β₂·v_{t-1} + (1−β₂)·g_t²  (β₂=0.999)' },
  { label: '편향 보정 — 초기 0 편향 제거', body: 'm̂ = m/(1−β₁ᵗ), v̂ = v/(1−β₂ᵗ) — t가 작을 때 보정 효과 큼' },
  { label: '적응적 업데이트 — √v̂로 나눠 학습률 자동 조절', body: 'θ = θ − η·m̂/(√v̂+ε) — 그래디언트 큰 파라미터 → 학습률 감소' },
];

/* 3개 파라미터의 그래디언트 크기 (적응적 학습률 시연) */
export const PARAMS = [
  { label: 'θ₁', grad: 8.0, color: '#0ea5e9' },   // 큰 그래디언트
  { label: 'θ₂', grad: 1.5, color: '#10b981' },   // 중간
  { label: 'θ₃', grad: 0.3, color: '#f59e0b' },   // 작은 그래디언트
];

/* 스텝별 효과적 학습률 (정규화) */
export const EFF_LR = [
  [1.0, 1.0, 1.0],     // step 0: 고정
  [1.0, 1.0, 1.0],     // step 1: m만 (아직 같음)
  [0.35, 0.65, 1.0],   // step 2: v 도입
  [0.3, 0.6, 1.0],     // step 3: 보정 후
  [0.25, 0.55, 1.0],   // step 4: 최종 적응적
];

export const COLORS = { bar: '#8b5cf6', axis: '#64748b' };
