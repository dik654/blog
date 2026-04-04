import type { CodeRef } from '@/components/code/types';
import keccakSrc from './codebase/reth/keccak_addr.rs?raw';
import bloomSrc from './codebase/reth/bloom.rs?raw';

export const keccakBloomCodeRefs: Record<string, CodeRef> = {
  'keccak-hash': {
    path: 'alloy-primitives/src/bits/keccak.rs', lang: 'rust', highlight: [4, 12],
    desc: 'keccak256 — tiny_keccak으로 32바이트 해시 생성',
    annotations: [
      { lines: [6, 8], color: 'sky', note: 'Keccak::v256()' },
      { lines: [9, 11], color: 'emerald', note: 'B256 래핑 반환' },
    ],
    code: keccakSrc,
  },
  'create-address': {
    path: 'alloy-primitives/src/bits/address.rs', lang: 'rust', highlight: [15, 24],
    desc: 'create_address — RLP(sender, nonce) → Keccak256 → 하위 20B',
    annotations: [
      { lines: [18, 21], color: 'amber', note: 'RLP 인코딩' },
      { lines: [22, 24], color: 'rose', note: 'hash[12..32] → Address' },
    ],
    code: keccakSrc,
  },
  'create2-address': {
    path: 'alloy-primitives/src/bits/address.rs', lang: 'rust', highlight: [27, 35],
    desc: 'create2_address — 0xff + sender + salt + init_code_hash',
    annotations: [
      { lines: [28, 32], color: 'violet', note: '85바이트 입력' },
      { lines: [33, 35], color: 'rose', note: 'Keccak256 → Address' },
    ],
    code: keccakSrc,
  },
  'bloom-struct': {
    path: 'alloy-primitives/src/bloom.rs', lang: 'rust', highlight: [3, 6],
    desc: 'Bloom(FixedBytes<256>) — 2048비트 블룸 필터',
    annotations: [
      { lines: [4, 4], color: 'emerald', note: '2048비트 비트맵' },
      { lines: [6, 6], color: 'sky', note: 'EMPTY 상수' },
    ],
    code: bloomSrc,
  },
  'bloom-accrue': {
    path: 'alloy-primitives/src/bloom.rs', lang: 'rust', highlight: [10, 18],
    desc: 'accrue — 6바이트로 3개 비트 위치 결정',
    annotations: [
      { lines: [12, 12], color: 'amber', note: 'Keccak256 해시' },
      { lines: [13, 17], color: 'rose', note: '2바이트씩 mod 2048' },
    ],
    code: bloomSrc,
  },
  'bloom-contains': {
    path: 'alloy-primitives/src/bloom.rs', lang: 'rust', highlight: [21, 29],
    desc: 'contains — 비트 AND로 포함 여부 검사',
    annotations: [
      { lines: [22, 25], color: 'violet', note: 'contains_input' },
      { lines: [28, 29], color: 'emerald', note: 'contains_bloom' },
    ],
    code: bloomSrc,
  },
};
