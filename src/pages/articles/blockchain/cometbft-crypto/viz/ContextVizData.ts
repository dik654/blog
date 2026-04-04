export const C = {
  sig: '#6366f1', merkle: '#10b981', hash: '#f59e0b',
  err: '#ef4444', ok: '#8b5cf6',
};

export const STEPS = [
  {
    label: '합의 메시지의 무결성·인증·비반박 보장',
    body: '검증자가 투표에 서명 → 누가 투표했는지 검증 가능',
  },
  {
    label: '서명 없이는 위조가 가능',
    body: '악의적 노드가 다른 검증자 명의로 투표 위조',
  },
  {
    label: 'Ed25519 — 서명/검증 흐름',
    body: 'Sign(msg): privKey(64B) → ed25519.Sign() → sig(64B)',
  },
  {
    label: 'Merkle — 재귀 이진 해시 트리',
    body: 'HashFromByteSlices(items):',
  },
  {
    label: 'TMHASH = SHA256[:20]',
    body: 'CometBFT 전용 해시: SHA256의 첫 20바이트만 사용',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'ed25519-sign', 1: 'ed25519-verify',
  2: 'ed25519-sign', 3: 'merkle-hash', 4: 'tmhash-sum',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'ed25519.go — 3대 프리미티브',
  1: 'ed25519.go — 서명 검증',
  2: 'ed25519.go — Sign/Verify/Address',
  3: 'proof.go — HashFromByteSlices',
  4: 'tmhash.go — SumTruncated',
};
