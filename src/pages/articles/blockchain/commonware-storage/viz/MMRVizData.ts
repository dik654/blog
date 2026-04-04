import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'MMR 구조 — 높이 감소하는 완전 이진 트리(peak)의 연속' },
  { label: 'Batch API — new_batch → add → merkleize → finalize → apply' },
  { label: 'Append — O(1) 순차 쓰기, peak 높이 일치 시 자동 병합' },
  { label: '증명 — fold_prefix(이전 peaks) + fetch_nodes(형제) → 루트 재구성' },
];

export const STEP_REFS = [
  'mmr-family', 'mmr-batch', 'mmr-family', 'mmr-proof',
] as const;

export const STEP_LABELS = [
  'mod.rs — Family 정의',
  'batch.rs — Batch API',
  'mod.rs — children()',
  'proof.rs — range_proof()',
] as const;
