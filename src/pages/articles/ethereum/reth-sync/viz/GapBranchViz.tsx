import type { ReactNode } from "react";
import SyncSceneShell from "./SyncSceneShell";

/**
 * 본문 대응: #short-gap · #backfill-sync · #live-sync — 부모가 빈 target을 받은 뒤의 갈림길.
 * 거리(missing parent ↔ canonical tip)를 활성 설정의 threshold와 비교한다.
 * 짧으면 block_range 또는 한 block씩, 크고 target이 저장소에 없으면 backfill.
 * Backfill이 끝나면 간격을 다시 재고 같은 갈림길로 돌아온다. threshold 값은 글이 정하지 않으므로 숫자로 그리지 않는다.
 */
type NodeId = "start" | "judge" | "range" | "single" | "tree" | "bf-start" | "pending" | "active" | "finished";

const SCENES = [
  {
    label: "갈림길",
    summary: "거리 ↔ threshold 비교",
    active: ["start", "judge"],
    note: "거리는 missing parent와 현재 canonical tip 사이에서 잽니다(사례: 1,008을 받았고 1,001–1,007이 없음). threshold 값은 글이 정하지 않아 사례만으로 길이 정해지지 않습니다.",
  },
  {
    label: "짧은 연속 구간",
    summary: "DownloadRequest::block_range",
    active: ["judge", "range"],
    note: "거리가 threshold보다 짧고 높이로 연속 범위를 정할 수 있으면, 비어 있는 연속 부모를 범위 요청으로 가져옵니다.",
  },
  {
    label: "Side branch",
    summary: "한 block씩 요청",
    active: ["judge", "single"],
    note: "거리는 짧아도 side branch(canonical chain에서 갈라진 다른 가지)처럼 높이만으로 연속 범위를 정할 수 없으면 한 block씩 요청합니다.",
  },
  {
    label: "받은 뒤 검증",
    summary: "다운로드 완료 ≠ canonical",
    active: ["range", "single", "tree"],
    note: "받은 block은 곧바로 canonical이 되지 않습니다. Engine tree가 검증해 부모에서 이어지는 유효한 chain을 만들었을 때만 forkchoice head를 canonical로 바꿉니다.",
  },
  {
    label: "큰 구간",
    summary: "BackfillAction::Start",
    active: ["judge", "bf-start"],
    note: "Engine tree가 BackfillAction::Start(PipelineTarget::Sync)를 내보내면 chain orchestrator가 PipelineSync에 전달하고, 시작·종료 event를 다시 알려 줍니다.",
  },
  {
    label: "기다린 뒤 재확인",
    summary: "Pending · 필요하면 PendingRevalidation",
    active: ["bf-start", "pending"],
    note: "Persistence나 payload build가 DB view를 쓰는 중이면 PendingRevalidation에서 기다린 뒤 target을 다시 확인합니다. 그동안 head가 바뀌었을 수 있기 때문입니다.",
  },
  {
    label: "Pipeline 단독 writer",
    summary: "forkchoiceUpdated → SYNCING · newPayload → buffer",
    active: ["pending", "active"],
    note: "Active 동안 새 forkchoiceUpdated에는 SYNCING으로 답하고 최신 target·finalized hash만 전달하며, 새 newPayload는 buffer에 둡니다. 두 경로가 같은 state를 동시에 쓰지 않게 합니다.",
  },
  {
    label: "끝난 뒤 다시 갈림길",
    summary: "크면 backfill 한 번 더 · 작으면 range",
    active: ["finished", "judge", "bf-start", "range"],
    note: "끝나면 완료 높이의 hash로 tree와 persistence head를 맞춥니다. 그동안 target이 앞으로 갔다면 간격을 다시 재서, 크면 backfill을 한 번 더, 작으면 남은 range를 받아 buffered child를 연결합니다.",
  },
] as const satisfies ReadonlyArray<{ label: string; summary: string; active: readonly NodeId[]; note: string }>;

