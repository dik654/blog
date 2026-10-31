import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "H100 기준",
  "Build 시작",
  "P101 수신",
  "Proposal 포장",
  "후보 검증",
  "B101 Commit",
  "Finalized head",
  "Event branches",
  "경계 확인",
] as const;

type Lane = "consensus" | "adapter" | "execution" | "receipt";

const STATES: readonly {
  call: string;
  consensus: string;
  adapter: string;
  execution: string;
  receipt: string;
  changed: readonly Lane[];
}[] = [
  {
    call: "Keeper execution head 조회",
    consensus: "CometBFT 다음 height = 101 · 아직 proposal 없음",
    adapter: "AppHash A100 · execution head H100을 같은 기준점으로 읽음",
    execution: "canonical head=safe=finalized=H100",
    receipt: "출발점만 확인 · P101 bytes와 consensus commit은 아직 없음",
    changed: ["consensus", "adapter", "execution"],
  },
  {
    call: "forkchoiceUpdatedV3(H100, attributes)",
    consensus: "Height 101 proposer가 PrepareProposal 실행",
    adapter: "Timestamp·fee recipient·withdrawals·A100을 payload attributes로 조립",
    execution: "H100 위 build attempt 생성 → payloadId=id101",
    receipt: "id101은 local cached build handle · block hash나 commit이 아님",
    changed: ["adapter", "execution", "receipt"],
  },
  {
    call: "getPayloadV3(id101)",
    consensus: "PrepareProposal 10초 context 안에서 대기",
    adapter: "Configured build delay 뒤 id101로 payload envelope 요청",
    execution: "Candidate P101 bytes·block hash EP101·blob commitments 반환",
    receipt: "P101을 받았지만 proposal에 포함되거나 다른 node가 승인한 것은 아님",
    changed: ["adapter", "execution", "receipt"],
  },
  {
    call: "TxEncoder(vote messages + MsgExecutionPayload)",
    consensus: "Proposal C101에 transaction 한 개 배치",
    adapter: "P101과 blob commitments를 unsigned Cosmos message로 포장",
    execution: "Local candidate P101은 cache에 남음",
    receipt: "C101은 합의 후보 · canonical execution head는 여전히 H100",
    changed: ["consensus", "adapter", "receipt"],
  },
  {
    call: "ProcessProposal → parseAndVerify → newPayloadV3",
    consensus: "Validator마다 C101 수용 여부 판단",
    adapter: "Authority·withdrawals·parent H100·height·time·fee recipient 검사",
    execution: "P101 실행 판정 VALID · canonical pointer는 H100 유지",
    receipt: "VALID는 candidate execution receipt · consensus commit이 아님",
    changed: ["consensus", "adapter", "execution", "receipt"],
  },
  {
    call: "CometBFT prevote·precommit → Commit",
    consensus: "Validator quorum이 C101을 B101로 확정",
    adapter: "Finalize mode에서 같은 MsgExecutionPayload 실행 준비",
    execution: "Node에 따라 P101이 VALID·SYNCING이거나 아직 없을 수 있음",
    receipt: "B101 commit은 consensus order receipt · local Engine head 전진과 다름",
    changed: ["consensus", "adapter", "receipt"],
  },
  {
    call: "Finalize newPayloadV3 → forkchoiceUpdatedV3",
    consensus: "B101은 이미 commit됨",
    adapter: "P101을 다시 push하고 FCU가 SYNCING이면 같은 context에서 retry",
    execution: "head=safe=finalized=EP101로 전진",
    receipt: "이 node의 canonical execution head가 P101과 맞아짐",
    changed: ["adapter", "execution", "receipt"],
  },
  {
    call: "FilterLogs → event별 CacheMultiStore branch",
    consensus: "B101 order는 바뀌지 않음",
    adapter: "L0 성공→Write · L1 panic→버림 · L2 성공→Write",
    execution: "EP101 logs는 그대로 보존",
    receipt: "2/3 event branches 적용 · block 전체 all-or-nothing이 아님",
    changed: ["adapter", "receipt"],
  },
  {
    call: "execution head 저장 → withdrawals 삭제 → app commit",
    consensus: "B101 commit receipt",
    adapter: "Keeper head=EP101 · 성공한 L0/L2 state만 parent branch에 합침",
    execution: "canonical EP101 receipt",
    receipt: "합의·EVM head·event 적용을 따로 확인 · 외부 cross-chain 성공은 미확인",
    changed: ["consensus", "adapter", "execution", "receipt"],
  },
] as const;

