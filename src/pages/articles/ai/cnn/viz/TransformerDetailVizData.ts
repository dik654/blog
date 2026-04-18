import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'ViT (Vision Transformer) 구조',
    body: '입력 224x224x3 이미지 → 16x16 패치 분할 → 14x14 = 196 patches.\n각 패치: 16x16x3 = 768 pixels → Linear projection → D차원.\nPosition embedding 추가 + [CLS] token → (197, 768) 시퀀스.\nTransformer Encoder L번 반복: MHSA + MLP + LayerNorm + Residual.\n[CLS] token → Linear → 분류.\nViT-B/16: 86M params, ViT-L/16: 307M, ViT-H/14: 632M.\n단점: 대규모 데이터(JFT-300M) 필요, 소규모에선 CNN이 유리.',
  },
  {
    label: '하이브리드 & 최신 동향',
    body: 'Swin Transformer(2021): 계층적 구조 + window attention + shifted window.\nCoAtNet(2021): MBConv + Transformer 결합.\nConvNeXt(2022): 순수 CNN인데 Transformer처럼 설계 — 7x7 depthwise, LayerNorm, GELU.\nImageNet SOTA(2024): EVA-02(ViT) 89.6%, InternImage(CNN) 89.6%, ConvNeXt-V2 88.9%.\n결론: CNN/Transformer 이분법은 깨짐 — 설계 원리가 상호 수렴 중.\n선택 기준: 데이터 크기, 하드웨어, 도메인에 따라 결정.',
  },
];

export const C = {
  vit: '#8b5cf6',
  hybrid: '#3b82f6',
  cnn: '#10b981',
  dim: '#94a3b8',
  warn: '#f59e0b',
};
