import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_LABELS = ["A 분기 활성", "B 분기 동률", "B3 도착", "A 분기 해제", "B 분기 적용", "새 head"] as const;

const TRACE_STATES = [
  {
    title: "노드는 P-A1-A2를 활성 체인으로 실행하고 있습니다.",
    now: "A1의 송금 x와 A2의 상태 변경이 UTXO 집합에 반영돼 있습니다.",
    evidence: "A2까지 누적 work는 공통 조상 P 이후 2입니다.",
    pending: "다른 유효 분기 B1은 보였지만 누적 work가 1이라 활성화하지 않습니다.",
  },
  {
    title: "B2가 도착해 두 분기의 누적 work가 2로 같아집니다.",
    now: "이 예의 노드는 먼저 활성화할 수 있었던 A 분기를 그대로 유지합니다.",
    evidence: "Bitcoin Core의 후보 정렬은 누적 work가 같으면 로컬 sequence 순서를 사용합니다.",
    pending: "동률은 전역 finality가 아닙니다. 다른 노드는 B를 보고 있을 수 있습니다.",
  },
  {
    title: "B3가 도착하자 B 분기의 누적 work가 3으로 커집니다.",
    now: "가용한 후보 가운데 B3가 가장 큰 nChainWork를 가진 head가 됩니다.",
    evidence: "FindMostWorkChain은 알려진 invalid 조상과 block data가 없는 후보를 제외합니다.",
    pending: "후보를 골랐다고 아직 B의 transaction state가 적용된 것은 아닙니다.",
  },
  {
    title: "활성 tip에서 공통 조상 P까지 A2와 A1을 역순으로 해제합니다.",
    now: "각 block의 undo data로 UTXO 변경을 되돌리고, 송금 x는 disconnected transaction이 됩니다.",
    evidence: "활성 chainstate가 P의 상태로 돌아와 새 분기를 적용할 준비가 됩니다.",
    pending: "x가 새 분기와 충돌하지 않을 때만 mempool 후보로 돌아갈 수 있습니다.",
  },
  {
    title: "공통 조상 다음의 B1, B2, B3를 차례로 검증하고 적용합니다.",
    now: "ConnectTip이 transaction·script·UTXO 전이를 확인하며 새 chainstate를 만듭니다.",
    evidence: "중간 block이 invalid면 그 분기를 실패로 표시하고 다른 후보를 다시 찾습니다.",
    pending: "세 block을 모두 연결하기 전에는 B3를 활성 tip으로 외부에 알리지 않습니다.",
  },
  {
    title: "B3가 새 활성 head가 되고 지갑의 confirmation도 다시 계산됩니다.",
    now: "A 분기에만 있던 x는 미확정으로 돌아가거나 B 분기 transaction과 충돌해 제외됩니다.",
    evidence: "노드는 누적 work가 더 큰 유효 분기로 수렴했습니다.",
    pending: "B3도 더 큰 competing work가 나타나면 바뀔 수 있으므로 deterministic finality는 아닙니다.",
  },
] as const;

const TRACE_NOTES = TRACE_STATES.map((state) => `${state.title} ${state.now} ${state.evidence} ${state.pending}`);

type BranchBlock = { id: string; work: number; transaction?: string };

const BRANCH_A: BranchBlock[] = [
  { id: "A1", work: 1, transaction: "송금 x" },
  { id: "A2", work: 1 },
];

const BRANCH_B: BranchBlock[] = [
  { id: "B1", work: 1 },
  { id: "B2", work: 1 },
  { id: "B3", work: 1 },
];

function visibleCount(branch: "A" | "B", scene: number) {
  if (branch === "A") return 2;
  if (scene === 0) return 1;
  if (scene === 1) return 2;
  return 3;
}

function branchMode(branch: "A" | "B", scene: number) {
  if (branch === "A") {
    if (scene <= 2) return "active";
    if (scene === 3) return "disconnect";
    return "inactive";
  }
  if (scene <= 1) return "inactive";
  if (scene === 2) return "candidate";
  if (scene === 3) return "pending";
  return "active";
}

