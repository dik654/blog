import type { CodeRef } from '@/components/code/types';
import blockRaw from './codebase/prysm/beacon-chain/blockchain/process_block.go?raw';

export const blockCodeRefs: Record<string, CodeRef> = {
  'on-block': {
    path: 'beacon-chain/blockchain/process_block.go — onBlock()',
    lang: 'go',
    code: blockRaw,
    highlight: [5, 30],
    desc: 'onBlock — 블록 수신 시 상태 전이 + 포크 선택 + DB 저장',
    annotations: [
      { lines: [8, 10], color: 'sky', note: '부모 상태 조회 (DB 또는 캐시)' },
      { lines: [12, 14], color: 'emerald', note: 'ProcessSlots: 빈 슬롯 포함 전진' },
      { lines: [16, 19], color: 'amber', note: '블록 상태 전이 (헤더, RANDAO, ops)' },
      { lines: [21, 23], color: 'violet', note: 'Engine API → EL 페이로드 검증' },
      { lines: [25, 25], color: 'rose', note: '포크 선택 트리에 노드 삽입' },
    ],
  },
  'validate-execution': {
    path: 'beacon-chain/blockchain/process_block.go — validateExecutionOnBlock()',
    lang: 'go',
    code: blockRaw,
    highlight: [33, 44],
    desc: 'validateExecutionOnBlock — Engine API로 EL에 페이로드 검증 요청',
    annotations: [
      { lines: [35, 37], color: 'sky', note: '블록 바디에서 실행 페이로드 추출' },
      { lines: [38, 38], color: 'emerald', note: 'NewPayload RPC 호출 (CL → EL)' },
      { lines: [42, 42], color: 'amber', note: 'VALID가 아니면 블록 거부' },
    ],
  },
};
