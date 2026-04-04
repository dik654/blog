import type { CodeRef } from '@/components/code/types';
import storeRaw from './codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/store.go?raw';
import epochRaw from './codebase/prysm/beacon-chain/core/epoch/epoch_processing.go?raw';

export const finalityCodeRefs: Record<string, CodeRef> = {
  'update-justified': {
    path: 'forkchoice/doubly-linked-tree/store.go — UpdateJustifiedCheckpoint()',
    lang: 'go',
    code: storeRaw,
    highlight: [3, 13],
    desc: 'UpdateJustifiedCheckpoint — 2/3 투표 달성 시 justified 체크포인트 갱신',
    annotations: [
      { lines: [8, 9], color: 'violet', note: '이전보다 낮은 에폭의 체크포인트는 거부' },
      { lines: [11, 11], color: 'emerald', note: 'justifiedCheckpoint 포인터 교체' },
    ],
  },
  'prune-finalized': {
    path: 'forkchoice/doubly-linked-tree/store.go — Prune()',
    lang: 'go',
    code: storeRaw,
    highlight: [25, 37],
    desc: 'Prune — finalized 노드 아래의 모든 노드를 제거하여 메모리 확보',
    annotations: [
      { lines: [30, 32], color: 'violet', note: 'finalized 루트로 노드 탐색' },
      { lines: [33, 33], color: 'emerald', note: '하위 노드 재귀 삭제' },
      { lines: [34, 35], color: 'sky', note: 'finalized 노드를 새 루트로 승격, parent 해제' },
    ],
  },
  'weak-subjectivity': {
    path: 'core/epoch/epoch_processing.go — ProcessJustificationAndFinalization()',
    lang: 'go',
    code: epochRaw,
    highlight: [3, 33],
    desc: 'ProcessJustificationAndFinalization — 에폭 전환 시 justified/finalized 판정',
    annotations: [
      { lines: [11, 11], color: 'violet', note: 'totalBalance * 2/3 = 슈퍼마조리티 임계값' },
      { lines: [14, 18], color: 'emerald', note: '이전 에폭 투표 ≥ 2/3 → justified' },
      { lines: [20, 24], color: 'sky', note: '현재 에폭 투표 ≥ 2/3 → justified' },
      { lines: [29, 31], color: 'amber', note: '연속 2 에폭 justified → finalized 확정' },
    ],
  },
};
