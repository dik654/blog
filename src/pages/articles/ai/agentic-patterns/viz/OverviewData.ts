import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '단순 LLM 호출 — 입력 → 출력, 끝',
    body: '도구 없이 질문 하나에 응답 하나를 생성하고 종료하는 1회성 호출이다.',
  },
  {
    label: '에이전트 = LLM + 도구 + 판단 + 반복',
    body: '에이전트는 도구를 호출하고, 결과를 관찰하고, 스스로 다음 행동을 결정한다.',
  },
  {
    label: '에이전트 루프: Observe → Think → Act',
    body: 'Observe → Think → Act 루프를 목표 달성까지 반복한다.',
  },
  {
    label: '4대 구성요소',
    body: 'LLM(두뇌), Tools(손), Memory(기억), Planning(계획)으로 구성된다.',
  },
];

export const COMPONENTS = [
  { label: 'LLM', short: '두뇌', color: '#6366f1' },
  { label: 'Tools', short: '손', color: '#f59e0b' },
  { label: 'Memory', short: '기억', color: '#10b981' },
  { label: 'Planning', short: '계획', color: '#6366f1' },
];
