import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  uniform: '#3b82f6',
  stride: '#10b981',
  keyframe: '#f59e0b',
  skip: '#94a3b8',
  selected: '#ef4444',
  flow: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: 'Uniform Sampling — 균등 간격 추출',
    body: '전체 T 프레임에서 N개를 균등 간격으로 추출.\n예: 300프레임 영상 → 16프레임 선택 시 19프레임 간격.\n장점: 구현이 단순하고 전체 시간 범위를 커버.\n단점: 빠른 동작이 간격 사이에서 누락될 수 있음.',
  },
  {
    label: 'Temporal Stride — 고정 보폭 추출',
    body: '시작점에서 stride 간격으로 연속 추출.\n예: stride=4이면 0, 4, 8, 12, ... 번째 프레임 선택.\n장점: 지역적 시간 연속성을 잘 보존.\n단점: 영상 후반부를 커버하지 못할 수 있음.',
  },
  {
    label: 'Key Frame Selection — 장면 전환 기반',
    body: '프레임 간 차이(히스토그램, optical flow 등)를 측정해 변화가 큰 지점을 선택.\n장면 전환·급격한 움직임 지점을 확실히 포착.\n단점: 정적 구간에서 프레임이 부족할 수 있음.',
  },
  {
    label: '트레이드오프: 프레임 수 vs 정확도 vs 메모리',
    body: '프레임 수 ↑ → 정확도 ↑ but GPU 메모리 ↑ (선형 증가).\n실전 기준: 8~32 프레임이 일반적. 64프레임은 고성능 GPU 필요.\n짧은 클립(2~5초) vs 전체 영상(수분) — 긴 영상은 클립 분할 후 집계.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
