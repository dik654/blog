export const SETUP_CODE = `// KZG10 Trusted Setup (Kate-Zaverucha-Goldberg, 2010)
pub fn setup<R: RngCore>(
  max_degree: usize, produce_g2_powers: bool, rng: &mut R,
) -> Result<UniversalParams<E>, Error> {
  let beta = E::ScalarField::rand(rng);  // 비밀 값 (toxic waste)
  let g = E::G1::rand(rng);              // G1 생성원
  let gamma_g = E::G1::rand(rng);        // hiding용 추가 생성원
  let h = E::G2::rand(rng);              // G2 생성원

  // powers_of_beta = [1, beta, beta^2, ..., beta^max_degree]
  let mut powers_of_beta = vec![E::ScalarField::one()];
  let mut cur = beta;
  for _ in 0..=max_degree { powers_of_beta.push(cur); cur *= &beta; }

  // G1에서의 Powers: [g, beta*g, beta^2*g, ...]
  let powers_of_g = g.batch_mul(&powers_of_beta[0..max_degree + 1]);
  // hiding용: [gamma_g, beta*gamma_g, ...]
  let powers_of_gamma_g = gamma_g.batch_mul(&powers_of_beta);
}`;

export const SETUP_ANNOTATIONS = [
  { lines: [5, 8] as [number, number], color: 'sky' as const, note: '비밀 값 생성 (beta, g, gamma_g, h)' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: 'beta의 거듭제곱 스칼라 계산' },
  { lines: [16, 18] as [number, number], color: 'amber' as const, note: 'MSM으로 G1/hiding 포인트 생성' },
];

export const COMMIT_CODE = `// 다항식 커밋 & Opening Proof
pub fn commit(powers: &Powers<E>, polynomial: &P,
  hiding_bound: Option<usize>, rng: Option<&mut dyn RngCore>,
) -> Result<(Commitment<E>, Randomness), Error> {
  // 계수 처리: leading zero 건너뛰기 + bigint 변환
  let (num_leading_zeros, plain_coeffs) =
    skip_leading_zeros_and_convert_to_bigints(polynomial);

  // MSM으로 커밋: C = a0*G + a1*(beta*G) + ... = p(beta)*G
  let mut commitment = <E::G1 as VariableBaseMSM>::msm_bigint(
    &powers.powers_of_g[num_leading_zeros..], &plain_coeffs);

  // hiding 활성화 시: C += r(beta)*gamma_G
  if let Some(hiding_degree) = hiding_bound {
    let random_commitment = <E::G1 as VariableBaseMSM>::msm_bigint(
      &powers.powers_of_gamma_g, &random_ints);
    commitment += &random_commitment;
  }
  // 최종: C = p(beta)*G + r(beta)*gamma_G
}`;

export const COMMIT_ANNOTATIONS = [
  { lines: [6, 7] as [number, number], color: 'sky' as const, note: 'leading zero 최적화로 불필요한 연산 제거' },
  { lines: [10, 11] as [number, number], color: 'emerald' as const, note: 'MSM: C = p(beta)*G (핵심 커밋 연산)' },
  { lines: [14, 18] as [number, number], color: 'amber' as const, note: 'hiding: 랜덤 다항식으로 정보 은닉' },
];
