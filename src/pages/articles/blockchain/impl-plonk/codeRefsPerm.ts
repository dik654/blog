import type { CodeRef } from '@/components/code/types';

export const permCodeRefs: Record<string, CodeRef> = {
  'perm-poly': {
    path: 'plonk/permutation.rs — permutation 다항식',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'copy constraint를 Union-Find로 cycle 구성 후\nposition tag를 Lagrange 보간하여 sigma 다항식 생성.',
    code: `/// sigma = cycle 표현: 같은 class의 position들이 순환
fn compute_sigma(n: usize,
    copy_constraints: &[(WirePosition, WirePosition)],
) -> Vec<usize> {
    let mut parent: Vec<usize> = (0..3*n).collect();
    // Union-Find로 equivalence class 구성
    for &(p, q) in copy_constraints {
        union(&mut parent, pos_to_idx(p, n), pos_to_idx(q, n));
    }
    // class별 그룹핑 → cycle 구성
    // [p1, p2, ..., pk] → p1→p2→...→pk→p1
    let mut sigma: Vec<usize> = (0..3*n).collect();
    for (_, class) in &classes {
        for i in 0..class.len() {
            let next = if i+1 < class.len() { class[i+1] }
                       else { class[0] };
            sigma[class[i]] = next;
        }
    }
    sigma
}

/// sigma_A(w^i) = position_tag(sigma(A, i))
pub fn compute_permutation_polynomials(
    cs: &PlonkConstraintSystem, domain: &Domain,
) -> (Polynomial, Polynomial, Polynomial) {
    let sigma = compute_sigma(n, cs.copy_constraints());
    // 각 column별 Lagrange 보간...
}`,
    annotations: [
      { lines: [5, 8], color: 'sky', note: 'Union-Find — copy constraint를 equivalence class로 병합' },
      { lines: [12, 19], color: 'emerald', note: 'cycle 구성 — class 내 원소를 순환 연결' },
      { lines: [23, 29], color: 'amber', note: 'tag → 다항식 — position_tag를 도메인 점에서 보간' },
    ],
  },
  'perm-grand': {
    path: 'plonk/permutation.rs — grand product Z(x)',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'grand product Z(x).\ncopy constraint 만족 시 Z가 telescope하여 Z(w^n)=1.',
    code: `/// Z(w^0) = 1
/// Z(w^(i+1)) = Z(w^i) * num(i) / den(i)
pub fn compute_grand_product(
    cs: &PlonkConstraintSystem, domain: &Domain,
    sigma_a: &Polynomial, sigma_b: &Polynomial,
    sigma_c: &Polynomial, beta: Fr, gamma: Fr,
) -> Polynomial {
    let mut z_values = Vec::with_capacity(n);
    z_values.push(Fr::ONE); // Z(w^0) = 1

    for i in 0..n-1 {
        let omega_i = domain.elements[i];
        // num: identity tag 사용
        let num = (a_i + beta * omega_i + gamma)
            * (b_i + beta * k1 * omega_i + gamma)
            * (c_i + beta * k2 * omega_i + gamma);
        // den: sigma tag 사용
        let den = (a_i + beta * sigma_a.eval(omega_i) + gamma)
            * (b_i + beta * sigma_b.eval(omega_i) + gamma)
            * (c_i + beta * sigma_c.eval(omega_i) + gamma);

        z_values.push(z_values[i] * num * den.inv()?);
    }
    // Lagrange 보간으로 다항식 Z(x) 구성
    Polynomial::lagrange_interpolate(&points)
}`,
    annotations: [
      { lines: [1, 2], color: 'sky', note: 'Z(w^0)=1에서 시작, 매 행마다 num/den 누적곱' },
      { lines: [13, 16], color: 'emerald', note: 'num: identity permutation 가정 — 코셋 tag 사용' },
      { lines: [18, 20], color: 'amber', note: 'den: 실제 sigma permutation — copy constraint 반영' },
      { lines: [22, 22], color: 'violet', note: '만족 시 num=den → telescope → Z(w^n)=1' },
    ],
  },
};
