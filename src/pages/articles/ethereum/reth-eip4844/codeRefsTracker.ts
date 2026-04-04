import type { CodeRef } from '@/components/code/types';
import trackerRs from './codebase/reth/crates/transaction-pool/src/blobstore/tracker.rs?raw';

export const trackerRefs: Record<string, CodeRef> = {
  'canon-tracker': {
    path: 'reth/crates/transaction-pool/src/blobstore/tracker.rs',
    code: trackerRs,
    lang: 'rust',
    highlight: [4, 52],
    desc: '문제: Finalized 블록의 blob을 BlobStore에서 정리해야 합니다. 어떤 블록에 어떤 blob TX가 포함되었는지 추적이 필요합니다.\n\n해결: BTreeMap<BlockNumber, Vec<B256>>로 블록별 blob TX를 추적하고, finalization 시 순서대로 삭제합니다.',
    annotations: [
      { lines: [7, 9], color: 'sky', note: 'BTreeMap: 블록 번호 순서대로 정렬 → 범위 삭제 효율적' },
      { lines: [22, 30], color: 'emerald', note: 'add_new_chain_blocks: is_eip4844() 필터로 blob TX만 추적' },
      { lines: [34, 48], color: 'amber', note: 'on_finalized_block: finalized 블록까지의 blob TX 반환' },
      { lines: [53, 56], color: 'violet', note: 'BlobStoreUpdates: 삭제할 TX 목록 또는 None' },
    ],
  },
};
