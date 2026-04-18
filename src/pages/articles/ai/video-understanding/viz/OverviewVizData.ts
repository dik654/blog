import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  image: '#3b82f6',
  video: '#8b5cf6',
  time: '#ef4444',
  spatial: '#10b981',
  flow: '#64748b',
  app: '#f59e0b',
};

export const STEPS: StepDef[] = [
  {
    label: '이미지 vs 비디오 — 차원의 차이',
    body: '이미지: H x W x C (높이 x 너비 x 채널), 한 장의 정적 장면.\n비디오: T x H x W x C — 시간 축 T가 추가되어 데이터 볼륨이 수십~수백 배 증가.',
  },
  {
    label: '시공간(Spatiotemporal) 피처',
    body: '공간(spatial) — 한 프레임 안의 물체 위치, 형태, 질감.\n시간(temporal) — 프레임 간 움직임, 변화, 인과관계.\n비디오 이해 = 두 축을 동시에 모델링.',
  },
  {
    label: '핵심 과제 3가지',
    body: '행동 인식(Action Recognition) — "무엇을 하는가" 분류.\n시간 위치화(Temporal Localization) — "언제 일어나는가" 탐지.\n비디오 캡셔닝(Video Captioning) — 영상 내용을 자연어로 기술.',
  },
  {
    label: '실전 응용: 구조물 안정성 & 딥페이크',
    body: '구조물 시뮬레이션: 10초 영상에서 균열 진행·변위 패턴을 시간 축으로 추적.\n딥페이크 탐지: 프레임 간 미세한 불일치(깜빡임 패턴, 입 움직임)를 시간 축에서 감지.\n의료 영상: 초음파·내시경 동영상에서 병변 진행 추적.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
