import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'XceptionNet: Depthwise Separable Conv 기반 탐지',
    body: 'Inception 구조의 극단적 변형 — 채널별 분리 합성곱(depthwise separable convolution)\n일반 Conv 대비 파라미터 수 8배 감소, 연산량 대폭 절감\n딥페이크 탐지의 de facto 베이스라인 — FaceForensics++ 벤치마크 1위 (2019)\n입력: 299x299, 출력: binary (real/fake)',
  },
  {
    label: 'EfficientNet-B4: Compound Scaling으로 효율 극대화',
    body: 'Compound Scaling: 너비, 깊이, 해상도를 동시에 확대\nB0 → B7: 정확도-효율 트레이드오프 곡선\nB4 (380x380): 딥페이크 탐지의 최적 지점 — 정확도↑ 과적합↓\nMBConv: SE(Squeeze-Excite) + 역병목 구조 → 채널 어텐션',
  },
  {
    label: 'CLIP 기반 제로샷 탐지: 학습 없이 탐지',
    body: 'CLIP(Contrastive Language-Image Pretraining) — 4억 쌍의 이미지-텍스트 사전학습\n프롬프트: "a real photo of a person" vs "a deepfake photo of a person"\n제로샷: 딥페이크 학습 데이터 없이도 유의미한 탐지 성능\n한계: fine-tuned 모델 대비 정확도 낮음 — 보조 신호로 활용',
  },
  {
    label: '앙상블: 다양한 백본 + 다양한 전처리 조합',
    body: '다양성 확보: XceptionNet + EfficientNet-B4 + CLIP → 서로 다른 피처 포착\n전처리 다양화: 얼굴 크롭 크기, 해상도, 주파수 피처 유무\n결합: 확률 평균 / 가중 평균 / 스태킹(meta learner)\n대회 상위권은 예외 없이 3~5개 모델 앙상블',
  },
];

export const COLORS = {
  xception: '#3b82f6',
  efficient: '#10b981',
  clip: '#8b5cf6',
  ensemble: '#f59e0b',
  highlight: '#ef4444',
};
