import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  cnn: '#6366f1',
  vit: '#f59e0b',
  patch: '#10b981',
  attn: '#ef4444',
  dim: '#8b5cf6',
};

export const STEPS: StepDef[] = [
  {
    label: 'CNN: 로컬 수용 영역 (Local Receptive Field)',
    body: '3x3 또는 5x5 커널이 이미지의 작은 영역만 본다. 먼 픽셀 간 관계를 포착하려면 여러 층을 쌓아야 한다 — 깊이가 곧 비용.',
  },
  {
    label: 'ViT: 글로벌 셀프 어텐션 (Global Self-Attention)',
    body: '모든 패치가 다른 모든 패치를 직접 참조. 첫 레이어부터 이미지 전체의 관계를 포착 — CNN의 로컬 제약 없음.',
  },
  {
    label: '"An Image is Worth 16x16 Words"',
    body: 'Dosovitskiy et al. (2020): 이미지를 16x16 패치로 분할, 각 패치를 토큰으로 취급. NLP Transformer를 거의 수정 없이 적용 → ImageNet SOTA.',
  },
  {
    label: 'Local vs Global: 핵심 차이',
    body: 'CNN은 귀납 편향(locality, translation equivariance)이 내장 — 적은 데이터에 유리.\nViT는 이런 편향 없이 데이터에서 직접 학습 — 대규모 데이터에서 CNN을 압도.',
  },
];
