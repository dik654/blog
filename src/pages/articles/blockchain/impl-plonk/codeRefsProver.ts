import type { CodeRef } from '@/components/code/types';

export const proverCodeRefs: Record<string, CodeRef> = {
  'prover-rounds': {
    path: 'plonk/prover.rs — 5-round Fiat-Shamir prover',
    lang: 'rust',
    highlight: [1, 38],
    desc: 'PLONK 5라운드 prover 전체 흐름.\nwire commit → Z → quotient T → eval → opening.',
    code: `pub fn prove(srs: &SRS, cs: &PlonkConstraintSystem,
    domain: &Domain) -> PlonkProof {
    let selectors = cs.selector_polynomials(domain);
    let (a_poly, b_poly, c_poly) = cs.wire_polynomials(domain);
    let (sigma_a, sigma_b, sigma_c) =
        compute_permutation_polynomials(cs, domain);

    // Round 1: Wire Commitments
    let a_comm = kzg::commit(srs, &a_poly);
    let b_comm = kzg::commit(srs, &b_poly);
    let c_comm = kzg::commit(srs, &c_poly);
    // transcript에 추가 → beta, gamma 도출

    // Round 2: Permutation Grand Product
    let z_poly = compute_grand_product(
        cs, domain, &sigma_a, &sigma_b, &sigma_c, beta, gamma);
    let z_comm = kzg::commit(srs, &z_poly);

    // Round 3: Quotient T(x) = combined / Z_H(x)
    // gate + alpha*perm1 + alpha^2*perm2
    let (t_lo, t_mid, t_hi) = split_quotient(&t_poly, n);

    // Round 4: Evaluations at zeta
    let a_eval = a_poly.eval(zeta);
    // sigma_a_eval, sigma_b_eval, z_omega_eval...

    // Round 5: Opening Proofs
    // W_zeta: batch opening [r + nu*(a-a_bar) + ...] / (x-zeta)
    // W_zeta_omega: [Z - z_bar_omega] / (x - zeta*omega)
    PlonkProof { a_comm, b_comm, c_comm, z_comm,
        t_lo_comm, t_mid_comm, t_hi_comm,
        a_eval, b_eval, c_eval,
        sigma_a_eval, sigma_b_eval, z_omega_eval,
        w_zeta, w_zeta_omega }
}`,
    annotations: [
      { lines: [8, 11], color: 'sky', note: 'Round 1 — wire 다항식을 KZG commit → 3개 G1 점' },
      { lines: [14, 17], color: 'emerald', note: 'Round 2 — copy constraint의 grand product Z(x) commit' },
      { lines: [19, 21], color: 'amber', note: 'Round 3 — 모든 제약을 합산 → Z_H로 나눠 T(x) 생성' },
      { lines: [27, 29], color: 'violet', note: 'Round 5 — batch KZG opening 2개 (zeta, zeta*omega)' },
    ],
  },
  'prover-verify': {
    path: 'plonk/prover.rs — verifier (batched pairing)',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'PLONK 검증.\nFiat-Shamir 재현 → linearization commitment → pairing.',
    code: `pub fn verify(srs: &SRS, vk: &VerifyingKey,
    proof: &PlonkProof, _public_inputs: &[Fr]) -> bool {
    // Step 1: Fiat-Shamir 챌린지 재현
    let (beta, gamma, alpha, zeta, nu, u) = replay_transcript(proof);

    // Step 2: Z_H(zeta), L1(zeta) 계산
    let z_h_zeta = zeta_n - Fr::ONE;
    let l1_zeta = z_h_zeta / (n * (zeta - 1));

    // Step 3: Linearization commitment [r]_1
    let r_comm = a_bar*[q_L] + b_bar*[q_R] + c_bar*[q_O]
        + (a_bar*b_bar)*[q_M] + [q_C]
        + (alpha*perm_num + alpha^2*L1)*[Z]
        - alpha*...*beta*[sigma_C]
        - z_h_zeta*([t_lo] + zeta^n*[t_mid] + zeta^2n*[t_hi])
        - r_constant * G1;

    // Step 4: Batched F = [r] + nu*[a] + nu^2*[b] + ... + u*[Z]
    // Step 5: E = nu*a_bar + nu^2*b_bar + ... + u*z_bar_omega

    // Step 6: Pairing Check
    // e(W_zeta + u*W_zeta_omega, [tau]_2)
    //   == e(zeta*W_zeta + u*zeta*omega*W_zeta_omega + F - E, G_2)
    lhs == rhs
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'Fiat-Shamir — prover와 동일한 순서로 챌린지 재현' },
      { lines: [10, 16], color: 'emerald', note: '선형화 — 다항식곱을 scalar*commitment로 분해' },
      { lines: [18, 19], color: 'amber', note: '배치 결합 — nu 거듭제곱으로 6개 다항식을 하나로' },
      { lines: [22, 24], color: 'violet', note: '최종 검증 — pairing 2번으로 모든 관계 확인' },
    ],
  },
};
