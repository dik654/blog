import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 초기화 — Encoder context 수신',
    body:
      '(c₀, h₀) = (cₜ, hₜ) — Encoder 최종 상태를 Decoder 초기 상태로 복사.\n' +
      'y₀ = <SOS> (start-of-sequence 토큰) — 생성의 시작점.\n' +
      'context vector가 유일한 입력 정보원 — 모든 번역이 이 벡터에서 출발.\n' +
      '이 구조가 "bottleneck" 문제의 근원 — Attention이 해결하게 될 핵심 약점.',
  },
  {
    label: '② 자기회귀 생성 루프',
    body:
      'while yₜ₋₁ ≠ <EOS> and t < max_len:\n' +
      '  eₜ = Embedding[yₜ₋₁] — 이전 출력 토큰을 벡터로 변환.\n' +
      '  (cₜ, hₜ) = LSTM(eₜ, cₜ₋₁, hₜ₋₁) — 새 은닉 상태 생성.\n' +
      '  logits = W_out·hₜ → probs = softmax(logits) → yₜ = argmax(probs).\n' +
      '이전 출력이 다음 입력이 되는 구조 — GPT도 동일. 순차적이므로 병렬화 불가.',
  },
  {
    label: '③ 생성 전략 비교 — Greedy vs Beam vs Sampling',
    body:
      'Greedy: 매 스텝 argmax. 빠르지만 전역 최적이 아닐 수 있음.\n' +
      'Beam Search(k=4~10): top-k 후보 유지, 누적 확률 최대 경로 선택. 번역 품질 우수.\n' +
      'Sampling: temperature(T<1:sharp, T>1:flat) + top-p + top-k. 다양성 확보, 창의적 생성.\n' +
      'Beam의 복잡도: O(k·V·T′) — k=4, vocab=30K, T′=50이면 ~600만 연산.',
  },
  {
    label: '④ Exposure Bias — 학습/추론 불일치',
    body:
      '학습: teacher forcing — 정답(ground truth) yₜ₋₁을 다음 입력으로 사용.\n' +
      '추론: free running — 자신의 예측 ŷₜ₋₁을 다음 입력으로 사용.\n' +
      '오류 누적: 한 스텝의 잘못된 예측이 이후 모든 스텝에 연쇄 전파.\n' +
      '해결: Scheduled Sampling(Bengio 2015) — 확률 ε로 정답, (1−ε)로 예측 사용. ε를 점진 감소.',
  },
];

export const INIT_C = '#6366f1';
export const AUTO_C = '#10b981';
export const BEAM_C = '#f59e0b';
export const BIAS_C = '#ef4444';
