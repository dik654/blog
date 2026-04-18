import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Tanh 수식과 핵심 값',
    body: '수식: tanh(x) = (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ). 출력 범위 (−1, +1), 원점 대칭.\n도함수: tanh\'(x) = 1 − tanh²(x). 제곱 형태라 계산이 간편.\nSigmoid와의 관계: tanh(x) = 2·σ(2x) − 1 — 수직 2배 확대 + 수직 이동.\n핵심 값: tanh(0)=0, tanh(1)≈0.76, tanh(2)≈0.96, tanh(3)≈0.995.\n미분값: tanh\'(0)=1.0, tanh\'(1)≈0.42, tanh\'(2)≈0.07, tanh\'(3)≈0.01.\nx=0에서 기울기 1.0은 sigmoid의 0.25보다 4배 — gradient가 4배 더 강하게 전달된다.',
  },
  {
    label: 'Sigmoid 대비 3가지 장점',
    body: '① Zero-centered 출력 — tanh 평균 출력 ≈ 0. 다음 층 입력이 양수·음수 고르게 분포.\n∂L/∂wᵢ = δ·xᵢ에서 xᵢ가 ±이므로 gradient 방향이 자유 → zig-zag 경로 제거.\n② 최대 기울기 4배 — tanh\'(0)=1.0 vs σ\'(0)=0.25. gradient 감쇠가 4배 느림.\n10층 네트워크: tanh 최대 gradient ∝ 1.0¹⁰=1.0 vs sigmoid ∝ 0.25¹⁰≈10⁻⁶.\n③ 원점 대칭(odd function) — tanh(−x) = −tanh(x).\n음수 입력은 음수 출력, 양수 입력은 양수 출력 → 데이터의 부호 정보를 보존.\n1990년대 LeCun 등의 실험: 같은 구조에서 tanh가 sigmoid보다 수렴 속도 2~3배 빠름.',
  },
  {
    label: '한계 & LSTM에서의 역할',
    body: '한계: |x|>2에서 tanh\'(x)<0.07 → 여전히 vanishing gradient 발생.\n20층 네트워크에서 gradient ∝ 0.07²⁰ ≈ 8×10⁻²⁴ → 사실상 0.\n그러나 LSTM(1997, Hochreiter & Schmidhuber)이 이 한계를 구조적으로 해결.\nLSTM에서의 역할 분담: sigmoid는 gate(0~1 밸브), tanh는 candidate(−1~+1 값).\nforget gate: fₜ = σ(Wf·[hₜ₋₁, xₜ] + bf) — 이전 기억을 얼마나 유지할지 결정.\ncandidate: c̃ₜ = tanh(Wc·[hₜ₋₁, xₜ] + bc) — 새로운 기억 후보를 −1~+1로 생성.\ncell state 업데이트: cₜ = fₜ⊙cₜ₋₁ + iₜ⊙c̃ₜ — gate가 gradient 고속도로 역할.',
  },
];

export const COLORS = {
  tanh: '#10b981',
  sig: '#3b82f6',
  advantage: '#f59e0b',
  limit: '#ef4444',
  dim: '#94a3b8',
};
