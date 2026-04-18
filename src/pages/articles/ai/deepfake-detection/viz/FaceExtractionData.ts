import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1단계: 얼굴 검출 — 이미지에서 얼굴 영역 찾기',
    body: 'MTCNN: 3단계 캐스케이드(P-Net→R-Net→O-Net) — 작은 얼굴도 검출\nRetinaFace: FPN 기반 단일 패스 — 정확도 최고, 속도 보통\nMediaPipe: 모바일 최적화 — 실시간 가능, 대회용으로는 정확도 부족',
  },
  {
    label: '2단계: 랜드마크 정렬 — 눈·코·입 위치 기준 회전 보정',
    body: '5점 랜드마크(양쪽 눈, 코, 양쪽 입꼬리)로 얼굴 기울기 계산\nAffine Transform: 기준 좌표(template)에 맞춰 회전+스케일+이동\n정렬 안 하면 — 같은 사람이라도 각도에 따라 다른 피처 추출',
  },
  {
    label: '3단계: 크롭 + 리사이즈 — 모델 입력 규격 맞추기',
    body: '얼굴 영역에 마진 1.3배 확장 (턱·이마·귀 포함)\n224x224 또는 299x299로 리사이즈 — 백본 입력 규격\n비율 유지: 짧은 변 기준 리사이즈 후 center crop',
  },
  {
    label: '비디오 프레임 샘플링: 모든 프레임을 처리하지 않는다',
    body: '균등 샘플링: 전체 N프레임에서 K개 등간격 추출 (K=16~32)\n얼굴 품질 기반: 블러/가림 없는 프레임 우선 선택\n키프레임 기반: 장면 전환점 근처 프레임 — 조작 경계가 드러나기 쉬움\n최종: 프레임별 예측 → 비디오 단위 집계(평균/최대/투표)',
  },
];

export const COLORS = {
  detect: '#3b82f6',
  landmark: '#10b981',
  crop: '#f59e0b',
  sample: '#8b5cf6',
};
