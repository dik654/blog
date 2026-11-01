import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENE_LABELS = ["제안", "vote", "certificate", "직접 결정", "prefix", "간접 결정", "linearize", "완료 경계"] as const;
const PHASES = ["제안", "vote", "certificate", "결정", "prefix", "anchor", "정렬", "receipt"] as const;
const AUTHORS = ["A", "B", "C", "D"] as const;
const SLOTS = ["L1", "L2", "L3", "L4"] as const;

type SlotStatus = "commit" | "skip" | "undecided" | "held";
type TraceState = {
  title: string;
  detail: string;
  result: string;
  phase: number;
  votes: number;
  certificates: number;
  visibleRound: number;
  slots: Record<(typeof SLOTS)[number], SlotStatus>;
  prefix: readonly string[];
  output: readonly string[];
  receipt: "none" | "consensus" | "execution";
};

const TRACE_STATES: readonly TraceState[] = [
  {
    title: "Alice→Bob 거래가 A의 leader block L1에 들어갑니다",
    detail: "L1은 signed proposal입니다. 별도 certificate는 없지만 epoch·round·author·parents·signature는 검증합니다.",
    result: "L1 제안 · uncertified는 unvalidated라는 뜻이 아님",
    phase: 0, votes: 0, certificates: 0, visibleRound: 0,
    slots: { L1: "undecided", L2: "undecided", L3: "undecided", L4: "undecided" }, prefix: [], output: [], receipt: "none",
  },
  {
    title: "다음 round의 세 author가 L1을 처음 지지합니다",
    detail: "A1·B1·C1이 ancestry에서 L1을 first support합니다. 같은 author의 stake는 한 번만 셉니다.",
    result: "Distinct vote 3/3 · L1 support quorum",
    phase: 1, votes: 3, certificates: 0, visibleRound: 1,
    slots: { L1: "undecided", L2: "undecided", L3: "undecided", L4: "undecided" }, prefix: [], output: [], receipt: "none",
  },
  {
    title: "그다음 round의 세 block이 vote quorum을 ancestry에 담습니다",
    detail: "A2·B2·C2 각각이 quorum votes를 ancestry에 담아 implicit certificate가 됩니다. 세 개가 direct commit pattern을 만듭니다.",
    result: "Certificate block 3/3 · direct commit pattern",
    phase: 2, votes: 3, certificates: 3, visibleRound: 2,
    slots: { L1: "undecided", L2: "undecided", L3: "undecided", L4: "undecided" }, prefix: [], output: [], receipt: "none",
  },
  {
    title: "Direct decider가 L1을 commit으로 판정합니다",
    detail: "Quorum certificate blocks면 commit, quorum non-support면 skip입니다. 둘 다 부족하면 추측하지 않고 undecided로 둡니다.",
    result: "L1 direct commit · decision과 실행은 아직 별개",
    phase: 3, votes: 3, certificates: 3, visibleRound: 2,
    slots: { L1: "commit", L2: "skip", L3: "undecided", L4: "held" }, prefix: [], output: [], receipt: "none",
  },
  {
    title: "오래된 undecided L3가 뒤의 L4 외부화를 막습니다",
    detail: "연속으로 판정된 L1·L2까지만 내보냅니다. L3 뒤의 L4 결정은 사라지지 않고 보류됩니다.",
    result: "Decided prefix [L1, L2] · L4 보류",
    phase: 4, votes: 3, certificates: 3, visibleRound: 2,
    slots: { L1: "commit", L2: "skip", L3: "undecided", L4: "held" }, prefix: ["L1", "L2"], output: [], receipt: "none",
  },
  {
    title: "나중에 결정된 anchor가 L3의 상태를 간접 판정합니다",
    detail: "Anchor ancestry에 L3 certificate가 있으면 indirect commit, 없으면 skip입니다. 여기서는 L3을 commit해 L4까지 이어집니다.",
    result: "Prefix [L1, L2, L3, L4] · gap 해소",
    phase: 5, votes: 3, certificates: 3, visibleRound: 2,
    slots: { L1: "commit", L2: "skip", L3: "commit", L4: "commit" }, prefix: ["L1", "L2", "L3", "L4"], output: [], receipt: "none",
  },
  {
    title: "Linearizer가 새 causal ancestors만 한 번씩 펼칩니다",
    detail: "이미 committed한 blocks와 GC 경계 아래를 빼고 ancestry를 모읍니다. Sui v1.82.3은 round·authority 순으로 정렬합니다.",
    result: "예시 sub-DAG A0 → A1 → B1 → C1 → A2 → B2 → C2",
    phase: 6, votes: 3, certificates: 3, visibleRound: 2,
    slots: { L1: "commit", L2: "skip", L3: "commit", L4: "commit" }, prefix: ["L1", "L2", "L3", "L4"], output: ["A0", "A1", "B1", "C1", "A2", "B2", "C2"], receipt: "consensus",
  },
  {
    title: "Consensus order와 거래 실행·checkpoint를 따로 확인합니다",
    detail: "CommittedSubDag는 consensus output입니다. Fast path, application execution, checkpoint는 별도 상태입니다.",
    result: "Consensus receipt 확보 · execution/finality receipt는 별도",
    phase: 7, votes: 3, certificates: 3, visibleRound: 2,
    slots: { L1: "commit", L2: "skip", L3: "commit", L4: "commit" }, prefix: ["L1", "L2", "L3", "L4"], output: ["A0", "A1", "B1", "C1", "A2", "B2", "C2"], receipt: "execution",
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) => `${state.title}. ${state.detail} ${state.result}`);

