import type { CodeRef } from '@/components/code/types';
import rlpSrc from './codebase/reth/rlp.rs?raw';
import rlpDecodeSrc from './codebase/reth/rlp_decode.rs?raw';

export const rlpCodeRefs: Record<string, CodeRef> = {
  'rlp-traits': {
    path: 'alloy-rlp/src/lib.rs', lang: 'rust', highlight: [3, 12],
    desc: 'Encodable/Decodable trait — RLP 직렬화 인터페이스',
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'Encodable — 인코딩' },
      { lines: [9, 12], color: 'emerald', note: 'Decodable — 복원' },
    ],
    code: rlpSrc,
  },
  'rlp-derive': {
    path: 'alloy-rlp/src/lib.rs', lang: 'rust', highlight: [15, 22],
    desc: 'derive 매크로로 RLP 인코더/디코더 자동 생성',
    annotations: [
      { lines: [15, 16], color: 'amber', note: 'derive 매크로' },
      { lines: [17, 22], color: 'violet', note: 'TX 필드 직렬화' },
    ],
    code: rlpSrc,
  },
  'rlp-fixed': {
    path: 'alloy-rlp/src/lib.rs', lang: 'rust', highlight: [24, 28],
    desc: 'encode_fixed_size — 스택 할당 ArrayVec으로 힙 없이 인코딩',
    annotations: [
      { lines: [25, 28], color: 'rose', note: '고정 크기 버퍼' },
    ],
    code: rlpSrc,
  },
  'rlp-header': {
    path: 'alloy-rlp/src/lib.rs', lang: 'rust', highlight: [31, 39],
    desc: 'RLP Header 디코딩 — 첫 바이트로 타입/길이 판별',
    annotations: [
      { lines: [34, 34], color: 'sky', note: '단일 바이트' },
      { lines: [35, 35], color: 'emerald', note: '짧은 문자열' },
      { lines: [36, 36], color: 'amber', note: '짧은 리스트' },
    ],
    code: rlpSrc,
  },
  'rlp-decode-header': {
    path: 'alloy-rlp/src/decode.rs', lang: 'rust', highlight: [13, 27],
    desc: 'decode_header — 첫 바이트 match로 Header 파싱',
    annotations: [
      { lines: [14, 14], color: 'rose', note: 'InputTooShort' },
      { lines: [17, 17], color: 'sky', note: '단일 바이트' },
      { lines: [18, 22], color: 'emerald', note: '문자열/리스트 분기' },
    ],
    code: rlpDecodeSrc,
  },
  'rlp-decode-errors': {
    path: 'alloy-rlp/src/error.rs', lang: 'rust', highlight: [3, 8],
    desc: 'RLP Error — UnexpectedLength, LeadingZero, Overflow, InputTooShort',
    annotations: [
      { lines: [4, 4], color: 'rose', note: 'UnexpectedLength' },
      { lines: [5, 5], color: 'amber', note: 'LeadingZero' },
      { lines: [6, 7], color: 'violet', note: 'Overflow / InputTooShort' },
    ],
    code: rlpDecodeSrc,
  },
  'rlp-decode-exact': {
    path: 'alloy-rlp/src/decode.rs', lang: 'rust', highlight: [30, 37],
    desc: 'decode_exact — 남은 바이트 시 UnexpectedLength 에러',
    annotations: [
      { lines: [32, 32], color: 'sky', note: 'T::decode()' },
      { lines: [33, 35], color: 'rose', note: '남은 바이트 검사' },
    ],
    code: rlpDecodeSrc,
  },
};
