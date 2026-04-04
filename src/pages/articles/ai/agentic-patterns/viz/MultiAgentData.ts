import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Supervisor: 중앙 조정자가 서브에이전트에 위임',
    body: '감독자가 작업을 서브에이전트에 배분하고 결과를 취합',
  },
  {
    label: 'Debate: 에이전트 간 토론 → 합의',
    body: '복수 에이전트가 독립 추론 후 토론 → 합의로 정확도 향상',
  },
  {
    label: 'Specialist Routing: 의도 분류 → 전문 에이전트',
    body: '라우터가 의도 분류 → 전문 에이전트로 분기, 범용보다 효과적',
  },
  {
    label: 'Hierarchical: 매니저 → 팀 리더 → 워커',
    body: 'Manager → Team Lead → Worker 계층으로 대규모 작업 분할 조율',
  },
];

export const AGENTS = [
  { label: 'Supervisor', color: '#6366f1', x: 190, y: 20 },
  { label: 'Code', color: '#10b981', x: 60, y: 100 },
  { label: 'Search', color: '#f59e0b', x: 190, y: 100 },
  { label: 'Write', color: '#6366f1', x: 320, y: 100 },
];
