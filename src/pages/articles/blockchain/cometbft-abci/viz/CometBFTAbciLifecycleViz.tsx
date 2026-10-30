import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "커밋 상태",
  "후보 구성",
  "후보 판정",
  "B41 결정",
  "결정 실행",
  "결과 저장",
  "영속화",
  "재시작",
] as const;

type StateKey = "block" | "result" | "node" | "candidate" | "execute" | "durable";

const STATES: readonly {
  method: string;
  input: string;
  owner: string;
  block: string;
  result: string;
  node: string;
  candidate: string;
  execute: string;
  durable: string;
  receipt: string;
  changed: readonly StateKey[];
}[] = [
  {
    method: "대기",
    input: "h40 · mempool [T지급, T만료, T스테이킹]",
    owner: "각 node의 현재 정본",
    block: "높이 40까지",
    result: "h40 response",
    node: "State h40 · A40",
    candidate: "없음",
    execute: "S40",
    durable: "h40 · A40",
    receipt: "세 저장 위치가 모두 h40에서 맞습니다.",
    changed: [],
  },
  {
    method: "Prepare",
    input: "PrepareProposal · raw 3건 → [T스테이킹, T지급]",
    owner: "이번 round의 proposer application",
    block: "B41 후보 생성",
    result: "아직 없음",
    node: "State h40 · A40",
    candidate: "C(B41) · 선택 사항",
    execute: "S40 유지",
    durable: "h40 · A40",
    receipt: "응답 transaction은 max_tx_bytes 안에 있어야 합니다.",
    changed: ["block", "candidate"],
  },
  {
    method: "Process",
    input: "ProcessProposal · 같은 B41 bytes",
    owner: "각 validator application",
    block: "B41 · ACCEPT",
    result: "아직 없음",
    node: "State h40 · A40",
    candidate: "C(B41) 격리",
    execute: "S40 유지",
    durable: "h40 · A40",
    receipt: "ACCEPT는 prevote 자격이지 commit이나 실행 성공이 아닙니다.",
    changed: ["block", "candidate"],
  },
  {
    method: "Consensus",
    input: "+2/3 precommit · BlockID B41",
    owner: "CometBFT consensus",
    block: "block store · B41",
    result: "아직 없음",
    node: "State h40 · A40",
    candidate: "C(B41) 보존",
    execute: "S40 유지",
    durable: "h40 · A40",
    receipt: "순서는 결정됐지만 application state는 아직 h40입니다.",
    changed: ["block"],
  },
  {
    method: "Finalize",
    input: "FinalizeBlock · decided B41",
    owner: "Consensus connection의 ExecuteTxState",
    block: "block store · B41",
    result: "TxResults · A41",
    node: "State h40 · A40",
    candidate: "B41이면 승격",
    execute: "S41 · A41 · memory",
    durable: "h40 · A40",
    receipt: "후보가 없으면 B41을 다시 실행하며, 여기서는 디스크에 commit하지 않습니다.",
    changed: ["result", "candidate", "execute"],
  },
  {
    method: "Save result",
    input: "SaveFinalizeBlockResponse(h41)",
    owner: "CometBFT response store",
    block: "block store · B41",
    result: "h41 response 저장",
    node: "State h40 · A40",
    candidate: "나머지 후보 폐기",
    execute: "S41 · A41 · memory",
    durable: "h40 · A40",
    receipt: "Crash 시 FinalizeBlock을 재실행해 저장된 response와 비교할 수 있습니다.",
    changed: ["result", "candidate"],
  },
  {
    method: "Commit",
    input: "mempool lock → flush → Commit → State save",
    owner: "Application, 그다음 CometBFT",
    block: "block store · B41",
    result: "h41 response 저장",
    node: "State h41 · A41",
    candidate: "없음",
    execute: "S41 → committed",
    durable: "h41 · A41",
    receipt: "Application이 먼저 durable h41을 만든 뒤 CometBFT State가 h41로 저장됩니다.",
    changed: ["node", "execute", "durable"],
  },
  {
    method: "Handshake",
    input: "재시작 · Info.LastBlockHeight/AppHash 조회",
    owner: "CometBFT replay",
    block: "block store · h41",
    result: "response store · h41",
    node: "State h41 · A41",
    candidate: "없음",
    execute: "S41",
    durable: "h41 · A41",
    receipt: "block만 있으면 Finalize부터, response까지 있으면 재실행·대조 후 Commit합니다.",
    changed: ["block", "result", "node", "durable"],
  },
] as const;

