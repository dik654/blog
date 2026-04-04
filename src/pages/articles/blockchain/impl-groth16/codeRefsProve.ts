import type { CodeRef } from '@/components/code/types';

export const proveCodeRefs: Record<string, CodeRef> = {
  'groth16-prove': {
    path: 'groth16.rs — prove()',
    lang: 'rust',
    highlight: [1, 34],
    desc: '증명 생성.\nh(x) 계산 → A, B, C 커브 포인트 조립.\n블라인딩 r,s로 영지식성 보장.',
    code: `pub fn prove<R: Rng>(
    pk: &ProvingKey, qap: &QAP,
    witness: &[Fr], rng: &mut R,
) -> Option<Proof> {
    // 1. h(x) = (a·b - c) / t — 불만족이면 None
    let h = qap.compute_h(witness)?;

    // 2. 블라인딩 팩터 — 영지식성의 핵심
    let r = random_fr(rng);
    let s = random_fr(rng);

    // 3. A = [α]₁ + Σ wⱼ·[aⱼ(τ)]₁ + r·[δ]₁
    let mut proof_a = pk.alpha_g1;
    for j in 0..pk.num_variables {
        if !witness[j].is_zero() {
            proof_a = proof_a
                + pk.a_query[j]
                    .scalar_mul(&witness[j].to_repr());
        }
    }
    proof_a = proof_a
        + pk.delta_g1.scalar_mul(&r.to_repr());

    // 4. B = [β]₂ + Σ wⱼ·[bⱼ(τ)]₂ + s·[δ]₂
    let mut proof_b = pk.beta_g2;
    for j in 0..pk.num_variables {
        if !witness[j].is_zero() {
            proof_b = proof_b
                + pk.b_g2_query[j]
                    .scalar_mul(&witness[j].to_repr());
        }
    }
    proof_b = proof_b
        + pk.delta_g2.scalar_mul(&s.to_repr());
    ...
}`,
    annotations: [
      { lines: [5, 6], color: 'sky', note: 'h(x) 계산 — QAP 불만족이면 Option::None 즉시 반환' },
      { lines: [8, 10], color: 'emerald', note: 'r,s — 매번 새 랜덤. 같은 witness여도 다른 증명 생성' },
      { lines: [12, 22], color: 'amber', note: 'A 조립: α(지식계수) + Σwⱼaⱼ(τ)(QAP) + rδ(블라인딩)' },
    ],
  },
  'groth16-prove-c': {
    path: 'groth16.rs — C 원소 계산',
    lang: 'rust',
    highlight: [1, 25],
    desc: 'C = private기여 + h기여 + 블라인딩.\n세 항이 합쳐져 검증 방정식의 e(C,[δ]₂) 항을 구성.',
    code: `// C ∈ G1
let num_public = pk.num_instance + 1;
let mut proof_c = G1::identity();

// 비공개 변수 기여: Σ wⱼ · l_query[j']
for (idx, j) in
    (num_public..pk.num_variables).enumerate()
{
    if !witness[j].is_zero() {
        proof_c = proof_c
            + pk.l_query[idx]
                .scalar_mul(&witness[j].to_repr());
    }
}

// h(x) 기여: Σ hᵢ · h_query[i]
for (i, &h_coeff) in h.coeffs.iter().enumerate() {
    if !h_coeff.is_zero() && i < pk.h_query.len() {
        proof_c = proof_c
            + pk.h_query[i]
                .scalar_mul(&h_coeff.to_repr());
    }
}

// 블라인딩: s·A + r·B' - r·s·[δ]₁
proof_c = proof_c
    + proof_a.scalar_mul(&s.to_repr())
    + b_g1.scalar_mul(&r.to_repr())
    + (-pk.delta_g1.scalar_mul(&rs.to_repr()));`,
    annotations: [
      { lines: [5, 14], color: 'sky', note: 'private 기여: (β·aⱼ+α·bⱼ+cⱼ)/δ를 wⱼ로 결합' },
      { lines: [16, 23], color: 'emerald', note: 'h 기여: h(τ)·t(τ)/δ — QAP 만족의 증거' },
      { lines: [25, 29], color: 'amber', note: '블라인딩: sA+rB\'-rsδ — 교차항 소거하여 영지식성 보장' },
    ],
  },
};
