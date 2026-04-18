import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '수용야(Receptive Field) 계산',
    body: 'RF = 출력 한 뉴런이 입력에서 "보는" 영역 크기.\n공식: RF_l = RF_{l-1} + (k_l - 1) x 누적stride.\n3x3 conv 반복(stride=1): Layer1 RF=3, Layer2 RF=5, Layer3 RF=7, Layer10 RF=21.\nStride=2 포함 시 급격 증가: Layer1 RF=3, Layer2(s=2) RF=5, Layer3 RF=9, Layer4(s=2) RF=13.\n224x224 이미지 분류용 CNN은 RF=200+ 필요.\n확장 방법: 깊은 네트워크, Dilated Conv, Stride 증가, 큰 커널.',
  },
  {
    label: 'Dilated Conv & Depthwise Separable',
    body: 'Dilated Conv: 커널 원소 사이에 빈칸 삽입.\ndilation=1: [X X X], dilation=2: [X . X . X].\n유효 크기: k + (k-1) x (d-1). 3x3 dilation=2 → 유효 5x5, 파라미터 동일.\nDepthwise Separable: 일반 Conv를 두 단계로 분리.\n① Depthwise: k x k x C_in (채널별 독립), ② Pointwise: 1x1 x C_in x C_out.\n비율: 1/C_out + 1/k^2. 3x3, 128ch → 약 9배 절감.\nMobileNet, EfficientNet의 핵심 빌딩 블록.',
  },
];

export const C = {
  rf: '#3b82f6',
  dilated: '#8b5cf6',
  dw: '#10b981',
  dim: '#94a3b8',
  warn: '#f59e0b',
};
