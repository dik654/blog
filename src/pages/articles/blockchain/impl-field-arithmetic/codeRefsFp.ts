import type { CodeRef } from '@/components/code/types';

export const fpCodeRefs: Record<string, CodeRef> = {
  'fp-struct': {
    path: 'field/fp.rs — Fp struct + constants',
    lang: 'rust',
    highlight: [1, 24],
    desc: 'BN254 소수체 Fp.\n내부는 항상 Montgomery form — a_mont = a * R mod p로 저장.',
    code: `/// BN254 base field modulus p (254-bit)
const MODULUS: [u64; 4] = [
    0x3c208c16d87cfd47, // 최하위 64-bit
    0x97816a916871ca8d,
    0xb85045b68181585d,
    0x30644e72e131a029, // 최상위 64-bit
];

/// Fp — 내부는 Montgomery form
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Fp(pub(crate) [u64; 4]);

/// R = 2^256 mod p — Montgomery form에서 1의 표현
const R: [u64; 4] = [
    0xd35d438dc58f0d9d, 0x0a78eb28f5c70b3d,
    0x666ea36f7879462c, 0x0e0a77c19a07df2f,
];

/// R^2 mod p — normal → Montgomery 변환용
const R2: [u64; 4] = [
    0xf32cfc5b538afa89, 0xb5e71911d44501fb,
    0x47ab1eff0a417ff6, 0x06d89f71cab8351f,
];`,
    annotations: [
      { lines: [2, 7], color: 'sky', note: 'MODULUS — BN254 소수 p. little-endian [u64; 4] 표현' },
      { lines: [10, 11], color: 'emerald', note: 'Fp 내부 값은 항상 a*R mod p — 생(raw) 숫자가 아님' },
      { lines: [14, 16], color: 'amber', note: 'R — 1의 Montgomery 표현. ONE = Fp(R)' },
      { lines: [20, 23], color: 'violet', note: 'R^2 — from_raw(a) = mont_mul(a, R^2) = a*R = a_mont' },
    ],
  },
  'fp-add-sub': {
    path: 'field/fp.rs — add, sub, neg',
    lang: 'rust',
    highlight: [1, 30],
    desc: '모듈러 덧셈/뺄셈.\n결과가 [0, p) 범위를 벗어나면 p를 더하거나 빼서 보정.',
    code: `/// (a + b) mod p
pub fn add(&self, rhs: &Fp) -> Fp {
    // 4개 limb을 순서대로 더하며 carry 전파
    let (d0, carry) = self.0[0].overflowing_add(rhs.0[0]);
    let (d1, carry) = adc(self.0[1], rhs.0[1], carry);
    let (d2, carry) = adc(self.0[2], rhs.0[2], carry);
    let (d3, _) = adc(self.0[3], rhs.0[3], carry);
    // 결과 >= p이면 p를 빼서 [0, p)로
    sub_if_gte([d0, d1, d2, d3])
}

/// (a - b) mod p
pub fn sub(&self, rhs: &Fp) -> Fp {
    let (d0, borrow) = self.0[0].overflowing_sub(rhs.0[0]);
    let (d1, borrow) = sbb(self.0[1], rhs.0[1], borrow);
    let (d2, borrow) = sbb(self.0[2], rhs.0[2], borrow);
    let (d3, borrow) = sbb(self.0[3], rhs.0[3], borrow);
    if borrow {
        // a < b → 음수 → p를 더하면 동일한 값 (mod p)
        let (d0, carry) = d0.overflowing_add(MODULUS[0]);
        let (d1, carry) = adc(d1, MODULUS[1], carry);
        let (d2, carry) = adc(d2, MODULUS[2], carry);
        let (d3, _) = adc(d3, MODULUS[3], carry);
        Fp([d0, d1, d2, d3])
    } else {
        Fp([d0, d1, d2, d3])
    }
}

/// -a mod p = p - a (0이면 0)
pub fn neg(&self) -> Fp { ... }`,
    annotations: [
      { lines: [3, 7], color: 'sky', note: 'limb 단위 덧셈 — 하위부터 상위로 carry를 전파' },
      { lines: [9, 9], color: 'emerald', note: 'sub_if_gte — p를 빼보고, 음수면 원래 값 유지' },
      { lines: [18, 24], color: 'amber', note: 'borrow 발생 시 p를 더해 [0, p)로 복원 — 모듈러 연산의 핵심' },
    ],
  },
};
