import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Teacher Forcing — 정답 입력으로 학습 가속',
    body:
      '학습 시: decoder input = 정답 시퀀스(shifted). 입력: <SOS>,y₁,y₂,y₃,… / 타겟: y₁,y₂,y₃,y₄,…\n' +
      '모든 타임스텝을 한 번에 병렬 계산 가능 — GPU 행렬 연산 효율 극대화.\n' +
      '오류 누적 없음: 이전 스텝 예측이 틀려도 다음 입력은 정답 → 빠른 수렴.\n' +
      '단점: 추론 시 정답이 없으므로 동작 불일치 발생 — exposure bias의 근원.',
  },
  {
    label: '② Free Running — 추론 시 자기 예측 사용',
    body:
      '추론 시: decoder input = 이전 예측 ŷₜ₋₁ (모델 자신의 출력).\n' +
      '학습과 추론의 분포 불일치: P_train(yₜ₋₁)=정답, P_test(yₜ₋₁)=모델 예측.\n' +
      '한 스텝 오류 → 다음 입력이 학습 때 본 적 없는 분포 → 오류 증폭.\n' +
      '문장이 길수록 누적 오류 심화 — 긴 번역에서 품질 급락의 원인.',
  },
  {
    label: '③ 손실 함수와 역전파 경로',
    body:
      'L = −Σₜ log P(yₜ|y<ₜ^true, X) — teacher forcing 적용 cross-entropy.\n' +
      'P(yₜ) = softmax(W·sₜ)[yₜ] — vocab 전체에 대한 확률 중 정답 토큰의 확률.\n' +
      '역전파: L→softmax→decoder LSTM 전체→encoder LSTM 전체 — 하나의 계산 그래프.\n' +
      '모든 파라미터(W_enc, W_dec, W_embed, W_out) 동시 업데이트 — end-to-end 학습.',
  },
  {
    label: '④ Scheduled Sampling — Bias 완화',
    body:
      'Bengio 2015: 학습 중 일부 확률로 모델 예측 사용.\n' +
      '확률 ε로 ground truth, (1−ε)로 모델 출력을 다음 입력으로 선택.\n' +
      'ε를 에포크 진행과 함께 1→0으로 감소 — 점진적으로 free running에 적응.\n' +
      '학습/추론 분포 격차를 줄여 exposure bias 완화. 현대 LLM에서도 변형 사용.',
  },
];

export const TF_C = '#10b981';
export const FR_C = '#ef4444';
export const LOSS_C = '#6366f1';
export const SS_C = '#f59e0b';
