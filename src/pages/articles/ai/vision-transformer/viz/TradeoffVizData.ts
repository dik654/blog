import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  cnn: '#6366f1',
  vit: '#f59e0b',
  cross: '#ef4444',
  ok: '#10b981',
  neutral: '#64748b',
};

// 데이터량별 정확도 비교 (ImageNet-like)
export const PERF_DATA = [
  { data: '1K', cnn: 62, vit: 38 },
  { data: '10K', cnn: 75, vit: 58 },
  { data: '100K', cnn: 82, vit: 81 },
  { data: '1M', cnn: 84, vit: 87 },
  { data: '14M', cnn: 85, vit: 89 },
  { data: '300M', cnn: 86, vit: 92 },
];

export const STEPS: StepDef[] = [
  {
    label: 'CNN vs ViT: 데이터량에 따른 성능 교차',
    body: '소규모 데이터(<10K): CNN의 귀납 편향(locality)이 유리 — 적은 데이터로도 합리적 성능.\n대규모 데이터(>100K): ViT의 유연한 표현 학습이 CNN을 추월.',
  },
  {
    label: '귀납 편향의 양면성',
    body: 'CNN: 지역성(locality) + 이동 등변성(translation equivariance) 내장 → 적은 데이터에서 빠른 수렴.\nViT: 편향 없음 → 데이터가 충분하면 더 일반적인 패턴 학습 가능. 부족하면 과적합.',
  },
  {
    label: '해상도와 연산량 비교',
    body: 'CNN: 해상도 2배 → 연산량 ~4배 (O(HW)).\nViT: 토큰 수 2배 → 어텐션 연산량 ~4배 (O(n²)). 패치 크기로 조절 가능.\nSwin: 윈도우 어텐션으로 O(n) 달성 — 고해상도에서 ViT 대비 2-3배 효율적.',
  },
  {
    label: '학습 시간과 메모리',
    body: 'ViT-Base: 2.5일 (8xA100), 메모리 ~24GB. 224→384 해상도 시 4배 증가.\nResNet-50: 1일 (8xA100), 메모리 ~8GB. 해상도 증가 영향 상대적으로 작음.\nDeiT 전략: 작은 모델 + 증류 → 학습 효율 3배 향상.',
  },
];
