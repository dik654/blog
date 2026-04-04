export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'SHA-256 vs Poseidon — ZK 제약 비용',
    body: 'Poseidon은 유한체 산술로 ~250 제약, SHA-256 대비 100배 적어 ZK에 최적',
  },
  {
    label: 'Poseidon 라운드 구조: Full + Partial',
    body: 'Full(전체 S-box) + Partial(첫 원소만) 조합 — Full 4 + Partial 57 + Full 4',
  },
  {
    label: 'Sponge 구조: 입력 흡수 → 순열 → 출력 추출',
    body: 'state=[capacity, rate₀, rate₁]에서 입력 흡수 → 순열 → state[1]이 해시 결과',
  },
  {
    label: '전체 구성: Hash → Merkle → Commitment → Circuit',
    body: 'Hash → Merkle(멤버십) → Commitment(은닉) → 전부 R1CS 회로로 ZK 증명',
  },
];

export const STEP_REFS = ['poseidon-params', 'poseidon-permutation', 'poseidon-hash', 'merkle-tree'];
export const STEP_LABELS = ['poseidon.rs — Poseidon 상수', 'poseidon.rs — poseidon_permutation', 'poseidon.rs — poseidon_hash', 'merkle.rs — SparseMerkleTree'];
