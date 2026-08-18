import type { CodeRef } from "@/components/code/types";
import blobStoreMod from "../reth-eip4844/codebase/reth/crates/transaction-pool/src/blobstore/mod.rs?raw";
import diskRs from "../reth-eip4844/codebase/reth/crates/transaction-pool/src/blobstore/disk.rs?raw";
import diskInnerRs from "../reth-eip4844/codebase/reth/crates/transaction-pool/src/blobstore/disk_inner.rs?raw";
import memRs from "../reth-eip4844/codebase/reth/crates/transaction-pool/src/blobstore/mem.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "blobstore-trait": {
    path: "reth/crates/transaction-pool/src/blobstore/mod.rs",
    code: blobStoreMod,
    lang: "rust",
    highlight: [6, 40],
    desc: "문제: 저장 구현(disk/memory)을 교체할 수 있으면서도 key·bytes·outcome의 shape는 고정해야 합니다.\n\n해결: BlobStore 트레이트로 insert·delete·cleanup·get을 추상화합니다.",
    annotations: [
      { lines: [8, 9], color: "sky", note: "insert: tx_hash → sidecar 매핑 저장 (storage key)" },
      { lines: [16, 19], color: "emerald", note: "delete_all: finalized 블록의 blob 일괄 삭제" },
      { lines: [22, 22], color: "amber", note: "cleanup: 지연 삭제 수행 (DiskFileBlobStore용)" },
      { lines: [25, 26], color: "violet", note: "get: TX 해시로 sidecar 조회 (read outcome의 시작점)" },
    ],
  },
  "disk-inner-ops": {
    path: "reth/crates/transaction-pool/src/blobstore/disk_inner.rs",
    code: diskInnerRs,
    lang: "rust",
    highlight: [4, 47],
    desc: "문제: blob 삽입 시 캐시와 디스크를 동기화하고, 조회 시 hit/miss를 구분해야 합니다.\n\n해결: RLP 인코딩 → versioned_hash 매핑 → LRU 캐시 → 디스크 순서로 삽입하고, 조회는 캐시 우선으로 확인합니다.",
    annotations: [
      { lines: [8, 10], color: "sky", note: "RLP 인코딩 — 디스크 저장용 직렬화 (write bytes)" },
      { lines: [13, 18], color: "emerald", note: "versioned_hash → tx_hash 매핑 (engine API getBlobsV1용)" },
      { lines: [21, 22], color: "amber", note: "LRU 캐시에 저장 — 최근 blob 빠른 조회" },
      { lines: [36, 46], color: "violet", note: "get_one: 캐시 미스 시 디스크 read_one() 호출 → hit/miss 분기" },
    ],
  },
  "disk-blobstore": {
    path: "reth/crates/transaction-pool/src/blobstore/disk.rs",
    code: diskRs,
    lang: "rust",
    highlight: [40, 70],
    desc: "문제: Finalized block의 blob을 지워야 하지만, 삭제 시점에 파일 lock을 잡으면 삽입·조회 성능이 떨어집니다.\n\n해결: delete()는 즉시 지우지 않고 삭제 대기 목록에 추가만 하고, cleanup()이 백그라운드에서 일괄 삭제합니다.",
    annotations: [
      { lines: [47, 53], color: "sky", note: "delete: 즉시 삭제하지 않고 txs_to_delete에 추가 (deferred deletion)" },
      { lines: [55, 69], color: "emerald", note: "cleanup: 대기 목록을 순회하며 실제 파일 삭제, 이미 없으면 성공 처리" },
    ],
  },
  "mem-blobstore": {
    path: "reth/crates/transaction-pool/src/blobstore/mem.rs",
    code: memRs,
    lang: "rust",
    highlight: [17, 39],
    desc: "문제: 테스트·경량 노드는 디스크 I/O 없이 blob을 관리해야 합니다.\n\n해결: RwLock<HashMap>으로 즉시 저장·삭제하며, disk 구현과 달리 cleanup은 no-op입니다 — 지연 삭제할 대상이 없기 때문입니다.",
    annotations: [
      { lines: [28, 33], color: "sky", note: "delete: disk와 달리 즉시 제거 — 삭제 대기 목록이 없음" },
      { lines: [36, 39], color: "emerald", note: "cleanup no-op — DiskFileBlobStore의 delayed cleanup과 대비" },
    ],
  },
};