const NODE_TEXT: Record<NodeId, { eyebrow: string; title: string; detail: string }> = {
  start: { eyebrow: "입력", title: "부모가 빈 target 수신", detail: "받은 block의 부모가 로컬에 없음" },
  judge: { eyebrow: "판단", title: "거리 vs threshold", detail: "missing parent ↔ canonical tip 거리 · threshold는 활성 설정값" },
  range: { eyebrow: "연속 범위", title: "block_range 요청", detail: "높이로 연속 부모를 정할 수 있을 때" },
  single: { eyebrow: "높이로 못 정함", title: "한 block씩 요청", detail: "side branch처럼 범위를 정할 수 없을 때" },
  tree: { eyebrow: "검증", title: "engine tree 실행·검증", detail: "유효한 chain일 때만 head를 canonical로" },
  "bf-start": { eyebrow: "시작", title: "BackfillAction::Start", detail: "orchestrator → PipelineSync" },
  pending: { eyebrow: "Pending", title: "writer 전환 대기", detail: "DB view 사용 중이면 끝난 뒤 target 재확인" },
  active: { eyebrow: "Active", title: "pipeline 단독 writer", detail: "forkchoiceUpdated → SYNCING · newPayload → buffer" },
  finished: { eyebrow: "Finished → Idle", title: "저장 head 맞춤", detail: "새 간격을 다시 판단" },
};

function Node({ id, on }: { id: NodeId; on: boolean }) {
  const text = NODE_TEXT[id];
  return (
    <div
      data-gap-node={id}
      className={`min-w-0 rounded-lg border bg-background px-2 py-1.5 transition-opacity duration-300 motion-reduce:transition-none sm:px-2.5 ${
        on ? "border-primary ring-1 ring-inset ring-primary" : "border-border opacity-40"
      }`}
    >
      <span className="block font-mono text-[9px] font-black leading-3 text-primary">{text.eyebrow}</span>
      <strong className="mt-0.5 block break-keep text-[11px] leading-4">{text.title}</strong>
      <span className="mt-0.5 hidden break-keep text-[10px] leading-[0.875rem] text-muted-foreground sm:block">{text.detail}</span>
    </div>
  );
}

function Lane({ label, on, loop, children }: { label: string; on: boolean; loop?: boolean; children: ReactNode }) {
  return (
    <div className={`min-w-0 border-l-2 pl-2 sm:pl-3 ${on ? "border-primary" : "border-border"}`}>
      <span className={`mb-1 block break-keep text-[10px] font-bold leading-4 ${on ? "text-foreground" : "text-muted-foreground/60"}`}>{label}</span>
      {children}
      {loop !== undefined ? (
        <span aria-hidden={!loop} className={`mt-1 block break-keep text-[10px] font-bold leading-4 text-primary ${loop ? "" : "invisible"}`}>
          ↺ Finished 뒤 다시 &lsquo;거리 vs threshold&rsquo; 판단으로 돌아갑니다
        </span>
      ) : null}
    </div>
  );
}

export default function GapBranchViz() {
  return (
    <SyncSceneShell
      eyebrow="갈림길 · 다운로드와 backfill"
      title="누락 거리 하나가 다운로드 길과 backfill 길을 가릅니다"
      description="칸 하나가 판단 또는 작업 하나입니다(수신은 downloader, 시작 전달은 orchestrator, Active는 pipeline 몫). 위 줄은 threshold보다 짧은 구간, 아래 줄은 threshold를 넘고 target이 저장소에 없는 구간입니다. threshold는 활성 설정값이라 그림에 숫자로 적지 않았습니다."
      note="Reth v2.8.1 기준 글의 설명을 그대로 옮겼습니다. 블록 번호는 글의 설명용 사례입니다."
      ariaLabel="누락 거리를 threshold와 비교해 block range 다운로드, 한 block씩 요청, backfill pipeline으로 갈라지고 backfill 뒤 다시 판단하는 여덟 장면"
      scenes={SCENES}
      render={(activeIndex) => {
        const on = new Set<NodeId>(SCENES[activeIndex].active);
        const leftOn = on.has("range") || on.has("single") || on.has("tree");
        const rightOn = on.has("bf-start") || on.has("pending") || on.has("active") || on.has("finished");
        const loop = activeIndex === SCENES.length - 1;
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Node id="start" on={on.has("start")} />
              <Node id="judge" on={on.has("judge")} />
            </div>
            <Lane label="↓ threshold보다 짧음" on={leftOn}>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                <Node id="range" on={on.has("range")} />
                <Node id="single" on={on.has("single")} />
                <div className="col-span-2 sm:col-span-1">
                  <Node id="tree" on={on.has("tree")} />
                </div>
              </div>
            </Lane>
            <Lane label="↓ threshold를 넘고 target이 저장소에 없음" on={rightOn} loop={loop}>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                <Node id="bf-start" on={on.has("bf-start")} />
                <Node id="pending" on={on.has("pending")} />
                <Node id="active" on={on.has("active")} />
                <Node id="finished" on={on.has("finished")} />
              </div>
            </Lane>
          </div>
        );
      }}
    />
  );
}
