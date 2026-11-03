import type { CodeRef } from "@/components/code/types";
import nextCommitteeRaw from "./codebase/prysm/excerpts/next_committee_v7.go?raw";
import submitMessageRaw from "./codebase/prysm/excerpts/submit_sync_message_v7.go?raw";
import aggregatorSelectionRaw from "./codebase/prysm/excerpts/aggregator_selection_v7.go?raw";
import proposerAggregateRaw from "./codebase/prysm/excerpts/proposer_sync_aggregate_v7.go?raw";
import processAggregateRaw from "./codebase/prysm/excerpts/process_sync_aggregate_v7.go?raw";
import bootstrapRaw from "./codebase/consensus-specs/excerpts/light_client_bootstrap.py?raw";
import validateUpdateRaw from "./codebase/consensus-specs/excerpts/validate_light_client_update.py?raw";
import processUpdateRaw from "./codebase/consensus-specs/excerpts/process_light_client_update.py?raw";

export const syncCommitteeCodeRefs: Record<string, CodeRef> = {
  "next-sync-committee": {
    path: "beacon-chain/core/altair/sync_committee.go — NextSyncCommitteeIndices() · v7.3.1",
    lang: "go",
    code: nextCommitteeRaw,
    highlight: [1, 58],
    desc: "활성 validator를 shuffle하고 effective balance 가중 acceptance를 반복해 duplicate 가능한 committee positions를 채우는 실제 구현",
    annotations: [
      { lines: [2, 13], color: "sky", note: "다음 epoch의 활성 집합·seed·preset size 고정" },
      { lines: [21, 35], color: "amber", note: "후보를 제거하지 않고 position이 찰 때까지 순회" },
      { lines: [37, 53], color: "emerald", note: "Electra 이후 16-bit random value로 effective balance 가중 수락" },
    ],
  },
  "submit-sync-msg": {
    path: "validator/client/sync_committee.go — SubmitSyncCommitteeMessage() · v7.3.1",
    lang: "go",
    code: submitMessageRaw,
    highlight: [1, 78],
    desc: "현재 head root를 가져와 sync-committee domain의 signing root로 서명하고 SyncCommitteeMessage를 제출하는 전체 경로",
    annotations: [
      { lines: [6, 20], color: "sky", note: "유효 block 또는 due time을 기다린 뒤 서명할 root 요청" },
      { lines: [28, 38], color: "violet", note: "DomainSyncCommittee와 block root로 signing root 계산" },
      { lines: [40, 61], color: "emerald", note: "키 매니저 서명 뒤 slot·root·validator index·signature 구성" },
    ],
  },
  "sync-aggregator-selection": {
    path: "beacon-chain/core/altair/sync_committee.go — IsSyncCommitteeAggregator() · v7.3.1",
    lang: "go",
    code: aggregatorSelectionRaw,
    highlight: [1, 17],
    desc: "selection proof hash의 앞 8 bytes가 preset으로 계산한 modulo의 0 residue인지 확인",
    annotations: [
      { lines: [12, 14], color: "amber", note: "512 / 4 / 16 = modulo 8" },
      { lines: [15, 17], color: "emerald", note: "균등 hash라면 각 position의 선택 확률은 1/8" },
    ],
  },
  "proposer-sync-aggregate": {
    path: "beacon-chain/rpc/prysm/v1alpha1/validator/proposer_altair.go — getSyncAggregate() · v7.3.1",
    lang: "go",
    code: proposerAggregateRaw,
    highlight: [1, 97],
    desc: "다음 block proposer가 이전 slot·parent root에 맞는 contribution을 subnet별로 고르고 전체 bits와 signature로 합치는 구현",
    annotations: [
      { lines: [6, 17], color: "sky", note: "새 block의 previous slot과 parent root로 aggregate 요청" },
      { lines: [36, 47], color: "rose", note: "root가 다른 contribution 제거" },
      { lines: [57, 77], color: "amber", note: "subnet마다 dedupe 후 가장 많은 참여를 담은 contribution 선택" },
      { lines: [80, 96], color: "emerald", note: "네 local bit 구간과 서명을 최종 SyncAggregate로 결합" },
    ],
  },
  "process-sync-aggregate": {
    path: "beacon-chain/core/altair/block.go — ProcessSyncAggregate() · v7.3.1",
    lang: "go",
    code: processAggregateRaw,
    highlight: [1, 114],
    desc: "Block의 participant positions로 rewards를 적용하고 previous-slot root에 대한 BLS aggregate signature를 검증",
    annotations: [
      { lines: [5, 11], color: "violet", note: "참여 keys·reward 계산과 signature 검증을 분리" },
      { lines: [34, 87], color: "amber", note: "bit position별 validator를 찾아 참여·불참 delta 적용" },
      { lines: [91, 113], color: "emerald", note: "state slot의 previous slot root와 sync domain으로 FastAggregateVerify" },
    ],
  },
  "light-client-bootstrap": {
    path: "consensus-specs/specs/altair/light-client/sync-protocol.md — initialize_light_client_store() · aa16bb4c",
    lang: "python",
    code: bootstrapRaw,
    highlight: [1, 23],
    desc: "신뢰한 block root와 state-root Merkle branch에서 current sync committee를 고정하는 사양",
    annotations: [
      { lines: [4, 5], color: "rose", note: "bootstrap header root가 사용자가 신뢰한 root와 같아야 함" },
      { lines: [7, 12], color: "emerald", note: "current committee가 그 header state root에 실제로 포함됐는지 증명" },
    ],
  },
  "validate-light-client-update": {
    path: "consensus-specs/specs/altair/light-client/sync-protocol.md — validate_light_client_update() · aa16bb4c",
    lang: "python",
    code: validateUpdateRaw,
    highlight: [1, 84],
    desc: "Update의 slot·period·finality branch·next committee branch·aggregate signature를 모두 확인하는 사양",
    annotations: [
      { lines: [7, 20], color: "sky", note: "최소 참여와 signature/attested/finalized slot 순서 검사" },
      { lines: [30, 61], color: "amber", note: "finalized header와 next committee를 attested state root에 연결" },
      { lines: [63, 84], color: "emerald", note: "현재 또는 다음 committee의 set-bit pubkeys로 BLS signature 검증" },
    ],
  },
  "process-light-client-update": {
    path: "consensus-specs/specs/altair/light-client/sync-protocol.md — process_light_client_update() · aa16bb4c",
    lang: "python",
    code: processUpdateRaw,
    highlight: [1, 44],
    desc: "검증을 통과한 update도 참여 수준에 따라 optimistic 또는 finalized header를 다르게 전진시키는 사양",
    annotations: [
      { lines: [7, 17], color: "sky", note: "유효 update 중 best 후보와 최대 참여 수 추적" },
      { lines: [19, 24], color: "amber", note: "동적 safety threshold 초과 시 optimistic header 갱신" },
      { lines: [26, 44], color: "emerald", note: "2/3 참여와 finality 조건을 만족해야 finalized update 적용" },
    ],
  },
};
