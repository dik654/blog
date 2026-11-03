import type { CodeRef } from "@/components/code/types";

import aggregationChecksRs from "./codebase/current/aggregation_checks.rs?raw";
import batchCircuitRs from "./codebase/current/batch_circuit.rs?raw";
import bundleInfoRs from "./codebase/current/bundle_info.rs?raw";
import chunkExecuteRs from "./codebase/current/chunk_execute.rs?raw";
import chunkGuestRs from "./codebase/current/chunk_guest.rs?raw";
import chunkPublicInputRs from "./codebase/current/chunk_public_input.rs?raw";
import chunkValidateRs from "./codebase/current/chunk_validate.rs?raw";
import provingTaskRs from "./codebase/current/proving_task.rs?raw";
import verifierBindingRs from "./codebase/current/verifier_binding.rs?raw";

export const SCROLL_ZKVM_VERSION = "v0.9.1";
export const SCROLL_ZKVM_COMMIT = "bf887150bb671af9b17dd53e92b7f2bbf01ec745";

export const currentCodeRefs: Record<string, CodeRef> = {
  "scroll-chunk-guest": {
    path: "crates/circuits/chunk-circuit/src/main.rs · lines 14–28",
    code: chunkGuestRs,
    lang: "rust",
    highlight: [9, 13],
    desc: "Chunk guest가 witness bytes를 읽고 역직렬화한 뒤 실행 검증에서 public inputs를 만들고, 그 Keccak-256 digest만 OpenVM public values로 공개하는 현재 경로입니다.",
    annotations: [
      { lines: [9, 10], color: "sky", note: "비공개 witness bytes를 guest 입력에서 읽음" },
      { lines: [11, 12], color: "amber", note: "고정 fork의 실행 검증으로 ChunkInfo 생성" },
      { lines: [14, 14], color: "emerald", note: "공개 인터페이스에는 32-byte PI hash 공개" },
    ],
  },
  "scroll-chunk-validate": {
    path: "crates/circuits/chunk-circuit/src/circuit.rs · lines 27–49",
    code: chunkValidateRs,
    lang: "rust",
    highlight: [17, 22],
    desc: "Witness의 version byte에서 선택한 fork가 witness의 fork_name과 같은지 확인하고, ChunkWitness를 실제 실행해 VersionedChunkInfo로 바꾸는 경계입니다.",
    annotations: [
      { lines: [2, 3], color: "sky", note: "입력과 공개 출력의 실제 타입" },
      { lines: [18, 19], color: "rose", note: "fork 이름 불일치 즉시 거절" },
      { lines: [21, 22], color: "emerald", note: "실행 성공 결과와 version을 한 쌍으로 반환" },
    ],
  },
  "scroll-chunk-execute": {
    path: "crates/types/chunk/src/scroll/execute.rs · lines 21–91",
    code: chunkExecuteRs,
    lang: "rust",
    highlight: [11, 70],
    desc: "현재 chunk 실행 경로입니다. fork에 맞는 chain spec으로 블록 witness를 재실행한 뒤 pre/post state root, transaction digest, message queue hash와 block context를 ChunkInfo에 넣습니다.",
    annotations: [
      { lines: [11, 22], color: "sky", note: "witness fork에 맞는 실행 규칙 선택" },
      { lines: [24, 33], color: "amber", note: "sbv verifier가 블록을 실행해 pre/post root 산출" },
      { lines: [38, 48], color: "violet", note: "tx data와 L1 message queue commitments 계산" },
      { lines: [50, 69], color: "emerald", note: "공개 statement의 재료인 ChunkInfo 구성" },
    ],
  },
  "scroll-chunk-public-input": {
    path: "crates/types/base/src/public_inputs/scroll/chunk.rs · ChunkInfo, pi_galileo",
    code: chunkPublicInputRs,
    lang: "rust",
    highlight: [1, 64],
    desc: "Galileo 계열 chunk statement를 만드는 실제 필드와 직렬화 순서입니다. root 두 개뿐 아니라 fork version, chain, withdrawal, tx data, message queue, first block와 block contexts가 함께 hash됩니다.",
    annotations: [
      { lines: [1, 32], color: "sky", note: "ChunkInfo의 실제 공개 의미 필드" },
      { lines: [36, 45], color: "amber", note: "version·chain·roots·data·queue의 순서 고정" },
      { lines: [46, 53], color: "emerald", note: "첫 block number와 모든 block context도 포함" },
    ],
  },
  "scroll-aggregation-checks": {
    path: "crates/types/circuit/src/lib.rs · lines 107–126; public_inputs/scroll/chunk.rs · lines 293–299",
    code: aggregationChecksRs,
    lang: "rust",
    highlight: [5, 25],
    desc: "Aggregation은 child proof의 PI hash만 모으지 않습니다. 인접한 chunk의 chain/state/message queue가 실제로 이어지는지 확인하고, witness에서 계산한 PI hash가 proof public values와 같은지도 확인합니다.",
    annotations: [
      { lines: [5, 9], color: "rose", note: "빈 aggregation과 끊긴 인접 statement 거절" },
      { lines: [11, 18], color: "emerald", note: "witness PI hash와 child proof 공개값의 일치" },
      { lines: [22, 25], color: "sky", note: "state root와 L1 message queue의 연속성" },
    ],
  },
  "scroll-batch-circuit": {
    path: "crates/circuits/batch-circuit/src/circuit.rs · lines 51–94",
    code: batchCircuitRs,
    lang: "rust",
    highlight: [4, 40],
    desc: "Batch guest가 child를 아무 OpenVM proof로 받지 않고, 빌드 때 고정된 chunk EXE·VM commitments를 확인한 다음 각 chunk PI hash를 증명 공개값과 대조하는 원문입니다.",
    annotations: [
      { lines: [4, 19], color: "rose", note: "허용한 chunk guest와 VM commitment만 수용" },
      { lines: [21, 30], color: "sky", note: "같은 version으로 chunk infos 구성" },
      { lines: [32, 43], color: "emerald", note: "child proof의 32 public values를 PI hash로 복원" },
    ],
  },
  "scroll-bundle-info": {
    path: "crates/types/bundle/src/witness.rs · lines 26–62",
    code: bundleInfoRs,
    lang: "rust",
    highlight: [2, 24],
    desc: "Bundle 공개 statement는 첫 batch의 이전 상태에서 마지막 batch의 이후 상태까지를 하나의 최종화 경계로 압축합니다.",
    annotations: [
      { lines: [2, 2], color: "rose", note: "빈 bundle은 거절" },
      { lines: [4, 5], color: "sky", note: "시작과 끝 batch를 선택" },
      { lines: [8, 23], color: "emerald", note: "이전 root/hash와 최종 root/hash를 한 statement로 구성" },
    ],
  },
  "scroll-verifier-binding": {
    path: "crates/verifier/src/verifier.rs · lines 120–140",
    code: verifierBindingRs,
    lang: "rust",
    highlight: [6, 30],
    desc: "EVM-verifiable bundle proof를 실행하기 전에 proof의 app EXE·VM commitments가 신뢰한 vk bytes와 같은지 확인합니다. proof bytes만 맞아도 다른 guest이면 거절됩니다.",
    annotations: [
      { lines: [6, 14], color: "sky", note: "proof가 들고 온 app commitments 추출" },
      { lines: [16, 21], color: "rose", note: "expected guest 또는 VM이 다르면 fail closed" },
      { lines: [23, 27], color: "emerald", note: "그 뒤에야 EVM verifier bytecode 실행" },
    ],
  },
  "scroll-proving-task": {
    path: "crates/types/src/task.rs · lines 7–24",
    code: provingTaskRs,
    lang: "rust",
    highlight: [1, 18],
    desc: "Coordinator와 prover 사이에서 오가는 현재 universal task의 실제 경계입니다. witness, child proofs, fork, expected VK, stable identifier와 deferred verification commits를 분리합니다.",
    annotations: [
      { lines: [2, 6], color: "sky", note: "guest 입력과 aggregation child proofs" },
      { lines: [7, 12], color: "amber", note: "fork·VK가 asset compatibility를 고정" },
      { lines: [13, 18], color: "emerald", note: "재시도 identity와 deferred proof commits" },
    ],
  },
};
