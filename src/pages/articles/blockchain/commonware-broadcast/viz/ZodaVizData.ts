export const STEPS = [
  { label: 'Scheme vs PhasedScheme',
    body: 'Scheme: encode → check → decode 3단계.' },
  { label: 'ZODA encode: 행렬 → RS → Merkle → 체크섬',
    body: '1. 데이터를 n·S × c 행렬로 배치' },
  { label: 'ZODA check: Merkle + 체크섬 검증',
    body: 'weak_shard 수신 → inclusion_proof로 Merkle 검증' },
  { label: 'Strong → Weak → CheckedShard',
    body: 'StrongShard: rows + proof + checksum + root (직접 수신자)' },
];

export const STEP_REFS: Record<number, string> = {
  0: 'coding-scheme',
  1: 'zoda-impl',
  2: 'zoda-check',
  3: 'zoda-impl',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'lib.rs — Scheme traits',
  1: 'mod.rs — encode()',
  2: 'mod.rs — check()',
  3: 'mod.rs — StrongShard/WeakShard',
};
