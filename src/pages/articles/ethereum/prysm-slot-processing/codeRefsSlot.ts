import type { CodeRef } from '@/components/code/types';
import transitionRaw from './codebase/prysm/beacon-chain/core/transition/transition.go?raw';

export const slotCodeRefs: Record<string, CodeRef> = {
  'process-slots': {
    path: 'beacon-chain/core/transition/transition.go — ProcessSlots()',
    lang: 'go',
    code: transitionRaw,
    highlight: [5, 27],
    desc: 'ProcessSlots — 현재 상태를 목표 슬롯까지 전진시키는 메인 루프',
    annotations: [
      { lines: [6, 8], color: 'sky', note: '역방향 슬롯 이동 방지 가드' },
      { lines: [11, 12], color: 'emerald', note: 'ProcessSlot: 상태 루트 캐싱' },
      { lines: [15, 19], color: 'amber', note: '에폭 경계 시 ProcessEpoch 트리거' },
      { lines: [22, 24], color: 'violet', note: '슬롯 증가 (state.slot++)' },
    ],
  },
  'process-slot': {
    path: 'beacon-chain/core/transition/transition.go — ProcessSlot()',
    lang: 'go',
    code: transitionRaw,
    highlight: [31, 44],
    desc: 'ProcessSlot — 상태 루트와 블록 루트를 히스토리 링 버퍼에 캐싱',
    annotations: [
      { lines: [34, 37], color: 'sky', note: 'HashTreeRoot 계산 후 stateRoots 링 버퍼 저장' },
      { lines: [38, 38], color: 'emerald', note: 'slot % SlotsPerHistoricalRoot = 링 버퍼 인덱스' },
      { lines: [41, 42], color: 'amber', note: '블록 루트도 blockRoots에 캐싱' },
    ],
  },
};