const NOTES = [
  "시작점은 세 저장 위치의 높이가 40으로 일치하는 상태입니다. Mempool의 transaction은 아직 후보일 뿐 application state를 바꾸지 않았습니다.",
  "Proposer의 CometBFT가 raw transaction을 모아 PrepareProposal을 호출합니다. Application은 만료 transaction을 빼고 순서를 바꿀 수 있지만 반환 bytes는 max_tx_bytes를 넘으면 안 됩니다.",
  "모든 correct validator가 같은 B41을 ProcessProposal로 검사합니다. 판정은 B41과 이전 committed S40에만 의존해야 하며 candidate 실행 결과는 정본 S40과 분리합니다.",
  "합의가 B41의 순서를 결정하고 block store에 기록합니다. 이 시점에는 application의 ExecuteTxState와 durable state가 여전히 S40입니다.",
  "FinalizeBlock이 결정된 B41을 authoritative하게 실행합니다. 같은 candidate가 있으면 승격할 수 있고, 없거나 버렸다면 다시 실행합니다. Response의 TxResults와 AppHash는 결정적이어야 합니다.",
  "CometBFT는 application Commit 전에 FinalizeBlock response를 저장합니다. 이 중간 receipt 덕분에 crash 후 재실행한 결과가 원래 response와 같은지 대조할 수 있습니다.",
  "CometBFT가 mempool을 잠그고 pending CheckTx를 flush한 뒤 Commit을 호출합니다. Application은 Commit 안에서 S41을 영속화하고, 반환 뒤 CometBFT가 AppHash A41을 포함한 node State를 저장합니다.",
  "재시작 때 application Info와 세 저장소 높이를 비교합니다. 남은 기록에 따라 다음 높이로 가거나 FinalizeBlock·Commit을 재생합니다.",
] as const;

function Fact({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className={`min-w-0 border p-2.5 sm:p-3 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="block text-[8px] font-bold text-muted-foreground sm:text-[9px]">{label}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-5 sm:text-xs">{value}</strong>
    </div>
  );
}

export default function CometBFTAbciLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6400, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const active = (key: StateKey) => state.changed.includes(key);

  useEffect(() => {
    const scroller = tabsRef.current;
    const target = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !target) return;
    const left = target.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="CometBFT v0.40.0 · 한 높이의 상태 소유권"
      title="B41 후보가 application의 durable h41이 될 때까지"
      description="호출 이름보다 block store·Finalize response·node State와 candidate·ExecuteTx·durable state가 언제 달라지는지 먼저 봅니다."
      note="B41·A40·A41과 transaction 이름은 설명용입니다. 순서와 method 의미는 commit 0880b4d3의 공식 규격과 소스로 확인했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-cometbft-abci-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="B41의 PrepareProposal부터 crash recovery까지 여덟 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 650px)" }}>
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
              <div className="bg-background p-3 text-[8px] font-bold text-muted-foreground sm:text-[9px]">이번 입력</div>
              <div className="min-w-0 bg-background p-3 font-mono text-[9px] font-bold leading-5 text-primary sm:text-xs">{state.input}</div>
            </div>

            <div className="my-3 grid grid-cols-[minmax(0,1fr)_4.25rem_minmax(0,1fr)] items-stretch gap-1.5 sm:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)] sm:gap-3">
              <section className="border border-border bg-background p-2 sm:p-3" aria-label="CometBFT가 소유하는 상태">
                <span className="text-[8px] font-black text-muted-foreground sm:text-[9px]">COMETBFT</span>
                <div className="mt-2 grid gap-1.5">
                  <Fact label="BLOCK STORE" value={state.block} active={active("block")} />
                  <Fact label="FINALIZE RESPONSE" value={state.result} active={active("result")} />
                  <Fact label="NODE STATE" value={state.node} active={active("node")} />
                </div>
              </section>

              <div className="flex min-w-0 flex-col items-center justify-center border-y border-border px-1 text-center">
                <span className="font-mono text-[7px] font-black text-primary sm:text-[10px]">{state.method}</span>
                <span aria-hidden className="my-2 text-sm text-muted-foreground">⇄</span>
                <span className="break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[9px] sm:leading-4">{state.owner}</span>
              </div>

              <section className="border border-border bg-background p-2 sm:p-3" aria-label="Application이 소유하는 상태">
                <span className="text-[8px] font-black text-muted-foreground sm:text-[9px]">APPLICATION</span>
                <div className="mt-2 grid gap-1.5">
                  <Fact label="CANDIDATE" value={state.candidate} active={active("candidate")} />
                  <Fact label="EXECUTE TX" value={state.execute} active={active("execute")} />
                  <Fact label="DURABLE" value={state.durable} active={active("durable")} />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[8px] font-bold text-muted-foreground sm:text-[9px]">남은 증거</div>
              <div className="min-w-0 bg-background p-3 text-[10px] font-bold leading-5 text-foreground sm:text-xs">{state.receipt}</div>
            </div>

            <p data-scene-note className="mt-3 min-h-[6.5rem] border-l-2 border-primary/50 pl-3 text-[10px] leading-5 text-muted-foreground sm:min-h-[7rem] sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="B41 상태 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
