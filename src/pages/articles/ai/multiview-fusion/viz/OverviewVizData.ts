import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  view1: '#6366f1',   // indigo — 시점 1
  view2: '#10b981',   // emerald — 시점 2
  fuse: '#f59e0b',    // amber — 퓨전
  cls: '#ef4444',     // red — 분류
  bg: '#64748b',      // slate — 보조
};

export const STEPS: StepDef[] = [
  {
    label: '멀티뷰 문제: 같은 대상, 여러 시점',
    body: '하나의 구조물(또는 객체)을 여러 각도에서 촬영한 이미지 제공. 단일 뷰로는 가려진 영역이나 깊이 정보를 놓칠 수 있다.',
  },
  {
    label: '단순 Concat — 6채널 입력',
    body: '두 장의 RGB(3채널) 이미지를 채널 축으로 이어붙여 6채널 텐서를 만든다. 간단하지만 뷰 간 관계를 모델이 스스로 파악해야 한다.',
  },
  {
    label: '지능적 퓨전 — 3가지 전략',
    body: 'Early Fusion(입력 단계 결합), Late Fusion(피처 단계 결합), Attention Fusion(피처 간 교차 주의). 각 전략의 정보 흐름과 장단점이 다르다.',
  },
];
