import type { CodeRef } from '@/components/code/types';

import prefixSetRs from './codebase/reth/prefix_set.rs?raw';
import stateRootRs from './codebase/reth/state_root.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'prefix-set': {
    path: 'reth/crates/trie/trie/src/prefix_set.rs',
    code: prefixSetRs,
    lang: 'rust',
    highlight: [13, 17],
    desc: 'PrefixSet — 변경된 키만 BTreeSet으로 추적. trie 재해시 범위를 최소화하여 상태 루트 계산 성능을 극대화.',
    annotations: [
      { lines: [14, 14], color: 'sky', note: 'BTreeSet<Nibbles> — 정렬된 키 집합' },
      { lines: [23, 25], color: 'emerald', note: 'insert — 블록 실행 중 변경 키 수집' },
      { lines: [28, 33], color: 'amber', note: 'contains — prefix 매칭으로 서브트리 재계산 여부 판단' },
    ],
  },
  'state-root': {
    path: 'reth/crates/trie/trie/src/state_root.rs',
    code: stateRootRs,
    lang: 'rust',
    highlight: [10, 18],
    desc: 'StateRoot — DB trie + BundleState 변경사항을 합쳐 새 상태 루트를 계산. PrefixSet으로 변경된 서브트리만 재해시.',
    annotations: [
      { lines: [13, 14], color: 'sky', note: 'tx — DB 읽기 트랜잭션 (기존 trie 접근)' },
      { lines: [15, 18], color: 'emerald', note: 'changed_*_prefixes — PrefixSet으로 변경 범위 한정' },
      { lines: [22, 31], color: 'amber', note: 'overlay_root — 서브트리 선택적 재해시' },
    ],
  },
};
