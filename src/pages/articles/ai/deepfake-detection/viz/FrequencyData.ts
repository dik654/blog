import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'FFT: 이미지를 주파수 도메인으로 변환',
    body: 'FFT(Fast Fourier Transform) — 공간 도메인 → 주파수 도메인 변환\n저주파: 이미지의 부드러운 영역(배경, 피부)\n고주파: 경계, 질감, 미세한 디테일\n딥페이크 생성 과정에서 고주파 영역에 특유의 패턴이 남는다',
  },
  {
    label: '실제 vs 딥페이크: 주파수 스펙트럼 차이',
    body: '실제 이미지 — 자연스러운 주파수 감쇠 (1/f 법칙)\n딥페이크 — 고주파에서 비정상적 피크 또는 감쇠 패턴\nGAN: 업샘플링 과정에서 주기적 아티팩트 발생 (체커보드 패턴)\nDiffusion: 특정 주파수 대역에서 에너지 분포 차이',
  },
  {
    label: '주파수 피처를 모델 입력에 결합',
    body: 'RGB 이미지만 입력 — 공간 도메인 정보만 활용\nRGB + FFT magnitude — 주파수 특성 추가로 탐지력 향상\n결합 방법: 채널 결합(6ch), 듀얼 브랜치, 어텐션 퓨전\n실험: 주파수 채널 추가만으로 AUC 2~5% 향상',
  },
  {
    label: '주파수 분석의 한계와 보완',
    body: '한계: JPEG 압축이 고주파 정보를 파괴 — 아티팩트 소실\n한계: 최신 생성 모델은 주파수 일관성도 학습\n보완: 다중 스케일 분석 (DCT, Wavelet), 다양한 주파수 대역 분리\n결론: 주파수는 강력한 보조 피처지만 단독으로는 부족 — 앙상블 필수',
  },
];

export const COLORS = {
  real: '#10b981',
  fake: '#ef4444',
  freq: '#3b82f6',
  combine: '#8b5cf6',
  limit: '#f59e0b',
};
