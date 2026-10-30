import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "두 요청 도착",
  "1차 gate",
  "Cache 선점",
  "CheckTx 응답",
  "Callback 경쟁",
  "Proposal 후보",
  "B41 Commit",
  "Update 제거",
  "Recheck 정리",
] as const;

type StateKey = "app" | "cache" | "pool" | "proposal";

const STATES: readonly {
  method: string;
  owner: string;
  input: string;
  app: string;
  cache: string;
  pool: string;
  proposal: string;
  receipt: string;
  changed: readonly StateKey[];
}[] = [
  {
    method: "CheckTx",
    owner: "RPC · P2P caller",
    input: "h40 · pool 900/1000B · T1 80B · T2 80B",
    app: "X40",
    cache: "T1·T2 없음",
    pool: "기존 900B",
    proposal: "기존 후보만",
    receipt: "두 요청은 같은 node에 도착했지만 아직 cache나 pool에 들어가지 않았습니다.",
    changed: [],
  },
  {
    method: "isFull · preCheck",
    owner: "CListMempool",
    input: "각 요청이 900+80≤1000을 관찰",
    app: "X40",
    cache: "T1·T2 없음",
    pool: "기존 900B",
    proposal: "변화 없음",
    receipt: "Count·pool bytes·단건 크기·preCheck를 통과했지만 application validity는 아직 모릅니다.",
    changed: ["pool"],
  },
  {
    method: "cache.Push",
    owner: "TxCache",
    input: "TxKey(T1) · TxKey(T2)",
    app: "X40",
    cache: "T1·T2 선점",
    pool: "기존 900B",
    proposal: "변화 없음",
    receipt: "Cache 선점은 duplicate CheckTx를 줄이는 표식이며 active pool membership이 아닙니다.",
    changed: ["cache"],
  },
  {
    method: "CheckTxAsync",
    owner: "ABCI application",
    input: "T1 OK · T2 OK · GasWanted 반환",
    app: "X40 기준 판정",
    cache: "T1·T2 있음",
    pool: "Callback 전 900B",
    proposal: "아직 후보 아님",
    receipt: "두 application 응답이 OK여도 callback이 pool에 넣기 전까지 proposal 후보가 아닙니다.",
    changed: ["app"],
  },
  {
    method: "resCbFirstTime · addTx",
    owner: "서로 다른 callback",
    input: "둘 다 900+80≤1000을 본 뒤 addTx",
    app: "X40",
    cache: "T1·T2 있음",
    pool: "T1·T2 · 1060B",
    proposal: "둘 다 local 후보",
    receipt: "두 번째 용량 검사도 삽입과 원자적이지 않아 strict ceiling보다 커질 수 있습니다.",
    changed: ["pool", "proposal"],
  },
  {
    method: "ReapMaxBytesMaxGas",
    owner: "Proposer 쪽 mempool",
    input: "List 순서 · encoded bytes · GasWanted",
    app: "X40",
    cache: "T1·T2 있음",
    pool: "T1 앞 · T2 뒤",
    proposal: "T1 선택 · T2 잔류",
    receipt: "Reap은 local snapshot을 읽을 뿐 다른 node의 순서나 block 포함을 확정하지 않습니다.",
    changed: ["proposal"],
  },
  {
    method: "Commit",
    owner: "BlockExecutor · application",
    input: "B41에 T1과 Carol 잔액을 쓰는 다른 tx 포함",
    app: "X41 영속화",
    cache: "아직 T1·T2 있음",
    pool: "Update 전 T1·T2",
    proposal: "B41 결정",
    receipt: "Mempool lock과 pending CheckTx flush 뒤 application이 X41을 Commit합니다.",
    changed: ["app", "proposal"],
  },
  {
    method: "Update(41)",
    owner: "CListMempool",
    input: "B41 tx와 TxResults · 새 pre/postCheck",
    app: "X41",
    cache: "T1 유지 · T2 유지",
    pool: "T1 제거 · T2 잔류",
    proposal: "새 height signal 재설정",
    receipt: "Committed T1은 pool에서 빠지지만 valid committed key는 cache에 남아 즉시 중복 재입장을 막습니다.",
    changed: ["cache", "pool", "proposal"],
  },
  {
    method: "CheckTxType_Recheck",
    owner: "Recheck cursor",
    input: "남은 T2를 X41에서 다시 판정 · invalid",
    app: "X41 기준 거절",
    cache: "설정에 따라 T2 제거",
    pool: "T2 제거",
    proposal: "새 후보 없음",
    receipt: "Recheck는 commit 뒤 조건이 바뀐 잔류 transaction을 제거합니다. Timeout은 모두 valid하다는 영수증이 아닙니다.",
    changed: ["app", "cache", "pool", "proposal"],
  },
] as const;

