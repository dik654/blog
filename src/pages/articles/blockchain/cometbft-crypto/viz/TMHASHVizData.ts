export const C = {
  input: '#6366f1', sha: '#f59e0b', trunc: '#8b5cf6', addr: '#10b981',
};

export const STEPS = [
  {
    label: 'Sum() — SHA256 전체 32바이트',
    body: 'sha256.Sum256(data) → h[:]',
  },
  {
    label: 'SumTruncated() — SHA256[:20]',
    body: 'sha256.Sum256(data) → h[:TruncatedSize]',
  },
  {
    label: '💡 20바이트로 줄이는 이유',
    body: '비트코인 RIPEMD160(SHA256(x)) 패턴에서 유래',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'tmhash-sum', 1: 'tmhash-sum', 2: 'tmhash-sum',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'tmhash.go — Sum()',
  1: 'tmhash.go — SumTruncated()',
  2: 'tmhash.go — TruncatedSize = 20',
};
