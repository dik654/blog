import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '자동 평가 — LLM-as-judge',
    body: '평가 전용 LLM이 응답을 1~5점 채점 — 사람 평가의 70~80% 일치율',
  },
  {
    label: '규칙 기반 검증',
    body: '정규식·JSON 스키마·금지어 필터 — 비용 0으로 LLM-judge와 병행',
  },
  {
    label: '골든 셋 + 엣지 케이스',
    body: '정답 확정 50~200개 골든 셋 + 엣지 케이스로 회귀 테스트 자동화',
  },
  {
    label: '핵심 메트릭 4가지',
    body: '정확도·지연시간·비용·환각률 — 프로덕션 LLM의 4대 핵심 지표',
  },
];

export const METRICS = [
  { label: '정확도', icon: '✓', color: '#10b981', value: '92.3%' },
  { label: '지연시간', icon: '⏱', color: '#6366f1', value: '1.2s' },
  { label: '비용', icon: '$', color: '#f59e0b', value: '$0.003' },
  { label: '환각률', icon: '!', color: '#f59e0b', value: '3.1%' },
];
