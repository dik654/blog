import type { CodeRef } from '@/components/code/types';
import roundRobinRaw from './codebase/prysm/beacon-chain/sync/initial-sync/round_robin.go?raw';
import blocksByRangeRaw from './codebase/prysm/beacon-chain/sync/rpc_beacon_blocks_by_range.go?raw';

export const syncCodeRefs: Record<string, CodeRef> = {
  'round-robin-sync': {
    path: 'beacon-chain/sync/initial-sync/round_robin.go — roundRobinSync()',
    lang: 'go', code: roundRobinRaw, highlight: [3, 37],
    desc: 'roundRobinSync — 여러 피어에 라운드로빈으로 블록을 요청하고 순차 처리',
    annotations: [
      { lines: [5, 8], color: 'sky', note: '동기화 가능한 피어 필터링' },
      { lines: [14, 14], color: 'emerald', note: '피어별 범위 분배 (라운드로빈)' },
      { lines: [17, 20], color: 'amber', note: '배치 요청 동시 전송' },
      { lines: [23, 23], color: 'violet', note: '응답 정렬 + 중복 제거' },
      { lines: [26, 29], color: 'rose', note: '블록 순차 처리 (상태 전환)' },
    ],
  },
  'blocks-by-range-handler': {
    path: 'beacon-chain/sync/rpc_beacon_blocks_by_range.go — beaconBlocksByRangeRPCHandler()',
    lang: 'go', code: blocksByRangeRaw, highlight: [3, 31],
    desc: 'beaconBlocksByRangeRPCHandler — 범위 요청에 대해 DB에서 블록을 스트리밍',
    annotations: [
      { lines: [7, 9], color: 'sky', note: '요청 타입 검증' },
      { lines: [12, 15], color: 'emerald', note: '범위 파라미터 유효성 검증' },
      { lines: [18, 25], color: 'amber', note: 'DB에서 블록 조회 + 스트림 전송' },
      { lines: [28, 29], color: 'violet', note: '스트림 정상 종료' },
    ],
  },
  'save-received-block': {
    path: 'beacon-chain/sync/initial-sync/round_robin.go — processBlock()',
    lang: 'go', code: roundRobinRaw, highlight: [26, 29],
    desc: 'processBlock — 수신 블록의 상태 전환 실행',
    annotations: [
      { lines: [26, 29], color: 'sky', note: '블록별 상태 전환 + DB 저장' },
    ],
  },
};
