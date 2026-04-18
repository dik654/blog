import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Self-Distillation: 자기 자신이 Teacher',
    body: '외부 Teacher 없이, 모델 자신의 이전 버전(또는 깊은 레이어)이 Teacher 역할.\n추가 대형 모델 없이도 성능 향상 가능.\nBorn-Again Networks(Furlanello et al., 2018)가 대표적.',
  },
  {
    label: '② Born-Again Networks: 반복 자기 증류',
    body: '1세대 모델을 Teacher로, 동일 구조 Student를 학습.\nStudent가 Teacher보다 나은 성능을 보이는 현상 발생.\n이 Student를 다시 Teacher로 → 반복할수록 성능 향상.',
  },
  {
    label: '③ Deep Mutual Learning: 동시 학습',
    body: 'Zhang et al.(2018): 두 모델이 서로를 Teacher로 삼아 동시 학습.\nL = L_CE + KL(p₁ ∥ p₂) + KL(p₂ ∥ p₁)\n독립 학습보다 두 모델 모두 성능이 향상됨.',
  },
  {
    label: '④ Label Smoothing과의 관계',
    body: 'Label smoothing: hard label [0,1,0] → [0.05, 0.9, 0.05].\nSelf-distillation의 soft target과 유사한 정규화 효과.\nTang et al.(2020): label smoothing은 self-distillation의 특수 케이스.',
  },
  {
    label: '⑤ 실전 장점: 추가 비용 없이 성능 향상',
    body: '별도 Teacher 학습 불필요 — 기존 학습 파이프라인에 바로 적용.\n정규화 효과로 과적합 방지.\nBERT, ViT 등 다양한 아키텍처에서 일관된 효과 확인.',
  },
];

export const C = {
  gen1: '#6366f1',
  gen2: '#10b981',
  mutual: '#f59e0b',
  smooth: '#ec4899',
  benefit: '#06b6d4',
  muted: 'var(--muted-foreground)',
};
