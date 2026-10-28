import type { CodeRef } from "@/components/code/types";

import applyRs from "../helios-consensus/codebase/helios/ethereum/consensus-core/src/consensus_core.rs?raw";
import orderingRs from "./codebase/helios/ethereum/consensus-core/src/update_ordering.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "hl-apply-update": {
    path: "helios/ethereum/consensus-core/src/consensus_core.rs",
    code: applyRs,
    lang: "rust",
    highlight: [7, 114],
    desc: "apply_generic_update — 검증된 update를 best 후보·참여 최댓값·optimistic/finalized header·committee와 checkpoint에 조건별로 반영합니다.",
    annotations: [
      { lines: [11, 28], color: "sky", note: "Best 후보와 현재 참여 최댓값을 먼저 기록하고 safety threshold를 넘을 때만 optimistic header를 전진시킵니다." },
      { lines: [42, 63], color: "amber", note: "2/3 참여와 더 새로운 finality 또는 finalized next committee를 함께 확인한 뒤 full apply로 들어갑니다." },
      { lines: [76, 100], color: "emerald", note: "Period handoff로 current·next committee와 참여 최댓값을 옮기고, 더 새로운 finalized header를 기록합니다." },
      { lines: [102, 111], color: "violet", note: "Finalized slot이 epoch 경계면 header tree hash root를 checkpoint로 반환합니다." },
    ],
  },
  "hl-best-update": {
    path: "helios/ethereum/consensus-core/src/consensus_core.rs",
    code: orderingRs,
    lang: "rust",
    highlight: [43, 116],
    desc: "is_better_update — 두 valid update를 supermajority·참여·committee·finality와 slot tie-break 순서로 비교합니다.",
    annotations: [
      { lines: [47, 59], color: "sky", note: "Supermajority 여부를 먼저 비교하고 둘 다 그 아래일 때는 참여 position이 많은 후보를 고릅니다." },
      { lines: [61, 101], color: "amber", note: "Relevant next committee, finality와 같은 committee period의 finality를 차례로 비교합니다." },
      { lines: [104, 115], color: "emerald", note: "나머지가 같으면 참여가 많은 쪽, 더 오래된 attested data, 더 이른 signature slot 순서로 결정합니다." },
    ],
  },
  "hl-force-update": {
    path: "helios/ethereum/consensus-core/src/consensus_core.rs",
    code: orderingRs,
    lang: "rust",
    highlight: [4, 24],
    desc: "force_update — 한 sync-committee period보다 오래 finality가 멈춘 경우 best valid update를 quorum 검사 없이 적용할 수 있는 liveness 예외입니다.",
    annotations: [
      { lines: [4, 5], color: "rose", note: "Source 자체가 quorum 미만 header를 받을 수 있으며 valid update 검열 가능성이 없을 때만 쓰라고 경고합니다." },
      { lines: [7, 20], color: "amber", note: "정체 기간과 best 후보를 확인하고, 새 finality가 없으면 attested header를 후보의 finalized header로 바꿔 적용합니다." },
      { lines: [20, 22], color: "sky", note: "Normal 2/3 gate를 거치지 않는 apply 함수를 호출한 뒤 best 후보를 비웁니다." },
    ],
  },
};
