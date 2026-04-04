import type { CodeRef } from './codeRefsTypes';

export const kzgCodeRefs: Record<string, CodeRef> = {
  'kzg-srs': {
    path: 'jellyfish/primitives/src/pcs/univariate_kzg/srs.rs',
    lang: 'rust',
    highlight: [1, 18],
    desc:
`UnivariateUniversalParams는 KZG의 SRS(Structured Reference String)입니다.

powers_of_g: [G1]₁, [τ·G1]₁, [τ²·G1]₁, ... — commit에 사용
h / beta_h: G2 생성자와 [τ]₂ — 페어링 검증에 사용

setup()에서 비밀 τ를 생성하고, τ의 거듭제곱을 타원곡선 위에 인코딩합니다.
τ 자체는 삭제해야 하며(toxic waste), SRS만 공개됩니다.`,
    code: `/// Universal parameter for univariate KZG PCS.
#[derive(Derivative, CanonicalSerialize, CanonicalDeserialize)]
pub struct UnivariateUniversalParams<E: Pairing> {
    /// Group elements of the form \`{ β^i G }\`,
    /// where \`β\` is the toxic waste,
    /// \`G\` is the generator of G1.
    pub powers_of_g: Vec<E::G1Affine>,
    /// The generator of G2.
    pub h: E::G2Affine,
    /// β times the generator of G2.
    pub beta_h: E::G2Affine,
}

impl<E: Pairing> UnivariateUniversalParams<E> {
    /// Returns the maximum supported degree
    pub fn max_degree(&self) -> usize {
        self.powers_of_g.len() - 1
    }
}`,
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'SRS 구조체 — τ 거듭제곱을 G1 점들로 저장' },
      { lines: [7, 8], color: 'emerald', note: 'powers_of_g: [G1, τ·G1, τ²·G1, ...] — MSM commit용' },
      { lines: [10, 12], color: 'amber', note: 'h, beta_h: G2 점 — 페어링 검증 e(C, h) == e(π, β_h)에 사용' },
    ],
  },

  'kzg-commit': {
    path: 'jellyfish/primitives/src/pcs/univariate_kzg/mod.rs',
    lang: 'rust',
    highlight: [1, 24],
    desc:
`commit()은 다항식 p(x)를 하나의 G1 점으로 커밋합니다.
핵심은 MSM: C = Σ cᵢ · [τⁱ]₁ = [p(τ)]₁
open()은 인수정리로 q(x) = (p(x)-v)/(x-z)를 계산합니다.`,
    code: `impl<E: Pairing> PolynomialCommitmentScheme for UnivariateKzgPCS<E> {
    fn commit(
        prover_param: &Self::ProverParam,
        poly: &DensePolynomial<E::ScalarField>,
    ) -> Result<Self::Commitment, PCSError> {
        let commit = E::G1::msm_unchecked(
            &prover_param.powers_of_g,
            &poly.coeffs,
        );
        Ok(Commitment(commit.into_affine()))
    }

    fn open(
        prover_param: &Self::ProverParam,
        polynomial: &DensePolynomial<E::ScalarField>,
        point: &E::ScalarField,
    ) -> Result<(Self::Proof, Self::Evaluation), PCSError> {
        let eval = polynomial.evaluate(point);
        let divisor = compute_divisor_polynomial(polynomial, point, &eval);
        // π = [q(τ)]₁ where q(x) = (p(x) - eval) / (x - point)
        let proof = E::G1::msm_unchecked(
            &prover_param.powers_of_g,
            &divisor.coeffs,
        );
        Ok((Proof(proof.into_affine()), eval))
    }
}`,
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'commit() — 다항식 계수를 SRS로 MSM → G1 점 1개' },
      { lines: [6, 10], color: 'emerald', note: 'MSM: C = Σ coeffs[i] · powers_of_g[i] = [p(τ)]₁' },
      { lines: [13, 20], color: 'amber', note: 'open() — 인수정리 기반: q(x) = (p(x)-v)/(x-z) 계산' },
      { lines: [21, 25], color: 'violet', note: '증명 π = [q(τ)]₁ — 역시 MSM으로 계산' },
    ],
  },
};
