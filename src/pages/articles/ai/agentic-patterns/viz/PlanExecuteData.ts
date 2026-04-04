import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Plan-and-Execute: 먼저 계획, 그다음 실행',
    body: '작업 전에 전체 단계를 먼저 설계하고 순차 실행한다.',
  },
  {
    label: '계획 단계 — 전체 작업을 하위 태스크로 분해',
    body: 'Planner LLM이 전체 작업을 하위 태스크로 한번에 분해한다.',
  },
  {
    label: 'Reflection: 실행 결과를 자기 평가',
    body: '각 단계 실행 후 LLM이 자체 평가해 계획을 수정할지 결정한다.',
  },
  {
    label: 'Replan: 필요시 계획을 동적으로 수정',
    body: '실행 중 새 정보를 발견하면 남은 단계를 동적으로 재설계한다.',
  },
  {
    label: 'Tree-of-Thought: 여러 경로 탐색',
    body: '단일 경로 대신 BFS/DFS로 여러 분기를 탐색해 최적 경로를 선택한다.',
  },
];
