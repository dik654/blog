import type { CodeRef } from './codeRefsTypes';

export const plonkishCodeRefs: Record<string, CodeRef> = {
  'plonk-gate': {
    path: 'ZK-Garage/plonk/src/proof_system/widget/arithmetic.rs',
    lang: 'rust',
    highlight: [1, 22],
    desc:
`ArithmeticGate는 PLONK의 범용 게이트 제약을 정의합니다.

q_M·(a·b) + q_L·a + q_R·b + q_O·c + q_C + PI = 0

selector 값 5개(q_M, q_L, q_R, q_O, q_C)의 조합으로
덧셈, 곱셈, 상수, 혼합 게이트를 하나의 등식으로 표현합니다.`,
    code: `/// Arithmetic gate: q_M·(a·b) + q_L·a + q_R·b + q_O·c + q_C + PI = 0
pub(crate) fn compute_quotient_i(
    index: usize,
    w_l: &[BlsScalar],    // left wire
    w_r: &[BlsScalar],    // right wire
    w_o: &[BlsScalar],    // output wire
    w_4: &[BlsScalar],    // 4th advice wire
    q_arith: &[BlsScalar],
) -> BlsScalar {
    let a = w_l[index];
    let b = w_r[index];
    let c = w_o[index];
    let d = w_4[index];

    // q_M·(a·b) + q_L·a + q_R·b + q_O·c + q_4·d + q_C + PI
    let q_m = self.q_m[index];
    let q_l = self.q_l[index];
    let q_r = self.q_r[index];
    let q_o = self.q_o[index];
    let q_c = self.q_c[index];

    (q_m * a * b) + (q_l * a) + (q_r * b) + (q_o * c) + q_c
}`,
    annotations: [
      { lines: [1, 2], color: 'sky', note: '범용 게이트 등식 — quotient polynomial의 i번째 항 계산' },
      { lines: [4, 7], color: 'emerald', note: '4개 wire 값 (a, b, c, d) — w_4는 TurboPlonk 확장' },
      { lines: [16, 20], color: 'amber', note: '5개 selector: q_M(곱셈), q_L(좌), q_R(우), q_O(출력), q_C(상수)' },
      { lines: [22, 22], color: 'violet', note: '최종 게이트 계산 — 0이면 제약 만족' },
    ],
  },

  'plonk-copy': {
    path: 'ZK-Garage/plonk/src/proof_system/permutation.rs',
    lang: 'rust',
    highlight: [1, 28],
    desc:
`Permutation argument는 copy constraint를 다항식으로 인코딩합니다.

Grand product Z(x)를 사용해 "두 벡터가 같은 값의 순열 관계"임을 증명합니다.
Z(ω⁰)=1에서 시작하여 각 행에서 (f'+γ)/(g'+γ) 비율을 누적하고,
마지막에 Z(ωⁿ)=1로 닫히면 permutation이 올바른 것입니다.`,
    code: `/// Computes the permutation accumulator polynomial Z(x)
pub(crate) fn compute_permutation_poly(
    domain: &EvaluationDomain,
    wires: (&[BlsScalar], &[BlsScalar], &[BlsScalar], &[BlsScalar]),
    permutation: &[BlsScalar],
    beta: &BlsScalar,
    gamma: &BlsScalar,
) -> DensePolynomial {
    let n = domain.size();
    let mut z = Vec::with_capacity(n);
    z.push(BlsScalar::one());  // Z(ω⁰) = 1

    for i in 0..n - 1 {
        let (a, b, c, d) = (wires.0[i], wires.1[i], wires.2[i], wires.3[i]);
        // numerator:   Π (wᵢ + β·ωⁱ·kⱼ + γ)
        let num = (a + beta * &domain.element(i) + gamma)
                * (b + beta * &K1 * &domain.element(i) + gamma)
                * (c + beta * &K2 * &domain.element(i) + gamma)
                * (d + beta * &K3 * &domain.element(i) + gamma);
        // denominator: Π (wᵢ + β·σ(i) + γ)
        let den = (a + beta * permutation[i] + gamma)
                * (b + beta * permutation[n + i] + gamma)
                * (c + beta * permutation[2*n + i] + gamma)
                * (d + beta * permutation[3*n + i] + gamma);
        z.push(z[i] * num * den.inverse().unwrap());
    }
    // z[n-1] should equal 1 if permutation is correct
    DensePolynomial::from_coefficients_vec(domain.ifft(&z))
}`,
    annotations: [
      { lines: [2, 8], color: 'sky', note: 'Z(x) 계산 진입 — beta, gamma는 Fiat-Shamir 챌린지' },
      { lines: [11, 11], color: 'emerald', note: 'Z(ω⁰) = 1 — accumulator 초기값' },
      { lines: [15, 19], color: 'amber', note: '분자: 원래 위치 기반 — (wᵢ + β·ωⁱ·kⱼ + γ)' },
      { lines: [20, 24], color: 'violet', note: '분모: permutation 위치 기반 — (wᵢ + β·σ(i) + γ)' },
    ],
  },
};
