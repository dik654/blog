import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 토큰 임베딩 — 단어를 벡터로',
    body:
      'eₜ = E[xₜ] — 임베딩 테이블 E∈ℝ^{vocab×d} 에서 토큰 인덱스로 lookup.\n' +
      'd_emb=256~512가 표준. "The"→[0.12, -0.34, …], "cat"→[0.56, 0.78, …].\n' +
      '임베딩은 학습 파라미터 — 의미적으로 유사한 단어가 가까운 벡터로 수렴.\n' +
      '원-핫 벡터(10K차원)를 256차원 밀집 벡터로 압축하는 역할.',
  },
  {
    label: '② LSTM 순차 처리 — 시간축 정보 통합',
    body:
      'for t=1 to T: (cₜ, hₜ) = LSTM(eₜ, cₜ₋₁, hₜ₋₁)\n' +
      'cₜ: cell state (장기 기억) — forget gate로 선택적 보존/삭제.\n' +
      'hₜ: hidden state (단기 기억, 출력) — output gate를 거친 현재 표현.\n' +
      '매 스텝마다 새 토큰 정보를 기존 기억에 통합 — 문장 전체를 순차 압축.',
  },
  {
    label: '③ LSTM 게이트 내부 연산',
    body:
      'fₜ = σ(Wf·[hₜ₋₁, eₜ] + bf) — forget gate: 기존 cell을 얼마나 유지할지.\n' +
      'iₜ = σ(Wi·[hₜ₋₁, eₜ] + bi) — input gate: 새 정보를 얼마나 반영할지.\n' +
      'C̃ₜ = tanh(Wc·[hₜ₋₁, eₜ] + bc) — 새 후보 기억.\n' +
      'cₜ = fₜ⊙cₜ₋₁ + iₜ⊙C̃ₜ — 덧셈 경로가 gradient highway 역할.\n' +
      'oₜ = σ(Wo·[hₜ₋₁, eₜ] + bo) — output gate.  hₜ = oₜ⊙tanh(cₜ).',
  },
  {
    label: '④ context = (cₜ, hₜ) — 문장 전체 압축',
    body:
      'T개 토큰 처리 후 최종 (cₜ, hₜ) 쌍이 전체 입력 문장의 압축 표현.\n' +
      'cₜ: 장기 기억 — 문장 앞부분의 핵심 정보 보존. hₜ: 단기 기억 — 최근 문맥 반영.\n' +
      '4-layer deep LSTM: h^(l)ₜ = LSTM_l(h^(l-1)ₜ, h^(l)ₜ₋₁) — 각 층이 더 추상적 표현 학습.\n' +
      '입력 역순화: "The cat sat"→"sat cat The" — 첫 단어 거리 단축으로 BLEU +4.7.',
  },
];

export const EMB_C = '#f59e0b';
export const LSTM_C = '#6366f1';
export const GATE_C = '#10b981';
export const CTX_C = '#ef4444';
