import type { CodeRef } from "@/components/code/types";
import kvRaw from "./codebase/prysm/beacon-chain/db/kv/kv.go?raw";
import blocksRaw from "./codebase/prysm/beacon-chain/db/kv/blocks.go?raw";
import stateRaw from "./codebase/prysm/beacon-chain/db/kv/state.go?raw";
import checkpointRaw from "./codebase/prysm/beacon-chain/db/kv/checkpoint.go?raw";

export const beaconDBCodeRefs: Record<string, CodeRef> = {
  "kv-store": {
    path: "beacon-chain/db/kv/kv.go · Store와 Buckets · Prysm v7.3.1",
    lang: "go",
    code: kvRaw,
    highlight: [5, 37],
    desc: "Store가 가진 bbolt DB·cache와 primary/index/checkpoint bucket 목록",
    annotations: [
      { lines: [5, 16], color: "sky", note: "DB와 process-local cache는 서로 다른 상태입니다." },
      { lines: [18, 37], color: "emerald", note: "원본·checkpoint·index가 서로 다른 bucket에 있습니다." },
    ],
  },
  "prepare-block-batch": {
    path: "beacon-chain/db/kv/blocks.go · prepareBlockBatch · Prysm v7.3.1",
    lang: "go",
    code: blocksRaw,
    highlight: [12, 35],
    desc: "Root·slot/parent index·encoded bytes를 write transaction 전에 계산",
    annotations: [
      { lines: [15, 16], color: "sky", note: "Root와 두 secondary index 값을 먼저 만듭니다." },
      { lines: [28, 32], color: "emerald", note: "Block encode도 transaction 밖에서 끝냅니다." },
    ],
  },
  "save-block-batch": {
    path: "beacon-chain/db/kv/blocks.go · SaveROBlocks · Prysm v7.3.1",
    lang: "go",
    code: blocksRaw,
    highlight: [38, 74],
    desc: "Block primary와 slot·parent index를 한 db.Update에서 갱신",
    annotations: [
      { lines: [44, 48], color: "sky", note: "비싼 준비 작업이 끝난 뒤 write transaction을 엽니다." },
      { lines: [50, 62], color: "emerald", note: "Primary Put과 index 갱신은 같은 callback 안에 있습니다." },
      { lines: [66, 73], color: "amber", note: "Cache loop는 db.Update 호출이 돌아온 뒤 실행됩니다." },
    ],
  },
  "read-block-roots-by-slot": {
    path: "beacon-chain/db/kv/blocks.go · BlockRootsBySlot · Prysm v7.3.1",
    lang: "go",
    code: blocksRaw,
    highlight: [85, 98],
    desc: "한 read transaction에서 slot index의 root 목록 조회",
    annotations: [
      { lines: [90, 94], color: "sky", note: "db.View가 조회 snapshot 경계를 만듭니다." },
      { lines: [98, 98], color: "emerald", note: "반환형은 단일 root가 아니라 root slice입니다." },
    ],
  },
  "save-states": {
    path: "beacon-chain/db/kv/state.go · SaveStates · Prysm v7.3.1",
    lang: "go",
    code: stateRaw,
    highlight: [4, 33],
    desc: "State bytes와 state slot index를 block 저장과 다른 db.Update에서 갱신",
    annotations: [
      { lines: [11, 17], color: "sky", note: "State encode는 transaction 전에 수행합니다." },
      { lines: [19, 29], color: "emerald", note: "State 전용 transaction이 index와 bytes를 함께 씁니다." },
    ],
  },
  "save-finalized-checkpoint": {
    path: "beacon-chain/db/kv/checkpoint.go · SaveFinalizedCheckpoint · Prysm v7.3.1",
    lang: "go",
    code: checkpointRaw,
    highlight: [4, 31],
    desc: "Finalized checkpoint와 finalized-root index를 별도 db.Update에서 갱신",
    annotations: [
      { lines: [13, 14], color: "sky", note: "먼저 state 또는 summary 존재 여부를 확인합니다." },
      { lines: [15, 28], color: "emerald", note: "Checkpoint와 finalized roots는 이 함수의 transaction에 묶입니다." },
    ],
  },
  "delete-history": {
    path: "beacon-chain/db/kv/blocks.go · DeleteHistoricalDataBeforeSlot · Prysm v7.3.1",
    lang: "go",
    code: blocksRaw,
    highlight: [101, 170],
    desc: "Cutoff 이전 block·state·summary·index를 한 pruning transaction에서 삭제",
    annotations: [
      { lines: [103, 107], color: "sky", note: "대상 slot/root는 먼저 read-only 경로에서 수집합니다." },
      { lines: [110, 135], color: "emerald", note: "선택한 record의 원본과 관련 metadata를 한 callback에서 지웁니다." },
      { lines: [136, 138], color: "amber", note: "Payload envelope는 다른 key를 써 별도 pruning이 필요합니다." },
    ],
  },
};
