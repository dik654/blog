import type { CodeRef } from "@/components/code/types";

import consensusCoreRs from "./codebase/helios/ethereum/consensus-core/src/consensus_core.rs?raw";
import consensusRs from "./codebase/helios/ethereum/src/consensus.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "hl-verify-update": {
    path: "helios/ethereum/consensus-core/src/consensus_core.rs",
    code: consensusCoreRs,
    lang: "rust",
    highlight: [118, 237],
    desc: "verify_generic_update — 시간·period·relevance·Merkle branch를 검사하고 마지막에 committee와 BLS signature를 확인합니다.",
    annotations: [
      { lines: [125, 157], color: "sky", note: "참여가 0인지, header와 시간 순서가 맞는지, signature period가 Store에 연결되는지 확인합니다." },
      { lines: [172, 210], color: "amber", note: "Finality header와 next committee가 attested state에 포함됐는지 각각 검증합니다." },
      { lines: [212, 234], color: "emerald", note: "Signature period로 current·next committee를 고른 뒤 set-bit 공개키와 domain-bound signature를 확인합니다." },
    ],
  },
  "hl-apply-update": {
    path: "helios/ethereum/consensus-core/src/consensus_core.rs",
    code: consensusCoreRs,
    lang: "rust",
    highlight: [7, 114],
    desc: "apply_generic_update — 검증된 update를 best 후보·optimistic header·finalized header·committee 상태에 반영합니다.",
    annotations: [
      { lines: [11, 28], color: "sky", note: "참여 최댓값과 optimistic header는 full finality 적용과 별도로 바뀔 수 있습니다." },
      { lines: [45, 63], color: "amber", note: "2/3 참여와 더 새로운 finality 또는 finalized next committee가 모두 있어야 full update를 적용합니다." },
      { lines: [78, 100], color: "emerald", note: "Period가 넘어가면 next를 current로 옮기고, 더 새로운 finalized header를 Store에 기록합니다." },
    ],
  },
  "hl-sync-loop": {
    path: "helios/ethereum/src/consensus.rs",
    code: consensusRs,
    lang: "rust",
    highlight: [4, 56],
    desc: "sync·advance — bootstrap 뒤 update를 검증·적용하고, 이후 finality와 비어 있는 next committee를 보충합니다.",
    annotations: [
      { lines: [4, 18], color: "sky", note: "초기 sync는 Store를 초기화한 뒤 bootstrap, update 목록, finality update 순서로 진행합니다." },
      { lines: [20, 29], color: "emerald", note: "동기화가 끝나면 checkpoint 값을 channel 소비자에게 알립니다." },
      { lines: [34, 53], color: "amber", note: "advance는 finality를 먼저 반영하고 next committee가 없을 때만 update 하나를 더 요청합니다." },
    ],
  },
};
