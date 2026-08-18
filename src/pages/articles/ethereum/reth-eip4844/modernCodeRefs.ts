import type { CodeRef } from "@/components/code/types";
import blobRs from "./codebase/reth/crates/transaction-pool/src/blobstore/blob.rs?raw";

export const modernCodeRefs: Record<string, CodeRef> = {
  "versioned-hash-check": {
    path: "reth/crates/transaction-pool/src/blobstore/blob.rs",
    code: blobRs,
    lang: "rust",
    highlight: [27, 34],
    desc: "문제: Transaction이 담은 versioned hash가 실제로 sidecar의 commitment에서 나온 값인지 확인해야 합니다.\n\n해결: 각 commitment를 kzg_to_versioned_hash()로 다시 계산해 같은 index의 참조값과 비교합니다 — 본문의 h_v=v‖SHA256(C)[1:32] 식을 그대로 적용한 코드입니다.",
    annotations: [
      { lines: [29, 29], color: "sky", note: "commitment 목록을 index와 함께 순회" },
      { lines: [30, 30], color: "emerald", note: "kzg_to_versioned_hash — 본문 h_v 식의 실제 구현" },
      { lines: [31, 33], color: "amber", note: "재계산한 값이 참조 versioned_hashes와 다르면 즉시 거부" },
    ],
  },
};
