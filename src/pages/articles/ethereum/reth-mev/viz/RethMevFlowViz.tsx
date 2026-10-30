import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "로컬", "빌드", "중개", "검증", "선택", "서명", "경계"] as const;

const NOTES = [
  "한 slot에서 Reth의 local payload와 external builder bids가 병렬로 준비됩니다. 두 경로는 consensus client와 proposer 앞에서 만나지만 상태 owner와 실패 지점은 다릅니다.",
  "Consensus client가 Engine API로 Reth에 payload build를 요청합니다. Reth는 parent P 위에 local candidate L을 준비합니다. 이 경로는 external bid가 없거나 cutoff를 넘겼을 때의 준비된 대안입니다.",
  "External builder는 public transaction과 private orderflow를 실행해 payload와 signed bid를 만듭니다. rbuilder는 Reth crates를 재사용할 수 있지만 Reth node와 같은 프로세스나 상태 owner는 아닙니다.",
  "Relay는 builder submission을 받아 proposer-side getHeader 요청에 bid를 돌려줍니다. Relay가 응답했다는 사실만으로 parent·signature·fork schema·delivery가 유효해지지는 않습니다.",
  "5와 7의 bid는 요청한 parent P와 일치하지만 9는 parent Q라서 제외합니다. Value 비교는 이 문맥 검증을 통과한 후보 집합 안에서만 수행합니다.",
  "설명용 cutoff 전에 도착한 유효 후보 가운데 7이 선택됩니다. Local L은 external path를 선택하기 전까지 준비 상태를 유지하지만, 한 번의 proposal에는 하나의 결정만 남겨야 합니다.",
  "Proposer는 external header를 담은 blinded beacon block에 서명하고 relay에 제출합니다. Relay가 약속한 body를 돌려주고 header와 body가 일치해야 block proposal로 이어집니다.",
  "No bid·invalid·late bid는 서명 전이라 local path로 갈 수 있습니다. Blinded block 서명 뒤 payload non-delivery는 이미 특정 header에 약속한 뒤의 실패이므로 local body로 자유롭게 바꿀 수 없습니다.",
] as const;

type NodeId = "reth" | "builder" | "relay" | "boost" | "cl" | "proposer";

const NODES: ReadonlyArray<{ id: NodeId; owner: string; title: string; detail: string }> = [
  { id: "reth", owner: "Execution client", title: "Reth local builder", detail: "Engine API · local L" },
  { id: "builder", owner: "별도 서비스", title: "External builder", detail: "payload · signed bid" },
  { id: "relay", owner: "중개자", title: "Relay", detail: "header · body 전달" },
  { id: "boost", owner: "Proposer 측", title: "mev-boost", detail: "relay 조회 · 후보 선택" },
  { id: "cl", owner: "Consensus client", title: "Beacon node", detail: "local·external 경로 조정" },
  { id: "proposer", owner: "Validator", title: "Proposer", detail: "서명 · block 제안" },
];

const ACTIVE: ReadonlyArray<readonly NodeId[]> = [
  ["reth", "builder", "relay", "boost", "cl", "proposer"],
  ["reth", "cl"],
  ["builder"],
  ["builder", "relay", "boost"],
  ["relay", "boost"],
  ["reth", "boost", "cl"],
  ["relay", "boost", "cl", "proposer"],
  ["reth", "relay", "boost", "cl", "proposer"],
];

const CANDIDATES = [
  { id: "local", label: "Local L", value: "4", parent: "P" },
  { id: "bid5", label: "Bid A", value: "5", parent: "P" },
  { id: "bid9", label: "Bid B", value: "9", parent: "Q" },
  { id: "bid7", label: "Bid C", value: "7", parent: "P" },
] as const;

const CANDIDATE_STATES: ReadonlyArray<ReadonlyArray<string>> = [
  ["준비 경로", "도착 예정", "도착 예정", "도착 예정"],
  ["준비 완료", "대기", "대기", "대기"],
  ["준비 완료", "builder 생성", "builder 생성", "builder 생성"],
  ["준비 완료", "relay 수신", "relay 수신", "relay 수신"],
  ["유효", "유효", "제외 · parent 불일치", "유효"],
  ["대기", "후보", "제외", "선택"],
  ["대기 종료", "미선택", "제외", "body 전달"],
  ["서명 전 fallback", "no bid와 구분", "invalid와 구분", "서명 뒤 non-delivery 가능"],
];

