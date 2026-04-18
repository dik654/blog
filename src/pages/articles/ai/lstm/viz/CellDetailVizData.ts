import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 셀 상태 업데이트 — 덧셈이 핵심',
    body: 'Cₜ = fₜ ⊙ Cₜ₋₁ + iₜ ⊙ C̃ₜ — 두 단계: 삭제(×fₜ) + 추가(+새 정보).\nfₜ ⊙ Cₜ₋₁: 잊을 부분을 원소별로 제거 → 불필요한 과거 정보 삭제.\niₜ ⊙ C̃ₜ: 새 정보를 원소별로 추가 → 현재 입력에서 유용한 정보 저장.\n이 두 연산이 별개로 동작하므로 "선택적 기억·망각"이 가능.\n핵심: 곱셈(×Wₕₕ)이 아닌 덧셈(+)으로 정보 전달 → 기울기 경로 확보.',
  },
  {
    label: '② RNN vs LSTM — 기울기 비교',
    body: 'Vanilla RNN: ∂hₜ/∂hₖ = ∏(Wₕₕ · diag(tanh\'(…))) — 곱셈 체인.\n|λ_max(Wₕₕ)| < 1이면 지수적 감소, > 1이면 지수적 증가.\nLSTM: ∂Cₜ/∂Cₜ₋₁ = fₜ — forget gate 값이 곧 기울기.\nfₜ ∈ [0, 1] 이지만, 여러 단계 축적 시 ∏fₜ ≈ 0.66~0.9 유지 가능.\nRNN은 10단계에서 기울기 0.02, LSTM은 0.66 — 33배 차이.',
  },
  {
    label: '③ Gradient Highway — 왜 덧셈이 기울기를 보존하는가',
    body: '미분의 핵심: ∂(a+b)/∂a = 1 — 덧셈의 기울기는 항상 1.\nCₜ = fₜ·Cₜ₋₁ + iₜ·C̃ₜ에서 ∂Cₜ/∂Cₜ₋₁ = fₜ (≈1에 가까움).\nRNN: ∂tanh(W·h)/∂h = W·(1-tanh²) — W가 반복 곱해져 축소.\n"덧셈 경로" = ResNet의 skip connection과 같은 원리.\nCₜ는 일종의 "정보 고속도로" — 기울기가 시간축을 따라 직선으로 전파.',
  },
  {
    label: '④ 셀 상태 vs 은닉 상태 — 두 기억의 분리',
    body: 'Cₜ (셀 상태): 장기 기억 저장소. 직접 외부에 노출되지 않음.\nhₜ (은닉 상태): 단기 출력. hₜ = oₜ ⊙ tanh(Cₜ)로 필터링된 버전.\n비유: Cₜ = 메모장(scratchpad), hₜ = 발표 자료(공개용).\n이 분리 덕분에 정보가 셀 안에 수십~수백 단계 보존 가능.\nGRU는 이 두 상태를 하나로 통합 — 단순하지만 장기 보존력이 약간 떨어짐.',
  },
];

export const CELL_C = '#f59e0b';
export const RNN_C = '#ef4444';
export const LSTM_C = '#10b981';
export const OUTPUT_C = '#6366f1';
