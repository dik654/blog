import type { CodeRef } from "@/components/code/types";
import checkpointSol from "./codebase/ipc/CheckpointingFacet.sol?raw";
import topDownFinalitySol from "./codebase/ipc/TopDownFinalityFacet.sol?raw";
import libGatewaySol from "./codebase/ipc/LibGateway.sol?raw";
import finalityWithNullRs from "./codebase/ipc/FinalityWithNull.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "ipc-subnet": {
    path: "contracts/contracts/gateway/router/CheckpointingFacet.sol · bcd7c0d excerpt",
    code: checkpointSol,
    lang: "solidity",
    highlight: [17, 77],
    desc: "실제 IPC CheckpointingFacet의 checkpoint 기록과 message 실행 경계 발췌 — quorum 검증은 system actor caller 경로의 책임입니다.",
    annotations: [
      {
        lines: [5, 9],
        color: "sky",
        note: "Checkpoint가 state commitment, bottom-up messages와 activity를 묶습니다.",
      },
      {
        lines: [17, 24],
        color: "emerald",
        note: "systemActorOnly는 이미 검증된 checkpoint만 side effect 경계로 넘깁니다.",
      },
      {
        lines: [26, 40],
        color: "amber",
        note: "Commitment·message batch·activity를 event로 남기고 latest height를 갱신합니다.",
      },
      {
        lines: [42, 77],
        color: "violet",
        note: "실제 message effect는 별도 execBottomUpMsgBatch에서 balance를 확인한 뒤 적용합니다.",
      },
    ],
  },
  "ipc-finality": {
    path: "contracts/contracts/gateway/router/TopDownFinalityFacet.sol · bcd7c0d excerpt",
    code: topDownFinalitySol,
    lang: "solidity",
    highlight: [5, 68],
    desc: "Parent finality 저장 호출과 validator-change tracker 적용이 같은 facet 안에서도 다른 함수라는 점을 보여 주는 발췌입니다.",
    annotations: [
      {
        lines: [5, 15],
        color: "sky",
        note: "Facet은 LibGateway에 저장을 위임하고 직전 finality를 호출자에게 돌려줍니다.",
      },
      {
        lines: [17, 22],
        color: "amber",
        note: "Parent의 validator change는 tracker에 먼저 쌓입니다.",
      },
      {
        lines: [24, 68],
        color: "emerald",
        note: "확인된 configuration만 child membership 적용 단계로 넘어갑니다.",
      },
    ],
  },
  "ipc-finality-provider": {
    path: "fendermint/vm/topdown/src/finality/null.rs · bcd7c0d excerpt",
    code: finalityWithNullRs,
    lang: "rust",
    highlight: [5, 50],
    desc: "Child validator가 parent finality proposal의 height 범위와 block hash를 local cache에 대조하는 실제 Fendermint 검사 발췌입니다.",
    annotations: [
      {
        lines: [9, 20],
        color: "amber",
        note: "비교 기준인 last committed finality가 없거나 이미 처리한 height면 거절합니다.",
      },
      {
        lines: [22, 28],
        color: "sky",
        note: "Trusted parent cache가 실제로 본 height까지만 proposal 후보가 됩니다.",
      },
      {
        lines: [31, 40],
        color: "emerald",
        note: "같은 height에서 관찰한 hash와 proposal hash를 직접 비교합니다.",
      },
      {
        lines: [42, 50],
        color: "violet",
        note: "Height 조건을 먼저 통과한 뒤 hash 조건을 검사합니다.",
      },
    ],
  },
  "ipc-finality-storage": {
    path: "contracts/contracts/lib/LibGateway.sol · bcd7c0d excerpt",
    code: libGatewaySol,
    lang: "solidity",
    highlight: [5, 22],
    desc: "Storage 함수가 직접 검사하는 것은 height의 단조 증가이며, hash ancestry는 바깥 계층의 책임임을 보여 줍니다.",
    annotations: [
      {
        lines: [5, 16],
        color: "amber",
        note: "같은 높이와 과거 높이를 거절하지만 ancestry predicate는 이 함수에 없습니다.",
      },
      {
        lines: [18, 22],
        color: "sky",
        note: "직전 finality를 반환하고 새 height·hash를 저장합니다.",
      },
    ],
  },
};
