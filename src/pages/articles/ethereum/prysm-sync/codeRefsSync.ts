import type { CodeRef } from "@/components/code/types";
import checkpointOriginRaw from "./codebase/prysm/beacon-chain/sync/checkpoint/api_checkpoint_v7.go?raw";
import roundRobinRaw from "./codebase/prysm/beacon-chain/sync/initial-sync/round_robin_v7.go?raw";
import queueOrderRaw from "./codebase/prysm/beacon-chain/sync/initial-sync/blocks_queue_order_v7.go?raw";
import receiverOwnerRaw from "./codebase/prysm/beacon-chain/sync/initial-sync/receiver_owner_v7.go?raw";
import serviceHandoffRaw from "./codebase/prysm/beacon-chain/sync/initial-sync/service_handoff_v7.go?raw";
import gossipGateRaw from "./codebase/prysm/beacon-chain/sync/validate_beacon_blocks_handoff_v7.go?raw";

export const syncCodeRefs: Record<string, CodeRef> = {
  "checkpoint-origin": {
    path: "beacon-chain/sync/checkpoint/api.go · APIInitializer.Initialize() · DownloadFinalizedData() · v7.3.1 excerpt",
    lang: "go",
    code: checkpointOriginRaw,
    highlight: [1, 68],
    desc: "Remote finalized state와 그 state의 latest block을 decode·pairing한 뒤 origin으로 저장합니다.",
    annotations: [
      { lines: [2, 14], color: "sky", note: "기존 origin이 없을 때만 remote state·block pair를 내려받아 SaveOrigin합니다." },
      { lines: [18, 30], color: "violet", note: "Finalized state bytes에서 fork를 감지하고 typed BeaconState로 decode합니다." },
      { lines: [32, 48], color: "amber", note: "State header가 가리키는 slot의 block을 받고 block·body root를 계산합니다." },
      { lines: [50, 57], color: "rose", note: "State header body root와 block body root가 다르면 fail-closed합니다." },
      { lines: [59, 67], color: "emerald", note: "검증한 bytes와 계산한 roots를 OriginData로 반환합니다." },
    ],
  },
  "two-phase-sync": {
    path: "beacon-chain/sync/initial-sync/round_robin.go · roundRobinSync() · v7.3.1 excerpt",
    lang: "go",
    code: roundRobinRaw,
    highlight: [1, 60],
    desc: "Finalized target까지 먼저 처리하고 current slot까지 두 번째 queue로 따라갑니다.",
    annotations: [
      { lines: [9, 12], color: "sky", note: "첫 단계는 connected peer 상태에서 얻은 finalized epoch를 목표로 합니다." },
      { lines: [14, 21], color: "emerald", note: "이미 current slot이면 끝내고, 아니면 non-finalized head 단계로 넘어갑니다." },
      { lines: [24, 44], color: "amber", note: "Finalized phase는 ordered data를 batch processing 경로로 보냅니다." },
      { lines: [47, 59], color: "violet", note: "두 번째 phase는 current slot을 목표로 regular-sync processing 경로를 사용합니다." },
    ],
  },
  "queue-state-machine": {
    path: "beacon-chain/sync/initial-sync/blocks_queue.go + fsm.go · v7.3.1 excerpts",
    lang: "go",
    code: queueOrderRaw,
    highlight: [1, 40],
    desc: "네 lookahead machine이 response를 scheduled에서 dataParsed로 옮기고 invalid peer evidence를 기록합니다.",
    annotations: [
      { lines: [1, 8], color: "sky", note: "Queue는 네 window를 미리 열고 현재 head보다 최대 32 slot 뒤에서 다시 확인합니다." },
      { lines: [11, 17], color: "violet", note: "각 range는 new·scheduled·dataParsed·skipped·sent 중 하나의 상태입니다." },
      { lines: [19, 30], color: "amber", note: "Scheduled machine만 typed response를 받을 수 있습니다." },
      { lines: [31, 38], color: "rose", note: "Invalid data는 peer downscore 근거가 되고 성공한 response만 dataParsed가 됩니다." },
    ],
  },
  "ordered-range-send": {
    path: "beacon-chain/sync/initial-sync/blocks_queue.go · onReadyToSendEvent() · v7.3.1 excerpt",
    lang: "go",
    code: queueOrderRaw,
    highlight: [42, 79],
    desc: "뒤 range가 먼저 준비돼도 앞 machine이 대기 중이면 consumer에게 보내지 않습니다.",
    annotations: [
      { lines: [43, 53], color: "sky", note: "DataParsed만 보낼 수 있고 block이 0개면 skipped로 분류합니다." },
      { lines: [55, 62], color: "emerald", note: "fetchedData channel에 전달한 뒤 queue state만 sent로 바뀝니다." },
      { lines: [64, 66], color: "amber", note: "가장 이른 range는 바로 consumer에게 보낼 수 있습니다." },
      { lines: [68, 75], color: "rose", note: "앞 range가 아직 new·scheduled·dataParsed면 뒤 range는 기다립니다." },
      { lines: [77, 77], color: "violet", note: "앞 range들이 진행된 뒤에만 다음 response를 전달합니다." },
    ],
  },
  "receiver-owner": {
    path: "beacon-chain/sync/initial-sync/round_robin.go · processFetchedData() · processBlock() · v7.3.1 excerpts",
    lang: "go",
    code: receiverOwnerRaw,
    highlight: [1, 27],
    desc: "Queue consumer가 blockchain receiver를 호출하며 parent 부재면 chain processing 전에 멈춥니다.",
    annotations: [
      { lines: [1, 10], color: "sky", note: "Finalized phase batch는 Chain.ReceiveBlockBatch를 실제 receiver로 넘깁니다." },
      { lines: [13, 22], color: "violet", note: "개별 block 경로는 block root와 진행 상태를 준비합니다." },
      { lines: [23, 24], color: "rose", note: "Parent가 local chain에 없으면 receiver를 호출하지 않습니다." },
      { lines: [26, 26], color: "emerald", note: "검증·transition·저장은 전달받은 blockchain receiver의 책임입니다." },
    ],
  },
  "initial-sync-handoff": {
    path: "beacon-chain/sync/initial-sync/service.go · Start() · markSynced() · v7.3.1 excerpt",
    lang: "go",
    code: serviceHandoffRaw,
    highlight: [1, 33],
    desc: "Current head까지 round-robin sync가 끝난 뒤 synced flag와 completion channel을 한 방향으로 전환합니다.",
    annotations: [
      { lines: [3, 8], color: "sky", note: "이미 current slot에 도달했으면 바로 완료 상태로 전환합니다." },
      { lines: [10, 19], color: "amber", note: "최소 peer와 checkpoint-origin sidecar가 준비돼야 range sync를 시작합니다." },
      { lines: [20, 27], color: "violet", note: "두 단계 roundRobinSync가 끝난 뒤에만 markSynced를 호출합니다." },
      { lines: [30, 32], color: "emerald", note: "Atomic bool을 true로 만들고 InitialSyncComplete channel을 닫습니다." },
    ],
  },
  "gossip-sync-gate": {
    path: "beacon-chain/sync/validate_beacon_blocks.go · validateBeaconBlockPubSub() · v7.3.1 excerpt",
    lang: "go",
    code: gossipGateRaw,
    highlight: [4, 18],
    desc: "Initial sync가 진행 중이면 remote gossip block을 처리하지 않고 Ignore합니다.",
    annotations: [
      { lines: [8, 10], color: "sky", note: "자기 자신이 publish한 message는 별도 fast path로 accept합니다." },
      { lines: [12, 15], color: "rose", note: "Remote block은 Syncing이 true인 동안 ValidationIgnore입니다." },
      { lines: [17, 18], color: "emerald", note: "Initial sync 완료 뒤에야 일반 block validation 경로가 이어집니다." },
    ],
  },
};
