import type { CodeRef } from '@/components/code/types';

export const kzgCodeRefs: Record<string, CodeRef> = {
  'kzg-srs': {
    path: 'kzg.rs — SRS + Trusted Setup',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'Universal SRS 구조체와 setup.\nGroth16은 회로마다 새 CRS가 필요하지만 KZG는 한 번이면 충분.',
    code: `/// SRS — Universal Setup 결과
pub struct SRS {
    pub g1_powers: Vec<G1>,  // [t^0]_1, [t^1]_1, ..., [t^d]_1
    pub g2_powers: Vec<G2>,  // [t^0]_2, [t^1]_2, ...
}

/// Trusted Setup — t 랜덤 생성 후 powers 계산
pub fn setup<R: Rng>(
    max_degree: usize,
    max_degree_g2: usize,
    rng: &mut R,
) -> SRS {
    let tau = random_nonzero_fr(rng);  // toxic waste
    let g1 = G1::generator();

    let mut g1_powers = Vec::with_capacity(max_degree + 1);
    let mut tau_power = Fr::ONE;
    for _ in 0..=max_degree {
        g1_powers.push(g1.scalar_mul(&tau_power.to_repr()));
        tau_power = tau_power * tau;
    }
    // G2도 동일 패턴...
    SRS { g1_powers, g2_powers }
}`,
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'SRS = t의 거듭제곱을 커브 포인트로 인코딩한 배열' },
      { lines: [13, 13], color: 'emerald', note: 'tau(t) = toxic waste — setup 후 반드시 삭제' },
      { lines: [17, 21], color: 'amber', note: 'scalar_mul 반복 — O(d) 시간, d = 최대 차수' },
    ],
  },
  'kzg-commit': {
    path: 'kzg.rs — commit + open + verify',
    lang: 'rust',
    highlight: [1, 38],
    desc: 'commit: 다항식을 G1 점 하나로.\nopen: f(z)=y 증명 생성.\nverify: 페어링으로 검증.',
    code: `/// commit(f) = Sum f_i * [t^i]_1
pub fn commit(srs: &SRS, poly: &Polynomial) -> Commitment {
    let mut result = G1::identity();
    for (i, &coeff) in poly.coeffs.iter().enumerate() {
        if !coeff.is_zero() {
            result = result + srs.g1_powers[i]
                .scalar_mul(&coeff.to_repr());
        }
    }
    Commitment(result)
}

/// open: q(x) = (f(x) - y) / (x - z), pi = commit(q)
pub fn open(srs: &SRS, poly: &Polynomial, point: Fr)
    -> Opening {
    let value = poly.eval(point);
    let numerator = poly - &Polynomial::constant(value);
    let denominator = Polynomial::from_coeffs(vec![-point, Fr::ONE]);
    let (quotient, _) = numerator.div_rem(&denominator);
    Opening { point, value, proof: commit(srs, &quotient).0 }
}

/// verify: e(pi, [t]_2) == e(C - [y]_1 + z*pi, G_2)
pub fn verify(srs: &SRS, commitment: &Commitment,
    opening: &Opening) -> bool {
    let pi = opening.proof;
    let y_g1 = G1::generator().scalar_mul(&opening.value.to_repr());
    let z_pi = pi.scalar_mul(&opening.point.to_repr());
    let rhs_g1 = commitment.0 + (-y_g1) + z_pi;

    let lhs = pairing(&pi, &srs.g2_powers[1]);      // e(pi, [t]_2)
    let rhs = pairing(&rhs_g1, &srs.g2_powers[0]);   // e(..., G_2)
    lhs == rhs
}`,
    annotations: [
      { lines: [2, 10], color: 'sky', note: 'commit — MSM: 다항식 계수와 SRS 점의 선형 결합' },
      { lines: [14, 20], color: 'emerald', note: 'open — f(z)=y 이면 (x-z) | (f(x)-y) → 몫 q 존재' },
      { lines: [23, 33], color: 'amber', note: '2-pairing 최적화: G2 scalar_mul 회피로 검증 고속화' },
    ],
  },
};
