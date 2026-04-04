import type { CodeRef } from './codeRefsTypes';

export const setupCodeRefs: Record<string, CodeRef> = {
  'groth16-keygen': {
    path: 'arkworks-rs/groth16/src/generator.rs',
    lang: 'rust',
    highlight: [1, 35],
    desc:
`generate_random_parameters()는 R1CS 회로로부터 ProvingKey와 VerifyingKey를 생성합니다.

1. toxic waste (α, β, γ, δ, τ) 5개 랜덤 생성
2. τ의 거듭제곱으로 QAP 다항식 평가
3. IC(공개) / L(비공개)로 Linear Combination 분리
4. γ, δ로 나눠 별도 검증 채널 형성

N명 MPC ceremony에서는 각자의 비밀값 곱으로 최종 파라미터가 결정됩니다.`,
    code: `pub fn generate_random_parameters<E, C, R>(
    circuit: C,
    rng: &mut R,
) -> Result<ProvingKey<E>, SynthesisError>
where
    E: Pairing,
    C: ConstraintSynthesizer<E::ScalarField>,
    R: Rng,
{
    // 1. Toxic waste 생성
    let alpha = E::ScalarField::rand(rng);
    let beta  = E::ScalarField::rand(rng);
    let gamma = E::ScalarField::rand(rng);
    let delta = E::ScalarField::rand(rng);
    let tau   = E::ScalarField::rand(rng);

    // 2. R1CS → QAP 변환
    let cs = ConstraintSystem::new_ref();
    circuit.generate_constraints(cs.clone())?;
    cs.finalize();
    let matrices = cs.to_matrices().unwrap();

    // 3. QAP 다항식을 τ에서 평가
    let domain = EvaluationDomain::new(matrices.num_constraints)?;
    let powers_of_tau: Vec<_> = (0..domain.size())
        .map(|i| tau.pow([i as u64]))
        .collect();

    // 4. ProvingKey / VerifyingKey 조립
    let vk = VerifyingKey {
        alpha_g1:  (E::G1::generator() * alpha).into(),
        beta_g2:   (E::G2::generator() * beta).into(),
        gamma_g2:  (E::G2::generator() * gamma).into(),
        delta_g2:  (E::G2::generator() * delta).into(),
        gamma_abc_g1: compute_ic::<E>(&matrices, &alpha, &beta, &gamma, &tau),
    };
    Ok(ProvingKey { vk, /* ... */ })
}`,
    annotations: [
      { lines: [10, 15], color: 'sky', note: 'Toxic waste 5개 랜덤 생성 — setup 후 반드시 삭제' },
      { lines: [17, 21], color: 'emerald', note: 'R1CS 제약 생성 → QAP 행렬 변환' },
      { lines: [23, 28], color: 'amber', note: 'τ 거듭제곱 계산 — QAP 다항식 평가용' },
      { lines: [30, 37], color: 'violet', note: 'VK 조립: [α]₁, [β]₂, [γ]₂, [δ]₂ + IC(공개 입력)' },
    ],
  },

};
