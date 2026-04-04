import type { CodeRef } from '@/components/code/types';
import blobStoreMod from './codebase/reth/crates/transaction-pool/src/blobstore/mod.rs?raw';
import diskRs from './codebase/reth/crates/transaction-pool/src/blobstore/disk.rs?raw';
import diskInnerRs from './codebase/reth/crates/transaction-pool/src/blobstore/disk_inner.rs?raw';
import memRs from './codebase/reth/crates/transaction-pool/src/blobstore/mem.rs?raw';

export const blobStoreRefs: Record<string, CodeRef> = {
  'blobstore-trait': {
    path: 'reth/crates/transaction-pool/src/blobstore/mod.rs',
    code: blobStoreMod,
    lang: 'rust',
    highlight: [4, 37],
    desc: '문제: Blob 데이터(~128KB/개)를 효율적으로 저장하고 finalization 후 정리해야 합니다.\n\n해결: BlobStore 트레이트로 추상화. 디스크/메모리 구현을 교체 가능하게 설계합니다.',
    annotations: [
      { lines: [7, 9], color: 'sky', note: 'insert: tx_hash → sidecar 매핑 저장' },
      { lines: [19, 20], color: 'emerald', note: 'delete_all: finalized 블록의 blob 일괄 삭제' },
      { lines: [22, 23], color: 'amber', note: 'cleanup: 지연 삭제 수행 (DiskFileBlobStore용)' },
      { lines: [31, 32], color: 'violet', note: 'get_by_versioned_hashes: engine API에서 blob 조회' },
    ],
  },
  'disk-blobstore': {
    path: 'reth/crates/transaction-pool/src/blobstore/disk.rs',
    code: diskRs,
    lang: 'rust',
    highlight: [8, 44],
    desc: '문제: Blob 데이터가 크므로(128KB×6=768KB/블록) 메모리만으론 부족합니다.\n\n해결: 디스크에 파일로 저장하고, LRU 캐시로 최근 blob을 메모리에 유지합니다. 삭제는 지연 처리.',
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'DEFAULT_MAX_CACHED_BLOBS: LRU 캐시 100개' },
      { lines: [17, 27], color: 'emerald', note: 'Inner: blob_cache(LRU) + file_lock(RwLock) + txs_to_delete' },
      { lines: [32, 39], color: 'amber', note: 'open: 이전 blob 삭제 후 빈 디렉토리 재생성' },
      { lines: [52, 56], color: 'violet', note: 'delete: 즉시 삭제하지 않고 삭제 대기 목록에 추가' },
    ],
  },
  'disk-inner-ops': {
    path: 'reth/crates/transaction-pool/src/blobstore/disk_inner.rs',
    code: diskInnerRs,
    lang: 'rust',
    highlight: [4, 30],
    desc: '문제: blob 삽입 시 캐시와 디스크를 동기화해야 합니다.\n\n해결: RLP 인코딩 → versioned_hash 매핑 → LRU 캐시 → 디스크 순서로 4단계 삽입.',
    annotations: [
      { lines: [7, 9], color: 'sky', note: 'RLP 인코딩 — 디스크 저장용 직렬화' },
      { lines: [13, 18], color: 'emerald', note: 'versioned_hash → tx_hash 매핑 (engine API용)' },
      { lines: [21, 22], color: 'amber', note: 'LRU 캐시에 저장 — 최근 blob 빠른 조회' },
      { lines: [35, 42], color: 'violet', note: 'get_one: 캐시 미스 시 디스크 → 캐시 추가' },
    ],
  },
  'mem-blobstore': {
    path: 'reth/crates/transaction-pool/src/blobstore/mem.rs',
    code: memRs,
    lang: 'rust',
    highlight: [4, 17],
    desc: '문제: 테스트 환경에서는 디스크 I/O 없이 blob을 관리해야 합니다.\n\n해결: RwLock<HashMap>으로 간단하게 구현. cleanup은 no-op.',
    annotations: [
      { lines: [11, 13], color: 'sky', note: 'RwLock<B256Map>: 동시 읽기 허용, 쓰기 시 독점' },
      { lines: [23, 25], color: 'emerald', note: 'insert_size: blob.size() 계산 후 크기 추적' },
      { lines: [36, 38], color: 'amber', note: 'cleanup no-op — 메모리는 delete에서 즉시 제거' },
    ],
  },
};
