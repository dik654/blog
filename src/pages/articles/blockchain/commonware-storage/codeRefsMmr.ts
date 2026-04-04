import type { CodeRef } from '@/components/code/types';

import mmrMod from './codebase/commonware/mmr_mod.rs?raw';
import mmrBatch from './codebase/commonware/mmr_batch.rs?raw';
import mmrProof from './codebase/commonware/mmr_proof.rs?raw';

export const mmrRefs: Record<string, CodeRef> = {
  'mmr-family': {
    path: 'storage/src/merkle/mmr/mod.rs',
    code: mmrMod,
    lang: 'rust',
    highlight: [28, 47],
    desc: 'MMR Family — Position/Location 타입 + 좌표 변환. Location→Position: 2*N - popcount(N).',
    annotations: [
      { lines: [28, 30], color: 'sky', note: 'Proof/Position/Location 타입 별칭' },
      { lines: [36, 38], color: 'emerald', note: 'MAX_NODES = 2^63 - 1 (리프 2^62개)' },
      { lines: [41, 43], color: 'amber', note: 'location_to_position: 2*N - popcount(N)' },
      { lines: [46, 47], color: 'violet', note: 'children: left = pos-2^h, right = pos-1' },
    ],
  },
  'mmr-batch': {
    path: 'storage/src/merkle/mmr/batch.rs',
    code: mmrBatch,
    lang: 'rust',
    highlight: [1, 15],
    desc: 'Batch API — new_batch → add → merkleize → finalize → apply 5단계 파이프라인.',
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'UnmerkleizedBatch — 리프 추가 전용' },
      { lines: [6, 7], color: 'emerald', note: 'MerkleizedBatch — 루트 계산 완료 상태' },
      { lines: [9, 10], color: 'amber', note: 'Changeset — apply()에 전달하는 변경분' },
    ],
  },
  'mmr-proof': {
    path: 'storage/src/merkle/mmr/proof.rs',
    code: mmrProof,
    lang: 'rust',
    highlight: [3, 32],
    desc: 'range_proof — Blueprint(fold_prefix + fetch_nodes)로 증명 구성. peak 접기 + 형제 노드 수집.',
    annotations: [
      { lines: [8, 10], color: 'sky', note: 'Blueprint = fold_prefix + fetch_nodes' },
      { lines: [14, 20], color: 'emerald', note: 'fold_prefix: 범위 이전 peak들을 하나로 접기' },
      { lines: [23, 28], color: 'amber', note: 'fetch_nodes: 경로 형제 노드 수집' },
    ],
  },
};
