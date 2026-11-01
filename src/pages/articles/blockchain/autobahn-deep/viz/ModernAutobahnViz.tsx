import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENE_LABELS = ["직전 cut", "거래 탑승", "PoA", "새 cut", "Prepare", "Confirm", "동기화", "실행"] as const;

type LaneName = "A" | "B" | "C" | "D";
type Car = { id: string; position: number; label?: string };
type TraceState = {
  title: string;
  detail: string;
  result: string;
  visible: Record<LaneName, number>;
  certified: readonly string[];
  active: readonly string[];
  cut: string;
  prepare: number;
  confirm: number;
  synced: readonly string[];
  output: readonly string[];
  phase: number;
};

const LANE_CARS: Record<LaneName, readonly Car[]> = {
  A: [{ id: "A1", position: 1 }, { id: "A2", position: 2, label: "Alice→Bob" }],
  B: [{ id: "B1", position: 1 }, { id: "B2", position: 2 }],
  C: [{ id: "C1", position: 1 }, { id: "C2", position: 2 }],
  D: [{ id: "D1", position: 1 }, { id: "D2", position: 2 }, { id: "D3", position: 3 }],
};

const TRACE_STATES: readonly TraceState[] = [
  {
    title: "직전에 확정한 cut은 네 차선의 1번 car를 가리킵니다",
    detail: "각 replica는 자기 차선을 독립적으로 늘립니다. 합의는 거래 원문이 아니라 각 차선에서 어디까지 처리할지를 가리키는 좌표를 다룹니다.",
    result: "직전 cut [1,1,1,1] · 새로 실행할 car 없음",
    visible: { A: 1, B: 1, C: 1, D: 1 }, certified: ["A1", "B1", "C1", "D1"], active: ["A1", "B1", "C1", "D1"], cut: "[1,1,1,1]", prepare: 0, confirm: 0, synced: [], output: [], phase: 0,
  },
  {
    title: "Alice→Bob 거래 묶음이 A 차선의 다음 car에 탑승합니다",
    detail: "A2에는 차선 번호와 위치, A1의 digest, 거래 묶음이 들어갑니다. 아직 다른 replica의 확인을 받지 않았으므로 단순 제안입니다.",
    result: "A2 제안 · 아직 certified tip이 아님",
    visible: { A: 2, B: 1, C: 1, D: 1 }, certified: ["A1", "B1", "C1", "D1"], active: ["A2"], cut: "[1,1,1,1]", prepare: 0, confirm: 0, synced: [], output: [], phase: 0,
  },
  {
    title: "서로 다른 두 replica가 A2를 확인해 PoA를 만듭니다",
    detail: "n=4, f=1이면 f+1=2표입니다. 두 표 중 적어도 한 표는 정직한 보관자가 냈으므로 A2 데이터를 다시 받을 경로가 남습니다.",
    result: "A2 PoA 2/2 · A 차선의 certified tip이 2로 전진",
    visible: { A: 2, B: 1, C: 1, D: 1 }, certified: ["A1", "A2", "B1", "C1", "D1"], active: ["A2"], cut: "[1,1,1,1]", prepare: 0, confirm: 0, synced: [], output: [], phase: 0,
  },
  {
    title: "네 차선이 서로 다른 속도로 전진하고 leader가 새 cut을 제안합니다",
    detail: "A·B·C는 2번, D는 3번까지 인증됐습니다. leader는 전체 backlog를 복사하지 않고 certified tip 네 개만 [2,2,2,3]으로 묶습니다.",
    result: "제안한 cut [2,2,2,3] · 합의 전",
    visible: { A: 2, B: 2, C: 2, D: 3 }, certified: ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "D3"], active: ["A2", "B2", "C2", "D2", "D3"], cut: "[2,2,2,3]", prepare: 0, confirm: 0, synced: [], output: [], phase: 1,
  },
  {
    title: "세 replica가 같은 cut에 Prep-Vote를 보내 PrepareQC를 만듭니다",
    detail: "2f+1=3표가 같은 view와 cut digest에 결속됩니다. PrepareQC는 slow path의 첫 번째 합의 증거이지 아직 CommitQC와 같은 증거가 아닙니다.",
    result: "Prep-Vote 3/3 · PrepareQC 형성",
    visible: { A: 2, B: 2, C: 2, D: 3 }, certified: ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "D3"], active: ["A2", "B2", "C2", "D2", "D3"], cut: "[2,2,2,3]", prepare: 3, confirm: 0, synced: [], output: [], phase: 2,
  },
  {
    title: "세 Confirm-Ack이 모이면 slow-path CommitQC가 됩니다",
    detail: "Confirm 단계는 결정 증거가 다음 view에도 남도록 만듭니다. 모든 n=4 Prep-Vote가 모인 fast path라면 이 단계를 생략할 수 있지만, 3표를 fast evidence로 바꿔 부를 수는 없습니다.",
    result: "Confirm-Ack 3/3 · cut 확정",
    visible: { A: 2, B: 2, C: 2, D: 3 }, certified: ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "D3"], active: ["A2", "B2", "C2", "D2", "D3"], cut: "[2,2,2,3]", prepare: 3, confirm: 3, synced: [], output: [], phase: 3,
  },
  {
    title: "느린 replica는 자신에게 없는 D2와 D3를 먼저 동기화합니다",
    detail: "cut을 확정했다는 사실과 payload를 모두 보유했다는 사실은 다릅니다. 누락된 suffix를 받아 digest와 parent chain을 검증해야 실행 순서를 만들 수 있습니다.",
    result: "D2·D3 수신 및 검증 · 실행 준비",
    visible: { A: 2, B: 2, C: 2, D: 3 }, certified: ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "D3"], active: ["D2", "D3"], cut: "[2,2,2,3]", prepare: 3, confirm: 3, synced: ["D2", "D3"], output: [], phase: 4,
  },
  {
    title: "모두가 같은 규칙으로 새 suffix를 섞어 한 번씩 실행합니다",
    detail: "직전 cut 이후 A2·B2·C2·D2·D3만 꺼냅니다. 아래 A→B→C→D 순서는 이해를 위한 예시이며, 논문은 모든 replica가 공유하는 결정적 zipping 함수만 요구합니다.",
    result: "예시 출력 A2 → B2 → C2 → D2 → D3",
    visible: { A: 2, B: 2, C: 2, D: 3 }, certified: ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "D3"], active: ["A2", "B2", "C2", "D2", "D3"], cut: "[2,2,2,3]", prepare: 3, confirm: 3, synced: ["D2", "D3"], output: ["A2", "B2", "C2", "D2", "D3"], phase: 5,
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) => `${state.title}. ${state.detail} ${state.result}`);
const PHASES = ["차선", "cut", "Prepare", "Confirm", "동기화", "실행"] as const;

