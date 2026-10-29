import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "FCU", "자료 찾기", "짧은 구간", "Backfill", "검증 실패", "Live 복귀", "알림 경계"] as const;

const NOTES = [
  "CL의 forkchoice, Engine API, engine tree, downloader, backfill pipeline과 저장소를 먼저 한 장에 놓습니다. 핵심은 같은 canonical state를 전진시키는 writer가 한 시점에 하나뿐이라는 점입니다.",
  "CL이 로컬에 없는 head를 forkchoiceUpdated로 보내면 engine tree는 VALID로 가장하지 않고 SYNCING을 반환합니다. 요청의 head·safe·finalized는 다음 자료 수집과 검증의 목표로 남습니다.",
  "Engine tree가 모르는 head 또는 부모 hash를 DownloadRequest로 내보내면 P2P downloader가 block 한 개나 연속 범위를 가져옵니다. 받은 bytes는 아직 canonical state가 아닙니다.",
  "누락 구간이 backfill 기준보다 짧으면 downloader가 받은 부모부터 engine tree가 실행·검증합니다. Head까지 연결되면 forkchoice를 적용하고 in-memory canonical state를 전진시킵니다.",
  "구간이 크면 BackfillAction::Start가 staged pipeline을 시작합니다. Pipeline이 DB write lock을 가진 동안 live newPayload는 실행하지 않고 buffer에 두며, forkchoiceUpdated에는 SYNCING으로 답합니다.",
  "Stage가 잘못된 block이나 root 불일치를 찾으면 pipeline은 뒤 stage부터 역순으로 checkpoint를 되돌립니다. 내려받은 높이보다 실행·검증 checkpoint가 뒤에 있으면 전체 완료로 보고하지 않습니다.",
  "Pipeline이 target까지 끝나면 저장된 head와 persistence 경계를 다시 맞춥니다. 남은 짧은 구간을 내려받아 buffered block을 연결하고, 그 뒤 engine tree가 live writer로 돌아갑니다.",
  "Canonical commit·reorg 알림은 이후 ExEx 소비자에게 전달할 수 있습니다. 이 알림은 sync를 수행하지 않으며, 외부 인덱서의 checkpoint와 재처리는 별도 책임입니다.",
] as const;

const NODES = [
  { id: "cl", layer: "입력", title: "Consensus client", detail: "forkchoiceUpdated · newPayload" },
  { id: "api", layer: "경계", title: "Engine API handler", detail: "요청 순서 · PayloadStatus" },
  { id: "tree", layer: "제어", title: "Engine tree", detail: "gap 판단 · live 실행 · buffer" },
  { id: "downloader", layer: "자료", title: "P2P downloader", detail: "block set · block range" },
  { id: "orchestrator", layer: "제어", title: "Chain orchestrator", detail: "backfill 단독 실행" },
  { id: "pipeline", layer: "실행", title: "Staged pipeline", detail: "stage · checkpoint · unwind" },
  { id: "store", layer: "상태", title: "Provider · storage", detail: "검증된 canonical prefix" },
  { id: "exex", layer: "소비", title: "ExEx consumer", detail: "commit · reorg 알림" },
] as const;

const ACTIVE: ReadonlyArray<readonly string[]> = [
  NODES.map((node) => node.id),
  ["cl", "api", "tree"],
  ["tree", "downloader"],
  ["downloader", "tree", "store"],
  ["tree", "orchestrator", "pipeline", "store"],
  ["pipeline", "store"],
  ["pipeline", "store", "tree"],
  ["tree", "store", "exex"],
];

const STATE = [
  ["writer", "engine tree 또는 pipeline 중 하나"],
  ["응답", "SYNCING · 목표 forkchoice 보관"],
  ["출력", "DownloadRequest · bytes는 미검증"],
  ["writer", "engine tree · 짧은 구간 연결"],
  ["writer", "pipeline · live payload는 buffer"],
  ["복구", "reverse unwind · checkpoint 후퇴"],
  ["handoff", "persisted head → live writer"],
  ["경계", "canonical 결과 → downstream"],
] as const;

function FlowRail({ active }: { active: number }) {
  return (
    <div className="grid grid-cols-8 gap-px bg-border p-px" aria-label="Reth 동기화의 여덟 장면">
      {SCENES.map((scene, index) => (
        <div key={scene} className={`min-w-0 bg-background px-0.5 py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
          <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
          <strong className="mt-1 hidden break-keep text-[8px] leading-3 sm:block lg:text-[9px]">{scene}</strong>
        </div>
      ))}
    </div>
  );
}

function Architecture({ active }: { active: number }) {
  const activeIds = new Set(ACTIVE[active]);
  return (
    <div className="mt-2 grid grid-cols-2 gap-px bg-border p-px sm:mt-3 lg:grid-cols-4" aria-label="Consensus client에서 저장소와 ExEx까지 이어지는 구성요소">
      {NODES.map((node) => {
        const selected = activeIds.has(node.id);
        return (
          <div
            key={node.id}
            className={`min-w-0 bg-background p-3 sm:block sm:p-4 ${selected ? "ring-2 ring-inset ring-primary" : "hidden opacity-55"}`}
          >
            <span className="font-mono text-[9px] font-black text-primary">{node.layer}</span>
            <strong className="mt-1 block break-keep text-xs sm:text-sm">{node.title}</strong>
            <span className="mt-1.5 block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">{node.detail}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function RethSyncFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame
      eyebrow="개념 경로 · 모르는 head 한 건"
      title="자료를 찾는 경로와 canonical state를 쓰는 경로를 분리합니다"
      description="CL이 보낸 head의 부모가 없을 때 SYNCING에서 시작해 짧은 다운로드 또는 backfill을 거쳐 live 실행으로 돌아오는 과정을 추적합니다."
      note="Reth v2.8.1 commit d763342f의 engine tree·backfill·pipeline 경계를 기준으로 구성했습니다. 처리량과 소요 시간은 대상 환경에서 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-sync-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth가 모르는 forkchoice head를 다운로드하거나 backfill한 뒤 live 실행으로 복귀하는 여덟 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <FlowRail active={active} />
        <Architecture active={active} />
        <div className="mt-2 grid grid-cols-[0.7fr_1.3fr] gap-px bg-border p-px sm:mt-3">
          <div className="min-w-0 bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-w-0 bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">상태 영수증</span>
            <strong className="mt-1 block break-keep text-xs text-primary sm:text-sm">{STATE[active][0]} · {STATE[active][1]}</strong>
          </div>
        </div>
        <p data-scene-note className="mt-2 min-h-[5.5rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["전체", "FCU", "자료", "짧은 구간", "큰 구간", "검증 실패", "Live", "ExEx"]}
          playLabel="동기화 흐름 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
