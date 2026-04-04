export const PAIRING_STEPS = [
  {
    label: '타원곡선 위의 점 덧셈',
    body: '두 점의 직선 → 세 번째 교점 반사 = P+Q. 군(group)을 이룬다.',
  },
  {
    label: '유한체 위의 곡선',
    body: 'Fp 위에서 곡선 정의. 점 덧셈 공식 동일, 전부 mod p.',
  },
  {
    label: 'G1 — BN254 곡선 위 점들의 군',
    body: 'y²=x³+3, 256-bit 소수 p. 위수 r ≈ 2²⁵⁴. 점 1개 = 64 bytes.',
  },
  {
    label: 'G2 — twist로 만든 두 번째 군',
    body: 'twist = 곡선 계수를 ξ로 나눠 Fp² 위 새 곡선. 좌표: a+bu.',
  },
  {
    label: '페어링 = 두 점 → 하나의 값',
    body: 'e(P,Q): G1×G2→GT. 양선형성: e(aP,bQ)=e(P,Q)^(ab).',
  },
  {
    label: '파이프라인: P,Q → Miller Loop → Final Exp → GT',
    body: 'Miller Loop → Fp¹² 원소 f → Final Exp → GT. 총 ~20,000 Fp곱.',
  },
  {
    label: 'Miller Loop: 접선 함수를 반복 누적',
    body: '매 스텝: 더블링 → 접선 평가 ℓ(P) → f에 곱셈. 254번 반복.',
  },
  {
    label: 'Miller Loop: 한 iteration의 동작',
    body: 'T←2T, ℓ(P) 평가, f←f²·ℓ(P). sparse 곱셈으로 1/3 비용.',
  },
  {
    label: 'Final Exp 개요: 3단계 분해',
    body: '~3000-bit 지수를 (p⁶-1)·(p²+1)·(p⁴-p²+1)/r로 인수분해.',
  },
  {
    label: 'Easy Part 1: f^(p⁶−1) = 켤레 ÷ 원본',
    body: '켤레 f̄·f⁻¹. 역원 1번 + 곱셈 1번. 전체의 ~0.04%.',
  },
  {
    label: 'Easy Part 2: g^(p²+1) = Frobenius + 곱셈 1번',
    body: 'Frobenius 2회(비용≈0) + Fp12 곱 1번.',
  },
  {
    label: 'Hard Part: h^d를 x-체인 + Frobenius로',
    body: 'd를 c₀+c₁p+c₂p²+c₃p³로 분해. 곱 ~30 + Frobenius 4번.',
  },
];
