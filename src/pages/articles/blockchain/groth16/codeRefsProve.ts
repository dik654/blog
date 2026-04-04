import type { CodeRef } from './codeRefsTypes';

export const proveCodeRefs: Record<string, CodeRef> = {
  'groth16-create-proof': {
    path: 'arkworks-rs/groth16/src/prover.rs',
    lang: 'rust',
    highlight: [1, 32],
    desc:
`create_random_proof()는 ProvingKey와 witness로 Proof(A, B, C)를 생성합니다.

1. r, s 랜덤 블라인딩 → 같은 witness라도 매번 다른 증명 (영지식)
2. A = [α + Σaᵢ·uᵢ(τ) + r·δ]₁ — MSM으로 계산
3. B = [β + Σaᵢ·vᵢ(τ) + s·δ]₂ — G2에서 MSM
4. C = [비공개 LC + h(τ)·t(τ)/δ + As + Br - rsδ]₁

MSM이 전체 연산의 90% 이상을 차지하며, GPU 가속의 주요 대상입니다.`,
    code: `pub fn create_random_proof<E, C, R>(
    circuit: C,
    pk: &ProvingKey<E>,
    rng: &mut R,
) -> Result<Proof<E>, SynthesisError>
where
    E: Pairing,
    C: ConstraintSynthesizer<E::ScalarField>,
    R: Rng,
{
    // 영지식 블라인딩 팩터
    let r = E::ScalarField::rand(rng);
    let s = E::ScalarField::rand(rng);

    // witness 계산 (R1CS 만족하는 full assignment)
    let cs = ConstraintSystem::new_ref();
    circuit.generate_constraints(cs.clone())?;
    let assignment = cs.borrow().unwrap().witness_assignment.clone();
    let h = QAP::compute_h(&assignment, &pk.domain)?;

    // A = [α]₁ + MSM(u_query, assignment) + r·[δ]₁
    let g_a = pk.vk.alpha_g1
        + E::G1::msm_unchecked(&pk.a_query, &assignment)
        + pk.vk.delta_g1 * r;

    // B = [β]₂ + MSM(v_query, assignment) + s·[δ]₂
    let g_b = pk.vk.beta_g2
        + E::G2::msm_unchecked(&pk.b_g2_query, &assignment)
        + pk.vk.delta_g2 * s;

    // B' in G1 (C 계산용)
    let g_b_g1 = pk.beta_g1
        + E::G1::msm_unchecked(&pk.b_g1_query, &assignment);`,
    annotations: [
      { lines: [11, 13], color: 'sky', note: 'r, s 랜덤 — 매 증명마다 다른 블라인딩 (영지식 보장)' },
      { lines: [15, 19], color: 'emerald', note: 'witness 계산 + h(x) = QAP quotient polynomial' },
      { lines: [21, 24], color: 'amber', note: 'A ∈ G1: α + Σaᵢ·uᵢ(τ) + rδ — 핵심 MSM 연산' },
      { lines: [26, 29], color: 'violet', note: 'B ∈ G2: β + Σaᵢ·vᵢ(τ) + sδ — G2 MSM' },
    ],
  },

  'groth16-c-calc': {
    path: 'arkworks-rs/groth16/src/prover.rs',
    lang: 'rust',
    highlight: [1, 20],
    desc:
`C 계산은 Groth16 증명에서 가장 복잡한 부분입니다.

C = [비공개 LC]/δ + [h(τ)·t(τ)]/δ + A·s + B'·r - r·s·[δ]₁

비공개 LC: 인덱스 l+1..m까지의 linear combination (공개 부분 제외)
h(τ)·t(τ)/δ: QAP quotient을 δ로 나눈 것
A·s + B'·r - rsδ: 블라인딩 상쇄 항`,
    code: `    // C 계산: 비공개 LC + QAP quotient + 블라인딩
    let private_lc = E::G1::msm_unchecked(
        &pk.l_query,                    // L: 비공개 wire의 LC
        &assignment[num_public + 1..],  // 비공개 witness만
    );

    let h_term = E::G1::msm_unchecked(
        &pk.h_query,   // [τⁱ·t(τ)/δ]₁
        &h.coeffs,     // h(x) 계수
    );

    // 블라인딩: A·s + B'·r - r·s·[δ]₁
    let g_c = private_lc
        + h_term
        + g_a * s         // A·s
        + g_b_g1 * r      // B'·r (G1 버전)
        - pk.vk.delta_g1 * (r * s);  // -rsδ

    Ok(Proof {
        a: g_a.into_affine(),
        b: g_b.into_affine(),
        c: g_c.into_affine(),
    })`,
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'MSM: 비공개 witness × L_query (γ,δ로 분리된 부분)' },
      { lines: [7, 10], color: 'emerald', note: 'MSM: h(x) × [τⁱ·t(τ)/δ]₁ — QAP quotient 항' },
      { lines: [12, 17], color: 'amber', note: 'A·s + B\'·r - rsδ — 검증 시 상쇄되는 블라인딩' },
      { lines: [19, 22], color: 'violet', note: 'Proof(A, B, C) — BN254 기준 256 bytes' },
    ],
  },
};
