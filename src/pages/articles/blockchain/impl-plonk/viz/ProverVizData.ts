export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: '5-Round 프로토콜 개요',
    body: '5 라운드: wire commit → perm Z → quotient T → 평가 → batch opening',
  },
  {
    label: 'Round 3 — Quotient T(x) = combined / Z_H(x)',
    body: 'gate+perm을 Z_H로 나눠 T(x) 생성 — n차씩 t_lo, t_mid, t_hi로 3분할',
  },
  {
    label: 'Round 5 — Linearization + Batch Opening',
    body: '선형화 r(x) + batch opening 2개(W_zeta, W_{zeta*omega})로 증명 완성',
  },
  {
    label: 'Verifier — Fiat-Shamir 재현 + Pairing Check',
    body: 'Fiat-Shamir 재현 → linearization → batched pairing check로 O(1) 검증',
  },
];

export const STEP_REFS = ['prover-rounds', 'prover-rounds', 'prover-rounds', 'prover-verify'];
export const STEP_LABELS = ['prover.rs — 5-round overview', 'prover.rs — quotient T(x)', 'prover.rs — linearization', 'prover.rs — verifier pairing'];
