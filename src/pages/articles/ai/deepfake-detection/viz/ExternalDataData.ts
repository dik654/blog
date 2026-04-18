import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '공개 데이터셋: FF++, DFDC, CelebDF 비교',
    body: 'FaceForensics++ (FF++) — 1,000개 원본 x 5가지 조작 = 5,000 영상. 학술 표준\nDFDC (Facebook) — 10만 클립, 3,426명, 다양한 환경. 대규모\nCelebDF-v2 — 590 원본 + 5,639 합성. 고품질 합성에 특화\n각 데이터셋이 커버하는 조작 기법이 다르다 — 조합이 핵심',
  },
  {
    label: '다양한 조작 기법 커버: 일반화의 핵심',
    body: 'Face2Face, FaceSwap, DeepFakes, NeuralTextures, FaceShifter...\n학습 데이터가 특정 기법에 편향되면 — 미지의 조작에 취약\n전략: 최소 3~5가지 조작 기법을 포함하여 학습\n실전: 데이터셋별 조작 기법 매핑 테이블 작성 → 빈 셀 채우기',
  },
  {
    label: '합성 데이터 생성: 학습 데이터 자체 제작',
    body: 'SimSwap, FaceSwap, DeepFaceLab로 자체 딥페이크 생성\n원본 영상 확보 → 자동 파이프라인으로 대량 합성\n이점: 조작 기법/강도/해상도를 직접 제어 가능\n주의: 합성 품질이 테스트와 유사해야 — 쉬운 합성은 오히려 해',
  },
  {
    label: '라벨 품질 관리: 노이즈 라벨이 성능을 죽인다',
    body: '공개 데이터셋의 라벨 오류율: 1~5% (무시할 수 없는 수준)\n검증: 모델 예측과 라벨 불일치 샘플 → 수동 검수\nConfident Learning: 라벨 노이즈 자동 탐지 (cleanlab)\n전략: 라벨 스무딩(0.05~0.1) + 노이즈 라벨 제거 → 안정적 학습',
  },
];

export const COLORS = {
  ffpp: '#3b82f6',
  dfdc: '#10b981',
  celebdf: '#8b5cf6',
  synth: '#f59e0b',
  label: '#ef4444',
};
