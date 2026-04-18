import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① FC vs CNN vs RNN — 구조적 차이',
    body:
      'FC: 입력 고정 (예: 10-word → 20-word면 구조 변경). 파라미터 수 = input_dim × hidden_dim.\n' +
      'CNN: 필터가 지역 패턴 감지, translation invariant → 순서 일부 보존하나 장거리 의존성 약함.\n' +
      'RNN: hₜ = f(hₜ₋₁, xₜ)로 가변 길이 시퀀스를 순서 보존하며 처리.\n' +
      'FC는 10-word 입력을 256-dim hidden에 매핑하면 W ∈ R^{2560×256} = 655K 파라미터.\n' +
      'RNN은 동일 작업에 Wₓₕ ∈ R^{256×256} + Wₕₕ ∈ R^{256×256} = 131K로 5배 적다.',
  },
  {
    label: '② Elman vs Jordan 네트워크',
    body:
      'Elman(1990): hₜ = tanh(Wₕₕ·hₜ₋₁ + Wₓₕ·xₜ + bₕ) — hidden state 순환.\n' +
      'Jordan(1986): hₜ = tanh(Wₒₕ·yₜ₋₁ + Wₓₕ·xₜ + bₕ) — output 피드백 사용.\n' +
      'Elman이 표준: hidden state가 내부 기억 역할 → 출력과 독립적으로 정보 압축 가능.\n' +
      'Jordan은 출력이 곧 피드백 → 출력 차원 = 피드백 차원이라 유연성 제한.\n' +
      'Weight sharing: 모든 t에서 동일 Wₕₕ, Wₓₕ → 시퀀스 길이와 무관한 파라미터 수.',
  },
  {
    label: '③ Many-to-X 패턴 — 4가지 입출력 구조',
    body:
      'Many-to-One: 감정 분석 — "이 영화 정말 좋았다" → positive (전체 시퀀스 → 단일 레이블).\n' +
      'Many-to-Many (동일 길이): POS tagging — 각 단어 → 품사 (명사/동사/형용사).\n' +
      'Many-to-Many (다른 길이): 기계 번역 — "I love you" → "나는 너를 사랑해" (Encoder-Decoder).\n' +
      'One-to-Many: 이미지 캡셔닝 — CNN 특징벡터 1개 → "A cat sitting on a mat" 시퀀스.\n' +
      '각 패턴은 손실 함수 적용 위치가 다름: Many-to-One은 마지막 hₜ만, Many-to-Many는 매 step.',
  },
  {
    label: '④ 시퀀스 모델 계보 — RNN → Transformer',
    body:
      'RNN(1986): 순차 처리, O(T) 시간. 장거리 의존성 ~10-20 step 한계 (기울기 소실).\n' +
      'LSTM(1997): 게이트 3개(forget/input/output) + cell state → 유효 거리 ~100-200 step.\n' +
      'GRU(2014): 게이트 2개(reset/update)로 LSTM 간소화 → 파라미터 25% 절감, 성능 유사.\n' +
      'Transformer(2017): Self-attention O(T²) but 병렬 처리 가능 → GPT/BERT의 기반.\n' +
      'Mamba/SSM(2023): 선택적 상태 공간 — O(T) 순차 + 병렬 학습 가능, RNN의 현대적 부활.',
  },
];

export const FC_C = '#ef4444';
export const CNN_C = '#f59e0b';
export const RNN_C = '#10b981';
export const LSTM_C = '#6366f1';