const NOTES = [
  "Node N의 현재 높이는 40이고 active pool raw bytes는 900입니다. T1은 alice→bob 10, T2는 carol→dave 5이며 둘 다 80 bytes라고 두겠습니다.",
  "CheckTx는 update read lock 아래에서 현재 count와 bytes, 단건 크기, preCheck와 application connection을 순서대로 확인합니다. 이 검사는 transaction 의미를 확정하지 않습니다.",
  "TxCache.Push가 false면 이미 본 bytes이므로 application에 다시 보내지 않습니다. Cache에 있다는 사실과 현재 CList에 있다는 사실은 서로 다릅니다.",
  "새 transaction은 CheckTxAsync로 application에 전달됩니다. Request별 callback은 sender 정보와 first-time admission을 처리합니다.",
  "resCbFirstTime은 Code·postCheck 뒤 isFull을 다시 호출합니다. 그러나 isFull과 addTx 사이를 하나의 mutex로 묶지 않으므로 concurrent callback이 같은 900을 읽을 수 있습니다.",
  "Reap은 list 앞에서부터 protobuf encoded size와 GasWanted 누계를 더합니다. Max를 넘기는 마지막 transaction은 반환 slice에서 뺍니다.",
  "BlockExecutor는 mempool을 잠그고 pending application CheckTx를 flush한 뒤 Commit합니다. Update는 별도 goroutine에서 실행되지만 lock은 Update가 끝날 때까지 유지됩니다.",
  "Update는 block에 들어간 T1을 local pool에서 지우고 valid committed key를 cache에 남깁니다. Height별 TxsAvailable 표식도 다시 시작합니다.",
  "남은 snapshot의 T2는 CheckTxType_Recheck로 X41에서 다시 검사합니다. Block의 다른 transaction이 Carol의 잔액을 썼다면 T2는 이제 invalid라 pool에서 빠집니다.",
] as const;

function StateCell({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`min-w-0 border p-2.5 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="block text-[9px] font-black text-muted-foreground">{label}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-5 sm:text-xs">{value}</strong>
    </div>
  );
}

export default function MempoolLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7000, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const active = (key: StateKey) => state.changed.includes(key);

  useEffect(() => {
    const scroller = tabsRef.current;
    const selected = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !selected) return;
    const left = selected.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - selected.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="CometBFT v0.40.0 · local mempool 한 세대"
      title="두 transaction이 admission부터 commit 뒤 recheck까지 이동하는 상태를 추적합니다"
      description="Cache, active pool, proposal snapshot과 application state를 따로 표시합니다."
      note="호출과 동시성 경계는 content commit 0880b4d3의 CListMempool·BlockExecutor 구현에 맞췄습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-cometbft-mempool-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="두 transaction의 local admission부터 commit 뒤 recheck까지 아홉 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-9 gap-px bg-border p-px" style={{ width: "max(100%, 720px)" }}>
              {SCENES.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={index === scenes.active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[8px] leading-3">{label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-[31rem] border-y border-border py-3 sm:min-h-[32rem] sm:py-4">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[9px] font-bold text-muted-foreground">이번 입력</div>
              <div className="min-w-0 bg-background p-3 font-mono text-[10px] font-bold leading-5 text-primary sm:text-xs">{state.input}</div>
            </div>

            <div className="my-3 grid grid-cols-2 gap-2 sm:gap-3">
              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="application과 cache 상태">
                <span className="text-[9px] font-black text-muted-foreground">VALIDATION</span>
                <div className="mt-2 grid gap-1.5">
                  <StateCell label="APPLICATION" value={state.app} active={active("app")} />
                  <StateCell label="SEEN CACHE" value={state.cache} active={active("cache")} />
                </div>
              </section>

              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="pool과 proposal 상태">
                <span className="text-[9px] font-black text-muted-foreground">CANDIDATES</span>
                <div className="mt-2 grid gap-1.5">
                  <StateCell label="ACTIVE POOL" value={state.pool} active={active("pool")} />
                  <StateCell label="PROPOSAL VIEW" value={state.proposal} active={active("proposal")} />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[9px] font-bold text-muted-foreground">현재 owner</div>
              <div className="min-w-0 bg-background p-3 text-[10px] font-bold leading-5 sm:text-xs">{state.method} · {state.owner}</div>
            </div>
            <div className="mt-px grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[9px] font-bold text-muted-foreground">남은 사실</div>
              <div className="min-w-0 bg-background p-3 text-[10px] font-bold leading-5 sm:text-xs">{state.receipt}</div>
            </div>

            <p data-scene-note className="mt-3 min-h-[5rem] border-l-2 border-primary/50 pl-3 text-[10px] leading-5 text-muted-foreground sm:min-h-[6rem] sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="Mempool 상태 전이 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
