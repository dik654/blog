import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'Current DB = Any DB + Activity Bitmap + Grafted MMR' },
  { label: 'Grafting — ops MMR 서브트리 + 비트맵 청크 → 하나의 leaf' },
  { label: 'OperationProof — 활성 비트 확인 + grafted 루트 검증' },
  { label: '정규 루트 = Hash(ops_root || grafted_root [|| partial_chunk])' },
];

export const STEP_REFS = [
  'current-db', 'grafting', 'current-proof', 'current-db',
] as const;

export const STEP_LABELS = [
  'db.rs — Db 구조체',
  'grafting.rs — 접목',
  'proof.rs — OperationProof',
  'db.rs — root()',
] as const;
