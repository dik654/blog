export const C = {
  ed: '#6366f1',
  bls: '#10b981',
  secp: '#f59e0b',
};

export const STEPS = [
  {
    label: 'ed25519: 가장 빠른 서명/검증',
    body: 'ed25519-consensus 크레이트 — ZIP-215 엄격 규칙.',
  },
  {
    label: 'bls12381: 집계 서명 → O(1) 인증서',
    body: 'MinPk variant: PK 48B(G1), Sig 96B(G2).',
  },
  {
    label: 'secp256r1: HSM/TEE 호환',
    body: 'NIST P-256 — RFC 6979 + BIP 62 low-s.',
  },
];

export const STEP_REFS = [
  'ed25519-signer',
  'bls-signer',
  'secp256r1-signer',
];

export const STEP_LABELS = [
  'scheme.rs — ed25519 Signer impl',
  'scheme.rs — bls12381 Signer impl',
  'standard.rs — secp256r1 Signer impl',
];
