import type { CodeRef } from '@/components/code/types';

export const extHigherCodeRefs: Record<string, CodeRef> = {
  'fp6-struct': {
    path: 'field/fp6.rs — Fp6 곱셈 + inv',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'Fp6 삼차 확장체.\nc0 + c1*v + c2*v^2. Karatsuba로 Fp2 곱셈 9회 → 6회.',
    code: `/// Fp6 = Fp2[v] / (v^3 - beta)  beta = 9 + u
pub struct Fp6 {
    pub c0: Fp2, // 상수항
    pub c1: Fp2, // v의 계수
    pub c2: Fp2, // v^2의 계수
}

/// Karatsuba 곱셈: Fp2 곱셈 6회
pub fn mul(&self, rhs: &Fp6) -> Fp6 {
    let v0 = self.c0 * rhs.c0;
    let v1 = self.c1 * rhs.c1;
    let v2 = self.c2 * rhs.c2;
    let c0 = v0 + ((self.c1 + self.c2)
        * (rhs.c1 + rhs.c2) - v1 - v2)
        .mul_by_nonresidue();
    ...
}

/// 역원: norm을 Fp2로 내려서 계산
pub fn inv(&self) -> Option<Fp6> {
    let norm_inv = norm.inv()?; // Fp2의 역원
    Some(Fp6 { c0: t0 * norm_inv, ... })
}`,
    annotations: [
      { lines: [1, 6], color: 'sky', note: 'Fp6 = Fp2 3개. v^3 = beta(9+u)로 차수 제한' },
      { lines: [8, 16], color: 'emerald', note: 'Karatsuba — v0, v1, v2 재사용으로 곱셈 횟수 절감' },
      { lines: [19, 22], color: 'amber', note: 'norm으로 Fp6 → Fp2 차원 축소' },
    ],
  },
  'fp12-struct': {
    path: 'field/fp12.rs — Fp12 곱셈 + inv',
    lang: 'rust',
    highlight: [1, 24],
    desc: 'Fp12 타워 최상층.\nc0 + c1*w (w^2 = v). 페어링 결과가 이 필드의 원소.',
    code: `/// Fp12 = Fp6[w] / (w^2 - v)
/// 페어링 e(G1, G2) 결과가 Fp12 원소
pub struct Fp12 {
    pub c0: Fp6, // 상수항
    pub c1: Fp6, // w의 계수
}

/// Karatsuba 곱셈: Fp6 곱셈 3회
pub fn mul(&self, rhs: &Fp12) -> Fp12 {
    let v0 = self.c0 * rhs.c0;
    let v1 = self.c1 * rhs.c1;
    let c1 = (self.c0 + self.c1)
        * (rhs.c0 + rhs.c1) - v0 - v1;
    let c0 = v0 + v1.mul_by_nonresidue();
    Fp12 { c0, c1 }
}

/// 역원: conj(a) / norm(a)
pub fn inv(&self) -> Option<Fp12> {
    let norm = c0s - c1s.mul_by_nonresidue();
    ...
}`,
    annotations: [
      { lines: [1, 6], color: 'sky', note: 'Fp12 — 페어링의 결과 공간. embedding degree k=12' },
      { lines: [8, 15], color: 'emerald', note: 'Karatsuba — Fp2, Fp6, Fp12 모두 동일 구조' },
      { lines: [18, 21], color: 'amber', note: 'conjugate + norm — Fp12 역원을 Fp6 역원으로 환원' },
    ],
  },
};