function LaneRail({ lane, state }: { lane: LaneName; state: TraceState }) {
  return <div className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center border border-foreground/30 bg-background text-sm font-black">{lane}</div>
    <div className="relative grid min-h-16 grid-cols-3 items-center gap-2 before:absolute before:left-3 before:right-3 before:top-1/2 before:h-px before:bg-border">
      {LANE_CARS[lane].map((car) => {
        const visible = car.position <= state.visible[lane];
        const certified = state.certified.includes(car.id);
        const active = state.active.includes(car.id);
        const synced = state.synced.includes(car.id);
        return <div key={car.id} className={`relative z-10 min-w-0 border px-2 py-2 text-center transition-colors duration-300 ${!visible ? "invisible" : active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
          <p className="text-xs font-black">{car.id}</p>
          <p className="mt-0.5 break-keep text-[9px] leading-4 text-muted-foreground">{synced ? "동기화 완료" : certified ? "PoA" : car.label ?? "제안"}</p>
        </div>;
      })}
    </div>
  </div>;
}

function VoteMeter({ label, value, target }: { label: string; value: number; target: number }) {
  return <div className="min-w-0 border border-border bg-background p-3">
    <div className="flex items-center justify-between gap-3"><p className="break-keep text-[10px] font-bold text-muted-foreground">{label}</p><p className="text-xs font-black">{value}/{target}</p></div>
    <div className="mt-2 grid grid-cols-3 gap-1" aria-label={`${label} ${value}/${target}`}>
      {Array.from({ length: target }, (_, index) => <span key={index} className={`h-2 ${index < value ? "bg-primary" : "bg-border"}`} />)}
    </div>
  </div>;
}

export function AutobahnLaneCutViz() {
  const scenes = useAnimatedScenes(SCENE_LABELS.length, 6500, { loop: false });
  const state = TRACE_STATES[scenes.active];
  return <VizFrame eyebrow="한 요청 추적 · n=4 · f=1" title="거래 하나가 차선에 들어가 cut으로 확정되고 실행되기까지" description="차선 전파, tip 합의, 누락 데이터 동기화, 실행을 여덟 장면으로 나눠 봅니다." note="마지막 장면의 A→B→C→D zipping은 설명용 예시입니다. 논문은 하나의 고정된 차선 우선순위가 아니라 모든 replica가 공유하는 결정적 함수를 요구합니다." canvasClassName="p-4 sm:p-6">
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Autobahn 처리 흐름 장면 탐색기">
      <div data-viz-live-only className="space-y-5">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PHASES.map((phase, index) => <div key={phase} className={`border px-2 py-2 text-center text-[10px] font-black transition-colors duration-300 ${index === state.phase ? "border-primary bg-primary/10 text-foreground" : index < state.phase ? "border-foreground/30 bg-background text-foreground" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {phase}</div>)}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(15rem,0.75fr)]">
          <div className="min-w-0 space-y-2 border border-border bg-background p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3"><p className="text-xs font-black">replica별 data lane</p><code className="border border-border bg-muted/40 px-2 py-1 text-xs">cut {state.cut}</code></div>
            {(["A", "B", "C", "D"] as const).map((lane) => <LaneRail key={lane} lane={lane} state={state} />)}
          </div>
          <div className="min-w-0 space-y-3">
            <div className="border border-border bg-background p-4"><p className="text-[10px] font-black text-primary">장면 {scenes.active + 1} / {SCENE_LABELS.length}</p><h4 className="mt-2 break-keep text-base font-black leading-6">{state.title}</h4><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{state.detail}</p><p className="mt-3 border-l-2 border-primary pl-3 text-xs font-bold leading-5">{state.result}</p></div>
            <div className="grid grid-cols-2 gap-2"><VoteMeter label="Prep-Vote" value={state.prepare} target={3} /><VoteMeter label="Confirm-Ack" value={state.confirm} target={3} /></div>
            <div className="border border-border bg-background p-3"><p className="text-[10px] font-bold text-muted-foreground">결정적 출력</p><div className="mt-2 flex min-h-8 flex-wrap gap-1.5">{state.output.length ? state.output.map((item, index) => <span key={item} className="border border-primary bg-primary/10 px-2 py-1 text-xs font-black">{index + 1}. {item}</span>) : <span className="text-xs text-muted-foreground">아직 실행 순서가 없습니다.</span>}</div></div>
          </div>
        </div>
        <AnimatedSceneControls labels={SCENE_LABELS} active={scenes.active} playing={scenes.playing} reducedMotion={scenes.reducedMotion} setActive={scenes.setActive} setPlaying={scenes.setPlaying} playLabel="흐름 재생" controlLabels={SCENE_LABELS} />
      </div>
      <StaticSceneList labels={SCENE_LABELS} notes={TRACE_NOTES} />
    </div>
  </VizFrame>;
}

const COMMIT_ROWS = [
  ["Car PoA", "f+1 matching votes", "적어도 한 정직한 데이터 보관자", "같은 위치의 유일한 car"],
  ["PrepareQC", "2f+1 Prep-Votes", "같은 view·cut에 대한 준비 증거", "slow-path 최종 확정"],
  ["Slow CommitQC", "2f+1 Confirm-Acks", "다음 view에서도 보존할 결정 증거", "payload 동기화·실행 완료"],
  ["Fast CommitQC", "모든 n Prep-Votes", "좋은 구간에서 Confirm 생략", "2f+1표만으로 가능한 fast path"],
  ["Timeout Certificate", "2f+1 Timeouts", "다음 view로 이동할 ticket", "어떤 cut을 확정했다는 증거"],
] as const;

export function AutobahnCommitViz() {
  return <VizFrame eyebrow="증거의 종류" title="이름이 다른 증거는 표 수와 보장도 다릅니다" description="구현에서 모두 같은 boolean으로 합치면 view change가 어떤 값을 보존해야 하는지 잃습니다." documentFlow canvasClassName="p-0"><ResponsiveVizTable columns={["증거", "논문 기준", "보장하는 것", "보장하지 않는 것"]} rows={COMMIT_ROWS} desktopMinWidthClassName="min-w-[900px]" /></VizFrame>;
}

const EVIDENCE_ROWS = [
  ["SOSP 2024 논문", "lane·PoA·cut·Prepare/Confirm·view change", "프로토콜과 증명, 논문 조건의 평가", "공개 코드가 모든 알고리즘을 그대로 구현"],
  ["artifact commit 6d77e03", "Rust primary/worker와 Prepare·Confirm·Commit messages", "실험용 프로토타입의 실제 자료형과 경로", "제품 수준 복구·보관·모든 최적화"],
  ["cut 확정", "[2,2,2,3]에 대한 CommitQC", "어떤 lane suffix를 순서에 넣을지 합의", "누락 payload 수신과 상태 반영 완료"],
  ["처리 완료", "payload 검증·결정적 zip·application receipt", "클라이언트가 관찰할 결과", "모든 부하에서 backlog가 즉시 사라짐"],
] as const;

export function AutobahnEvidenceBoundaryViz() {
  return <VizFrame eyebrow="논문 · 공개 코드 · 완료 상태" title="프로토콜 주장과 공개 프로토타입, 서비스 완료를 한 문장으로 합치지 않습니다" description="어디까지 확인했는지와 아직 말할 수 없는 범위를 함께 둡니다." documentFlow canvasClassName="p-0"><ResponsiveVizTable columns={["근거·상태", "확인 대상", "확인되는 것", "이것만으로 말할 수 없는 것"]} rows={EVIDENCE_ROWS} desktopMinWidthClassName="min-w-[940px]" /></VizFrame>;
}
