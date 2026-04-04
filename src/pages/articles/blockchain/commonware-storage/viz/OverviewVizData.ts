import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'SSD 순차 쓰기 최적화 — 랜덤 쓰기 회피가 설계 원칙' },
  { label: 'Persistable trait — commit → sync → destroy 라이프사이클' },
  { label: 'Context = Storage + Clock + Metrics — 결정론적 시뮬레이션 가능' },
];

export const STEP_REFS = ['persistable-trait', 'persistable-trait', 'context-trait'] as const;

export const STEP_LABELS = [
  'lib.rs — append-only 설계',
  'lib.rs — Persistable trait',
  'lib.rs — Context trait',
] as const;
