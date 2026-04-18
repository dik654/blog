import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  save: '#10b981',
  load: '#3b82f6',
  best: '#f59e0b',
  seed: '#8b5cf6',
  determ: '#ef4444',
  flow: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: 'torch.save / load_state_dict 패턴',
    body: 'model.state_dict()로 가중치만 저장 (pickle 전체 저장 X).\n체크포인트에 epoch, optimizer, scheduler 상태도 함께 저장해야 학습 재개 가능.',
  },
  {
    label: 'Best Model vs Last Model 전략',
    body: 'best_model: validation 기준 최고 성능 모델 저장 — 최종 추론용.\nlast_model: 매 epoch 덮어쓰기 — 학습 재개(resume)용.\n두 파일을 분리 저장하는 것이 실전 표준.',
  },
  {
    label: '시드 고정: 4가지 난수 소스',
    body: 'random.seed(42), np.random.seed(42), torch.manual_seed(42), torch.cuda.manual_seed_all(42).\nPython 내장 + NumPy + PyTorch CPU + CUDA — 네 곳 모두 고정해야 재현.',
  },
  {
    label: 'deterministic 설정: 완전 재현성',
    body: 'torch.backends.cudnn.deterministic = True: cuDNN 알고리즘 고정.\ntorch.backends.cudnn.benchmark = False: 자동 알고리즘 탐색 비활성.\ntorch.use_deterministic_algorithms(True): 비결정적 연산 에러.\n속도 5~10% 감소 — 디버깅 때만 켜는 전략.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
