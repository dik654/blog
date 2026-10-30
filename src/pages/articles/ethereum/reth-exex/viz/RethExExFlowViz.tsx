import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "전체",
  "Reorg",
  "WAL",
  "전달",
  "되돌림",
  "적용",
  "완료",
  "정체",
  "복구",
] as const;

const NOTES = [
  "Canonical chain이 103~105에서 103′~105′로 바뀌면 ExEx 경로는 변화 모양을 보존한 채 manager, WAL, 각 extension으로 전달합니다. 전달과 파생 DB 확정은 서로 다른 상태입니다.",
  "Reth는 ChainReorged에 old 103~105와 new 103′~105′를 함께 넣습니다. 높이 105 하나만 보내면 어느 branch의 행을 지워야 하는지 알 수 없습니다.",
  "Blockchain tree에서 온 notification은 ExEx WAL에 먼저 기록되고 manager의 bounded buffer에 들어갑니다. 이미 finalized인 pipeline notification은 WAL 기록을 건너뜁니다.",
  "Manager가 capacity-1 channel에 notification을 넣으면 Reth는 delivered로 봅니다. 이 시점에는 extension의 파생 DB transaction이 아직 시작되지 않았을 수 있습니다.",
  "Extension A는 old branch의 105→103 순서로 파생 행을 되돌리고 자체 head를 공통 조상 102로 맞춥니다. Extension B는 아직 102에서 다음 notification을 기다립니다.",
  "A는 new branch의 103′→105′를 적용하고 파생 행과 ExExHead를 같은 로컬 transaction에 확정합니다. 그 뒤에야 완료 위치를 알릴 근거가 생깁니다.",
  "A가 105′, B가 102를 FinishedHeight로 보내면 공통 완료 높이는 102입니다. Finalized header가 104여도 WAL 정리 경계는 min(105, 102, 104)=102이며 각 hash가 canonical인지도 확인합니다.",
  "B가 읽지 않으면 B의 channel이 차고, 모든 ExEx에 보내지 못한 notification이 manager buffer에 남습니다. Buffer capacity가 0이면 send_async upstream이 기다립니다.",
  "B가 저장한 ExExHead 102로 재시작하면 그 hash의 canonicality를 확인하고 103′~105′를 backfill합니다. Backfill 중 들어온 live reorg와 이후 구간은 따로 보관한 뒤 순서대로 이어서 전달합니다.",
] as const;

type NodeId = "canonical" | "manager" | "wal" | "channel" | "derived" | "finished";

const NODES: ReadonlyArray<{ id: NodeId; eyebrow: string; title: string; detail: string }> = [
  { id: "canonical", eyebrow: "입력", title: "Canonical 변화", detail: "old + new branch" },
  { id: "manager", eyebrow: "제어", title: "ExEx manager", detail: "fan-out · bounded buffer" },
  { id: "wal", eyebrow: "복구", title: "Notification WAL", detail: "blockchain-tree source" },
  { id: "channel", eyebrow: "전달", title: "ExEx channel", detail: "capacity 1 · delivered" },
  { id: "derived", eyebrow: "소비", title: "파생 DB · ExExHead", detail: "rollback · apply · commit" },
  { id: "finished", eyebrow: "진행", title: "FinishedHeight", detail: "canonical hash · pruning" },
];

const ACTIVE: ReadonlyArray<readonly NodeId[]> = [
  ["canonical", "manager", "wal", "channel", "derived", "finished"],
  ["canonical", "manager"],
  ["manager", "wal"],
  ["manager", "channel"],
  ["channel", "derived"],
  ["derived"],
  ["derived", "finished", "wal"],
  ["manager", "channel"],
  ["wal", "channel", "derived", "finished"],
];

const RECEIPTS = [
  ["흐름", "canonical 변화 → manager → extension → 완료 신호"],
  ["notification", "old 103~105 · new 103′~105′"],
  ["보존", "WAL append · manager buffer id N"],
  ["전달 경계", "channel accepted ≠ 파생 DB commit"],
  ["A의 head", "105(old) → 102"],
  ["A의 head", "102 → 105′ · local commit"],
  ["공통 경계", "min(A 105, B 102, finalized 104) = 102"],
  ["정체", "B channel full → manager capacity 0 → upstream wait"],
  ["재시작", "head 102 확인 → 103′~105′ backfill → live drain"],
] as const;