function Branch({ name, blocks, scene }: { name: "A" | "B"; blocks: readonly BranchBlock[]; scene: number }) {
  const count = visibleCount(name, scene);
  const mode = branchMode(name, scene);
  const sum = blocks.slice(0, count).reduce((total, block) => total + block.work, 0);
  const label = mode === "active" ? "활성" : mode === "candidate" ? "교체 후보" : mode === "disconnect" ? "해제 중" : mode === "pending" ? "적용 대기" : "비활성";
  const emphasized = mode !== "inactive";

  return (
    <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2">
      <div className="text-right">
        <p className="text-[10px] font-black text-foreground">분기 {name}</p>
        <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground">work {sum}</p>
      </div>
      <div className="flex min-w-0 items-center gap-1">
        {blocks.map((block, index) => {
          const visible = index < count;
          return (
            <div key={block.id} className="contents">
              {index > 0 && <span className={`h-px min-w-2 flex-1 ${visible ? "bg-border" : "bg-transparent"}`} />}
              <div className={`min-w-[3.35rem] border px-1.5 py-2 text-center transition-colors duration-200 sm:min-w-[4.4rem] ${!visible ? "border-dashed border-border/30 bg-muted/10 text-muted-foreground/25" : mode === "active" ? "border-primary bg-primary text-primary-foreground" : mode === "candidate" ? "border-primary bg-primary/10 text-foreground" : mode === "disconnect" ? "border-destructive/70 bg-destructive/10 text-foreground" : mode === "pending" ? "border-border bg-muted/50 text-foreground" : "border-border bg-background text-muted-foreground"}`}>
                <p className="text-[10px] font-black sm:text-xs">{block.id}</p>
                <p className="mt-0.5 text-[8px] font-semibold opacity-80">+{block.work}</p>
                {block.transaction && <p className="mt-1 break-keep text-[8px] font-bold">{block.transaction}</p>}
              </div>
            </div>
          );
        })}
        <span className={`ml-1 shrink-0 text-[9px] font-black ${emphasized ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
      </div>
    </div>
  );
}

function Progress({ active }: { active: number }) {
  return (
    <div className="mt-4 grid grid-cols-6 gap-1" aria-hidden="true">
      {TRACE_LABELS.map((label, index) => <span key={label} className={`h-1.5 ${index <= active ? "bg-primary" : "bg-border"}`} />)}
    </div>
  );
}

export function NakamotoReorgTraceViz() {
  const scenes = useAnimatedScenes(TRACE_LABELS.length, 6000, { loop: false });
  const state = TRACE_STATES[scenes.active];
  const stateLabel = scenes.active <= 2 ? "A의 UTXO" : scenes.active === 3 ? "P의 UTXO" : scenes.active === 4 ? "B 적용 중" : "B의 UTXO";

  return (
    <VizFrame eyebrow="한 번의 자연 분기 · block work는 모두 1" title="A 분기를 실행하던 노드가 B3를 받고 재조직하는 과정" description="후보 head 선택과 실제 chainstate 교체를 여섯 단계로 분리해 추적합니다." note="P·A1·B1 같은 이름과 work=1은 설명용입니다. 실제 Bitcoin은 target에서 정수 work를 계산합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="활성 A 분기가 더 큰 누적 work의 B 분기로 재조직되는 여섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage>
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {TRACE_LABELS[scenes.active]}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>
          <div className="mt-3 grid gap-3 xl:grid-cols-[1.18fr_.82fr]">
            <div className="border border-border bg-background p-3">
              <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2">
                <span className="text-right text-[9px] font-semibold text-muted-foreground">공통</span>
                <div className="flex items-center gap-2"><div className="border border-foreground/40 bg-foreground px-3 py-2 text-[10px] font-black text-background">P</div><span className="text-[9px] font-semibold text-muted-foreground">분기점</span></div>
              </div>
              <div className="mt-3 space-y-3"><Branch name="A" blocks={BRANCH_A} scene={scenes.active} /><Branch name="B" blocks={BRANCH_B} scene={scenes.active} /></div>
              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-border pt-3 text-center text-[10px] font-bold">
                <div className={`border p-2 ${scenes.active === 3 ? "border-destructive/70 bg-destructive/10" : "border-border bg-card"}`}>{stateLabel}</div>
                <span className="text-muted-foreground">·</span>
                <div className="border border-border bg-card p-2">송금 x · {scenes.active <= 2 ? "확인됨" : scenes.active === 3 ? "연결 해제" : scenes.active === 4 ? "재검사" : "미확정 또는 충돌"}</div>
              </div>
            </div>
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 xl:block xl:space-y-px xl:overflow-visible xl:border xl:border-border xl:bg-border xl:p-px">
              <div className="w-[86%] shrink-0 snap-start border border-border bg-background p-3 xl:w-auto xl:border-0"><p className="text-[10px] font-semibold text-muted-foreground">지금 바뀌는 상태</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.now}</p></div>
              <div className="w-[86%] shrink-0 snap-start border border-border bg-background p-3 xl:w-auto xl:border-0"><p className="text-[10px] font-semibold text-muted-foreground">판단 근거</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.evidence}</p></div>
              <div className="w-[86%] shrink-0 snap-start border border-border bg-background p-3 xl:w-auto xl:border-0"><p className="text-[10px] font-semibold text-muted-foreground">아직 보장하지 않는 것</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.pending}</p></div>
            </div>
          </div>
          <Progress active={scenes.active} />
        </div>
        <AnimatedSceneControls {...scenes} labels={TRACE_LABELS} controlLabels={TRACE_LABELS} playLabel="재조직 과정 재생" />
      </div>
      <StaticSceneList labels={TRACE_LABELS} notes={TRACE_NOTES} />
    </VizFrame>
  );
}

const IMPLEMENTATION_ROWS = [
  ["Block index", "GetBitsProof(nBits)", "parent.nChainWork + block work", "높이만 더하기"],
  ["후보 정렬", "CBlockIndexWorkComparator", "누적 work → activation sequence", "동률을 finality로 해석"],
  ["후보 검사", "FindMostWorkChain", "invalid 조상·누락 data 제외", "header work만 보고 실행"],
  ["상태 교체", "ActivateBestChainStep", "fork까지 disconnect → 새 branch connect", "UTXO를 한 번에 덮어쓰기"],
] as const;

export function ChainworkImplementationViz() {
  return (
    <VizFrame eyebrow="Bitcoin Core v32.1 · 고정된 구현 경로" title="누적 work를 기록하는 일과 chainstate를 바꾸는 일은 서로 다른 단계입니다" description="후보의 점수, 사용 가능성, transaction state 적용을 순서대로 구분합니다." documentFlow canvasClassName="p-0">
      <ResponsiveVizTable columns={["단계", "코드 경계", "상태 변화", "잘못된 단축"]} rows={IMPLEMENTATION_ROWS} desktopMinWidthClassName="min-w-[900px]" />
    </VizFrame>
  );
}

const FINALITY_ROWS = [
  ["현재 head", "가장 큰 유효 cumulative work", "새 work가 오면 즉시 바뀔 수 있음"],
  ["z만큼 뒤처진 공격자", "(q/p)^z · q<p인 단순 random walk", "고정 hash share·정상 전파 전제"],
  ["k-deep history", "두 정직한 view의 common prefix", "실행 구간·실패 확률·network model 필요"],
  ["외부 행동", "서비스가 정한 손실 예산과 확인 정책", "프로토콜이 결제 취소 불가를 선언하지 않음"],
] as const;

export function FinalityBoundaryViz() {
  return (
    <VizFrame eyebrow="Head · confirmation · 외부 행동" title="같은 ‘확정’이라는 말로 네 가지 판단을 합치지 않습니다" description="Fork choice는 현재 읽을 branch를 고르고, confirmation 정책은 되돌림 위험을 받아들일 시점을 정합니다." documentFlow canvasClassName="p-0">
      <ResponsiveVizTable columns={["관찰 대상", "판단 근거", "남아 있는 경계"]} rows={FINALITY_ROWS} desktopMinWidthClassName="min-w-[820px]" />
    </VizFrame>
  );
}
