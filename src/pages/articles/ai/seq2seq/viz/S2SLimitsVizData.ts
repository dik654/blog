import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 고정 차원 Bottleneck — 정보 압축 한계',
    body:
      'c∈ℝ^d (d=512) — 10단어든 100단어든 같은 크기 벡터에 압축.\n' +
      '문장 길이별 BLEU: <10→22.9, 10-20→29.0, 20-30→28.6, 30-40→26.3, >40→20.5.\n' +
      '40단어 이상에서 BLEU 급락 — 고정 크기 벡터의 정보 용량 한계.\n' +
      'Shannon 관점: 입력 엔트로피 > 벡터 용량이면 정보 손실 불가피.',
  },
  {
    label: '② 장기 의존성 + 순차 처리',
    body:
      '장기 의존성: 문장 앞부분 정보가 hₜ까지 전달되기 어려움 — LSTM도 ~100 토큰 한계.\n' +
      '역순 입력은 임시방편: 첫 단어 거리만 단축, 중간 단어 문제 미해결.\n' +
      '순차 처리: Encoder·Decoder 모두 LSTM — 시간축 병렬화 불가.\n' +
      'GPU 활용률 저조: T=50이면 50번 순차 연산 필요. Transformer는 O(1) 병렬.',
  },
  {
    label: '③ 해결책 진화 — Attention → Transformer',
    body:
      '2015 Attention(Bahdanau, Luong): 모든 encoder hidden state 저장 + 동적 선택 → bottleneck 해소.\n' +
      '2017 Transformer(Vaswani): Self-Attention으로 RNN 완전 대체 → 병렬 처리 가능.\n' +
      'Multi-head attention: 8~16개 head가 각기 다른 관계 패턴 포착.\n' +
      '2018 BERT/GPT: 사전학습+파인튜닝 패러다임 → 범용 언어 이해/생성.',
  },
  {
    label: '④ Seq2Seq의 영속적 유산',
    body:
      'Encoder-Decoder 패러다임: T5, BART 등 현재까지 사용.\n' +
      'Autoregressive 생성: GPT-4, Claude 등 모든 LLM의 기본 생성 방식.\n' +
      'Teacher forcing: 현대 LLM 학습에서도 핵심 기법.\n' +
      'BLEU 평가: 2014년부터 표준, 현재까지 번역 벤치마크 기본 지표.',
  },
];

export const BOTTLE_C = '#ef4444';
export const SEQ_C = '#f59e0b';
export const SOLVE_C = '#10b981';
export const LEGACY_C = '#6366f1';
