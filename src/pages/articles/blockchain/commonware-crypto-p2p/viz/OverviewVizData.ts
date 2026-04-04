export const C = {
  signer: '#6366f1',
  verifier: '#10b981',
  batch: '#f59e0b',
  recover: '#8b5cf6',
};

export const STEPS = [
  {
    label: 'Signer: namespace + msg → Signature',
    body: 'namespace + msg로 도메인 분리 — 계층 간 서명 재사용 불가',
  },
  {
    label: 'Verifier: 공개키로 서명 검증',
    body: 'PublicKey가 Ord + Hash 확장 — BTreeSet 키로 정렬/집합 연산 가능',
  },
  {
    label: 'BatchVerifier: 서명 누적 → 일괄 검증',
    body: 'add() N회 → verify(rng) 1회 — 랜덤 가중합으로 위조 배치 공격 방지',
  },
  {
    label: 'Recoverable: 서명에서 공개키 복원',
    body: 'secp256r1 전용 — 서명 65B에서 v 바이트로 공개키 복원 (EIP-712 호환)',
  },
];

export const STEP_REFS = [
  'signer-trait',
  'verifier-trait',
  'batch-verifier',
  'secp256r1-recover',
];

export const STEP_LABELS = [
  'lib.rs — Signer trait',
  'lib.rs — Verifier / PublicKey / Signature',
  'lib.rs — BatchVerifier',
  'recoverable.rs — Recoverable',
];
