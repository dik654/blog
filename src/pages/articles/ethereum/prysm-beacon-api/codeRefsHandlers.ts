import type { CodeRef } from '@/components/code/types';
import handlersRaw from './codebase/prysm/beacon-chain/rpc/eth/beacon/handlers.go?raw';

export const handlersCodeRefs: Record<string, CodeRef> = {
  'get-block-v2': {
    path: 'rpc/eth/beacon/handlers.go — GetBlockV2()',
    lang: 'go',
    code: handlersRaw,
    highlight: [3, 25],
    desc: 'GetBlockV2 — block_id로 비콘 블록 조회 (REST API)',
    annotations: [
      { lines: [7, 7], color: 'sky', note: 'block_id: head, genesis, finalized, slot, root' },
      { lines: [13, 13], color: 'emerald', note: '포크 버전별 응답 구조 분기' },
      { lines: [19, 23], color: 'amber', note: 'Accept 헤더 기반 SSZ/JSON 응답' },
    ],
  },
  'get-state-v2': {
    path: 'rpc/eth/beacon/handlers.go — GetStateV2()',
    lang: 'go',
    code: handlersRaw,
    highlight: [28, 37],
    desc: 'GetStateV2 — state_id로 비콘 상태 조회',
    annotations: [
      { lines: [31, 31], color: 'sky', note: 'state_id: head, finalized, slot, state_root' },
      { lines: [36, 36], color: 'emerald', note: '내부 상태 → API 응답 구조체 변환' },
    ],
  },
};
