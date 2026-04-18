import type { StepDef } from '@/components/ui/step-viz';

export const C = {
  img: '#6366f1',
  patch: '#10b981',
  token: '#f59e0b',
  cls: '#ef4444',
  pos: '#8b5cf6',
};

export const PATCH_SIZE = 16;
export const IMG_SIZE = 224;
export const NUM_PATCHES = (IMG_SIZE / PATCH_SIZE) ** 2; // 196

export const STEPS: StepDef[] = [
  {
    label: '1. 이미지 → 패치 분할',
    body: `224x224 이미지를 ${PATCH_SIZE}x${PATCH_SIZE} 패치로 분할 → ${NUM_PATCHES}개 패치 생성.\n각 패치 = ${PATCH_SIZE}x${PATCH_SIZE}x3 = 768 픽셀값.`,
  },
  {
    label: '2. 선형 프로젝션 (Linear Projection)',
    body: `각 패치(768차원)를 학습 가능한 행렬 E로 D차원(768)에 매핑.\nz = x·E + b — Conv2d(stride=16)로 구현하면 한 번의 연산으로 분할+프로젝션 동시 수행.`,
  },
  {
    label: '3. CLS 토큰 추가',
    body: `시퀀스 맨 앞에 학습 가능한 [CLS] 토큰 추가 → 총 ${NUM_PATCHES + 1}개 토큰.\n[CLS]의 최종 출력이 이미지 전체의 표현(representation) — 분류 헤드 입력.`,
  },
  {
    label: '4. 위치 인코딩 (Position Embedding)',
    body: `패치 순서를 알려주는 학습 가능한 벡터를 각 토큰에 더함.\nz₀ = [CLS; p₁E; p₂E; ...] + E_pos — Sinusoidal이 아닌 학습 임베딩이 ViT에서 더 효과적.`,
  },
  {
    label: '5. 패치 크기의 영향',
    body: '패치 16x16 → 196토큰, 14x14 → 256토큰, 32x32 → 49토큰.\n작은 패치 = 더 많은 토큰 = 더 세밀한 표현, 하지만 O(n²) 어텐션으로 연산량 급증.',
  },
];
