import type { CodeRef } from '@/components/code/types';
import getterRaw from './codebase/prysm/beacon-chain/state/stategen/getter.go?raw';
import replayRaw from './codebase/prysm/beacon-chain/state/stategen/replay.go?raw';

export const stateCacheCodeRefs: Record<string, CodeRef> = {
  'state-by-root': {
    path: 'beacon-chain/state/stategen/getter.go — StateByRoot()',
    lang: 'go', code: getterRaw, highlight: [3, 19],
    desc: 'StateByRoot — Hot 캐시 → DB → 재생(replay) 3단계 폴백으로 상태 조회',
    annotations: [
      { lines: [5, 7], color: 'sky', note: '1순위: Hot 캐시 (인메모리)' },
      { lines: [9, 15], color: 'emerald', note: '2순위: DB에 저장된 상태' },
      { lines: [17, 17], color: 'amber', note: '3순위: 가장 가까운 저장 상태에서 재생' },
    ],
  },
  'state-by-slot': {
    path: 'beacon-chain/state/stategen/getter.go — StateBySlot()',
    lang: 'go', code: getterRaw, highlight: [22, 35],
    desc: 'StateBySlot — 슬롯으로 블록 루트를 찾고 StateByRoot 호출',
    annotations: [
      { lines: [24, 26], color: 'sky', note: '슬롯 → 블록 루트 인덱스 조회' },
      { lines: [28, 32], color: 'emerald', note: '빈 슬롯이면 이전 블록 루트로 대체' },
      { lines: [34, 34], color: 'amber', note: 'StateByRoot로 위임' },
    ],
  },
  'replay-blocks': {
    path: 'beacon-chain/state/stategen/replay.go — ReplayBlocks()',
    lang: 'go', code: replayRaw, highlight: [3, 28],
    desc: 'ReplayBlocks — 저장된 상태에서 블록을 순차 적용해 타겟 슬롯 상태 계산',
    annotations: [
      { lines: [9, 12], color: 'sky', note: '갭 슬롯 처리 (ProcessSlots)' },
      { lines: [14, 17], color: 'emerald', note: '블록 상태 전환 실행' },
      { lines: [21, 25], color: 'amber', note: '마지막 블록 이후 남은 슬롯 전진' },
    ],
  },
};
