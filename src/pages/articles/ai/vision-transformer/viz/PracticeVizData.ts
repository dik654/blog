import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  timm: '#6366f1',
  model: '#f59e0b',
  finetune: '#10b981',
  tip: '#ef4444',
  data: '#8b5cf6',
};

export const STEPS: StepDef[] = [
  {
    label: 'timm: PyTorch Image Models 라이브러리',
    body: '900+ 사전학습 모델을 통일된 인터페이스로 제공.\ntimm.create_model("vit_base_patch16_224", pretrained=True, num_classes=N)\n모델 생성 → 데이터 변환 → 학습을 3줄로 시작.',
  },
  {
    label: '모델 선택 가이드',
    body: '정확도 우선: swin_large_patch4_window12_384 (87.3% ImageNet)\n속도 우선: vit_small_patch16_224 (79.4%, 4.6 GFLOPs)\n균형: vit_base_patch16_224 (84.5%, 17.6 GFLOPs)\n메모리 제한: deit_small_distilled_patch16_224 (81.2%, 4.6 GFLOPs)',
  },
  {
    label: 'Fine-tuning 핵심 전략',
    body: '1) 학습률: ViT는 CNN보다 낮게 — 1e-5~5e-5 (CNN: 1e-3~1e-4)\n2) Layer-wise LR Decay: 깊은 층일수록 높은 학습률 (decay=0.65)\n3) Warmup: 전체의 5-10% 에폭 동안 선형 증가 후 코사인 감쇠\n4) 해상도: 384로 fine-tune 시 position embedding 보간 필수',
  },
  {
    label: '대회 활용 전략',
    body: '앙상블: CNN(ConvNeXt) + ViT(Swin) 혼합 — 서로 다른 귀납 편향으로 상호 보완.\nTTA: 수평 반전 + 멀티크롭. ViT는 CNN보다 TTA 효과 큼 (+0.5~1.0%).\nProgressive Resizing: 224 → 384로 단계적 해상도 증가. ViT에서 특히 효과적.',
  },
];
