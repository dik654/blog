import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const PARTICIPANTS = [
  { id: "A", power: 40 },
  { id: "B", power: 25 },
  { id: "C", power: 15 },
  { id: "D", power: 40 },
] as const;

const TRACE_LABELS = ["제안", "수신", "QUALITY", "PREPARE", "COMMIT", "DECIDE 전달", "DECIDE 정족수", "반환"] as const;
const TRACE_STEPS = ["Gossip", "검증", "QUALITY", "PREPARE", "COMMIT", "DECIDE", "certificate"] as const;

type ParticipantId = (typeof PARTICIPANTS)[number]["id"];
type TraceState = {
  title: string;
  detail: string;
  result: string;
  route: number;
  round: string;
  phase: string;
  received: readonly ParticipantId[];
  counted: readonly ParticipantId[];
  power: number;
  evidence: string;
};

const TRACE_STATES: readonly TraceState[] = [
  {
    title: "Alice→Bob 거래를 포함한 chain P를 제안합니다",
    detail: "참가자 A가 이전에 확정된 base를 연장한 P를 자신의 입력 chain으로 고릅니다. 아직 누구의 표도 세지 않았습니다.",
    result: "로컬 제안 P · 합의 결과 아님",
    route: 0, round: "0", phase: "입력", received: [], counted: [], power: 0, evidence: "없음",
  },
  {
    title: "Gossipsub으로 받은 메시지는 먼저 검증 대기 상태가 됩니다",
    detail: "A·B·C의 메시지를 받았어도 network·instance·round·phase·sender·signature·chain을 확인하기 전에는 정족수에 넣지 않습니다.",
    result: "수신 80 · 집계 0",
    route: 1, round: "0", phase: "검증", received: ["A", "B", "C"], counted: [], power: 0, evidence: "원본 메시지",
  },
  {
    title: "Round 0의 QUALITY 표가 P의 후보 자격을 만듭니다",
    detail: "검증을 통과한 A·B·C의 power는 40+25+15=80입니다. 정확한 threshold 80에 닿아 P 또는 그 prefix를 candidate set에 넣습니다.",
    result: "QUALITY 80/120 · strong quorum",
    route: 2, round: "0", phase: "QUALITY", received: ["A", "B", "C"], counted: ["A", "B", "C"], power: 80, evidence: "QUALITY 표",
  },
  {
    title: "같은 P에 PREPARE 80이 모여 commit할 근거가 생깁니다",
    detail: "Round 0 PREPARE는 별도 justification 없이 시작할 수 있습니다. 이후 round의 PREPARE라면 허용된 이전 phase evidence가 필요합니다.",
    result: "PREPARE 80/120 · P justification 생성",
    route: 3, round: "0", phase: "PREPARE", received: ["A", "B", "C"], counted: ["A", "B", "C"], power: 80, evidence: "QUALITY 후보 P",
  },
  {
    title: "P를 가리키는 COMMIT 80이 결정 후보를 고정합니다",
    detail: "각 COMMIT은 P의 PREPARE strong quorum을 justification으로 싣습니다. 같은 sender의 중복 메시지는 power를 더 늘리지 않습니다.",
    result: "COMMIT 80/120 · non-bottom quorum",
    route: 4, round: "0", phase: "COMMIT", received: ["A", "B", "C"], counted: ["A", "B", "C"], power: 80, evidence: "PREPARE 80",
  },
  {
    title: "COMMIT 근거를 확인한 참가자가 DECIDE를 다시 보냅니다",
    detail: "DECIDE 메시지는 round 0으로 정규화되고 P에 대한 COMMIT strong quorum을 justification으로 가집니다. DECIDE 한 장은 아직 최종 certificate가 아닙니다.",
    result: "DECIDE 표 40/120 · COMMIT 근거 80/120",
    route: 5, round: "외부", phase: "DECIDE", received: ["A"], counted: ["A"], power: 40, evidence: "COMMIT 80",
  },
  {
    title: "서로 다른 DECIDE sender의 power도 80에 도달해야 합니다",
    detail: "A·B·C의 유효한 DECIDE를 모으면 80/120입니다. 이 표들을 집계한 서명이 instance의 decision certificate가 됩니다.",
    result: "DECIDE 80/120 · certificate 완성",
    route: 5, round: "외부", phase: "DECIDE", received: ["A", "B", "C"], counted: ["A", "B", "C"], power: 80, evidence: "COMMIT 80 + DECIDE 80",
  },
  {
    title: "합의 계층은 P와 decision certificate를 반환합니다",
    detail: "이 반환값은 GPBFT 합의의 완료입니다. Alice→Bob 거래의 애플리케이션 실행과 EC fork-choice 반영은 F3 통합 계층이 따로 확인합니다.",
    result: "decision P · consensus 완료 · 실행은 별도",
    route: 6, round: "종료", phase: "반환", received: ["A", "B", "C"], counted: ["A", "B", "C"], power: 80, evidence: "DECIDE certificate",
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) => `${state.title}. ${state.detail} ${state.result}`);

