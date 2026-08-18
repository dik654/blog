import type { CodeRef } from "@/components/code/types";
import validateEthRs from "../reth-eip4844/codebase/reth/crates/transaction-pool/src/validate/eth.rs?raw";
import blobRs from "../reth-eip4844/codebase/reth/crates/transaction-pool/src/blobstore/blob.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "tx-validate-stateless": {
    path: "reth/crates/transaction-pool/src/validate/eth.rs",
    code: validateEthRs,
    lang: "rust",
    highlight: [3, 46],
    desc: "문제: Blob TX가 풀에 진입하기 전 값싼 구조 오류를 먼저 걸러야 합니다.\n\n해결: 포크 활성 여부, 크기 한도, blob 개수를 상태 조회 없이 검사합니다. 비용은 원소 수에 비례합니다.",
    annotations: [
      { lines: [9, 12], color: "sky", note: "Cancun 포크 미활성 → EIP-4844 거부" },
      { lines: [19, 25], color: "emerald", note: "blob TX는 input 바이트 기준 크기 제한 (본체만 메모리)" },
      { lines: [29, 43], color: "amber", note: "blob 개수 0이면 거부, 포크별 max_blob_count 초과도 거부" },
    ],
  },
  "tx-validate-eip4844": {
    path: "reth/crates/transaction-pool/src/validate/eth.rs",
    code: validateEthRs,
    lang: "rust",
    highlight: [48, 75],
    desc: "문제: Blob TX의 사이드카가 유효한지 KZG 검증을 수행해야 하고, re-org로 사이드카가 없는 경우도 구분해야 합니다.\n\n해결: take_blob()으로 세 가지 경우(None/Missing/Present)를 분기해 서로 다른 reason code를 반환합니다.",
    annotations: [
      { lines: [56, 57], color: "sky", note: "None: blob TX인데 사이드카 자체가 없음 → 에러" },
      { lines: [60, 66], color: "emerald", note: "Missing: re-org 재주입. local BlobStore에 있으면 재검증 없이 통과" },
      { lines: [69, 72], color: "amber", note: "Present: KZG 검증 수행 → 성공 시 사이드카 반환" },
    ],
  },
  "blob-validate": {
    path: "reth/crates/transaction-pool/src/blobstore/blob.rs",
    code: blobRs,
    lang: "rust",
    highlight: [5, 45],
    desc: "문제: 사이드카(blobs + commitments + proofs)의 개수·binding·KZG proof가 모두 맞는지 확인해야 합니다.\n\n해결: 개수 일치 → 개수 한도 → commitment→versioned hash 매칭 → KZG proof 배치 검증 순서로, 싼 검사부터 비싼 검사로 진행합니다.",
    annotations: [
      { lines: [10, 16], color: "sky", note: "blob·commitment·proof 개수가 모두 같아야 함 (shape gate)" },
      { lines: [18, 25], color: "emerald", note: "MAX_BLOBS_PER_BLOCK 초과 시 거부 (shape gate)" },
      { lines: [27, 34], color: "amber", note: "commitment → versioned hash 재계산 후 참조값과 비교 (binding)" },
      { lines: [36, 42], color: "violet", note: "KZG proof 배치 검증 — pairing 연산 공유로 개별 검증보다 효율적 (KZG gate)" },
    ],
  },
};
