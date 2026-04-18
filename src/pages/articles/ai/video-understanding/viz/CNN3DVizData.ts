import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  conv2d: '#94a3b8',
  conv3d: '#3b82f6',
  c3d: '#8b5cf6',
  i3d: '#10b981',
  slow: '#ef4444',
  fast: '#f59e0b',
  r21d: '#06b6d4',
  flow: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: '2D CNN → 3D CNN: 시간 축 확장',
    body: '2D Conv: (H, W) 공간만 처리 — 커널 크기 k x k.\n3D Conv: (T, H, W) 시공간 처리 — 커널 크기 d x k x k.\nd = 시간 방향 커널 크기. 연속 프레임의 움직임 패턴을 직접 학습.',
  },
  {
    label: 'C3D — 최초의 3D 컨볼루션 네트워크',
    body: 'Tran et al. (2015). 모든 conv를 3x3x3으로 통일.\n16프레임 입력 → 5개 3D conv 블록 → FC → 클래스 예측.\n장점: 단순하고 시공간 피처를 직접 추출.\n한계: 2D pretrained 가중치를 활용할 수 없어 학습 데이터가 많이 필요.',
  },
  {
    label: 'I3D — Inflated 3D ConvNet',
    body: 'Carreira & Zisserman (2017). 핵심 아이디어: 2D pretrained 커널을 3D로 "부풀리기".\nk x k 커널 → d x k x k 커널로 확장, 가중치를 d로 나눠 복제.\nImageNet pretrained의 강력한 공간 피처를 시간 축으로 확장.\nTwo-Stream: RGB + Optical Flow 두 스트림의 예측을 결합.',
  },
  {
    label: 'SlowFast — 이중 경로 설계',
    body: 'Feichtenhofer et al. (2019). 두 경로의 역할 분담.\nSlow pathway: 낮은 프레임률(예: 4fps), 많은 채널 → 공간 의미(무엇이 있는가).\nFast pathway: 높은 프레임률(예: 32fps), 적은 채널(Slow의 1/8) → 시간 동작(어떻게 움직이는가).\nLateral connection: Fast→Slow로 시간 정보를 전달. 파라미터의 80%가 Slow에 집중.',
  },
  {
    label: 'R(2+1)D — 공간/시간 분리 컨볼루션',
    body: 'Tran et al. (2018). 3D conv를 2D 공간 conv + 1D 시간 conv로 분해.\n3x3x3 대신 1x3x3(공간) → 3x1x1(시간) 순서.\n장점 1: 비선형성 추가 — 분리 사이에 ReLU 삽입, 표현력 향상.\n장점 2: 파라미터 수 감소 — 3x3x3=27 vs (1x3x3)+(3x1x1)=12.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