function ParticipantPower({ state }: { state: TraceState }) {
  return <div>
    <div className="grid grid-cols-4 gap-1" aria-label="참가자별 합의 power">
      {PARTICIPANTS.map(({ id, power }) => {
        const counted = state.counted.includes(id);
        const received = state.received.includes(id);
        return <div key={id} className={`min-w-0 border px-1 py-2 text-center transition-colors duration-300 ${counted ? "border-primary bg-primary/10" : received ? "border-foreground/30 bg-background" : "border-border bg-muted/20 text-muted-foreground"}`}>
          <p className="text-xs font-black">{id}</p>
          <p className="mt-0.5 text-[10px] font-bold">{power}</p>
          <p className="mt-1 break-keep text-[9px] leading-3 text-muted-foreground">{counted ? "검증·집계" : received ? "수신" : "대기"}</p>
        </div>;
      })}
    </div>
    <div className="relative mt-3 h-2 bg-border/60" aria-label={`현재 집계 power ${state.power}, threshold 80`}>
      <span className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-500" style={{ width: `${(state.power / 120) * 100}%` }} />
      <span className="absolute inset-y-[-4px] left-2/3 w-px bg-foreground" />
      <span className="absolute left-2/3 top-3 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold">threshold 80</span>
    </div>
  </div>;
}

