import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Forward + Loss 계산',
    body:
      'Forward: hₜ = tanh(W·hₜ₋₁ + U·xₜ + b), yₜ = softmax(V·hₜ + c)\n' +
      '각 시간 step의 손실: Lₜ = -log P(targetₜ | hₜ). 전체 손실: L = Σₜ Lₜ / T.\n' +
      'T=100, vocab=10K일 때 softmax 1회 = 10K 곱셈 → 전체 100만 연산.\n' +
      '모든 hₜ를 메모리에 저장해야 역전파 가능 → 공간 O(T·H).\n' +
      'teacher forcing: 학습 시 yₜ₋₁ 대신 실제 targetₜ₋₁을 다음 입력으로 사용 → 수렴 가속.',
  },
  {
    label: '② Chain Rule — 시간 역방향 기울기',
    body:
      '∂L/∂W = Σₜ Σₖ₌₁ᵗ (∂Lₜ/∂hₜ) · (∂hₜ/∂hₖ) · (∂hₖ/∂W)\n' +
      '각 항의 의미:\n' +
      '• ∂Lₜ/∂hₜ = 시점 t의 손실이 은닉 상태 hₜ에 얼마나 민감한가 (출력층에서 오는 오차 신호)\n' +
      '• ∂hₜ/∂hₖ = 과거 시점 k의 은닉 상태가 현재 시점 t까지 얼마나 영향을 미치는가 (시간 거리 t-k만큼의 Jacobian 곱)\n' +
      '• ∂hₖ/∂W = 시점 k에서 가중치 W가 hₖ 계산에 어떻게 관여했는가 (local gradient)\n' +
      '핵심: ∂hₜ/∂hₖ = Πⱼ₌ₖ₊₁ᵗ Wₕₕᵀ·diag(1−hⱼ²) — Wₕₕ를 (t-k)번 곱하므로 거리가 멀수록 지수적 변화.',
  },
  {
    label: '③ Vanishing vs Exploding Gradient',
    body:
      'Wₕₕ의 최대 특이값 σ_max: σ_max < 1이면 ||∂hₜ/∂hₖ|| ≤ σ_maxᵗ⁻ᵏ → 0 수렴 (소실).\n' +
      'σ_max > 1이면 ||∂hₜ/∂hₖ|| → ∞ (폭발). tanh의 미분 최대값 = 1 → 추가 감쇄.\n' +
      '예: σ_max=0.9, t-k=50 → 0.9⁵⁰ = 0.0052 — 기울기가 200분의 1로 축소.\n' +
      '예: σ_max=1.1, t-k=50 → 1.1⁵⁰ = 117.4 — 기울기 117배 폭발 → NaN 발생.\n' +
      'LSTM의 cell state는 곱셈이 아닌 덧셈 경로 제공 → gradient highway로 소실 방지.',
  },
  {
    label: '④ Truncated BPTT + Gradient Clipping',
    body:
      'Truncated BPTT: 시퀀스를 K step 청크로 분할, 각 청크 내에서만 역전파.\n' +
      'K=20이 일반적. T=1000 → 50개 청크. 메모리 O(K·H)로 감소. 장거리 의존성은 포기.\n' +
      'Gradient Clipping: ||g|| > θ이면 g ← g · θ/||g||. θ=5~10이 실무 기본값.\n' +
      'clipping은 방향 보존, 크기만 제한 → 학습 안정성 확보.\n' +
      '추가: orthogonal init (Wₕₕ 직교 초기화) → σ_max ≈ 1 → 초기 gradient 안정.',
  },
];

export const FWD_C = '#6366f1';
export const BWD_C = '#ef4444';
export const CLIP_C = '#10b981';
export const WARN_C = '#f59e0b';
