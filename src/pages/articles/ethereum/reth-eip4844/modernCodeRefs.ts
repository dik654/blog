import type { CodeRef } from "@/components/code/types";
import txEip4844Rs from "./codebase/alloy-v2.5.0/tx-eip4844.rs?raw";
import sidecarStructRs from "./codebase/alloy-v2.5.0/sidecar-struct.rs?raw";
import sidecarBindingRs from "./codebase/alloy-v2.5.0/sidecar-binding.rs?raw";
import sidecarProofRs from "./codebase/alloy-v2.5.0/sidecar-proof.rs?raw";
import versionedHashRs from "./codebase/alloy-v2.5.0/versioned-hash.rs?raw";
import sidecarVariantRs from "./codebase/alloy-v2.5.0/sidecar-variant.rs?raw";
import rethValidationRs from "./codebase/reth-v2.8.1/validate-eip4844.rs?raw";
import rethSidecarVersionRs from "./codebase/reth-v2.8.1/sidecar-version.rs?raw";

export const modernCodeRefs: Record<string, CodeRef> = {
  "transaction-fields": {
    path: "alloy-v2.5.0/crates/consensus/src/transaction/eip4844.rs",
    code: txEip4844Rs,
    lang: "rust",
    highlight: [3, 17],
    desc: "Alloy의 Type-3 transaction은 Blob 원문 대신 32-byte versioned hash 목록과 Blob gas의 최대 가격을 보관합니다. validate_blob은 이 목록을 sidecar 검증 함수에 넘깁니다.",
    annotations: [
      { lines: [3, 4], color: "sky", note: "Transaction body에 남는 Blob 참조 목록" },
      { lines: [21, 26], color: "emerald", note: "Transaction 참조와 sidecar를 한 검증 호출로 결합" },
    ],
  },
  "sidecar-fields": {
    path: "alloy-v2.5.0/crates/eips/src/eip4844/sidecar.rs",
    code: sidecarStructRs,
    lang: "rust",
    highlight: [15, 22],
    desc: "EIP-4844 sidecar는 Blob, commitment, proof를 같은 index의 세 목록으로 보관합니다. 공개 필드는 이 불변식을 자동으로 강제하지 않으므로 검증을 거쳐야 합니다.",
    annotations: [
      { lines: [3, 6], color: "amber", note: "세 목록은 길이와 index 의미가 같아야 함" },
      { lines: [15, 22], color: "sky", note: "실제 데이터와 두 KZG 값을 따로 보관" },
    ],
  },
  "versioned-hash": {
    path: "alloy-v2.5.0/crates/eips/src/eip4844/mod.rs",
    code: versionedHashRs,
    lang: "rust",
    highlight: [1, 8],
    desc: "48-byte commitment를 SHA-256으로 줄인 뒤 첫 byte를 현재 KZG scheme version인 0x01로 바꿔 32-byte versioned hash를 만듭니다.",
    annotations: [
      { lines: [4, 4], color: "amber", note: "Commitment 길이 경계" },
      { lines: [5, 7], color: "emerald", note: "SHA-256 digest에 scheme version을 기록" },
    ],
  },
  "sidecar-binding": {
    path: "alloy-v2.5.0/crates/eips/src/eip4844/sidecar.rs",
    code: sidecarBindingRs,
    lang: "rust",
    highlight: [1, 21],
    desc: "검증은 transaction의 versioned hash 수와 sidecar commitment 수를 먼저 맞춘 뒤, 같은 index의 commitment에서 hash를 다시 계산해 비교합니다.",
    annotations: [
      { lines: [1, 8], color: "amber", note: "목록 길이가 다르면 pairing 자체가 성립하지 않음" },
      { lines: [10, 21], color: "emerald", note: "같은 index의 commitment와 transaction 참조를 결속" },
    ],
  },
  "sidecar-proof": {
    path: "alloy-v2.5.0/crates/eips/src/eip4844/sidecar.rs",
    code: sidecarProofRs,
    lang: "rust",
    highlight: [1, 9],
    desc: "Hash 결속이 맞아도 끝이 아닙니다. Blob·commitment·proof 세 목록을 batch KZG 검증에 넣고 결과가 참일 때만 성공합니다.",
    annotations: [
      { lines: [1, 7], color: "sky", note: "세 목록을 같은 batch proof 검증에 투입" },
      { lines: [9, 9], color: "amber", note: "false이면 InvalidProof로 fail closed" },
    ],
  },
  "reth-delegation": {
    path: "reth-v2.8.1/crates/transaction-pool/src/validate/eth.rs",
    code: rethValidationRs,
    lang: "rust",
    highlight: [1, 11],
    desc: "Reth v2.8.1의 transaction-pool validator는 transaction과 sidecar를 Alloy 검증에 넘기고, 실패를 pool 거부 사유와 metric으로 바꿉니다. 성공한 sidecar만 다음 저장 단계로 보냅니다.",
    annotations: [
      { lines: [1, 7], color: "amber", note: "검증 실패를 Pool admission 실패로 변환" },
      { lines: [8, 11], color: "emerald", note: "성공 시간 기록 뒤 sidecar를 저장 단계로 전달" },
    ],
  },
  "sidecar-version-boundary": {
    path: "reth-v2.8.1/crates/transaction-pool/src/validate/eth.rs",
    code: rethSidecarVersionRs,
    lang: "rust",
    highlight: [1, 25],
    desc: "Reth v2.8.1은 활성 fork와 설정에 따라 EIP-4844 v0 sidecar와 EIP-7594 v1 sidecar를 구분합니다. 이 글의 B₀·C₀·π₀ 사례는 v0 메커니즘을 설명합니다.",
    annotations: [
      { lines: [1, 15], color: "sky", note: "Osaka 전후에 허용할 sidecar version을 구분" },
      { lines: [17, 25], color: "amber", note: "EIP-7594를 끈 체인은 v1 sidecar를 거부" },
    ],
  },
  "alloy-sidecar-variant": {
    path: "alloy-v2.5.0/crates/consensus/src/transaction/eip4844_sidecar.rs",
    code: sidecarVariantRs,
    lang: "rust",
    highlight: [1, 14],
    desc: "Alloy는 BlobTransactionSidecarVariant라는 공통 타입에서 선택된 sidecar version의 validate 구현으로 위임합니다.",
    annotations: [
      { lines: [1, 9], color: "emerald", note: "Version별 구현을 같은 transaction 검증 계약으로 연결" },
    ],
  },
};