export function GpbftTraceViz() {
  const scenes = useAnimatedScenes(TRACE_LABELS.length, 6800, { loop: false });
  const state = TRACE_STATES[scenes.active];
  return <VizFrame eyebrow="한 chain 제안 추적 · total power 120" title="P를 받는 일부터 decision certificate를 반환하는 일까지" description="각 장면에서 수신한 표, 검증을 마쳐 실제로 센 power, 다음 phase를 허용한 evidence가 함께 바뀝니다." note="A=40, B=25, C=15, D=40은 계산을 손으로 따라가기 위한 가정입니다. Strong quorum 식과 phase 전이는 FIP-0086 및 go-f3 v0.8.15를 따릅니다." documentFlow canvasClassName="p-3 sm:p-6">
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="GossiPBFT 정상 경로 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
          {TRACE_STEPS.map((step, index) => <div key={step} className={`border px-1.5 py-2 text-center text-[9px] font-black transition-colors duration-300 ${index === state.route ? "border-primary bg-primary/10" : index < state.route ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {step}</div>)}
        </div>
        <div className="grid gap-4">
          <div className="min-w-0 border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <div><p className="text-[10px] font-bold text-muted-foreground">현재 phase</p><p className="mt-1 text-base font-black">{state.phase}</p></div>
              <div className="text-right"><p className="text-[10px] font-bold text-muted-foreground">round</p><p className="mt-1 font-mono text-sm font-black">{state.round}</p></div>
            </div>
            <div className="mt-5"><ParticipantPower state={state} /></div>
            <div className="mt-9 grid grid-cols-3 gap-px bg-border p-px text-center">
              <div className="bg-background p-2"><p className="text-[9px] text-muted-foreground">수신 power</p><p className="mt-1 text-sm font-black">{state.received.reduce((sum, id) => sum + (PARTICIPANTS.find((p) => p.id === id)?.power ?? 0), 0)}</p></div>
              <div className="bg-background p-2"><p className="text-[9px] text-muted-foreground">집계 power</p><p className="mt-1 text-sm font-black">{state.power}</p></div>
              <div className="bg-background p-2"><p className="text-[9px] text-muted-foreground">판정</p><p className="mt-1 break-keep text-xs font-black">{state.power >= 80 ? "정족수" : "미달"}</p></div>
            </div>
          </div>
          <div className="min-w-0 border border-border bg-background p-4">
            <p className="text-[10px] font-black text-primary">장면 {scenes.active + 1} / {TRACE_LABELS.length}</p>
            <h4 className="mt-2 break-keep text-base font-black leading-6">{state.title}</h4>
            <p className="mt-3 break-keep text-xs leading-6 text-muted-foreground">{state.detail}</p>
            <div className="mt-4 border-t border-border pt-3"><p className="text-[10px] font-bold text-muted-foreground">다음 전이를 여는 evidence</p><p className="mt-1 break-keep text-xs font-black">{state.evidence}</p></div>
            <p className="mt-4 border-l-2 border-primary pl-3 text-xs font-bold leading-5">{state.result}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="정상 경로 재생" compact />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </div>
  </VizFrame>;
}

const RECOVERY_LABELS = ["표 분산", "bottom", "bottom 정족수", "CONVERGE", "재합의", "재전파"] as const;
const RECOVERY_STATES = [
  { round: "0", p: 65, q: 55, bottom: 0, title: "P와 Q로 PREPARE 표가 갈립니다", detail: "P는 A+B=65, Q는 C+D=55입니다. 전체 120을 받았어도 어느 값도 80에 닿지 않으므로 값을 임의로 고르지 않습니다.", action: "PREPARE phase 완료 · P 정족수 불가능" },
  { round: "0", p: 65, q: 55, bottom: 40, title: "참가자는 COMMIT에서 bottom을 표합니다", detail: "여기서 bottom(⊥)은 빈 chain을 확정한다는 뜻이 아니라 이 round에서 특정 non-bottom 값을 결정하지 않겠다는 표입니다.", action: "COMMIT ⊥ 전파" },
  { round: "0", p: 65, q: 55, bottom: 80, title: "Bottom COMMIT이 80에 닿으면 round를 넘깁니다", detail: "Strong quorum의 ⊥ evidence를 다음 round가 들고 갑니다. 기존 base와 candidate 정보를 버리지 않고 round 번호만 전진합니다.", action: "round 1 시작 가능" },
  { round: "1", p: 40, q: 0, bottom: 80, title: "Round 1은 QUALITY 대신 CONVERGE로 시작합니다", detail: "유효한 ticket과 justification을 가진 CONVERGE 중 protocol 규칙으로 proposal P를 선택합니다. CONVERGE는 round 0에는 없습니다.", action: "P 선택 · PREPARE로 이동" },
  { round: "1", p: 80, q: 0, bottom: 80, title: "P의 PREPARE와 COMMIT이 80에 닿아 DECIDE로 갑니다", detail: "새 round에서도 threshold는 낮아지지 않습니다. 달라진 것은 표가 모일 기회와 공유된 evidence이지 safety 기준이 아닙니다.", action: "P 결정 경로 복구" },
  { round: "1+", p: 80, q: 0, bottom: 80, title: "진행이 멈추면 현재·이전 phase evidence를 다시 보냅니다", detail: "높은 round에서는 phase timeout이 길어져도 별도 rebroadcast timer가 작동합니다. 네트워크가 끝내 회복되지 않으면 safety는 지켜도 종료는 보장할 수 없습니다.", action: "eventual delivery 뒤 진행" },
] as const;
const RECOVERY_NOTES = RECOVERY_STATES.map((state) => `${state.title}. ${state.detail} ${state.action}`);

function VoteBar({ label, value, tone }: { label: string; value: number; tone: "primary" | "muted" | "bottom" }) {
  const color = tone === "primary" ? "bg-primary" : tone === "bottom" ? "bg-foreground" : "bg-muted-foreground/35";
  return <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_2.5rem] items-center gap-2">
    <span className="text-[10px] font-bold">{label}</span>
    <span className="h-3 bg-border/60"><span className={`block h-full transition-[width] duration-500 ${color}`} style={{ width: `${(value / 120) * 100}%` }} /></span>
    <strong className="text-right font-mono text-xs">{value}</strong>
  </div>;
}

export function GpbftRecoveryViz() {
  const scenes = useAnimatedScenes(RECOVERY_LABELS.length, 7200, { loop: false });
  const state = RECOVERY_STATES[scenes.active];
  return <VizFrame eyebrow="충돌 제안 복구 · 같은 total power 120" title="정족수가 갈리면 bottom으로 이번 round를 닫고 다음 round에서 다시 좁힙니다" description="Bottom, CONVERGE, rebroadcast가 각각 무엇을 바꾸고 무엇을 바꾸지 않는지 한 경로로 봅니다." note="P=65와 Q=55는 recovery를 보여 주기 위한 가정입니다. 실제 proposal 선택은 candidate set, ticket, justification과 ECChain compatibility 검증을 함께 사용합니다." documentFlow canvasClassName="p-3 sm:p-6">
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="GossiPBFT 충돌 복구 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {RECOVERY_LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
        </div>
        <div className="grid gap-4">
          <div className="border border-border bg-background p-4">
            <div className="flex justify-between border-b border-border pb-3"><span className="text-[10px] font-bold text-muted-foreground">현재 round</span><strong className="font-mono text-sm">{state.round}</strong></div>
            <div className="mt-5 space-y-4"><VoteBar label="P" value={state.p} tone="primary" /><VoteBar label="Q" value={state.q} tone="muted" /><VoteBar label={state.round === "0" ? "bottom" : "⊥ evidence"} value={state.bottom} tone="bottom" /></div>
            <div className="relative mt-7 border-t border-dashed border-foreground/50 pt-2 text-right text-[9px] font-bold"><span>strong quorum 80</span></div>
          </div>
          <div className="border border-border bg-background p-4">
            <p className="text-[10px] font-black text-primary">장면 {scenes.active + 1} / {RECOVERY_LABELS.length}</p>
            <h4 className="mt-2 break-keep text-base font-black leading-6">{state.title}</h4>
            <p className="mt-3 break-keep text-xs leading-6 text-muted-foreground">{state.detail}</p>
            <p className="mt-4 border-l-2 border-primary pl-3 text-xs font-bold leading-5">{state.action}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={RECOVERY_LABELS} controlLabels={RECOVERY_LABELS} playLabel="복구 경로 재생" compact />
      </div>
      <StaticSceneList labels={RECOVERY_LABELS} notes={RECOVERY_NOTES} />
    </div>
  </VizFrame>;
}

const BOUNDARY_ROWS = [
  ["Gossipsub publish", "로컬 broadcast 요청을 접수", "상대가 받음·정족수·합의"],
  ["Message 수신", "Peer에서 bytes를 받음", "서명·domain·chain 유효성"],
  ["Validated vote", "해당 instance·round·phase에서 셀 수 있음", "같은 value의 strong quorum"],
  ["Phase justification", "이전 strong quorum을 aggregate signature로 증명", "최종 decision certificate"],
  ["DECIDE 한 장", "COMMIT strong quorum 근거를 다른 참가자에게 전달", "DECIDE sender power의 strong quorum"],
  ["Decision certificate", "GPBFT가 같은 ECChain을 반환", "거래 실행·EC 반영·외부 서비스 완료"],
] as const;

export function GpbftBoundaryViz() {
  return <VizFrame eyebrow="수신·검증·합의·실행의 경계" title="같은 ‘완료’로 부르면 안 되는 여섯 상태" description="각 상태가 확인해 주는 사실과 다음 계층에서 별도로 확인해야 할 사실을 나눕니다." documentFlow canvasClassName="p-0">
    <ResponsiveVizTable columns={["상태", "확인되는 것", "아직 확인되지 않는 것"]} rows={BOUNDARY_ROWS} desktopMinWidthClassName="min-w-[860px]" />
  </VizFrame>;
}