const NOTES = [
  "CometBFT 높이 101과 EVM payload P101은 같은 객체가 아닙니다. Octane은 committed application state의 AppHash A100과 local execution head H100을 다음 build의 공통 출발점으로 사용합니다.",
  "Payload ID는 execution client 안의 build attempt를 가리키는 임시 handle입니다. 다른 node가 공유하는 block identity도, consensus가 승인한 영수증도 아닙니다.",
  "getPayloadV3가 반환한 envelope에는 실행 payload와 blobs 정보가 들어 있지만 이 시점에는 proposer의 local candidate일 뿐입니다.",
  "Pinned source는 vote-extension messages와 MsgExecutionPayload를 한 unsigned Cosmos transaction으로 encode합니다. Proposal 안에 들어갔다는 사실과 commit은 아직 다릅니다.",
  "ProcessProposal 경로는 deterministic envelope 조건을 먼저 검사하고 newPayloadV3 결과를 봅니다. INVALID는 거절하지만 SYNCING·ACCEPTED는 VALID로 바꾸어 기록하지 않습니다.",
  "CometBFT Commit은 C101의 순서를 확정합니다. 그러나 다른 validator의 execution client가 P101을 canonical head로 반영했다는 사실까지 대신 증명하지 않습니다.",
  "Finalize 경로는 payload를 다시 넣은 뒤 FCU가 성공할 때까지 retry합니다. 이때서야 local execution client의 head·safe·finalized가 모두 EP101을 가리킵니다.",
  "각 EVM log는 별도 cache branch에서 처리됩니다. Error나 panic이 난 event만 버리고 다음 event를 계속하므로 적용 비율과 실패 identity를 따로 기록해야 합니다.",
  "최종 확인에는 B101 consensus commit, EP101 canonical head, keeper execution head와 event별 적용 결과가 모두 필요합니다. 외부 chain에 message가 도착했다는 결론은 이 글의 증거 범위 밖입니다.",
] as const;

const laneStyle = (active: boolean) =>
  `grid min-w-0 grid-cols-[5.75rem_minmax(0,1fr)] gap-px border bg-border transition-colors duration-300 motion-reduce:transition-none sm:grid-cols-[8.5rem_minmax(0,1fr)] ${active ? "border-l-4 border-primary" : "border-border"}`;

