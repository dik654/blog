import type { CodeRef } from "@/components/code/types";
import attestRaw from "../prysm/codebase/prysm/validator/client/attest_v7.go?raw";
import poolInterfaceRaw from "./codebase/prysm/beacon-chain/operations/attestations/pool_v7.go?raw";
import aggregatedRaw from "./codebase/prysm/beacon-chain/operations/attestations/kv/aggregated_v7.go?raw";
import subnetRaw from "./codebase/prysm/beacon-chain/core/helpers/attestation_v7.go?raw";

export const attestCodeRefs: Record<string, CodeRef> = {
  "submit-attestation": {
    path: "validator/client/attest.go — validator.SubmitAttestation()",
    lang: "go",
    code: attestRaw,
    highlight: [1, 161],
    desc: "Prysm v7.3.1 · duty 조회, signing root, slashing protection, fork별 제출과 receipt",
    annotations: [
      {
        lines: [6, 47],
        color: "sky",
        note: "같은 key·role을 잠그고 현재 duty와 committee를 찾습니다.",
      },
      {
        lines: [51, 91],
        color: "emerald",
        note: "Attestation data에 서명하고 fork에 맞는 indexed object를 만듭니다.",
      },
      {
        lines: [93, 116],
        color: "rose",
        note: "Signing root를 계산한 뒤 local slashing-protection DB가 충돌을 거절합니다.",
      },
      {
        lines: [118, 161],
        color: "violet",
        note: "Electra 전후 schema에 맞는 object를 제출하고 결과를 저장합니다.",
      },
    ],
  },
  "pool-interface": {
    path: "beacon-chain/operations/attestations/pool.go — Pool",
    lang: "go",
    code: poolInterfaceRaw,
    highlight: [1, 42],
    desc: "Prysm v7.3.1 · proposer·aggregator·fork choice가 쓰는 attestation pool 계약",
    annotations: [
      {
        lines: [1, 14],
        color: "violet",
        note: "Aggregated vote는 proposer가, unaggregated vote는 aggregator가 사용합니다.",
      },
      {
        lines: [15, 29],
        color: "sky",
        note: "집계 전후의 저장·조회·삭제와 seen 상태를 나눕니다.",
      },
      {
        lines: [30, 38],
        color: "emerald",
        note: "Block 포함용과 fork-choice 전달용 상태도 별도 owner로 둡니다.",
      },
    ],
  },
  "attestation-pool": {
    path: "beacon-chain/operations/attestations/kv/aggregated.go — SaveAggregatedAttestation()",
    lang: "go",
    code: aggregatedRaw,
    highlight: [1, 74],
    desc: "Prysm v7.3.1 · 집계 여부·중복 bit·data identity를 검사하고 clone한 aggregate를 저장",
    annotations: [
      {
        lines: [1, 23],
        color: "sky",
        note: "Nil·미집계·이미 저장됨·이미 본 participation bit를 먼저 거릅니다.",
      },
      {
        lines: [24, 47],
        color: "emerald",
        note: "AttestationData identity로 묶고 lock 안에서 clone을 저장하거나 기존 aggregate와 합칩니다.",
      },
      {
        lines: [49, 60],
        color: "rose",
        note: "여러 저장 중 하나가 실패하면 잘못 남은 aggregate를 삭제합니다.",
      },
      {
        lines: [62, 74],
        color: "violet",
        note: "읽을 때는 read lock 아래 모든 data group의 aggregate를 모읍니다.",
      },
    ],
  },
  "compute-subnet": {
    path: "beacon-chain/core/helpers/attestation.go — ComputeSubnetForAttestation()",
    lang: "go",
    code: subnetRaw,
    highlight: [1, 44],
    desc: "Prysm v7.3.1 · 활성 validator 수에서 committees-per-slot을 구해 slot·committee를 gossip subnet에 대응",
    annotations: [
      {
        lines: [1, 18],
        color: "sky",
        note: "공식 식과 함수 입력의 차이를 source 주석에 함께 남깁니다.",
      },
      {
        lines: [19, 39],
        color: "emerald",
        note: "Attestation 또는 slot·committee 입력을 공통 계산 함수로 보냅니다.",
      },
      {
        lines: [40, 44],
        color: "violet",
        note: "Epoch 안에서 지난 committee 수를 더한 뒤 subnet 수로 나눈 나머지를 반환합니다.",
      },
    ],
  },
};
