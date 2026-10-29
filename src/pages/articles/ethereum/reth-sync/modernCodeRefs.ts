import type { CodeRef } from "@/components/code/types";
import enginePath from "./codebase/reth-v2.8.1/engine-path.rs?raw";
import backfillControl from "./codebase/reth-v2.8.1/backfill-control.rs?raw";
import pipeline from "./codebase/reth-v2.8.1/pipeline.rs?raw";

export const RETH_SYNC_PROJECT_META = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · d763342f",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
} as const;

export const rethSyncCodeRefs: Record<string, CodeRef> = {
  "engine-path": {
    path: "reth-v2.8.1/crates/engine/tree/src/tree/mod.rs",
    lang: "rust",
    highlight: [4, 77],
    desc: "모르는 forkchoice head를 SYNCING으로 응답하고 작은 다운로드와 backfill로 나누는 실제 분기",
    annotations: [
      { lines: [9, 18], color: "sky", note: "이미 가진 canonical·fork를 먼저 처리하고 마지막에만 sync를 시작" },
      { lines: [35, 45], color: "amber", note: "모르는 head에는 SYNCING과 DownloadRequest를 함께 반환" },
      { lines: [55, 64], color: "rose", note: "큰 간격이면 BackfillAction::Start" },
      { lines: [66, 77], color: "emerald", note: "짧은 간격이면 부모 block range를 계속 다운로드" },
    ],
    code: enginePath,
  },
  "backfill-control": {
    path: "reth-v2.8.1/crates/engine/tree/src/backfill.rs + tree/mod.rs",
    lang: "rust",
    highlight: [4, 61],
    desc: "Backfill 상태와 live writer를 동시에 열지 않는 제어 경계",
    annotations: [
      { lines: [4, 13], color: "sky", note: "Idle·Pending·PendingRevalidation·Active의 명시적 상태" },
      { lines: [25, 40], color: "amber", note: "Pipeline이 실행 중이면 최신 목표만 전달하고 FCU에는 SYNCING" },
      { lines: [44, 52], color: "emerald", note: "Idle에서만 payload를 실행하고 아니면 buffer" },
      { lines: [56, 61], color: "rose", note: "Start 전 Pending으로 전환해 이중 writer 차단" },
    ],
    code: backfillControl,
  },
  pipeline: {
    path: "reth-v2.8.1/crates/stages/api/src/pipeline/mod.rs",
    lang: "rust",
    highlight: [4, 72],
    desc: "Stage를 순서대로 실행하고 검증 실패 시 역순으로 unwind하는 pipeline",
    annotations: [
      { lines: [11, 18], color: "sky", note: "각 stage를 앞 checkpoint에 이어 실행" },
      { lines: [20, 32], color: "rose", note: "Unwind 요청이 나오면 전체 pipeline을 안전 지점으로 복구" },
      { lines: [47, 48], color: "amber", note: "Stage 실행 순서의 반대로 되돌림" },
      { lines: [57, 68], color: "emerald", note: "Stage output과 checkpoint를 함께 후퇴" },
    ],
    code: pipeline,
  },
};
