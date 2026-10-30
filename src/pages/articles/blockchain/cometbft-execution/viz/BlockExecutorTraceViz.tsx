import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "입력 확인",
  "구조 검사",
  "연속성 검사",
  "결과 계산",
  "응답 저장",
  "State 계산",
  "앱 영속화",
  "노드 저장",
  "재시작 판정",
] as const;

type Field = "block" | "response" | "node" | "app" | "mempool";

const STATES: readonly {
  method: string;
  owner: string;
  input: string;
  block: string;
  response: string;
  node: string;
  app: string;
  mempool: string;
  gate: string;
  changed: readonly Field[];
}[] = [
  {
    method: "ApplyBlock",
    owner: "BlockExecutor",
    input: "C40 · decided B41 · BlockID41",
    block: "B41 저장",
    response: "없음",
    node: "C40 · A40",
    app: "X40 · A40",
    mempool: "T지급 포함",
    gate: "합의가 순서를 정했지만 application 실행은 아직 시작하지 않았습니다.",
    changed: ["block"],
  },
  {
    method: "ValidateBasic",
    owner: "Block·Header 자체",
    input: "B41 내부 bytes와 hash",
    block: "B41 구조 정상",
    response: "없음",
    node: "C40 · A40",
    app: "X40 · A40",
    mempool: "변화 없음",
    gate: "빈 필드·잘못된 길이·일관되지 않은 DataHash를 먼저 거절합니다.",
    changed: ["block"],
  },
  {
    method: "validateBlock",
    owner: "CometBFT State C40",
    input: "height·history·commitment·commit·time·evidence",
    block: "B41 ↔ C40 통과",
    response: "없음",
    node: "C40 · A40",
    app: "X40 · A40",
    mempool: "변화 없음",
    gate: "B41이 C40 바로 다음 block이고 이전 합의 증거가 맞아야 실행합니다.",
    changed: ["block", "node"],
  },
  {
    method: "FinalizeBlock",
    owner: "Application ExecuteTxState",
    input: "B41 transaction·commit·evidence",
    block: "B41 저장",
    response: "R41 · A41 memory",
    node: "C40 · A40",
    app: "X41 후보 · memory",
    mempool: "T지급 포함",
    gate: "Transaction 수와 TxResults 수가 같아야 다음 단계로 갑니다.",
    changed: ["response", "app"],
  },
  {
    method: "Save response",
    owner: "CometBFT StateStore",
    input: "SaveFinalizeBlockResponse(41, R41)",
    block: "B41 저장",
    response: "R41 · A41 저장",
    node: "C40 · A40",
    app: "X41 후보 · memory",
    mempool: "T지급 포함",
    gate: "Application Commit보다 먼저 R41을 남겨 재시작 때 결과를 복원합니다.",
    changed: ["response"],
  },
  {
    method: "updateState",
    owner: "BlockExecutor memory",
    input: "C40 + Header41 + R41",
    block: "B41 저장",
    response: "R41 · A41 저장",
    node: "C41* · AppHash 비어 있음",
    app: "X41 후보 · memory",
    mempool: "T지급 포함",
    gate: "Validator·parameter update를 계산하지만 AppHash는 Commit 뒤에 채웁니다.",
    changed: ["node"],
  },
  {
    method: "Commit",
    owner: "Application",
    input: "mempool lock·flush → Commit",
    block: "B41 저장",
    response: "R41 · A41 저장",
    node: "C41* · memory",
    app: "X41 · A41 durable",
    mempool: "잠금 · Update 시작",
    gate: "Commit이 반환되기 전에 application이 X41을 영속화해야 합니다.",
    changed: ["app", "mempool"],
  },
  {
    method: "StateStore.Save",
    owner: "CometBFT",
    input: "C41*.AppHash ← R41.AppHash",
    block: "B41 저장",
    response: "R41 · A41 저장",
    node: "C41 · A41 저장",
    app: "X41 · A41 durable",
    mempool: "비동기 재검사",
    gate: "세 저장 위치가 h41로 맞은 뒤 pruning과 event 발행을 시도합니다.",
    changed: ["node", "mempool"],
  },
  {
    method: "Handshake",
    owner: "CometBFT replay",
    input: "block·response·node State·app height 비교",
    block: "B41 저장",
    response: "R41 · A41 저장",
    node: "C41 또는 C40",
    app: "X41 또는 X40",
    mempool: "복구 뒤 재검사",
    gate: "app h40이면 real app, app h41·State h40이면 saved R41의 mock app으로 재생합니다.",
    changed: ["block", "response", "node", "app"],
  },
] as const;

