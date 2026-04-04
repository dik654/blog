import type { CodeRef } from '@/components/code/types';
import storeRaw from './codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/store.go?raw';

export const storeCodeRefs: Record<string, CodeRef> = {
  'fc-store': {
    path: 'forkchoice/doubly-linked-tree/store.go — ForkChoiceStore',
    lang: 'go',
    code: storeRaw,
    highlight: [3, 14],
    desc: 'ForkChoiceStore — 포크 선택 트리 전체 상태를 보관하는 구조체',
    annotations: [
      { lines: [5, 7], color: 'violet', note: 'nodeByRoot: 블록 루트 → 노드 매핑 (O(1) 탐색)' },
      { lines: [8, 9], color: 'emerald', note: 'treeRootNode / headNode: 트리의 양 끝단' },
      { lines: [10, 12], color: 'sky', note: '체크포인트 + proposer boost root' },
    ],
  },
  'fc-insert': {
    path: 'forkchoice/doubly-linked-tree/store.go — InsertNode()',
    lang: 'go',
    code: storeRaw,
    highlight: [27, 43],
    desc: 'InsertNode — 새 블록 도착 시 doubly-linked-tree에 노드 추가',
    annotations: [
      { lines: [31, 35], color: 'violet', note: '새 Node 생성: slot, root, epoch 정보' },
      { lines: [36, 39], color: 'emerald', note: '부모 노드 탐색 → 양방향 연결' },
      { lines: [41, 42], color: 'sky', note: 'nodeByRoot 맵에 등록' },
    ],
  },
};
