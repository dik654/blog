import type { CodeRef } from '@/components/code/types';

export const montCodeRefs: Record<string, CodeRef> = {
  'mont-mul': {
    path: 'field/fp.rs — mont_mul + mont_reduce_inner',
    lang: 'rust',
    highlight: [1, 38],
    desc: 'Montgomery 곱셈.\nschoolbook 4x4 곱셈 → REDC 축소. 나눗셈 없이 모듈러 곱셈 수행.',
    code: `/// Montgomery 곱셈: a_mont * b_mont * R^{-1} mod p
pub fn mont_mul(&self, rhs: &Fp) -> Fp {
    // 1단계: schoolbook 4x4 곱셈 → 8-limb 결과
    let mut t = [0u64; 8];
    // self[0] x rhs 전체
    let (t0, carry) = mac(0, self.0[0], rhs.0[0], 0);
    let (t1, carry) = mac(0, self.0[0], rhs.0[1], carry);
    let (t2, carry) = mac(0, self.0[0], rhs.0[2], carry);
    let (t3, t4)    = mac(0, self.0[0], rhs.0[3], carry);
    t[0] = t0;
    // self[1] x rhs, 기존 값에 누적
    let (t1, carry) = mac(t1, self.0[1], rhs.0[0], 0);
    // ... (self[2], self[3] 동일 패턴)

    // 2단계: Montgomery reduction (REDC)
    Fp(Self::mont_reduce_inner(&t))
}

/// REDC: 8-limb → 4-limb
fn mont_reduce_inner(t: &[u64; 8]) -> [u64; 4] {
    let mut r = *t;
    for i in 0..4 {
        // m = r[i] * INV mod 2^64
        // m*p를 더하면 r[i]가 정확히 0이 됨
        let m = r[i].wrapping_mul(INV);

        // r += m * p (하위 limb은 0이 되어 사라짐)
        let (_, carry) = mac(r[i], m, MODULUS[0], 0);
        let (res, carry) = mac(r[i+1], m, MODULUS[1], carry);
        r[i+1] = res;
        let (res, carry) = mac(r[i+2], m, MODULUS[2], carry);
        r[i+2] = res;
        let (res, carry) = mac(r[i+3], m, MODULUS[3], carry);
        r[i+3] = res;
        // carry를 상위 limb으로 전파 ...
    }
    // 상위 4 limb이 결과
    sub_if_gte([r[4], r[5], r[6], r[7]])
}`,
    annotations: [
      { lines: [3, 13], color: 'sky', note: '1단계: 4x4 schoolbook 곱셈 — mac로 16회 곱셈+누적' },
      { lines: [16, 16], color: 'emerald', note: '2단계: REDC — 8-limb을 4-limb으로 축소' },
      { lines: [24, 25], color: 'amber', note: 'INV 마법 — m*p를 더하면 하위 limb이 정확히 0' },
      { lines: [38, 38], color: 'violet', note: '최종 보정 — 결과 >= p이면 p를 빼줌' },
    ],
  },
  'fp-inv-pow': {
    path: 'field/fp.rs — inv, pow, square',
    lang: 'rust',
    highlight: [1, 26],
    desc: '거듭제곱과 역원.\nmont_mul 하나로 square, pow, inv를 모두 구현.',
    code: `/// a^2 = mont_mul(a, a)
pub fn square(&self) -> Fp {
    self.mont_mul(self)
}

/// a^exp — square-and-multiply
pub fn pow(&self, exp: &[u64; 4]) -> Fp {
    let mut result = Fp::ONE;
    let mut base = *self;
    for &limb in exp.iter() {
        for j in 0..64 {
            if (limb >> j) & 1 == 1 {
                result = result.mont_mul(&base);
            }
            base = base.square();
        }
    }
    result
}

/// a^{-1} = a^{p-2} mod p (Fermat's little theorem)
/// p가 소수이므로 a^{p-1} = 1, 양변을 a로 나누면 a^{p-2} = a^{-1}
pub fn inv(&self) -> Option<Fp> {
    if self.is_zero() { return None; }
    Some(self.pow(&[MODULUS[0] - 2, MODULUS[1], MODULUS[2], MODULUS[3]]))
}`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: 'square — 자기 자신과 mont_mul. 별도 최적화 가능하지만 여기선 간결함 우선' },
      { lines: [6, 18], color: 'emerald', note: 'square-and-multiply — 비트 하나당 1회 제곱, 1이면 추가 곱셈. O(256) 곱셈' },
      { lines: [21, 25], color: 'amber', note: 'Fermat 역원 — 확장 유클리드 대신 pow 한 줄로 구현. 254비트 지수 계산' },
    ],
  },
};