function DagNode({ label, active, muted, note }: { label: string; active: boolean; muted?: boolean; note: string }) {
  return <div className={`relative z-10 min-w-0 border px-1.5 py-1.5 text-center transition-colors duration-300 ${active ? "border-primary bg-primary/10" : muted ? "border-border/50 bg-muted/20 text-muted-foreground/55" : "border-border bg-background"}`}>
    <p className="text-xs font-black">{label}</p>
    <p className="mt-0.5 break-keep text-[9px] leading-3.5 text-muted-foreground">{note}</p>
  </div>;
}

function EvidenceMeter({ label, value, target }: { label: string; value: number; target: number }) {
  return <div className="border border-border bg-background p-3">
    <div className="flex items-center justify-between gap-3"><p className="break-keep text-[10px] font-bold text-muted-foreground">{label}</p><p className="text-xs font-black">{value}/{target}</p></div>
    <div className="mt-2 grid grid-cols-3 gap-1" aria-label={`${label} ${value}/${target}`}>
      {Array.from({ length: target }, (_, index) => <span key={index} className={`h-2 ${index < value ? "bg-primary" : "bg-border"}`} />)}
    </div>
  </div>;
}

function statusLabel(status: SlotStatus) {
  if (status === "commit") return "commit";
  if (status === "skip") return "skip";
  if (status === "held") return "commit · 보류";
  return "undecided";
}

