export const C = {
  leaf: '#10b981', inner: '#f59e0b', proof: '#6366f1', root: '#8b5cf6',
};

export const STEPS = [
  {
    label: 'HashFromByteSlices() — 재귀 이진 분할',
    body: '0개: emptyHash() — 1개: leafHash(0x00 ∥ item)',
  },
  {
    label: 'Proof.Verify() — 형제 경로로 루트 복원',
    body: 'Aunts: 루트까지의 형제 노드 해시 배열',
  },
  {
    label: 'leafHash vs innerHash — 프리픽스 구분',
    body: 'leaf: SHA256(0x00 ∥ data) — 잎 노드',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'merkle-hash',
  1: 'merkle-verify',
  2: 'merkle-leaf-inner',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'proof.go — HashFromByteSlices()',
  1: 'proof.go — Proof.Verify()',
  2: 'proof.go — leafHash / innerHash',
};
