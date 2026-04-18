import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Magnitude Pruning: |w| < threshold → 0으로 설정',
    body: '가장 단순한 프루닝 — 가중치의 절대값이 임계값보다 작으면 0으로 만든다.\n직관: 작은 가중치는 출력에 미치는 영향도 작다.',
  },
  {
    label: '희소 행렬: 0이 많은 행렬의 효율적 저장',
    body: '프루닝 후 행렬은 대부분 0 — 0이 아닌 값만 (행, 열, 값) 형태로 저장.\nCSR/CSC 포맷으로 메모리 절감. 하지만 GPU 연산 가속은 어렵다.',
  },
  {
    label: 'Lottery Ticket: 초기 가중치로 되돌려 재학습',
    body: '1) Dense 네트워크 학습 → 2) 작은 가중치 프루닝 → 3) 남은 가중치를 초기값으로 리셋\n→ 4) Sparse 네트워크만 재학습. 놀랍게도 원래만큼 정확도 달성.\n핵심: "어디를 연결하느냐"가 "초기값"보다 중요.',
  },
  {
    label: '한계: 비정형 희소성은 하드웨어 가속이 어렵다',
    body: 'GPU는 Dense 행렬곱에 최적화 — 무작위 0 패턴은 메모리 접근 불규칙.\n이론적 FLOP 감소 vs 실제 속도 향상 사이 괴리.\n해결: N:M 희소성(2:4) — NVIDIA A100부터 하드웨어 지원.',
  },
];

export const COLORS = {
  weight: '#3b82f6',
  pruned: '#ef4444',
  sparse: '#f59e0b',
  lottery: '#8b5cf6',
  hw: '#10b981',
};
