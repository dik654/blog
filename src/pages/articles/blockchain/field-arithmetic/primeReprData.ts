export const limbCode = `limb[0] = 0x3c208c16d87cfd47   ← 최하위 64-bit
limb[1] = 0x97816a916871ca8d
limb[2] = 0xb85045b68181585d
limb[3] = 0x30644e72e131a029   ← 최상위 64-bit

복원: limb[0] + limb[1] * 2^64 + limb[2] * 2^128 + limb[3] * 2^192`;

export const fpStructCode = `#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Fp(pub(crate) [u64; 4]);

pub const ZERO: Fp = Fp([0, 0, 0, 0]);`;

export const helperCode = `// adc: 두 u64를 carry와 함께 더하기
let (s1, c1) = a.overflowing_add(b);
let (s2, c2) = s1.overflowing_add(carry as u64);
(s2, c1 | c2)

// mac: 곱셈 결과가 128-bit이므로 u128로 확장
let wide = acc as u128 + (a as u128) * (b as u128) + carry as u128;
(wide as u64, (wide >> 64) as u64)`;

export const modAddCode = `pub fn add(&self, rhs: &Fp) -> Fp {
    let (d0, carry) = self.0[0].overflowing_add(rhs.0[0]);
    let (d1, carry) = adc(self.0[1], rhs.0[1], carry);
    let (d2, carry) = adc(self.0[2], rhs.0[2], carry);
    let (d3, _) = adc(self.0[3], rhs.0[3], carry);
    sub_if_gte([d0, d1, d2, d3])
}`;
