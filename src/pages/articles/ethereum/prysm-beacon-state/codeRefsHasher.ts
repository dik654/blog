import type { CodeRef } from '@/components/code/types';
import hasherRaw from './codebase/prysm/beacon-chain/state/state-native/hasher.go?raw';

export const hasherCodeRefs: Record<string, CodeRef> = {
  'hash-tree-root': {
    path: 'beacon-chain/state/state-native/hasher.go — HashTreeRoot()',
    lang: 'go',
    code: hasherRaw,
    highlight: [5, 22],
    desc: 'HashTreeRoot — 변경된 필드만 재해시하여 상태 루트를 계산',
    annotations: [
      { lines: [10, 13], color: 'sky', note: '변경된 필드 트라이만 재계산 (O(log n))' },
      { lines: [16, 19], color: 'emerald', note: '모든 필드의 리프 해시를 수집' },
      { lines: [21, 21], color: 'amber', note: 'BitwiseMerkleize로 최종 루트 계산' },
    ],
  },
  'field-trie-recompute': {
    path: 'beacon-chain/state/state-native/hasher.go — recomputeFieldTrie()',
    lang: 'go',
    code: hasherRaw,
    highlight: [25, 36],
    desc: 'recomputeFieldTrie — 특정 필드의 Merkle 트라이를 재구성',
    annotations: [
      { lines: [26, 31], color: 'sky', note: '전체 재구성: 슬라이스 크기 변경 시' },
      { lines: [34, 35], color: 'emerald', note: '부분 업데이트: 변경 인덱스만 반영' },
    ],
  },
};
