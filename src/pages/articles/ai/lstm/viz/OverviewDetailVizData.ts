import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Vanishing Gradient — 기울기가 사라지는 이유',
    body: 'Vanilla RNN: hₜ = tanh(Wₕₕ·hₜ₋₁ + Wₓₕ·xₜ + b).\n역전파 시 각 시간 단계마다 Wₕₕ를 반복 곱셈 — ∂hₜ/∂hₖ = ∏(Wₕₕ · diag(tanh\'(…))).\nspectral radius |λ_max(Wₕₕ)| < 1이면 기울기가 기하급수적으로 감소.\n예: |λ|=0.8, 20단계 → 0.8²⁰ = 0.012 — 기울기의 98.8%가 소실.\n이것이 바닐라 RNN이 장기 의존성(long-term dependency)을 학습하지 못하는 근본 원인.',
  },
  {
    label: '② Exploding Gradient — 기울기 폭발과 완화책',
    body: '|λ_max(Wₕₕ)| > 1이면 기울기가 기하급수적으로 증가 — NaN/Inf 발생.\n완화책: gradient clipping — ‖g‖ > θ일 때 g ← g·(θ/‖g‖).\nθ는 보통 1~5로 설정. 방향은 보존하되 크기만 제한.\n소실은 clipping으로 해결 불가 — 구조적 변경이 필요 → LSTM 등장 배경.',
  },
  {
    label: '③ LSTM의 핵심 아이디어 — 덧셈 경로',
    body: 'RNN: hₜ = tanh(W·hₜ₋₁) — 곱셈만으로 정보 전달 → 기울기 축소.\nLSTM: Cₜ = fₜ⊙Cₜ₋₁ + iₜ⊙C̃ₜ — 덧셈으로 정보 전달.\n∂Cₜ/∂Cₜ₋₁ = fₜ (forget gate 값) — 곱셈이 아닌 gate 값이 기울기 결정.\nfₜ ≈ 1이면 기울기가 거의 그대로 전달 → "gradient highway".\nHighreiter & Schmidhuber (1997)의 핵심 기여: 정보를 선택적으로 기억·망각하는 게이트 구조.',
  },
  {
    label: '④ LSTM의 위상 — 과거와 현재',
    body: '1997 LSTM 발표 → 2014 Seq2Seq + Attention → 2017 Transformer.\nTransformer 등장 후 NLP·번역·생성에서 LSTM 대부분 대체.\n여전히 유효한 영역: 시계열 예측, 강화학습, 임베디드/모바일(저자원 환경).\n2023~: Mamba(SSM), RWKV(RNN-Transformer 하이브리드) 등 RNN 계열 재부상.\nLSTM 학습 의의: 게이트·셀 상태·기울기 경로 개념은 현대 아키텍처에도 영향.',
  },
];

export const RNN_C = '#ef4444';
export const LSTM_C = '#10b981';
