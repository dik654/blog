export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: '해시 기반 커밋먼트: C = H(value, randomness)',
    body: 'Hiding(역산 불가) + Binding(충돌 불가) — Poseidon 1회로 커밋먼트 완성',
  },
  {
    label: 'commit → verify → open 프로토콜',
    body: 'commit(C 공개, v/r 비밀) → open(v/r 공개, H(v,r)==C 검증) 프로토콜',
  },
  {
    label: 'ZK 회로에서의 활용: Mixer / Semaphore',
    body: 'Poseidon + Merkle 회로로 ~3,000 제약 — commitment 멤버십의 ZK 증명 가능',
  },
];

export const STEP_REFS = ['commitment', 'commitment', 'merkle-circuit'];
export const STEP_LABELS = ['commitment.rs — commit + verify', 'commitment.rs — commit/open', 'merkle.rs — MerkleProofCircuit'];
