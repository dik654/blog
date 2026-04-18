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
    body: 'Optimizer가 gradient를 써서 가중치를 갱신 (optimizer.step()).\nScheduler가 learning rate를 epoch마다 조절.\nzero_grad()로 gradient 초기화 후 다음 배치.',
  },
  {
    label: '대회 실전: 빠른 세팅이 핵심',
    body: '뼈대 코드를 15분 안에 완성하고 → 데이터/피처/하이퍼파라미터 실험에 집중.\n파이프라인 구조를 외워두면 대회 시작 30분 안에 첫 제출 가능.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
