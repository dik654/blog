import type { CodeRef } from '@/components/code/types';
import mevSrc from './codebase/reth/mev_builder.rs?raw';
import flashbotsSrc from './codebase/reth/flashbots.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'mev-builder': {
    path: 'reth-mev/src/builder.rs', lang: 'rust', highlight: [3, 9],
    desc: 'MevPayloadBuilder — 외부 빌더 입찰과 로컬 빌드를 비교하는 래퍼',
    annotations: [
      { lines: [4, 6], color: 'sky', note: 'inner: 로컬 빌더 / relay_client: 외부 빌더 통신' },
    ],
    code: mevSrc,
  },
  'mev-build': {
    path: 'reth-mev/src/builder.rs', lang: 'rust', highlight: [11, 33],
    desc: 'build_payload — 로컬 빌드 + 외부 입찰 비교 → 더 높은 가치 선택',
    annotations: [
      { lines: [16, 17], color: 'sky', note: '1단계: 로컬 블록 빌드 (fallback 보장)' },
      { lines: [20, 22], color: 'emerald', note: '2단계: 외부 빌더에서 최적 입찰 요청' },
      { lines: [25, 27], color: 'amber', note: '외부 > 로컬 → 외부 블록 채택' },
      { lines: [29, 31], color: 'rose', note: '로컬 >= 외부 또는 외부 실패 → 로컬 fallback' },
    ],
    code: mevSrc,
  },
  'relay-register': {
    path: 'reth-mev/src/flashbots.rs', lang: 'rust', highlight: [8, 16],
    desc: 'register_validator — 검증자를 릴레이에 등록 (매 에폭)',
    annotations: [
      { lines: [10, 14], color: 'sky', note: 'POST /eth/v1/builder/validators 호출' },
    ],
    code: flashbotsSrc,
  },
  'relay-get-header': {
    path: 'reth-mev/src/flashbots.rs', lang: 'rust', highlight: [19, 31],
    desc: 'get_header — 슬롯에 대한 최적 빌더 입찰(bid) 요청',
    annotations: [
      { lines: [23, 26], color: 'emerald', note: 'GET /eth/v1/builder/header/{slot}/{parent}/{recipient}' },
      { lines: [28, 29], color: 'amber', note: '응답: SignedBuilderBid (블록 가치 포함)' },
    ],
    code: flashbotsSrc,
  },
  'relay-get-payload': {
    path: 'reth-mev/src/flashbots.rs', lang: 'rust', highlight: [34, 41],
    desc: 'get_payload — 선택된 빌더의 전체 블록(payload) 요청',
    annotations: [
      { lines: [37, 39], color: 'violet', note: 'POST blinded_blocks → 실제 ExecutionPayload 수신' },
    ],
    code: flashbotsSrc,
  },
};
