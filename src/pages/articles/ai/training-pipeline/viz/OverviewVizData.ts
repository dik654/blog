import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  data: '#6366f1',
  loader: '#3b82f6',
  model: '#10b981',
  loss: '#ef4444',
  optim: '#f59e0b',
  sched: '#8b5cf6',
  flow: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: '학습 파이프라인 전체 구조',
    body: 'Dataset → DataLoader → Model → Loss → Optimizer → Scheduler.\n6개 모듈이 순환하며 가중치를 갱신한다.',
  },
  {
    label: 'Forward Pass: 데이터 → 예측',
    body: 'DataLoader가 배치를 꺼내고, Model이 forward를 실행해 예측값(logits)을 생성한다.\n이 단계에서 GPU 메모리를 가장 많이 사용.',
  },
  {
    label: 'Backward Pass: 손실 → 기울기',
    body: 'Loss 함수가 예측과 정답의 차이를 스칼라로 계산.\nloss.backward()가 역전파로 모든 파라미터의 gradient를 계산.',
  },
  {
    label: 'Update: 기울기 → 가중치 갱신',
    body: 'Optimizer가 gradient를 써서 가중치를 갱신 (optimizer.step()).\nScheduler는 설정한 호출 주기(batch 또는 epoch)에 맞춰 learning rate를 조절.\nzero_grad()로 gradient 초기화 후 다음 배치.',
  },
  {
    label: '실전: 재현 가능한 baseline을 먼저 닫는다',
    body: '뼈대 코드를 먼저 실행해 end-to-end baseline과 기록 경로를 확인한다.\n그 다음 데이터, feature와 hyperparameter를 한 변수씩 바꿔 비교한다.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
