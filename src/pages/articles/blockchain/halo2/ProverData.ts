export const PHASE1_CODE = `// halo2_proofs/src/plonk/prover.rs

pub fn create_proof<C, E, R, T, ConcreteCircuit>(params, pk, circuits, instances, rng, transcript) {
    // 1. VK 해시 → 트랜스크립트 (도메인 분리)
    pk.vk.hash_into(transcript)?;

    // 2. 회로 합성: 어드바이스 열 값 채움
    //    WitnessCollection: advice[col][row] = assign_advice() 값
    //    blinding: 각 어드바이스 열 마지막 blinding_factors 행을 랜덤으로
    let advice_blinds: Vec<_> = advice.iter().map(|_| Blind(rng.next())).collect();

    // 3. Lagrange → KZG 커밋
    let advice_commitments = advice_values.iter().zip(advice_blinds.iter())
        .map(|(poly, blind)| params.commit_lagrange(poly, *blind).to_affine())
        .collect();
    // → transcript.write_point(commitment)?  (Fiat-Shamir에 포함)

    // 4. Lagrange → 계수형 → extended coset 변환 (NTT)
    let advice_polys  = advice.map(|p| domain.lagrange_to_coeff(p));
    let advice_cosets = advice_polys.map(|p| domain.coeff_to_extended(p));
}`;

export const PHASE2_CODE = `// θ (theta): Plookup 입력 열 선형 결합
let theta: ChallengeTheta = transcript.squeeze_challenge_scalar();
// → lookup.commit_permuted(pk, params, domain, theta, ...)
//   permuted_input_expression = Σ θ^i * input_i(X)
//   permuted_table_expression = Σ θ^i * table_i(X)

// β, γ (beta, gamma): 퍼뮤테이션 & Plookup 그랜드 프로덕트
let beta:  ChallengeBeta  = transcript.squeeze_challenge_scalar();
let gamma: ChallengeGamma = transcript.squeeze_challenge_scalar();

// 퍼뮤테이션 그랜드 프로덕트 Z_perm(X):
//   Z_perm(wX) * Π(A(X) + β·σ_i(X) + γ) = Z_perm(X) * Π(A(X) + β·X_i + γ)
// Plookup 그랜드 프로덕트 Z_lookup(X):
//   Z_lookup(wX) * (permuted_input + γ)(permuted_table + γ)
//       = Z_lookup(X) * (input + γ)(table + γ)

// y (고차 결합): 모든 게이트 + 퍼뮤테이션 + Plookup 제약을 y^i로 선형 결합
let y: ChallengeY = transcript.squeeze_challenge_scalar();
// → 소멸 다항식 h(X) = Σ y^i * constraint_i(X) / Z_H(X)
//   분할: h(X) = h_0(X) + X^n * h_1(X) + ... (도수 제한)
// → KZG 커밋 → transcript`;

export const PHASE5_CODE = `// x (개구 지점): 모든 다항식을 ω^rotation * x 에서 평가
let x: ChallengeX = transcript.squeeze_challenge_scalar();

// 각 열 다항식을 쿼리 지점에서 평가하여 트랜스크립트에 기록
// eval_polynomial(&advice_polys[col], domain.rotate_omega(*x, rotation))
// → transcript.write_scalar(eval)?

// SHPLONK 다중 개구 증명 (poly/multiopen/prover.rs)
// x_1, x_2, x_3, x_4 도전값으로 여러 다항식의 여러 점 개구를
// 단일 KZG 증명으로 압축
// ProverQuery { poly, blind, point, eval } 수집
// → kate_division(f(X) - f(a)) / (X - a) 계산 후 KZG 커밋`;
