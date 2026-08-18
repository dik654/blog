import type { CodeRef } from "@/components/code/types";
import trackerRs from "../reth-eip4844/codebase/reth/crates/transaction-pool/src/blobstore/tracker.rs?raw";
import validateEthRs from "../reth-eip4844/codebase/reth/crates/transaction-pool/src/validate/eth.rs?raw";
import consensusRs from "../reth-eip4844/codebase/reth/crates/consensus/common/src/validation.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "canon-tracker": {
    path: "reth/crates/transaction-pool/src/blobstore/tracker.rs",
    code: trackerRs,
    lang: "rust",
    highlight: [4, 56],
    desc: "문제: Finalized block의 blob을 BlobStore에서 정리하려면 어떤 block에 어떤 blob TX가 포함됐는지 먼저 추적해야 합니다.\n\n해결: BTreeMap<BlockNumber, Vec<B256>>로 블록별 blob TX를 추적하고, finalization 시 오래된 블록부터 순서대로 삭제 대상을 뽑습니다.",
    annotations: [
      { lines: [7, 9], color: "sky", note: "BTreeMap: 블록 번호 순서 보장 → finalized 이전 구간을 효율적으로 순회" },
      { lines: [22, 33], color: "emerald", note: "add_new_chain_blocks: is_eip4844() 필터로 blob TX 해시만 기록" },
      { lines: [37, 49], color: "amber", note: "on_finalized_block: first_entry()로 오래된 순서부터 finalized까지 반환" },
      { lines: [52, 56], color: "violet", note: "BlobStoreUpdates: 삭제할 TX 목록 또는 None" },
    ],
  },
  "reinsert-sidecar-check": {
    path: "reth/crates/transaction-pool/src/validate/eth.rs",
    code: validateEthRs,
    lang: "rust",
    highlight: [59, 66],
    desc: "문제: Reorg로 orphan된 blob TX를 재주입할 때, 매번 KZG를 다시 검증할지 local sidecar를 재사용할지 정해야 합니다.\n\n해결: take_blob()이 Missing을 반환하면(= body만 있고 sidecar가 빠짐) blob_store.contains()로 local 재사용 가능 여부를 확인합니다. 이 한 줄이 I_sidecar indicator의 실제 구현입니다.",
    annotations: [
      { lines: [60, 61], color: "sky", note: "re-org로 재주입된 TX — take_blob()이 Missing을 반환" },
      { lines: [61, 65], color: "emerald", note: "blob_store.contains(hash) — local sidecar 존재 여부가 곧 I_sidecar" },
      { lines: [64, 65], color: "amber", note: "존재하면 재검증 없이 통과 — 이미 검증된 receipt를 재사용" },
    ],
  },
  "header-blob-gas": {
    path: "reth/crates/consensus/common/src/validation.rs",
    code: consensusRs,
    lang: "rust",
    highlight: [4, 18],
    desc: "문제: 새 head에 재주입된 block의 헤더 blob_gas_used가 실제 blob TX 합계와 일치해야 합니다.\n\n해결: 본체의 blob gas 합계와 헤더 값을 비교하고, 불일치하면 ConsensusError로 거부합니다 — reorg 후에도 이 parity는 그대로 유지돼야 합니다.",
    annotations: [
      { lines: [7, 9], color: "sky", note: "header의 blob_gas_used 필드 존재 확인" },
      { lines: [10, 16], color: "emerald", note: "본체 합계 ≠ 헤더 값이면 BlobGasUsedDiff 에러" },
    ],
  },
  "header-4844-standalone": {
    path: "reth/crates/consensus/common/src/validation.rs",
    code: consensusRs,
    lang: "rust",
    highlight: [20, 55],
    desc: "문제: Release candidate가 reorg·restart 뒤에도 EIP-4844 헤더 불변식을 계속 지키는지 검증해야 합니다.\n\n해결: blob_gas_used 존재, beacon root 존재, 131072의 배수 여부, 최대값 초과 여부 네 가지를 부모 블록 없이도 독립적으로 검사합니다.",
    annotations: [
      { lines: [28, 29], color: "sky", note: "blob_gas_used 필드 존재 확인" },
      { lines: [32, 36], color: "emerald", note: "parent_beacon_block_root — Cancun 필수 필드" },
      { lines: [38, 44], color: "amber", note: "DATA_GAS_PER_BLOB(131072)의 배수 검증" },
      { lines: [46, 53], color: "violet", note: "블록당 최대 blob gas 초과 확인" },
    ],
  },
};
