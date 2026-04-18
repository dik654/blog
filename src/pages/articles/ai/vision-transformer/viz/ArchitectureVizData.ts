import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  vit: '#6366f1',
  deit: '#f59e0b',
  swin: '#10b981',
  beit: '#ef4444',
  mae: '#8b5cf6',
  layer: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: 'ViT: 기본 구조',
    body: 'Patch Embedding → [CLS] + Position → L개 Transformer Encoder → MLP Head.\n각 Encoder: LayerNorm → Multi-Head Self-Attention → LayerNorm → MLP(GELU). 잔차 연결 포함.',
  },
  {
    label: 'DeiT: 데이터 효율적 학습',
    body: 'ViT는 JFT-300M(3억 장)이 필요. DeiT는 ImageNet(120만 장)만으로 학습 가능.\n핵심: Distillation Token — 교사 모델(RegNet)의 지식을 추가 토큰으로 전달. 강력한 데이터 증강(RandAugment, Mixup, CutMix) 병행.',
  },
  {
    label: 'Swin Transformer: 윈도우 기반 계층 구조',
    body: 'Window Attention: 7x7 윈도우 내에서만 어텐션 → O(n)으로 선형 복잡도.\nShifted Window: 매 레이어마다 윈도우를 3.5px 이동 → 윈도우 간 정보 교환.\n4단계 계층 구조: 해상도 점진 감소, 채널 수 증가 — FPN과 결합 가능.',
  },
  {
    label: 'BEiT: 자기지도 사전학습 (Masked Image Modeling)',
    body: '이미지 패치를 dVAE로 시각 토큰화 → 40% 마스킹 → 원래 토큰 예측.\nBERT의 MLM을 비전에 적용. 라벨 없이 대규모 이미지에서 표현 학습 → fine-tuning 성능 향상.',
  },
  {
    label: 'MAE: Masked Autoencoder',
    body: '패치의 75%를 마스킹 → 인코더는 보이는 25%만 처리 → 디코더가 마스킹된 패치 복원.\n높은 마스킹 비율이 핵심: 쉬운 보간 방지 → 의미적 이해 강제. 사전학습 효율 4배 향상.',
  },
];
