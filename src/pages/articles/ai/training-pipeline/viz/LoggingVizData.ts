import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  loss: '#ef4444',
  metric: '#10b981',
  train: '#3b82f6',
  val: '#f59e0b',
  overfit: '#ef4444',
  wandb: '#8b5cf6',
  tb: '#06b6d4',
};

export const STEPS: StepDef[] = [
  {
    label: 'Loss & Metric 기록 구조',
    body: '매 배치: running_loss 누적 → epoch 끝에 평균.\n검증: val_loss + metric (accuracy, F1, AUC 등).\n리스트에 저장하면 학습곡선 시각화 가능.',
  },
  {
    label: '학습곡선으로 오버피팅 감지',
    body: 'train_loss는 계속 내려가는데 val_loss가 올라가면 — 오버피팅.\ngap이 벌어지기 시작하는 epoch이 early stopping 시점.\n학습곡선은 "모델 건강 지표" — 매 실험에서 반드시 확인.',
  },
  {
    label: 'Early Stopping: 과적합 방지 자동화',
    body: 'patience=N: val_loss가 N epoch 연속 개선되지 않으면 학습 중단.\nbest_loss 갱신 시 patience 카운터 리셋.\npatience=5~10이 일반적.',
  },
  {
    label: 'W&B / TensorBoard 연동',
    body: 'W&B: wandb.log({"loss": loss, "lr": lr}) — 클라우드 대시보드.\nTensorBoard: SummaryWriter + add_scalar — 로컬 시각화.\n둘 다 실시간 모니터링 + 실험 비교 + 하이퍼파라미터 추적 지원.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
