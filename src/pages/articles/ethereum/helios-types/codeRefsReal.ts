import type { CodeRef } from "@/components/code/types";
import modRs from "./codebase/helios-real/ethereum/consensus-core/src/types/mod.rs?raw";

export const codeRefsReal: Record<string, CodeRef> = {
  "helios-header-root": {
    path: "helios/ethereum/consensus-core/src/types/mod.rs",
    code: modRs,
    lang: "rust",
    highlight: [27, 47],
    desc: "문제: \"BeaconBlockHeader.state_root는 BeaconState root이며 EVM account trie root가 아니다. 실행 상태 root는 fork별 LightClientHeader.execution에서 가져온다\"는 claim이 실제로 어떤 구조인지 확인해야 합니다.\n\n해결: BeaconBlockHeader는 slot·proposer_index·parent_root·state_root·body_root만 갖고, LightClientHeader가 이 beacon header와 별도의 execution(ExecutionPayloadHeader) 필드를 분리해서 갖습니다.",
    annotations: [
      { lines: [27, 35], color: "sky", note: "article의 B_header=8+8+3·32=112 bytes — u64 두 개 + B256 세 개" },
      { lines: [41, 47], color: "emerald", note: "article의 실행 상태 root 분리 — beacon과 execution이 별도 필드" },
    ],
  },
  "helios-core-types": {
    path: "helios/ethereum/consensus-core/src/types/mod.rs",
    code: modRs,
    lang: "rust",
    highlight: [14, 69],
    desc: "문제: \"BeaconBlockHeader는 commitment, SyncAggregate는 서명 증거, Update는 검증 후보 메시지, LightClientStore는 검증 통과 결과를 누적하는 local state\"라는 네 구조체 역할 구분이 실제로 어떤 struct에 대응하는지, B_aggregate=160 bytes 계산이 맞는지 확인해야 합니다.\n\n해결: 네 struct가 정확히 이 역할로 정의돼 있고, SyncAggregate의 bits(committee size/8)+signature(96) 필드가 160 bytes 계산과 일치합니다.",
    annotations: [
      { lines: [14, 21], color: "sky", note: "article의 LightClientStore — 검증 통과 결과를 누적하는 local state" },
      { lines: [52, 55], color: "emerald", note: "article의 B_aggregate=512/8+96=160 bytes — bits(committee size bit-pack)+signature(BLS)" },
      { lines: [60, 68], color: "amber", note: "article의 Update — 검증 후보 메시지. Store에 반영되기 전까지는 candidate일 뿐" },
    ],
  },
};
