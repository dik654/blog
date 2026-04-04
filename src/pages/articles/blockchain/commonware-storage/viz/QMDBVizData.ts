import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'QMDB 전체 구조 — Any + Current + Store + Verify' },
  { label: 'Batch Lifecycle — new_batch → write → merkleize → finalize → apply' },
  { label: 'Flat Key-Value + In-Memory Merkleization = O(1) SSD I/O' },
  { label: 'MPT vs QMDB — 랜덤 I/O vs 순차 쓰기 성능 비교' },
];

export const STEP_REFS = [
  'any-db', 'any-get', 'current-db', 'current-db',
] as const;

export const STEP_LABELS = [
  'mod.rs — 모듈 구조',
  'traits.rs — Batch API',
  'db.rs — Merkleization',
  'db.rs — 성능',
] as const;