const EXTENSION_STATE = [
  { a: "old 105", b: "102", common: "미계산" },
  { a: "old 105", b: "102", common: "reorg 수신 전" },
  { a: "old 105", b: "102", common: "WAL 보존" },
  { a: "channel 수신", b: "channel 수신", common: "DB 미확정" },
  { a: "rollback → 102", b: "102", common: "처리 중" },
  { a: "new 105′", b: "102", common: "B 대기" },
  { a: "Finished 105′", b: "Finished 102", common: "102" },
  { a: "Finished 105′", b: "stalled 102", common: "102" },
  { a: "Finished 105′", b: "backfill → 105′", common: "105′" },
] as const;

function FlowNode({
  node,
  selected,
  index,
}: {
  node: (typeof NODES)[number];
  selected: boolean;
  index: number;
}) {
  return (
    <div
      data-exex-node={node.id}
      data-active={selected ? "true" : "false"}
      className={`relative min-w-0 bg-background p-2.5 sm:p-4 ${selected ? "ring-2 ring-inset ring-primary" : "opacity-35"}`}
    >
      <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")} · {node.eyebrow}</span>
      <strong className="mt-1 block break-keep text-[11px] leading-4 sm:text-sm sm:leading-5">{node.title}</strong>
      <span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">{node.detail}</span>
      {index < NODES.length - 1 && index % 3 !== 2 ? (
        <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-1 text-primary sm:block">→</span>
      ) : null}
    </div>
  );
}

export default function RethExExFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;
  const activeIds = new Set(ACTIVE[active]);
  const state = EXTENSION_STATE[active];

  return (
    <VizFrame
      eyebrow="개념 경로 · canonical reorg 하나 추적"
      title="전달, 파생 DB 확정, 완료 신호는 서로 다른 순간입니다"
      description="103~105가 103′~105′로 바뀌는 한 사례를 manager buffer와 WAL부터 두 ExEx의 완료 위치와 재시작까지 따라갑니다."
      note="Reth v2.8.1 commit d763342f의 ExEx notification·manager·WAL·with-head stream을 기준으로 구성했습니다. 블록 표시는 branch를 구분하기 위한 설명용 식별자입니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-exex-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth ExEx가 canonical reorg를 파생 상태에 반영하는 아홉 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-9 gap-px bg-border p-px" aria-label="Reth ExEx의 아홉 장면">
          {SCENES.map((scene, index) => (
            <div key={scene} className={`min-w-0 bg-background px-0.5 py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3" aria-label="Canonical 변화에서 FinishedHeight까지의 경로">
          {NODES.map((node, index) => <FlowNode key={node.id} node={node} selected={activeIds.has(node.id)} index={index} />)}
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3" aria-label="두 ExEx의 현재 처리 위치">
          <div className="min-w-0 bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">Extension A · 파생 인덱스</span>
            <strong className="mt-1 block break-keep text-xs leading-5 text-primary sm:text-sm">{state.a}</strong>
          </div>
          <div className="min-w-0 bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">Extension B · 분석 상태</span>
            <strong className="mt-1 block break-keep text-xs leading-5 text-primary sm:text-sm">{state.b}</strong>
          </div>
          <div className="min-w-0 bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">공통 완료 위치</span>
            <strong className="mt-1 block break-keep text-xs leading-5 text-primary sm:text-sm">{state.common}</strong>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-[0.7fr_1.3fr] gap-px bg-border p-px sm:mt-3">
          <div className="min-w-0 bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-w-0 bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">상태 영수증</span>
            <strong className="mt-1 block break-keep text-xs leading-5 text-primary sm:text-sm">{RECEIPTS[active][0]} · {RECEIPTS[active][1]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-2 min-h-24 border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["전체", "Reorg", "WAL", "전달", "되돌림", "적용", "완료", "정체", "복구"]}
          playLabel="재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]]:flex-nowrap [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:whitespace-nowrap [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
