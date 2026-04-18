import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 조건부 확률 분해 — P(Y|X)',
    body:
      '목표: 입력 X=(x₁,…,xₜ)를 출력 Y=(y₁,…,yₜ′)로 매핑. T≠T′ 허용.\n' +
      'P(Y|X) = ∏ P(yₜ|y<ₜ, X) — 각 출력 토큰을 이전 출력과 입력 전체에 조건부로 생성.\n' +
      'autoregressive 분해의 핵심: 순서대로 하나씩 생성하되, 이전 것을 모두 참조.\n' +
      '이 분해가 GPT·BERT 등 현대 LLM의 본질 — 2014년 Sutskever가 최초로 end-to-end 구현.',
  },
  {
    label: '② 인코더-디코더 구조',
    body:
      'Encoder: hₜ = LSTM(xₜ, hₜ₋₁) — 입력 토큰을 순차 처리하여 은닉 상태 갱신.\n' +
      'context vector c = hₜ — 마지막 은닉 상태가 전체 입력을 압축.\n' +
      'Decoder: sₜ = LSTM(yₜ₋₁, sₜ₋₁, c) — context에서 출력을 자기회귀적으로 생성.\n' +
      'P(yₜ) = softmax(W·sₜ) — vocab 크기만큼의 확률 분포에서 다음 토큰 선택.',
  },
  {
    label: '③ 학습과 추론',
    body:
      '학습 손실: L = −Σₜ log P(yₜ|y<ₜ, X) — 정답 시퀀스의 negative log-likelihood 최소화.\n' +
      'Greedy 추론: yₜ = argmax P(w|y<ₜ, X) — 매 스텝 최고 확률 토큰 선택. 빠르지만 차선.\n' +
      'Beam Search: top-k 후보를 유지하며 누적 확률 최대 경로 선택. k=4~10이 표준.\n' +
      '번역 예: X="The cat sat"(T=3) → Y="고양이가 앉았다"(T′=2) — 길이 다름을 자연 처리.',
  },
  {
    label: '④ 핵심 트릭 — 입력 역순화',
    body:
      'Sutskever 2014의 발견: "ABC→DEF" 대신 "CBA→DEF"로 학습하면 성능 급상승.\n' +
      'BLEU 25.9 → 30.6 (4.7 point 개선) — 초기 단어 간 거리 단축으로 기울기 흐름 개선.\n' +
      '4층 LSTM: 1층 BLEU 24.9 → 4층 BLEU 34.8 — 깊이가 추상화 수준을 높임.\n' +
      '큰 어휘(160K) + beam search 조합으로 WMT\'14 SOTA(BLEU 33.3) 상회.',
  },
  {
    label: '⑤ 역사적 의의 — Phrase-based MT 종료 선언',
    body:
      '2014년 이전: Moses(Koehn 2007) 기반 phrase-based statistical MT — 수작업 feature engineering.\n' +
      'Sutskever 2014: 단일 end-to-end 신경망 2개 LSTM만으로 BLEU 34.8 달성.\n' +
      'Seq2Seq→Attention(Bahdanau 2015)→Transformer(Vaswani 2017)→BERT/GPT(2018~).\n' +
      '10년 만에 모든 NLP 표준 모델의 조상이 됨 — encoder-decoder 패러다임의 출발점.',
  },
];

export const ENC_C = '#6366f1';
export const DEC_C = '#10b981';
export const CTX_C = '#f59e0b';
export const HIST_C = '#8b5cf6';
export const TRICK_C = '#ef4444';
