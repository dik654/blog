import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'Any DB 구조 — AuthenticatedLog(MMR) + snapshot 인덱스' },
  { label: 'get(key) — snapshot에서 위치 조회 → log에서 값 읽기' },
  { label: 'put(key, value) — log에 Operation 추가, snapshot 갱신' },
  { label: 'proof(loc) — MMR range_proof + 연산 목록 반환' },
  { label: 'prune — inactivity_floor 이전 비활성 연산 삭제' },
];

export const STEP_REFS = [
  'any-db', 'any-get', 'any-db', 'any-proof', 'any-db',
] as const;

export const STEP_LABELS = [
  'db.rs — Db 구조체',
  'db.rs — get()',
  'db.rs — log + snapshot',
  'db.rs — proof()',
  'db.rs — prune()',
] as const;
