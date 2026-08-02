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
    body: 'best_model: validation 기준으로 선택한 평가 후보.\nlast_model: 매 epoch 덮어쓰기 — 학습 재개(resume)용.\n모든 선택을 끝낸 뒤 untouched test set으로 best를 한 번 평가한다.',
  },
  {
    label: '시드 고정: 4가지 난수 소스',
    body: 'random.seed(42), np.random.seed(42), torch.manual_seed(42), torch.cuda.manual_seed_all(42).\n사용하는 난수 source를 모두 통제해 변동 원인을 줄인다. 이것만으로 release·hardware 간 완전 재현을 보장하지는 않는다.',
  },
  {
    label: 'deterministic 설정: 비결정성 축소',
    body: 'torch.backends.cudnn.deterministic = True: cuDNN 선택을 제한.\ntorch.backends.cudnn.benchmark = False: 자동 탐색 비활성.\ntorch.use_deterministic_algorithms(True): 알려진 비결정 연산을 에러로 표면화.\n완전 재현 보장은 아니며 workload별 비용을 측정한다.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
