import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Horizontal Flip — 가장 기본적인 증강',
    body: '좌우 반전. 자연 이미지에서 거의 항상 사용\n주의: 숫자·문자 인식(6↔9)이나 좌우 구분이 중요한 도메인에서는 사용 금지',
  },
  {
    label: 'Rotation — 회전 (±15°~30° 범위)',
    body: '각도가 너무 크면 의미가 변한다 — 항공 사진은 360° 가능, 얼굴은 ±15° 제한\nborder_mode: reflect/constant 선택에 따라 가장자리 처리가 달라진다',
  },
  {
    label: 'Random Crop & Resize — 위치 불변성 학습',
    body: '원본에서 랜덤 영역을 잘라내고 원래 크기로 복원\n작은 crop → 확대 효과, 큰 crop → 미세 이동 효과\nResizedCrop(224, scale=(0.08, 1.0))이 ImageNet 표준',
  },
  {
    label: 'Affine Transform — 이동·크기·기울기 복합',
    body: 'translate(±10%), scale(0.8~1.2), shear(±10°)를 한 번에 적용\n2×3 변환 행렬로 표현: [a b tx; c d ty] — 6개 파라미터',
  },
  {
    label: 'Elastic Deformation — 비정형 왜곡',
    body: '의료 영상(세포, X-ray)에서 특히 효과적 — 실제 조직 변형을 모사\n가우시안 필터로 부드러운 변위 필드(displacement field) 생성\nalpha(변형 강도) × sigma(부드러움) 두 파라미터로 제어',
  },
];

export const COLORS = {
  original: '#6366f1',
  flipped: '#3b82f6',
  rotated: '#10b981',
  cropped: '#f59e0b',
  affine: '#ef4444',
  elastic: '#8b5cf6',
};
