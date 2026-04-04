export const C = {
  priv: '#6366f1', pub: '#10b981', sig: '#f59e0b', addr: '#8b5cf6',
};

export const STEPS = [
  {
    label: 'Sign(): privKey → 서명 생성',
    body: 'ed25519.Sign(privKey, msg) → sig(64B)',
  },
  {
    label: 'VerifySignature(): pubKey + msg + sig → bool',
    body: 'len(sig) != 64이면 즉시 false 반환 — 불필요한 연산 차단',
  },
  {
    label: 'PubKey.Address() — SHA256(pubKey)[:20]',
    body: 'tmhash.SumTruncated(pubKey)',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'ed25519-sign',
  1: 'ed25519-verify',
  2: 'ed25519-addr',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'ed25519.go — Sign()',
  1: 'ed25519.go — VerifySignature()',
  2: 'ed25519.go — Address()',
};
