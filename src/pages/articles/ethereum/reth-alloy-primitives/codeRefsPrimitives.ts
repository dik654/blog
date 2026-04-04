import type { CodeRef } from '@/components/code/types';
import primSrc from './codebase/reth/primitives.rs?raw';
import fixedSrc from './codebase/reth/fixed_bytes.rs?raw';
import u256Src from './codebase/reth/u256_arith.rs?raw';

export const primCodeRefs: Record<string, CodeRef> = {
  'primitives-addr': {
    path: 'alloy-primitives/src/lib.rs', lang: 'rust', highlight: [3, 8],
    desc: 'Address(20B), B256(32B) — FixedBytes 기반 스택 할당 타입',
    annotations: [
      { lines: [4, 4], color: 'sky', note: 'Address — 20바이트' },
      { lines: [7, 7], color: 'emerald', note: 'B256 — 32바이트 해시' },
    ],
    code: primSrc,
  },
  'primitives-u256': {
    path: 'alloy-primitives/src/lib.rs', lang: 'rust', highlight: [10, 24],
    desc: 'U256 — 4개 u64 limb로 256비트 정수 표현',
    annotations: [
      { lines: [13, 13], color: 'amber', note: '4 x u64, little-endian' },
      { lines: [16, 17], color: 'violet', note: 'const 제로/최대값' },
      { lines: [20, 22], color: 'rose', note: 'wei→Gwei 변환' },
    ],
    code: primSrc,
  },
  'fixed-bytes-struct': {
    path: 'alloy-primitives/src/bits/fixed.rs', lang: 'rust', highlight: [4, 7],
    desc: 'FixedBytes<N> — const 제네릭 바이트 배열 래퍼',
    annotations: [
      { lines: [4, 6], color: 'violet', note: '#[derive] 자동 구현' },
      { lines: [7, 7], color: 'sky', note: '[u8; N] 스택 배열' },
    ],
    code: fixedSrc,
  },
  'fixed-bytes-deref': {
    path: 'alloy-primitives/src/bits/fixed.rs', lang: 'rust', highlight: [10, 16],
    desc: 'Deref → AsRef 체인 — 슬라이스 메서드 직접 호출',
    annotations: [
      { lines: [10, 13], color: 'amber', note: 'Deref → &[u8; N]' },
      { lines: [15, 16], color: 'emerald', note: 'AsRef<[u8]>' },
    ],
    code: fixedSrc,
  },
  'fixed-bytes-addr': {
    path: 'alloy-primitives/src/bits/address.rs', lang: 'rust', highlight: [19, 28],
    desc: 'Address / B256 뉴타입 래퍼',
    annotations: [
      { lines: [20, 21], color: 'sky', note: 'Address — transparent' },
      { lines: [24, 25], color: 'emerald', note: 'B256 — 동일 패턴' },
    ],
    code: fixedSrc,
  },
  'u256-limbs': {
    path: 'ruint/src/lib.rs', lang: 'rust', highlight: [4, 10],
    desc: 'U256 = Uint<256, 4> — 4개 u64 limb little-endian',
    annotations: [
      { lines: [6, 7], color: 'amber', note: 'limbs: [u64; LIMBS]' },
      { lines: [10, 10], color: 'violet', note: 'U256 타입 별칭' },
    ],
    code: u256Src,
  },
  'u256-overflowing': {
    path: 'ruint/src/algorithms/add.rs', lang: 'rust', highlight: [13, 23],
    desc: 'overflowing_add — carry 전파 4-limb 덧셈',
    annotations: [
      { lines: [16, 17], color: 'rose', note: 'overflowing_add + carry' },
      { lines: [18, 19], color: 'amber', note: 'carry 합산' },
      { lines: [21, 22], color: 'emerald', note: 'carry 누적' },
    ],
    code: u256Src,
  },
  'u256-checked': {
    path: 'ruint/src/algorithms/add.rs', lang: 'rust', highlight: [26, 35],
    desc: 'checked_add / saturating_add — 오버플로 처리',
    annotations: [
      { lines: [27, 29], color: 'violet', note: 'checked → None' },
      { lines: [32, 34], color: 'emerald', note: 'saturating → MAX' },
    ],
    code: u256Src,
  },
};
