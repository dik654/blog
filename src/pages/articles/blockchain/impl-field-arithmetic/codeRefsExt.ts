import type { CodeRef } from '@/components/code/types';

export const extCodeRefs: Record<string, CodeRef> = {
  'fp2-struct': {
    path: 'field/fp2.rs — Fp2 struct + mul + inv',
    lang: 'rust',
    highlight: [1, 34],
    desc: 'Fp2 이차 확장체.\na0 + a1*u (u^2 = -1). 복소수와 동일한 구조.',
    code: `/// Fp2 = Fp[u] / (u^2 + 1)
/// 구조: a0 + a1*u  (a0, a1 in Fp)
pub struct Fp2 {
    pub c0: Fp, // 실수부
    pub c1: Fp, // 허수부 (u의 계수)
}

/// Karatsuba 곱셈: Fp 곱셈 4회 → 3회
pub fn mul(&self, rhs: &Fp2) -> Fp2 {
    let v0 = self.c0 * rhs.c0;
    let v1 = self.c1 * rhs.c1;
    let c1 = (self.c0 + self.c1) * (rhs.c0 + rhs.c1) - v0 - v1;
    let c0 = v0 - v1; // u^2 = -1
    Fp2 { c0, c1 }
}

/// 역원: a^{-1} = conj(a) / norm(a)
pub fn inv(&self) -> Option<Fp2> {
    let n = self.norm();  // Fp2 → Fp
    let n_inv = n.inv()?;
    let conj = self.conjugate();
    Some(Fp2 { c0: conj.c0 * n_inv, c1: conj.c1 * n_inv })
}

/// 켤레: a0 + a1*u → a0 - a1*u
pub fn conjugate(&self) -> Fp2 {
    Fp2 { c0: self.c0, c1: -self.c1 }
}`,
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'Fp2 = 복소수. c0이 실수부, c1이 허수부' },
      { lines: [8, 15], color: 'emerald', note: 'Karatsuba — 곱셈 3회로 줄임. v0, v1 재사용' },
      { lines: [17, 23], color: 'amber', note: 'norm으로 차원을 내림 — Fp2 역원을 Fp 역원으로 환원' },
    ],
  },
};
