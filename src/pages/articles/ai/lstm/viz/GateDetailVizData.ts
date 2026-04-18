import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Forget Gate — 과거 정보 중 얼마나 유지할까',
    body: 'fₜ = σ(W_f · [hₜ₋₁, xₜ] + b_f) — 시그모이드 출력 [0, 1].\nfₜ=0 → 완전 삭제, fₜ=1 → 완전 보존. 원소별(element-wise) 적용.\n예: 문장에서 주어가 바뀌면 이전 주어 정보의 forget gate → 0에 가까워짐.\n입력 [hₜ₋₁, xₜ]는 이전 은닉 상태와 현재 입력의 연결(concatenation).\nb_f 초기화: 1로 설정 — 학습 초기에 "기억하는 쪽"으로 편향 (Jozefowicz 2015).',
  },
  {
    label: '② Input Gate + Candidate — 새 정보 저장',
    body: 'iₜ = σ(W_i · [hₜ₋₁, xₜ] + b_i) — 얼마나 저장할지 (filter).\nC̃ₜ = tanh(W_c · [hₜ₋₁, xₜ] + b_c) — 무엇을 저장할지 (content, [-1,1]).\n두 값의 원소별 곱 iₜ ⊙ C̃ₜ만큼 셀 상태에 추가.\ntanh는 값을 [-1,1]로 정규화 — 음수 값도 가능 → 기존 기억을 감소시킬 수도 있음.\n시그모이드(filter) × tanh(content) 분리가 LSTM 게이트의 핵심 설계 패턴.',
  },
  {
    label: '③ Output Gate — 셀 상태 중 얼마나 노출할까',
    body: 'oₜ = σ(W_o · [hₜ₋₁, xₜ] + b_o) — 출력 비율 결정.\nhₜ = oₜ ⊙ tanh(Cₜ) — 셀 상태를 tanh로 정규화한 뒤 gate 적용.\n셀 상태(Cₜ)는 장기 기억, 은닉 상태(hₜ)는 단기 출력 — 두 흐름이 분리.\n예: 셀에 "프랑스" 정보가 저장되어 있어도, 다음 단어 예측에 불필요하면 oₜ ≈ 0.\n이 분리 덕분에 정보가 셀 안에 오래 보존되면서도 출력은 상황에 맞게 선별.',
  },
  {
    label: '④ 파라미터 수 — Vanilla RNN의 4배',
    body: '파라미터 총 수: 4 × H × (H + I + 1). H=은닉 크기, I=입력 크기.\nH=512, I=300 → 약 166만 파라미터/레이어 — Vanilla RNN의 4배.\n4는 W_f, W_i, W_c, W_o 네 개의 가중치 행렬에서 유래.\nPyTorch에서는 효율을 위해 4개 행렬을 하나로 합쳐 연산 → GEMM 1회로 처리.\n실무: 2-4 레이어 스택이 일반적. 레이어당 약 160만 → 전체 320~640만 파라미터.',
  },
];

export const FORGET_C = '#ef4444';
export const INPUT_C = '#10b981';
export const OUTPUT_C = '#6366f1';
export const CELL_C = '#f59e0b';
