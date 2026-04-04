import type { CodeRef } from '@/components/code/types';
import fcRaw from './codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice.go?raw';

export const forkchoiceCodeRefs: Record<string, CodeRef> = {
  'fc-process-attest': {
    path: 'forkchoice/doubly-linked-tree/forkchoice.go — ProcessAttestation()',
    lang: 'go',
    code: fcRaw,
    highlight: [11, 22],
    desc: 'ProcessAttestation — 검증자의 투표를 votes 맵에 기록하여 가중치 반영',
    annotations: [
      { lines: [14, 15], color: 'violet', note: '검증자 인덱스와 블록 루트를 받는다' },
      { lines: [17, 21], color: 'emerald', note: 'Vote 구조체에 현재/다음 루트와 에폭 기록' },
    ],
  },
  'fc-head': {
    path: 'forkchoice/doubly-linked-tree/forkchoice.go — computeHead()',
    lang: 'go',
    code: fcRaw,
    highlight: [25, 39],
    desc: 'computeHead — justified 노드에서 출발, 가장 무거운 자식을 반복 선택하여 헤드 결정',
    annotations: [
      { lines: [27, 28], color: 'violet', note: 'justified 노드에서 탐색 시작' },
      { lines: [30, 32], color: 'emerald', note: '리프 노드 도달 시 headNode로 확정' },
      { lines: [34, 37], color: 'sky', note: 'weight 비교 → 동일 시 root 사전순 비교 (타이브레이크)' },
    ],
  },
};
