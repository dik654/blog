import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  train: '#10b981',
  val: '#3b82f6',
  grad: '#f59e0b',
  amp: '#8b5cf6',
  accum: '#ef4444',
  flow: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: 'train_one_epoch: 학습 루프 구조',
    body: 'model.train() → DataLoader 순회 → forward → loss → backward → step.\n핵심: model.train()은 Dropout과 BatchNorm을 학습 모드로 전환.',
  },
  {
    label: 'validate: 검증 루프 구조',
    body: 'model.eval() + torch.no_grad() 조합.\nDropout 비활성 + BN 이동평균 사용 + gradient 계산 생략.\n검증 루프에서 optimizer.step()은 절대 호출하지 않는다.',
  },
  {
    label: 'Gradient Accumulation: 메모리 부족 우회',
    body: '큰 배치 효과를 작은 GPU 메모리로 달성.\nN스텝마다 한 번 step() — loss를 N으로 나눠서 스케일링.\n실효 배치 = batch_size x accumulation_steps.',
  },
  {
    label: 'Mixed Precision (AMP): FP16 + FP32 혼합',
    body: 'torch.cuda.amp.autocast: forward를 FP16으로 실행.\nGradScaler: FP16 기울기의 underflow 방지.\nGPU 메모리 40~50% 절약, 속도 2x.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
