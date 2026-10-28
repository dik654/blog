import type { CodeRef } from "@/components/code/types";
import storeContract from "./codebase/reth-v2.8.1/store-contract.rs?raw";
import diskPath from "./codebase/reth-v2.8.1/disk-path.rs?raw";
import poolBoundary from "./codebase/reth-v2.8.1/pool-boundary.rs?raw";
import finalityCleanup from "./codebase/reth-v2.8.1/finality-cleanup.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "store-contract": {
    path: "reth-v2.8.1/transaction-pool/blobstore/mod.rs · BlobStore trait",
    code: storeContract,
    lang: "rust",
    highlight: [7, 27],
    desc: "문제: 기존 글은 digest·generation receipt를 Reth BlobStore의 실제 value처럼 설명했습니다.\n\n해결: v2.8.1의 실제 key는 transaction hash이고 value는 PooledBlobSidecar입니다. Trait는 insert·get·get_exact·delete·cleanup과 Missing·Decode·I/O 오류를 정의하지만 별도 receipt metadata를 저장하지 않습니다.",
    annotations: [
      { lines: [7, 10], color: "sky", note: "H₀ → PooledBlobSidecar S₀ 삽입" },
      { lines: [12, 15], color: "emerald", note: "get은 None과 Error를 분리" },
      { lines: [17, 19], color: "amber", note: "get_exact는 하나라도 없으면 MissingSidecar" },
      { lines: [29, 43], color: "violet", note: "누락·decode·backend 오류의 typed boundary" },
    ],
  },
  "disk-path": {
    path: "reth-v2.8.1/transaction-pool/blobstore/disk.rs · open/insert/get",
    code: diskPath,
    lang: "rust",
    highlight: [6, 72],
    desc: "문제: Disk라는 이름만 보고 restart durability와 atomic receipt를 추정하면 실제 실패 순서를 놓칩니다.\n\n해결: open은 이전 directory를 지웁니다. insert_one은 version index·LRU cache 뒤 파일을 쓰고, get_one은 cache→file decode 순서로 읽습니다.",
    annotations: [
      { lines: [11, 15], color: "rose", note: "Open 때 이전 Blob directory 전체 삭제" },
      { lines: [23, 35], color: "sky", note: "Encode→index→cache→file 순서" },
      { lines: [41, 55], color: "emerald", note: "Cache hit 뒤 file fallback" },
      { lines: [57, 72], color: "amber", note: "NotFound=None, decode 실패=DecodeError" },
    ],
  },
  "pool-boundary": {
    path: "reth-v2.8.1/transaction-pool/pool/mod.rs · on_added_transaction/insert_blob",
    code: poolBoundary,
    lang: "rust",
    highlight: [6, 27],
    desc: "문제: Pool insertion과 BlobStore insertion을 하나의 원자적 성공처럼 읽으면 sidecar 저장 실패가 transaction 상태에 미치는 영향을 잘못 설명합니다.\n\n해결: Pool lock 밖에서 sidecar insert를 실행하며 실패는 warning과 metric으로 남깁니다. 이 함수는 이미 성공한 Pool insertion을 rollback하지 않습니다.",
    annotations: [
      { lines: [6, 13], color: "sky", note: "Pool result에서 S₀를 꺼내 BlobStore로 전달" },
      { lines: [15, 18], color: "amber", note: "Replacement sidecar는 삭제 대상으로 전환" },
      { lines: [21, 27], color: "rose", note: "Store 실패는 metric·warning이며 Pool rollback 아님" },
    ],
  },
  "finality-cleanup": {
    path: "reth-v2.8.1/transaction-pool · tracker/maintain/disk cleanup",
    code: finalityCleanup,
    lang: "rust",
    highlight: [6, 52],
    desc: "문제: Sidecar를 block 포함 즉시 지우면 finality 전 reorg에서 old-chain transaction을 다시 넣을 자료가 없습니다.\n\n해결: Canon tracker가 finalized height 이하의 Blob transaction hash만 내보내고, Disk backend는 deletion queue 뒤 background cleanup으로 파일을 제거합니다.",
    annotations: [
      { lines: [6, 23], color: "sky", note: "Finalized 높이 이하 hash만 tracker에서 꺼냄" },
      { lines: [26, 37], color: "emerald", note: "Pool maintenance가 delete queue와 cleanup task 연결" },
      { lines: [39, 52], color: "amber", note: "NotFound도 성공으로 처리하는 파일 삭제" },
    ],
  },
};
