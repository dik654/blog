import type { CodeRef } from '@/components/code/types';
import statetreeGo from './codebase/lotus/chain/state/statetree.go?raw';
import hamtGo from './codebase/go-hamt-ipld/hamt.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'state-tree': {
    path: 'lotus/chain/state/statetree.go', code: statetreeGo, lang: 'go', highlight: [14, 40],
    desc: 'StateTree — HAMT 기반 Actor 주소→상태 매핑',
    annotations: [
      { lines: [14, 18], color: 'sky', note: 'StateTree — HAMT root + IPLD Store' },
      { lines: [22, 35], color: 'emerald', note: 'GetActor — ID 주소 변환 → HAMT 조회 O(log n)' },
      { lines: [38, 40], color: 'amber', note: 'Flush — dirty 노드를 블록스토어에 기록 → root CID' },
    ],
  },
  'hamt-find': {
    path: 'go-hamt-ipld/hamt.go', code: hamtGo, lang: 'go', highlight: [15, 42],
    desc: 'HAMT.Find() — SHA-256 해시의 비트폭 슬라이스로 트리 탐색',
    annotations: [
      { lines: [15, 18], color: 'sky', note: '비트폭 5, 버킷 크기 3 — I/O 최적화 파라미터' },
      { lines: [21, 25], color: 'emerald', note: 'Node — Bitfield + Pointers 구조' },
      { lines: [29, 42], color: 'amber', note: 'Find — 해시 슬라이스로 깊이별 탐색, 리프에서 버킷 매칭' },
    ],
  },
};