function StateLane({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={laneStyle(active)}>
      <div className={`bg-background p-2.5 text-[8px] font-black sm:p-3 sm:text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</div>
      <strong className="min-w-0 break-keep bg-background p-2.5 text-[9px] leading-5 sm:p-3 sm:text-xs sm:leading-6">{value}</strong>
    </div>
  );
}

export function OctanePayloadTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7600, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const active = (lane: Lane) => state.changed.includes(lane);

  useEffect(() => {
    const scroller = tabsRef.current;
    if (!scroller) return;
    const centerSelected = () => {
      const selected = scroller.querySelector<HTMLElement>('button[aria-pressed="true"]');
      if (!selected) return;
      const left = selected.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
      scroller.scrollTo({ left: left - (scroller.clientWidth - selected.offsetWidth) / 2, behavior: "auto" });
    };
    centerSelected();
    const handleResize = () => window.requestAnimationFrame(centerSelected);
    const resizeObserver = new ResizeObserver(centerSelected);
    resizeObserver.observe(scroller);
    window.addEventListener("resize", handleResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="Omni Octane · payload P101 한 건"
      title="Build handle과 consensus commit, canonical execution head를 차례대로 구분합니다"
      description="CometBFT·Halo/Octane·execution client가 각각 소유하는 상태를 height 101 한 건으로 추적합니다."
      note="제어 순서는 Omni commit 9864f25의 abci.go, proposal_server.go, msg_server.go와 engineclient.go에 맞췄습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div id={scenes.playbackId} data-viz-live-only data-octane-scene={scenes.active} tabIndex={0} role="group" aria-label="Octane payload P101의 build부터 event 적용까지 아홉 장면으로 추적" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-9 gap-px bg-border p-px" style={{ width: "max(100%, 756px)" }}>
              {SCENES.map((label, index) => (
                <button key={label} type="button" aria-pressed={index === scenes.active} onClick={() => scenes.setActive(index)} className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[8px] leading-3">{label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-[27rem] border-y border-border py-3 sm:min-h-[30rem] sm:py-4">
            <div className="grid gap-2">
              <StateLane label="COMETBFT" value={state.consensus} active={active("consensus")} />
              <StateLane label="HALO · OCTANE" value={state.adapter} active={active("adapter")} />
              <StateLane label="EXECUTION CLIENT" value={state.execution} active={active("execution")} />
            </div>

            <div className="mt-3 grid grid-cols-[5.75rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <div className="bg-background p-2.5 text-[8px] font-bold text-muted-foreground sm:p-3 sm:text-[10px]">현재 호출</div>
              <div className="min-w-0 break-keep bg-background p-2.5 text-[9px] font-bold leading-5 sm:p-3 sm:text-xs">{state.call}</div>
            </div>
            <div className={`mt-2 border-l-2 p-3 ${active("receipt") ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
              <span className="text-[8px] font-black text-muted-foreground sm:text-[9px]">현재 확인한 사실</span>
              <p className="mt-1 break-keep text-[9px] font-bold leading-5 sm:text-xs sm:leading-6">{state.receipt}</p>
            </div>
            <p data-scene-note className="mt-3 min-h-[5.5rem] border-l-2 border-primary/50 pl-3 text-[9px] leading-5 text-muted-foreground sm:min-h-[6.5rem] sm:text-sm sm:leading-6">{NOTES[scenes.active]}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="Octane payload 단계 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

const EVIDENCE_ROWS = [
  ["payloadId=id101", "Local build attempt를 다시 찾음", "Payload bytes·validity·consensus commit"],
  ["newPayloadV3 VALID", "한 execution client가 P101을 실행 가능하다고 판정", "CometBFT commit·canonical head"],
  ["B101 Commit", "Validator quorum이 proposal order를 확정", "각 node의 Engine head·event 적용"],
  ["FCU 성공", "Local head·safe·finalized가 EP101을 가리킴", "모든 event processor 성공"],
  ["Event branch Write", "해당 log의 application state merge", "다른 event·외부 chain effect"],
] as const;

export function OctaneEvidenceBoundaryViz() {
  return (
    <figure data-viz="octane-evidence-boundary" className="not-prose my-8 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">각 영수증은 서로 다른 상태만 확인합니다</p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">앞 단계의 성공을 다음 단계의 성공으로 확대하지 않고, 실제로 확인한 상태와 아직 남은 상태를 나눕니다.</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-px bg-border p-px">
        <div className="hidden grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)] gap-px bg-border text-[10px] font-black text-muted-foreground sm:grid">
          <span className="bg-background p-3">영수증</span><span className="bg-background p-3">확인한 상태</span><span className="bg-background p-3">확인하지 못한 상태</span>
        </div>
        {EVIDENCE_ROWS.map(([evidence, proves, limit]) => (
          <div key={evidence} className="grid gap-px bg-border sm:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-[10px] leading-5 text-primary sm:text-xs">{evidence}</strong>
            <span className="bg-background p-3 text-[10px] font-bold leading-5 sm:text-xs">{proves}</span>
            <span className="bg-background p-3 text-[10px] leading-5 text-muted-foreground sm:text-xs">{limit}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
