import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 모든 은닉 상태 보관 — 병목 해소',
    body:
      'Encoder 변경: H = (h₁, h₂, …, hₜ) — 모든 hidden state를 메모리에 유지.\n' +
      '기존 Seq2Seq: c = hₜ (마지막 하나만 사용, 나머지 폐기).\n' +
      'Attention: 모든 hⱼ를 저장하여 Decoder가 매 스텝 동적으로 참조.\n' +
      '추가 메모리: O(T·d) — T=50, d=512이면 ~100KB. 성능 대비 미미한 비용.',
  },
  {
    label: '② Alignment Score — sₜ₋₁과 hⱼ의 유사도',
    body:
      'eₜⱼ = score(sₜ₋₁, hⱼ) for j=1..T — 디코더 상태와 각 인코더 상태의 유사도 계산.\n' +
      'Dot: sᵀh — 가장 단순, 차원이 같아야 함.\n' +
      'General: sᵀWh — 학습 가능한 W∈ℝ^{d×d} 추가, 차원 불일치 허용.\n' +
      'Additive(Bahdanau): vᵀtanh(W₁s + W₂h) — 비선형 결합, 원래 논문의 방식.',
  },
  {
    label: '③ Softmax → 동적 Context Vector',
    body:
      'αₜⱼ = exp(eₜⱼ) / Σₖ exp(eₜₖ) — attention weight. 합=1인 확률 분포.\n' +
      'cₜ = Σⱼ αₜⱼ · hⱼ — 가중 평균으로 동적 context 생성.\n' +
      '핵심 차이: Seq2Seq의 c(고정, 모든 스텝 공유) vs cₜ(매 스텝 다름, 입력 동적 재조합).\n' +
      'αₜⱼ가 출력 t와 입력 j의 "정렬도" — attention heatmap으로 시각화 가능.',
  },
  {
    label: '④ Decoder 갱신 + 성능 개선',
    body:
      'sₜ = LSTM(sₜ₋₁, concat(yₜ₋₁, cₜ)) — 동적 context를 입력에 결합.\n' +
      'yₜ = softmax(W·concat(sₜ, cₜ)) — 출력에도 context 직접 참여.\n' +
      'WMT\'14 En→Fr: BLEU 29.3(baseline) → 36.2(+Attention) — +6.9 point!\n' +
      '긴 문장(50단어+)에서 특히 큰 개선: +10 BLEU. 병목 해소의 직접적 증거.',
  },
];

export const ENC_C = '#6366f1';
export const SCORE_C = '#f59e0b';
export const ATTN_C = '#10b981';
export const DEC_C = '#ef4444';
