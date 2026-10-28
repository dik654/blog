import type { CodeRef } from "@/components/code/types";

import consensusRs from "./codebase/helios/ethereum/src/consensus.rs?raw";
import consensusCoreRs from "./codebase/helios/ethereum/consensus-core/src/consensus_core.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "hl-fetch": {
    path: "helios/ethereum/src/consensus.rs",
    code: consensusRs,
    lang: "rust",
    highlight: [4, 31],
    desc: "bootstrap — checkpoint C로 응답을 가져오고 검증 뒤 Store에 적용하는 실제 순서.",
    annotations: [
      { lines: [6, 10], color: "sky", note: "Checkpoint C를 request key로 Bootstrap 응답을 가져옵니다." },
      { lines: [13, 22], color: "amber", note: "응답 header slot의 나이를 정책값과 비교합니다." },
      { lines: [25, 28], color: "emerald", note: "검증이 끝난 뒤에만 Store를 교체합니다." },
    ],
  },
  "hl-init": {
    path: "helios/ethereum/consensus-core/src/consensus_core.rs",
    code: consensusCoreRs,
    lang: "rust",
    highlight: [4, 56],
    desc: "verify_bootstrap·apply_bootstrap — Header·committee proof를 확인한 뒤 Store 전체를 만듭니다.",
    annotations: [
      { lines: [10, 13], color: "amber", note: "Fork별 header와 execution payload proof를 확인합니다." },
      { lines: [16, 23], color: "sky", note: "Committee K의 inclusion branch를 검사합니다." },
      { lines: [26, 36], color: "rose", note: "Header root 또는 committee proof가 다르면 Store를 바꾸지 않습니다." },
      { lines: [42, 51], color: "emerald", note: "검증된 응답에서 첫 Store 전체를 한 번에 구성합니다." },
    ],
  },
};
