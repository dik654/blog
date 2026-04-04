export const C = {
  r1cs: '#6366f1', qap: '#10b981', proof: '#ec4899', pair: '#0ea5e9',
};

export const STEPS = [
  {
    label: 'R1CS → QAP 변환',
    body: '회로의 제약 조건을 R1CS로 표현 — → 라그랑주 보간으로 QAP 다항식 변환',
  },
  {
    label: '증명 = A(G1) + B(G2) + C(G1)',
    body: '증명자: R1CS witness로 QAP 다항식 계산',
  },
  {
    label: '검증: 단일 페어링 방정식',
    body: 'e(A,B) = e(α,β) · e(inputs,γ) · e(C,δ)',
  },
];