export function MysticetiTraceViz() {
  const scenes = useAnimatedScenes(SCENE_LABELS.length, 6500, { loop: false });
  const state = TRACE_STATES[scenes.active];
  return <VizFrame eyebrow="한 거래 추적 · n=4 · f=1" title="Signed block 하나가 vote pattern을 거쳐 공통 순서가 되기까지" description="제안 자체의 certificate를 만들지 않는다는 말부터, 결정된 sub-DAG와 실행 완료가 다른 상태라는 점까지 여덟 장면으로 봅니다." note="A0·A1 같은 이름과 마지막 sub-DAG 배열은 원리를 따라가기 위한 축소 예시입니다. 현재 배포의 leader 수·wave 설정은 ProtocolConfig에 달려 있습니다." documentFlow canvasClassName="p-4 sm:p-6">
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Mysticeti 처리 흐름 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {PHASES.map((phase, index) => <div key={phase} className={`border px-1.5 py-2 text-center text-[9px] font-black transition-colors duration-300 ${index === state.phase ? "border-primary bg-primary/10 text-foreground" : index < state.phase ? "border-foreground/30 bg-background text-foreground" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {phase}</div>)}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,1.08fr)]">
          <div className="min-w-0 border border-border bg-background p-3 sm:p-4">
            <div className="grid grid-cols-[2rem_repeat(3,minmax(0,1fr))] gap-2 border-b border-border pb-2 text-center text-[10px] font-black text-muted-foreground">
              <span />{["round r", "round r+1", "round r+2"].map((round) => <span key={round}>{round}</span>)}
            </div>
            <div className="mt-3 space-y-1.5">
              {AUTHORS.map((author, row) => <div key={author} className="grid grid-cols-[2rem_repeat(3,minmax(0,1fr))] items-center gap-2">
                <span className="text-center text-xs font-black">{author}</span>
                <DagNode label={row === 0 ? "A0 · L1" : `${author}0`} note={row === 0 ? "거래" : "제안"} active={row === 0 && state.visibleRound >= 0} muted={row !== 0} />
                <DagNode label={`${author}1`} note={row < 3 ? "L1 vote" : "기타 vote"} active={row < 3 && state.visibleRound >= 1} muted={state.visibleRound < 1 || row === 3} />
                <DagNode label={`${author}2`} note={row < 3 ? "L1 cert." : "기타 cert."} active={row < 3 && state.visibleRound >= 2} muted={state.visibleRound < 2 || row === 3} />
              </div>)}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2"><EvidenceMeter label="Distinct votes" value={state.votes} target={3} /><EvidenceMeter label="Certificate blocks" value={state.certificates} target={3} /></div>
          </div>

          <div className="min-w-0 space-y-3">
            <div className="border border-border bg-background p-4"><p className="text-[10px] font-black text-primary">장면 {scenes.active + 1} / {SCENE_LABELS.length}</p><h4 className="mt-2 break-keep text-base font-black leading-6">{state.title}</h4><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{state.detail}</p><p className="mt-3 border-l-2 border-primary pl-3 text-xs font-bold leading-5">{state.result}</p></div>
            <div className="grid grid-cols-4 gap-2">
              {SLOTS.map((slot) => <div key={slot} className={`border px-2 py-1.5 ${state.slots[slot] === "commit" ? "border-primary bg-primary/10" : "border-border bg-background"}`}><p className="text-[10px] font-black">{slot}</p><p className="mt-0.5 break-keep text-[10px] text-muted-foreground">{statusLabel(state.slots[slot])}</p></div>)}
            </div>
            <div className="border border-border bg-background p-3"><p className="text-[10px] font-bold text-muted-foreground">외부화 가능한 prefix</p><p className="mt-2 min-h-5 break-keep text-xs font-black">{state.prefix.length ? state.prefix.join(" → ") : "아직 없음"}</p></div>
            <div className="border border-border bg-background p-3"><p className="text-[10px] font-bold text-muted-foreground">Committed sub-DAG output</p><div className="mt-2 flex min-h-8 flex-wrap gap-1.5">{state.output.length ? state.output.map((item, index) => <span key={item} className="border border-primary bg-primary/10 px-2 py-1 text-[10px] font-black">{index + 1}. {item}</span>) : <span className="text-xs text-muted-foreground">결정된 출력 없음</span>}</div>{state.receipt !== "none" && <p className="mt-2 text-[10px] font-bold text-primary">{state.receipt === "consensus" ? "consensus order receipt" : "execution·checkpoint는 별도 확인"}</p>}</div>
          </div>
        </div>
        <AnimatedSceneControls labels={SCENE_LABELS} active={scenes.active} playing={scenes.playing} reducedMotion={scenes.reducedMotion} setActive={scenes.setActive} setPlaying={scenes.setPlaying} playLabel="흐름 재생" controlLabels={SCENE_LABELS} compact />
      </div>
      <StaticSceneList labels={SCENE_LABELS} notes={TRACE_NOTES} />
    </div>
  </VizFrame>;
}

const BOUNDARY_ROWS = [
  ["Signed proposal", "서명·epoch·round·author·parent 검증", "이 block의 독립 certificate"],
  ["Implicit certificate", "2f+1 first-support votes를 ancestry에 담은 block", "leader direct commit"],
  ["Direct commit pattern", "2f+1 certificate blocks", "application execution·checkpoint"],
  ["Decided prefix", "undecided gap 전까지의 commit·skip", "gap 뒤 결정의 즉시 외부화"],
  ["CommittedSubDag", "새 ancestors의 중복 없는 결정적 순서", "공정한 순서·거래 성공"],
  ["Transaction votes", "fast-path accept·reject evidence", "모든 설정에서 활성·checkpoint finality"],
] as const;

export function MysticetiBoundaryViz() {
  return <VizFrame eyebrow="증거와 완료 상태" title="Uncertified, committed, executed를 한 상태로 합치지 않습니다" description="각 단계가 무엇을 보장하고, 그 증거만으로는 어디까지 말할 수 없는지 나눕니다." documentFlow canvasClassName="p-0"><ResponsiveVizTable columns={["상태·증거", "확인되는 것", "아직 확인되지 않는 것"]} rows={BOUNDARY_ROWS} desktopMinWidthClassName="min-w-[820px]" /></VizFrame>;
}
