import type { CodeRef } from "@/components/code/types";
import transitionRaw from "./codebase/prysm/beacon-chain/core/transition/transition.go?raw";
import skipSlotCacheRaw from "./codebase/prysm/beacon-chain/core/transition/skip_slot_cache.go?raw";
import skipSlotCacheTestRaw from "./codebase/prysm/beacon-chain/core/transition/skip_slot_cache_test.go?raw";

export const slotCodeRefs: Record<string, CodeRef> = {
  "process-slot": {
    path: "beacon-chain/core/transition/transition.go — 실제 ProcessSlot() 발췌 · v7.3.1",
    lang: "go",
    code: transitionRaw,
    highlight: [19, 70],
    desc: "현재 state root, zero-header backfill, header root와 Gloas availability를 순서대로 갱신합니다.",
    annotations: [
      { lines: [24, 33], color: "sky", note: "현재 state root를 계산해 current slot의 ring index에 기록" },
      { lines: [35, 43], color: "emerald", note: "Latest header state root가 zero일 때만 previous state root로 backfill" },
      { lines: [44, 55], color: "amber", note: "Backfill 뒤 header root를 계산해 같은 index의 block root로 기록" },
      { lines: [57, 67], color: "violet", note: "Gloas가 활성화된 state에서만 다음 payload availability를 초기화" },
    ],
  },
  "process-slots-core": {
    path: "beacon-chain/core/transition/transition.go — 실제 ProcessSlotsCore()·ProcessEpoch() 발췌 · v7.3.1",
    lang: "go",
    code: transitionRaw,
    highlight: [142, 210],
    desc: "Per-slot root 기록, epoch guard, slot 증가, fork upgrade를 target까지 반복합니다.",
    annotations: [
      { lines: [151, 155], color: "sky", note: "현재 slot의 roots를 먼저 기록" },
      { lines: [157, 161], color: "emerald", note: "Wrapper가 epoch 경계일 때만 fork별 transition을 실행" },
      { lines: [163, 166], color: "amber", note: "Protocol clock을 한 칸 증가" },
      { lines: [168, 174], color: "violet", note: "증가한 slot에서 활성화되는 fork schema로 upgrade" },
      { lines: [180, 209], color: "rose", note: "CanProcessEpoch guard와 state version이 실제 epoch 함수 선택을 결정" },
    ],
  },
  "skip-slot-cache": {
    path: "transition/cache skip_slot_cache.go — 실제 함수 발췌 · v7.3.1",
    lang: "go",
    code: skipSlotCacheRaw,
    highlight: [6, 123],
    desc: "Start slot과 latest header root를 섞은 key, LRU 8, copy-on-read/write를 확인합니다.",
    annotations: [
      { lines: [12, 25], color: "sky", note: "같은 slot의 서로 다른 fork가 같은 key를 쓰지 않도록 header root를 포함" },
      { lines: [29, 43], color: "emerald", note: "Process-local LRU 8과 in-progress map" },
      { lines: [45, 92], color: "amber", note: "동일 key 계산이 끝날 때까지 backoff하며 기다리고 hit에서는 state copy를 반환" },
      { lines: [94, 114], color: "rose", note: "동일 key 계산의 진행 상태를 메모리에서 조정" },
      { lines: [116, 123], color: "violet", note: "Cache 원본이 caller mutation에 노출되지 않도록 copy를 저장" },
    ],
  },
  "skip-slot-cache-test": {
    path: "beacon-chain/core/transition/skip_slot_cache_test.go — 실제 테스트 발췌 · v7.3.1",
    lang: "go",
    code: skipSlotCacheTestRaw,
    highlight: [5, 155],
    desc: "Cached transition parity와 같은 slot에서 갈라진 두 fork의 root 격리를 검사합니다.",
    annotations: [
      { lines: [17, 31], color: "emerald", note: "빈 cache 경로와 cache 재사용 경로의 최종 state가 같아야 함" },
      { lines: [56, 94], color: "sky", note: "같은 slot이지만 root가 다른 두 starting fork 준비" },
      { lines: [108, 129], color: "amber", note: "각 fork의 expected future root를 별도로 계산" },
      { lines: [131, 155], color: "violet", note: "동시 호출에서도 각 starting fork의 result가 섞이지 않아야 함" },
    ],
  },
};
