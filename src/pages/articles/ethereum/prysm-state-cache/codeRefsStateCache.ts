import type { CodeRef } from "@/components/code/types";
import hotCacheRaw from "./codebase/prysm/beacon-chain/state/stategen/hot_state_cache.go?raw";
import epochCacheRaw from "./codebase/prysm/beacon-chain/state/stategen/epoch_boundary_state_cache.go?raw";
import getterRaw from "./codebase/prysm/beacon-chain/state/stategen/getter.go?raw";
import replayRaw from "./codebase/prysm/beacon-chain/state/stategen/replay.go?raw";
import setterRaw from "./codebase/prysm/beacon-chain/state/stategen/setter.go?raw";
import ancestryRaw from "./codebase/prysm/beacon-chain/db/kv/blocks.go?raw";
import transitionRaw from "./codebase/prysm/beacon-chain/core/transition/transition_no_verify_sig.go?raw";

export const stateCacheCodeRefs: Record<string, CodeRef> = {
  "lookup-ladder": {
    path: "beacon-chain/state/stategen/getter.go — loadStateByRoot()",
    lang: "go",
    code: getterRaw,
    highlight: [4, 18],
    desc: "목표 block root를 hot cache, epoch-boundary cache, DB·replay 순서로 찾습니다.",
    annotations: [
      { lines: [8, 10], color: "sky", note: "Hot LRU hit는 Copy를 반환합니다." },
      { lines: [11, 17], color: "emerald", note: "Epoch-boundary FIFO도 copied state를 반환합니다." },
      { lines: [18, 18], color: "amber", note: "두 cache가 miss면 DB 또는 replay로 넘어갑니다." },
    ],
  },
  "db-or-replay": {
    path: "beacon-chain/state/stategen/getter.go — loadStateByRootFromDBOrReplay()",
    lang: "go",
    code: getterRaw,
    highlight: [21, 46],
    desc: "직접 저장 state가 없으면 목표 summary, 가장 가까운 ancestor state와 ancestry block을 조합합니다.",
    annotations: [
      { lines: [25, 29], color: "sky", note: "Full state가 DB에 있으면 replay하지 않습니다." },
      { lines: [31, 38], color: "emerald", note: "Summary는 목표 slot을, latestAncestor는 시작 state를 구합니다." },
      { lines: [39, 45], color: "amber", note: "같은 branch의 block을 불러 replay합니다." },
    ],
  },
  "summary-and-ancestor": {
    path: "beacon-chain/state/stategen/getter.go — recoverStateSummary() · latestAncestor()",
    lang: "go",
    code: getterRaw,
    highlight: [48, 92],
    desc: "Summary의 실제 두 field와 parent-root 기반 ancestor 탐색을 분리해서 보여줍니다.",
    annotations: [
      { lines: [57, 61], color: "sky", note: "Summary는 target block의 Slot·Root만 저장합니다." },
      { lines: [74, 86], color: "emerald", note: "Anchor는 parent root를 따라가며 cache와 DB에서 따로 찾습니다." },
      { lines: [87, 90], color: "amber", note: "State가 없으면 parent block을 읽어 계속 거슬러 갑니다." },
    ],
  },
  "hot-copy-boundary": {
    path: "beacon-chain/state/stategen/hot_state_cache.go — get() · getWithoutCopy() · put()",
    lang: "go",
    code: hotCacheRaw,
    highlight: [4, 32],
    desc: "Hot cache는 block root를 key로 쓰며 일반 get만 Copy를 호출합니다.",
    annotations: [
      { lines: [4, 4], color: "sky", note: "v7.3.1의 hot LRU 최대 entry 수는 32입니다." },
      { lines: [7, 15], color: "emerald", note: "일반 조회는 cached state를 복사합니다." },
      { lines: [18, 25], color: "amber", note: "NoCopy는 동일 object를 read-only 용도로 노출합니다." },
      { lines: [28, 31], color: "rose", note: "put 자체는 Copy를 호출하지 않습니다." },
    ],
  },
  "epoch-cache": {
    path: "beacon-chain/state/stategen/epoch_boundary_state_cache.go — copied FIFO",
    lang: "go",
    code: epochCacheRaw,
    highlight: [4, 30],
    desc: "Epoch-boundary cache는 최대 8개 FIFO이며 put과 일반 get 양쪽에서 Copy합니다.",
    annotations: [
      { lines: [4, 4], color: "sky", note: "최대 8개의 epoch-boundary entry입니다." },
      { lines: [7, 16], color: "emerald", note: "일반 root 조회는 Copy를 반환합니다." },
      { lines: [19, 29], color: "amber", note: "Put도 Copy한 state를 넣고 FIFO를 trim합니다." },
    ],
  },
  "ancestry-order": {
    path: "beacon-chain/db/kv/blocks.go — blocksAncestryQuery()",
    lang: "go",
    code: ancestryRaw,
    highlight: [14, 48],
    desc: "Descendent에서 parent로 거슬러 모은 block 목록을 마지막에 뒤집어 replay 순서로 반환합니다.",
    annotations: [
      { lines: [19, 38], color: "sky", note: "Descendent부터 parent chain을 역방향으로 수집합니다." },
      { lines: [46, 47], color: "emerald", note: "반환 직전 과거→현재 순서로 뒤집습니다." },
    ],
  },
  "replay": {
    path: "beacon-chain/state/stategen/replay.go — replayBlocks() · executeStateTransitionStateGen()",
    lang: "go",
    code: replayRaw,
    highlight: [4, 49],
    desc: "각 저장 block의 slot까지 빈 slot transition을 먼저 적용하고 block transition을 실행합니다.",
    annotations: [
      { lines: [10, 23], color: "sky", note: "Block 배열을 과거→현재 순서로 소비합니다." },
      { lines: [31, 36], color: "emerald", note: "Ancestry query는 target root와 slot 범위를 함께 고정합니다." },
      { lines: [44, 48], color: "amber", note: "ProcessSlots 뒤 ProcessBlockForStateRoot를 호출합니다." },
    ],
  },
  "save-boundary": {
    path: "beacon-chain/state/stategen/setter.go — saveStateByRoot()",
    lang: "go",
    code: setterRaw,
    highlight: [4, 25],
    desc: "Epoch cache, persistent summary, hot cache가 어떤 순서로 갱신되는지 보여줍니다.",
    annotations: [
      { lines: [9, 13], color: "sky", note: "Epoch 시작 state는 먼저 copied FIFO에 들어갑니다." },
      { lines: [15, 20], color: "emerald", note: "Summary 저장이 성공해야 다음 단계로 갑니다." },
      { lines: [22, 24], color: "amber", note: "Hot put은 object를 다시 Copy하지 않습니다." },
    ],
  },
  "replay-trust": {
    path: "beacon-chain/core/transition/transition_no_verify_sig.go — ProcessBlockForStateRoot()",
    lang: "go",
    code: transitionRaw,
    highlight: [4, 26],
    desc: "State generation이 사용하는 block transition은 stored·verified block을 전제로 일부 검증을 반복하지 않습니다.",
    annotations: [
      { lines: [16, 18], color: "sky", note: "Header handler도 NoVerify 경로입니다." },
      { lines: [23, 26], color: "amber", note: "Signature와 post-state root 비교가 이 함수에는 없습니다." },
    ],
  },
};