const NOTES = [
  "Consensus는 B41의 순서를 결정하고 block store에 남겼습니다. ApplyBlock의 시작점에서 CometBFT State와 application durable state는 아직 모두 h40입니다.",
  "Block.ValidateBasic은 block 내부 형식과 hash 관계를 검사합니다. 이 단계는 현재 chain State와의 연결이나 application transaction 성공을 증명하지 않습니다.",
  "validateBlock은 C40을 읽어 B41의 version·chain·height·LastBlockID·AppHash·validator hash·commit·time·evidence를 대조합니다. 실패하면 application을 호출하지 않습니다.",
  "FinalizeBlock은 결정된 B41을 X40 위에 실행해 transaction별 결과와 update, A41을 계산합니다. 이 결과는 아직 application disk에 commit되지 않았습니다.",
  "CometBFT는 R41을 application Commit 전에 저장합니다. Crash 뒤 app이 이미 h41이면 이 receipt로 CometBFT State만 재구성할 수 있습니다.",
  "updateState가 C41*를 만들지만 AppHash는 nil입니다. Validator update는 h43, consensus parameter update는 h42부터 반영되는 높이 차이도 이 함수가 계산합니다.",
  "Mempool connection의 pending 요청을 flush하고 잠근 상태에서 Commit을 호출합니다. 반환 뒤 mempool Update는 비동기로 실행되며 완료할 때까지 잠금이 유지됩니다.",
  "R41의 AppHash를 C41*에 넣어 StateStore에 저장합니다. 이 뒤 pruning과 event 발행을 시도하지만 event는 durable block receipt가 아닙니다.",
  "재시작은 마지막으로 남은 영수증을 봅니다. B41만 있고 app도 h40이면 실제 application에 재실행하고, app은 h41인데 node State가 h40이면 저장된 R41을 돌려주는 mock application으로 State만 복원합니다.",
] as const;

function StateCell({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`min-w-0 border p-2.5 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="block text-[9px] font-black text-muted-foreground">{label}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-5 sm:text-xs">{value}</strong>
    </div>
  );
}

export default function BlockExecutorTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7000, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const active = (field: Field) => state.changed.includes(field);

  useEffect(() => {
    const scroller = tabsRef.current;
    const selected = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !selected) return;
    const left = selected.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - selected.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="CometBFT v0.40.0 · 결정된 block의 적용"
      title="B41을 검증한 뒤 세 저장 위치를 h41로 맞춥니다"
      description="같은 B41을 따라가며 어느 단계가 계산이고, 어느 단계가 durable receipt인지 구분합니다."
      note="B41·C40·X40·R41은 설명용 이름입니다. 호출과 저장 순서는 commit 0880b4d3의 공식 코드에 맞췄습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-cometbft-execution-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="결정된 B41의 검증부터 crash recovery까지 아홉 장면으로 추적"
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
              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="CometBFT가 소유하는 저장 상태">
                <span className="text-[9px] font-black text-muted-foreground">COMETBFT</span>
                <div className="mt-2 grid gap-1.5">
                  <StateCell label="BLOCK STORE" value={state.block} active={active("block")} />
                  <StateCell label="FINALIZE RESPONSE" value={state.response} active={active("response")} />
                  <StateCell label="NODE STATE" value={state.node} active={active("node")} />
                </div>
              </section>

              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="Application과 mempool의 상태">
                <span className="text-[9px] font-black text-muted-foreground">APPLICATION</span>
                <div className="mt-2 grid gap-1.5">
                  <StateCell label="APP DURABLE" value={state.app} active={active("app")} />
                  <StateCell label="MEMPOOL" value={state.mempool} active={active("mempool")} />
                  <StateCell label="현재 OWNER" value={`${state.method} · ${state.owner}`} active />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[9px] font-bold text-muted-foreground">통과 조건</div>
              <div className="min-w-0 bg-background p-3 text-[10px] font-bold leading-5 sm:text-xs">{state.gate}</div>
            </div>

            <p data-scene-note className="mt-3 min-h-[6rem] border-l-2 border-primary/50 pl-3 text-[10px] leading-5 text-muted-foreground sm:min-h-[7rem] sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="B41 적용 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
