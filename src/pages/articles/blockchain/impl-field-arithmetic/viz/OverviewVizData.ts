export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: '254비트 소수를 [u64; 4]로 분할',
    body: '254비트 소수 p를 [u64; 4] little-endian으로 표현 (4 x 64 = 256 >= 254)',
  },
  {
    label: 'adc / sbb / mac — 64비트 산술 빌딩 블록',
    body: 'adc(올림), sbb(빌림), mac(곱셈누적) — 모든 다중 limb 산술의 빌딩 블록',
  },
  {
    label: '모듈러 덧셈 — carry 전파 후 p 보정',
    body: 'carry 전파 후 결과 >= p이면 p를 빼서 [0, p) 범위로 보정',
  },
  {
    label: '모듈러 뺄셈 — borrow 발생 시 p를 더함',
    body: 'borrow 발생 시 p를 더해 보정: (a - b + p) mod p = (a - b) mod p',
  },
];

export const STEP_REFS = ['fp-struct', 'fp-helpers', 'fp-add-sub', 'fp-add-sub'];
export const STEP_LABELS = ['fp.rs — Fp struct', 'mod.rs — adc/sbb/mac', 'fp.rs — add + sub_if_gte', 'fp.rs — sub + borrow'];
