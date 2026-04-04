import type { CodeRef } from '@/components/code/types';

export const qapCodeRefs: Record<string, CodeRef> = {
  'qap-convert': {
    path: 'qap.rs — QAP::from_r1cs()',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'R1CS 행렬 → QAP 다항식 변환.\n각 열을 Lagrange 보간하여 다항식으로 변환.\nm개의 등식 검사를 하나의 다항식 항등식으로 압축.',
    code: `pub fn from_r1cs(cs: &ConstraintSystem) -> Self {
    let m = cs.num_constraints(); // 제약 수
    let n = cs.num_variables();   // 변수 수

    // 도메인: {1, 2, ..., m} — 교육용 단순 선택
    // 프로덕션: roots of unity → FFT 기반 보간
    let domain: Vec<Fr> =
        (1..=m as u64).map(Fr::from_u64).collect();

    // 희소 행렬 추출
    let (a_mat, b_mat, c_mat) = cs.to_matrices();

    // 각 변수(열)에 대해 다항식 보간
    // 열 j: (ω₁, A[1,j]), ..., (ωₘ, A[m,j])
    let a_polys = columns_to_polynomials(
        &a_mat, n, &domain);
    let b_polys = columns_to_polynomials(
        &b_mat, n, &domain);
    let c_polys = columns_to_polynomials(
        &c_mat, n, &domain);

    // 소거 다항식: t(x) = ∏(x - ωᵢ)
    let t = vanishing_polynomial(&domain);

    QAP {
        a_polys, b_polys, c_polys,
        t, domain,
        num_instance: cs.num_instance,
        num_variables: n,
    }
}`,
    annotations: [
      { lines: [5, 8], color: 'sky', note: '도메인 선택: 단순히 {1,2,..,m}. 실제 구현은 roots of unity 사용' },
      { lines: [13, 20], color: 'emerald', note: '각 열을 Lagrange 보간 — O(n^2) 교육용 구현' },
      { lines: [22, 23], color: 'amber', note: 't(x) = 모든 도메인 점에서 0. "모든 제약 만족" ⟺ "t(x)로 나눠떨어짐"' },
    ],
  },
  'polynomial': {
    path: 'qap.rs — Polynomial + Lagrange 보간',
    lang: 'rust',
    highlight: [1, 30],
    desc: '계수 표현 다항식.\neval: Horner 법으로 O(n) 평가.\nlagrange_interpolate: n개 점에서 유일한 degree < n 다항식.',
    code: `/// 다항식: coeffs[0] + coeffs[1]·x + coeffs[2]·x² + ...
pub struct Polynomial {
    pub coeffs: Vec<Fr>,
}

/// Horner 평가: O(n)
pub fn eval(&self, x: Fr) -> Fr {
    let mut result = Fr::ZERO;
    for &c in self.coeffs.iter().rev() {
        result = result * x + c;  // Horner's method
    }
    result
}

/// Lagrange 보간: n개 점 → degree < n 다항식
/// Lᵢ(x) = ∏_{j≠i} (x-xⱼ)/(xᵢ-xⱼ)
/// p(x) = Σᵢ yᵢ · Lᵢ(x)
pub fn lagrange_interpolate(
    points: &[(Fr, Fr)]
) -> Self { ... }

/// 다항식 나눗셈: self = q · divisor + r
/// h(x) = (a·b - c) / t 계산에 사용
pub fn div_rem(&self, divisor: &Self)
    -> (Self, Self)
{
    // polynomial long division
    // 나머지가 0 → QAP 만족 → 증명 가능
    ...
}`,
    annotations: [
      { lines: [6, 12], color: 'sky', note: 'Horner 평가 — 역순 순회로 x 거듭제곱 없이 O(n)' },
      { lines: [15, 20], color: 'emerald', note: 'Lagrange basis Lᵢ(x): 점 xᵢ에서 1, 나머지 점에서 0' },
      { lines: [23, 30], color: 'amber', note: 'div_rem — 나머지=0 ⟺ 모든 제약 만족 ⟺ 유효한 증명' },
    ],
  },
  'qap-compute-h': {
    path: 'qap.rs — compute_h()',
    lang: 'rust',
    highlight: [1, 18],
    desc: 'h(x) = (a(x)·b(x) - c(x)) / t(x) 계산.\n나머지가 0이면 QAP 만족 → 증명 가능.\n나머지가 0이 아니면 witness가 잘못된 것.',
    code: `/// h(x) = (a(x)·b(x) - c(x)) / t(x)
/// 나머지 0 → Some(h), 비0 → None
pub fn compute_h(
    &self, witness: &[Fr]
) -> Option<Polynomial> {
    let (a, b, c) =
        self.compute_witness_polys(witness);

    // p(x) = a(x)·b(x) - c(x)
    let ab = &a * &b;
    let p = &ab - &c;

    // 나눗셈: p(x) = h(x)·t(x) + remainder
    let (h, rem) = p.div_rem(&self.t);

    if rem.is_zero() {
        Some(h) // QAP 만족 → 증명 가능
    } else {
        None    // 불만족 → 증명 불가
    }
}`,
    annotations: [
      { lines: [6, 7], color: 'sky', note: 'witness로 결합: a(x) = Σ sⱼ·aⱼ(x)' },
      { lines: [9, 11], color: 'emerald', note: 'p(x) = a·b - c — 제약을 다항식으로 표현' },
      { lines: [14, 20], color: 'amber', note: '나머지=0이면 모든 제약 만족 — Schwartz-Zippel 보장' },
    ],
  },
};
