import type { CodeRef } from "@/components/code/types";
import reorgMaintain from "./codebase/reth-v2.8.1/maintain-reorg.rs?raw";
import finalityMaintain from "./codebase/reth-v2.8.1/maintain-finality.rs?raw";
import tracker from "./codebase/reth-v2.8.1/tracker.rs?raw";
import validateMissing from "./codebase/reth-v2.8.1/validate-missing.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "reorg-maintain": {
    path: "reth v2.8.1 · crates/transaction-pool/src/maintain.rs:382-438",
    code: reorgMaintain,
    lang: "rust",
    highlight: [7, 56],
    desc: "문제: old canonical chain에서 빠진 transaction 가운데 무엇을 Pool에 되돌릴지, Blob transaction에 필요한 sidecar를 어디서 얻을지 결정해야 합니다.\n\n해결: new chain에 없는 old transaction만 고른 뒤 BlobStore에서 sidecar를 읽어 body와 결합합니다. 새 canonical state를 먼저 반영하고 재구성한 transaction을 external origin으로 넣습니다.",
    annotations: [
      { lines: [1, 4], color: "sky", note: "New chain에 이미 포함된 transaction hash 집합" },
      { lines: [7, 31], color: "emerald", note: "Old−new 차집합과 BlobStore sidecar 재결합" },
      { lines: [34, 43], color: "amber", note: "새 canonical state를 Pool에 먼저 반영" },
      { lines: [45, 53], color: "violet", note: "재구성한 후보를 external transaction으로 재주입" },
      { lines: [55, 56], color: "sky", note: "같은 높이의 tracker 기록을 new chain 기준으로 교체" },
    ],
  },
  "validate-missing": {
    path: "reth v2.8.1 · crates/transaction-pool/src/validate/eth.rs:806-835",
    code: validateMissing,
    lang: "rust",
    highlight: [11, 29],
    desc: "문제: Reorg로 다시 들어온 body에 sidecar가 붙어 있지 않을 수 있습니다.\n\n해결: Missing variant면 BlobStore에 같은 transaction hash가 있는지 확인합니다. 있으면 이미 검증해 저장한 sidecar로 간주하고, 없으면 MissingEip4844BlobSidecar로 거부합니다. 별도 receipt나 network fetch는 이 코드에 없습니다.",
    annotations: [
      { lines: [11, 16], color: "sky", note: "Transaction에서 sidecar variant를 분리" },
      { lines: [17, 22], color: "emerald", note: "Missing이면 local BlobStore contains 확인" },
      { lines: [23, 29], color: "rose", note: "Local miss는 typed validation error" },
    ],
  },
  tracker: {
    path: "reth v2.8.1 · crates/transaction-pool/src/blobstore/tracker.rs:1-77",
    code: tracker,
    lang: "rust",
    highlight: [9, 75],
    desc: "문제: Reorg 때 같은 block height의 canonical 내용이 바뀔 수 있고, finality 뒤에는 더 이상 필요 없는 sidecar를 정리해야 합니다.\n\n해결: BTreeMap에 block number별 Blob transaction hash를 기록합니다. Reorg의 new chain은 같은 높이 기록을 교체하고, finalized height 이하의 hash를 오래된 순서대로 내보냅니다.",
    annotations: [
      { lines: [9, 14], color: "sky", note: "Block number → Blob transaction hashes" },
      { lines: [16, 34], color: "emerald", note: "같은 높이 insert는 이전 canonical 기록을 교체" },
      { lines: [36, 54], color: "amber", note: "New chain에서 EIP-4844 hash만 다시 수집" },
      { lines: [56, 75], color: "violet", note: "Finalized height 이하 hash를 순서대로 배출" },
    ],
  },
  "finality-maintain": {
    path: "reth v2.8.1 · crates/transaction-pool/src/maintain.rs:233-247",
    code: finalityMaintain,
    lang: "rust",
    highlight: [1, 15],
    desc: "문제: Tracker가 내보낸 finalized Blob transaction을 실제 BlobStore 정리로 연결해야 합니다.\n\n해결: Finalized update의 hash를 delete_blobs에 넘기고, 별도 blocking task에서 cleanup_blobs를 실행합니다. 이 local 정리는 consensus data availability나 영구 archive 보존을 소유하지 않습니다.",
    annotations: [
      { lines: [1, 6], color: "sky", note: "새 finalized height와 tracker update 결합" },
      { lines: [7, 9], color: "emerald", note: "삭제 metric과 BlobStore delete 요청" },
      { lines: [10, 15], color: "amber", note: "Background cleanup task 실행" },
    ],
  },
};
