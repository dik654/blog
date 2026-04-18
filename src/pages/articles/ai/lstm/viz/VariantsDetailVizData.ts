import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① GRU — 게이트 3→2개, 상태 통합',
    body: 'Cho et al. (2014). 리셋 게이트(rₜ)와 업데이트 게이트(zₜ) 두 개만 사용.\nrₜ = σ(W_r · [hₜ₋₁, xₜ]) — 이전 은닉 상태 중 얼마나 참조할지 결정.\nzₜ = σ(W_z · [hₜ₋₁, xₜ]) — forget + input을 하나로 통합한 게이트.\nhₜ = (1-zₜ) ⊙ hₜ₋₁ + zₜ ⊙ h̃ₜ — 셀 상태 없이 은닉 상태만으로 기억.\nzₜ가 높으면 새 정보 반영, (1-zₜ)가 높으면 이전 기억 유지 — coupled 구조.',
  },
  {
    label: '② Peephole + Coupled — LSTM 변형들',
    body: 'Peephole LSTM (Gers 2002): 게이트가 셀 상태 Cₜ₋₁도 직접 참조.\nf = σ(W·[Cₜ₋₁, hₜ₋₁, xₜ]) — 현재 기억 크기를 보고 삭제량 결정.\nCoupled Input/Forget: iₜ = 1 - fₜ — 잊는 만큼 새로 채움.\n"저장하지 않는 만큼만 잊는다" — 셀 상태 크기가 일정하게 유지.\nPeephole은 타이밍 민감한 작업(음성)에서 약간의 개선, 범용적 이점은 제한적.',
  },
  {
    label: '③ Bidirectional + Stacked — 구조 확장',
    body: 'Bidirectional LSTM: 순방향 + 역방향 두 LSTM을 병렬 실행.\nhₜ = [h→ₜ ; h←ₜ] — 과거·미래 문맥을 모두 반영 → NER, POS 태깅 표준.\n파라미터 2배, 오프라인(전체 시퀀스 필요) 작업에만 사용 가능.\nStacked LSTM: 2~4 레이어 적층 — 하위 레이어는 로컬, 상위는 추상 패턴.\n깊어질수록 과적합 위험 → dropout(0.2~0.5)을 레이어 간에 적용.',
  },
  {
    label: '④ 현대 후계자 — Mamba, RWKV, RetNet',
    body: 'LSTM의 게이트 아이디어는 현대 아키텍처에 계승됨.\nMamba (Gu 2023): 선택적 SSM — 입력에 따라 상태 전이 행렬을 동적 조정.\nRWKV (Peng 2023): RNN의 순차 처리 + Transformer의 병렬 학습 결합.\nRetNet (Sun 2023): 선형 어텐션 기반, O(n) 추론·O(n²) 학습 분리.\n공통점: "선택적 기억" 메커니즘 — LSTM 게이트의 현대적 재해석.',
  },
];

export const GRU_C = '#10b981';
export const PEEK_C = '#f59e0b';
export const BI_C = '#6366f1';
export const MODERN_C = '#8b5cf6';
