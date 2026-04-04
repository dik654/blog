export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'IC_sum = ic[0] + Σ pub[j]·ic[j+1]',
    body: 'ic[0] + Σ pub[j]·ic[j+1]으로 공개 입력을 커브 포인트에 결합',
  },
  {
    label: 'e(A,B) =? e(α,β) · e(IC_sum,[γ]₂) · e(C,[δ]₂)',
    body: 'e(A,B) =? e(α,β)·e(IC_sum,[γ]₂)·e(C,[δ]₂) — 3개 페어링으로 검증 완료',
  },
  {
    label: '증명 크기 256바이트, 검증 O(1)',
    body: 'A+B+C = 256바이트, 회로 크기 무관 O(1) — Ethereum zk-rollup 검증 표준',
  },
];

export const STEP_REFS = ['groth16-verify', 'groth16-verify', 'groth16-proof'];
export const STEP_LABELS = ['groth16.rs — IC_sum 계산', 'groth16.rs — 페어링 검증', 'groth16.rs — Proof struct'];