const RECEIPTS = [
  "두 경로는 병렬로 준비되지만 한 proposal에서 만납니다.",
  "Reth local L · parent P · 설명용 value 4",
  "External builder가 A=5, B=9, C=7을 구성합니다.",
  "Relay가 bid를 보관하고 mev-boost 요청에 응답합니다.",
  "Bid B의 parent Q가 요청한 P와 달라 value 9여도 제외됩니다.",
  "유효·제시간 후보의 최댓값인 Bid C=7을 선택합니다.",
  "Signed blinded block → full payload C → proposal",
  "서명 전 실패와 서명 뒤 non-delivery는 복구 가능성이 다릅니다.",
] as const;

function FlowNode({ node, selected, index }: { node: (typeof NODES)[number]; selected: boolean; index: number }) {
  return (
    <div
      data-mev-node={node.id}
      data-active={selected ? "true" : "false"}
      className={`relative min-w-0 bg-background p-2.5 sm:p-4 ${selected ? "ring-2 ring-inset ring-primary" : "opacity-35"}`}
    >
      <span className="font-mono text-[8px] font-black text-primary sm:text-[9px]">{String(index + 1).padStart(2, "0")} · {node.owner}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-4 sm:text-sm sm:leading-5">{node.title}</strong>
      <span className="mt-1 block break-keep text-[8px] leading-3 text-muted-foreground sm:text-[11px] sm:leading-5">{node.detail}</span>
      {index < NODES.length - 1 && index % 3 !== 2 ? (
        <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-1 text-primary sm:block">→</span>
      ) : null}
    </div>
  );
}

export default function RethMevFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;
  const activeIds = new Set(ACTIVE[active]);

  return (
    <VizFrame
      eyebrow="개념 경로 · 한 slot의 후보 선택"
      title="Local payload와 external bid는 같은 owner가 만들지 않습니다"
      description="Parent P 위의 local L과 5·9·7 external bids가 준비되는 설명용 사례를 검증, 선택, blinded 서명, payload delivery까지 따라갑니다."
      note="Value와 시각은 메커니즘을 설명하기 위한 임의 값이며 대상 환경의 수익·latency 측정값이 아닙니다. Builder API는 고정한 specification과 mev-boost source snapshot을 기준으로 표시했습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-mev-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth local payload와 external builder 경로를 비교하는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-8 gap-px bg-border p-px" aria-label="Reth와 MEV의 여덟 장면">
          {SCENES.map((scene, index) => (
            <div key={scene} className={`min-w-0 bg-background px-0.5 py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3" aria-label="Local payload와 external bid의 책임 경로">
          {NODES.map((node, index) => <FlowNode key={node.id} node={node} selected={activeIds.has(node.id)} index={index} />)}
        </div>

        <div className="mt-2 grid grid-cols-4 gap-px bg-border p-px sm:mt-3" aria-label="설명용 local payload와 세 external bid 상태">
          {CANDIDATES.map((candidate, index) => {
            const state = CANDIDATE_STATES[active][index];
            const selected = active === 5 && candidate.id === "bid7";
            const rejected = active >= 4 && candidate.id === "bid9";
            return (
              <div key={candidate.id} className={`min-w-0 bg-background p-2.5 sm:p-3 ${selected ? "ring-2 ring-inset ring-primary" : rejected ? "opacity-45" : ""}`}>
                <span className="block break-keep text-[9px] font-bold text-muted-foreground sm:text-[10px]">{candidate.label}</span>
                <strong className="mt-1 block text-xs sm:text-sm">{candidate.value} · parent {candidate.parent}</strong>
                <span className="mt-1 block break-keep text-[8px] leading-3 text-primary sm:text-[10px] sm:leading-4">{state}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-2 grid grid-cols-[0.55fr_1.45fr] gap-px bg-border p-px sm:mt-3">
          <div className="min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">상태 영수증</span>
            <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-2 min-h-24 border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["전체", "로컬", "빌드", "중개", "검증", "선택", "서명", "경계"]}
          playLabel="재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]]:flex-nowrap [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:whitespace-nowrap [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
