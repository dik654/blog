export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Optimal Ate 페어링: e(P, Q) → Fp12',
    body: 'G1×G2 → GT, 쌍선형성 e(aP,bQ)=e(P,Q)^(ab)으로 ZK 검증 가능',
  },
  {
    label: 'Miller 루프 — NAF(|6u+2|) 순회',
    body: '|6u+2|의 65비트 NAF를 순회하며 매 step에서 line_double + 조건부 line_add',
  },
  {
    label: 'Line function — 접선/할선을 Fp12로 평가',
    body: '접선(double)/할선(add)을 Fp12로 평가 — sparse 결과로 계수 3개만 비영',
  },
  {
    label: 'Frobenius 보정 + 최종 지수화',
    body: 'Frobenius 보정 후 f^((p¹²-1)/r) 지수화 — easy part(conjugate·inv) + hard part(pow)',
  },
  {
    label: '쌍선형성 검증: e(aP, bQ) = e(P,Q)^(ab)',
    body: 'e(3P,5Q)=e(P,Q)^15과 e(P,-Q)·e(P,Q)=1 등의 테스트로 쌍선형성 확인',
  },
];

export const STEP_REFS = ['final-exp', 'miller-loop', 'line-functions', 'final-exp', 'final-exp'];
export const STEP_LABELS = ['pairing.rs — pairing()', 'pairing.rs — miller_loop()', 'pairing.rs — line functions', 'pairing.rs — final_exp()', 'pairing.rs — bilinearity'];
