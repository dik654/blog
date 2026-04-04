import type { CodeRef } from '@/components/code/types';

export const helperCodeRefs: Record<string, CodeRef> = {
  'fp-helpers': {
    path: 'field/mod.rs — adc, sbb, mac',
    lang: 'rust',
    highlight: [1, 27],
    desc: '64비트 산술 빌딩 블록.\nadc(add-carry), sbb(sub-borrow), mac(multiply-accumulate) — 모든 필드 연산의 기반.',
    code: `/// a + b + carry → (합, carry)
#[inline(always)]
pub(crate) fn adc(a: u64, b: u64, carry: bool) -> (u64, bool) {
    let (s1, c1) = a.overflowing_add(b);
    let (s2, c2) = s1.overflowing_add(carry as u64);
    (s2, c1 | c2)
}

/// a - b - borrow → (차, borrow)
#[inline(always)]
pub(crate) fn sbb(a: u64, b: u64, borrow: bool) -> (u64, bool) {
    let (s1, b1) = a.overflowing_sub(b);
    let (s2, b2) = s1.overflowing_sub(borrow as u64);
    (s2, b1 | b2)
}

/// acc + a * b + carry → (lo, hi)
/// u128 확장 곱셈으로 64×64 → 128비트 결과
#[inline(always)]
pub(crate) fn mac(acc: u64, a: u64, b: u64, carry: u64) -> (u64, u64) {
    let wide = acc as u128 + (a as u128) * (b as u128) + carry as u128;
    (wide as u64, (wide >> 64) as u64)
}`,
    annotations: [
      { lines: [1, 7], color: 'sky', note: 'adc — 캐리 전파 덧셈. limb 간 올림을 bool로 전달' },
      { lines: [9, 15], color: 'emerald', note: 'sbb — 빌림 전파 뺄셈. 모듈러 뺄셈의 underflow 감지용' },
      { lines: [17, 23], color: 'amber', note: 'mac — 곱셈+누적. u128로 확장해 오버플로 방지. Montgomery 곱셈의 핵심' },
    ],
  },
};
