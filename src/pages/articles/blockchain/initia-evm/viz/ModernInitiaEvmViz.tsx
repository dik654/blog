import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "기준 상태",
  "RPC 접수",
  "봉투 변환",
  "Ante",
  "EVM 진입",
  "요청 예약",
  "Snapshot 합치기",
  "Cosmos 실행",
  "Block commit",
] as const;

type Lane = "rpc" | "sdk" | "evm" | "module" | "receipt";

const STATES: readonly {
  call: string;
  rpc: string;
  sdk: string;
  evm: string;
  module: string;
  receipt: string;
  changed: readonly Lane[];
}[] = [
  {
    call: "아직 요청 없음",
    rpc: "Alice가 서명한 T7 · nonce 7 · to=Cosmos precompile",
    sdk: "Account sequence=7 · transaction branch 없음",
    evm: "StateDB snapshot 없음 · execute request queue 없음",
    module: "ufoo balance · Alice 100 / Bob 0",
    receipt: "출발 상태만 확인 · transaction hash와 block receipt는 아직 없음",
    changed: ["rpc", "sdk", "module"],
  },
  {
    call: "eth_sendRawTransaction(T7) → BroadcastTxSync",
    rpc: "Raw bytes decode · EIP-155 protected signature 검사 · hash(T7) 반환",
    sdk: "Cosmos transaction으로 encode한 뒤 synchronous broadcast 응답 확인",
    evm: "아직 EVM frame 실행 전",
    module: "Balance 변화 없음",
    receipt: "hash(T7)와 broadcast code=0 · block inclusion이나 state commit은 아님",
    changed: ["rpc", "sdk", "receipt"],
  },
  {
    call: "ConvertEthereumTxToCosmosTx(T7)",
    rpc: "Sender·chain ID·nonce·gas·to·value·data를 읽음",
    sdk: "MsgCall{to=Cosmos precompile, input=execute_cosmos(MsgSend 10ufoo)}",
    evm: "Ethereum signature mode와 nonce 7을 SDK signature에 보존",
    module: "MsgSend는 아직 실행되지 않음",
    receipt: "표현이 바뀌었을 뿐 실행·성공·commit은 확인하지 못함",
    changed: ["rpc", "sdk", "evm", "receipt"],
  },
  {
    call: "IncrementSequenceDecorator → BaseApp commitAnteCache",
    rpc: "T7 identity 유지",
    sdk: "Alice sequence 7→8 · Ante cache를 message branch보다 먼저 block working state에 반영",
    evm: "MsgCall 경로는 Ante 증가를 다시 올리지 않도록 flag를 읽을 준비",
    module: "Alice 100 / Bob 0",
    receipt: "뒤 message가 실패해도 sequence 8은 남을 수 있음 · 아직 block commit 전",
    changed: ["sdk", "evm", "receipt"],
  },
  {
    call: "MsgServer.Call → handleSequenceIncremented → EVMCall",
    rpc: "Contract address와 ABI input을 EVM 타입으로 복원",
    sdk: "CALL이므로 Ante가 이미 올린 8을 유지 · flag=false",
    evm: "StateDB와 snapshot을 만들고 Cosmos precompile을 향해 evm.Call 실행",
    module: "MsgSend handler는 아직 호출되지 않음",
    receipt: "Sequence가 한 요청에서 정확히 한 번 증가한 후보 경로",
    changed: ["sdk", "evm", "receipt"],
  },
  {
    call: "CosmosPrecompile.execute_cosmos",
    rpc: "ABI input 안의 MsgSend JSON을 sdk.Msg로 decode",
    sdk: "readOnly·dispatch enabled·caller=signer·gas 조건 검사",
    evm: "Snapshot 전용 queue에 ExecuteRequest{MsgSend 10ufoo} 추가",
    module: "Bank keeper는 아직 호출되지 않음 · Alice 100 / Bob 0",
    receipt: "Precompile return=true는 요청 예약 성공 · 송금 완료가 아님",
    changed: ["sdk", "evm", "receipt"],
  },
  {
    call: "EVM success → StateDB.Commit",
    rpc: "EVM return bytes와 logs 생성",
    sdk: "Child snapshot의 state와 ExecuteRequest를 parent transaction context에 합침",
    evm: "REVERT 없이 frame 종료 · refund를 반영해 gas 사용량 계산",
    module: "MsgSend는 parent queue에 도착했지만 module state는 아직 100 / 0",
    receipt: "EVM frame 성공 · block commit과 Cosmos submessage 성공은 아직 별도",
    changed: ["sdk", "evm", "receipt"],
  },
  {
    call: "dispatchMessages → bank MsgSend handler",
    rpc: "추가 client 호출 없음",
    sdk: "Submessage 전용 CacheContext에서 handler 실행 · 성공할 때만 commit()",
    evm: "필요하면 callback을 다시 EVMCall로 전달",
    module: "Transaction branch 후보 · Alice 90 / Bob 10",
    receipt: "Cosmos submessage branch 성공 · 아직 block app state commit 전",
    changed: ["sdk", "evm", "module", "receipt"],
  },
  {
    call: "FinalizeBlock transaction success → CometBFT Commit",
    rpc: "eth_getTransactionReceipt에서 committed 결과를 조회할 수 있음",
    sdk: "Outer transaction branch가 block state에 반영 · sequence=8",
    evm: "EVM logs와 execution status가 committed transaction 결과에 연결",
    module: "Durable balance · Alice 90 / Bob 10",
    receipt: "이제야 T7의 sequence·EVM·MsgSend effect를 같은 committed block에 묶어 확인",
    changed: ["rpc", "sdk", "evm", "module", "receipt"],
  },
] as const;

const NOTES = [
  "설명용 fixture입니다. Alice의 sequence는 7이고 ufoo 잔액은 100, Bob은 0입니다. T7은 Cosmos precompile에 MsgSend 10ufoo를 요청합니다.",
  "SendRawTransaction은 원래 Ethereum hash를 돌려주지만 pinned source는 내부에서 BroadcastTxSync를 사용합니다. 이 응답을 block commit과 같은 완료 신호로 읽으면 안 됩니다.",
  "MiniEVM은 별도 Ethereum execution client에 Engine API로 payload를 넘기지 않습니다. 같은 Cosmos app 안에서 Ethereum transaction을 MsgCall 또는 MsgCreate가 든 SDK transaction으로 바꿉니다.",
  "Pinned Cosmos SDK BaseApp은 성공한 Ante cache를 runMsgs보다 먼저 block working state에 씁니다. 뒤 EVM·MsgSend가 실패해도 sequence 증가는 남으며, block commit 뒤 durable해집니다.",
  "MsgCall은 Ante가 올린 sequence를 그대로 쓰고 flag를 내립니다. CREATE 경로는 EVM 자체 nonce 증가와 겹치지 않도록 다른 보정이 들어갑니다.",
  "execute_cosmos precompile은 Cosmos keeper를 즉시 호출하지 않습니다. Snapshot 전용 queue에 request를 넣어 EVM REVERT가 request까지 함께 버릴 수 있게 합니다.",
  "StateDB Commit은 성공한 nested snapshots를 현재 Cosmos transaction context에 합칩니다. 이 단계도 block database의 최종 commit과는 다릅니다.",
  "Queue의 MsgSend는 별도 CacheContext에서 실행됩니다. 성공 branch만 parent transaction에 합치며 allowFailure와 callback option은 실패 전파 방식을 바꿉니다.",
  "최종 완료는 hash 반환, EVM return, submessage commit만으로 부족합니다. 같은 block commit에서 sequence 8, Alice 90, Bob 10과 receipt를 함께 확인해야 합니다.",
] as const;

const laneClass = (active: boolean) =>
  `grid min-w-0 grid-cols-[5.4rem_minmax(0,1fr)] gap-px border bg-border sm:grid-cols-[8rem_minmax(0,1fr)] ${active ? "border-l-4 border-primary" : "border-border"}`;

function StateLane({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={laneClass(active)}>
      <div className={`bg-background p-2 text-[8px] font-black sm:p-3 sm:text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</div>
      <strong className="min-w-0 break-keep bg-background p-2 text-[9px] leading-5 sm:p-3 sm:text-xs sm:leading-6">{value}</strong>
    </div>
  );
}

export function MiniEvmTransactionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7600, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const active = (lane: Lane) => state.changed.includes(lane);

  useEffect(() => {
    const scroller = tabsRef.current;
    if (!scroller) return;
    const keepSelectedVisible = () => {
      const selected = scroller.querySelector<HTMLElement>('button[aria-pressed="true"]');
      if (!selected) return;
      const left = selected.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
      scroller.scrollTo({ left: left - (scroller.clientWidth - selected.offsetWidth) / 2, behavior: "auto" });
    };
    keepSelectedVisible();
    const onResize = () => window.requestAnimationFrame(keepSelectedVisible);
    const observer = new ResizeObserver(keepSelectedVisible);
    observer.observe(scroller);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="MiniEVM · transaction T7 한 건"
      title="Ethereum hash 반환부터 Cosmos block commit까지 상태가 아홉 번 바뀝니다"
      description="JSON-RPC·SDK transaction·EVM snapshot·Cosmos module state가 각각 언제 바뀌는지 같은 요청으로 추적합니다."
      note="수치와 주소는 설명용 fixture이며, 제어 순서는 MiniEVM v1.2.19 commit 27e60c5의 tx.go·txutils.go·sequence.go·context.go·snapshot.go에 맞췄습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-minievm-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="MiniEVM transaction T7의 RPC 접수부터 block commit까지 아홉 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-9 gap-px bg-border p-px" style={{ width: "max(100%, 756px)" }}>
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

          <div className="mt-3 border-y border-border py-3 sm:py-4">
            <div className="grid gap-1.5">
              <StateLane label="CLIENT · RPC" value={state.rpc} active={active("rpc")} />
              <StateLane label="COSMOS TX" value={state.sdk} active={active("sdk")} />
              <StateLane label="EVM · STATEDB" value={state.evm} active={active("evm")} />
              <StateLane label="COSMOS MODULE" value={state.module} active={active("module")} />
            </div>
            <div className="mt-2 grid grid-cols-[5.4rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)]">
              <div className="bg-background p-2 text-[8px] font-bold text-muted-foreground sm:p-3 sm:text-[10px]">현재 호출</div>
              <div className="min-w-0 break-keep bg-background p-2 text-[9px] font-bold leading-5 sm:p-3 sm:text-xs">{state.call}</div>
            </div>
            <div className={`mt-2 border-l-2 p-2.5 ${active("receipt") ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
              <span className="text-[8px] font-black text-muted-foreground sm:text-[9px]">현재 확인한 사실</span>
              <p className="mt-1 break-keep text-[9px] font-bold leading-5 sm:text-xs sm:leading-6">{state.receipt}</p>
            </div>
            <p data-scene-note className="mt-3 min-h-[5.5rem] border-l-2 border-primary/50 pl-3 text-[9px] leading-5 text-muted-foreground sm:min-h-[6.5rem] sm:text-sm sm:leading-6">{NOTES[scenes.active]}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="MiniEVM transaction 단계 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

const RECEIPTS = [
  ["hash(T7)", "Raw transaction decode와 synchronous broadcast 반환", "Mempool 잔류·block inclusion·EVM success"],
  ["BroadcastTxSync code=0", "CheckTx 경로가 오류 없이 응답", "FinalizeBlock 실행·durable state"],
  ["EVM return success", "Call frame과 StateDB snapshot이 성공", "Queued Cosmos message와 outer transaction commit"],
  ["Submessage commit", "MsgSend cache branch가 parent transaction에 합쳐짐", "CometBFT block commit"],
  ["Committed receipt", "Sequence 8과 balance 90/10이 같은 block state에 반영", "향후 reorg·외부 시스템 effect"],
] as const;

export function MiniEvmReceiptBoundaryViz() {
  return (
    <figure data-viz="minievm-receipt-boundary" className="not-prose my-8 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">완료 신호마다 확인하는 범위가 다릅니다</p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">앞 단계의 성공을 block commit으로 확대하지 않고, 실제로 확인한 상태와 남은 상태를 나눕니다.</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-px bg-border p-px">
        <div className="hidden grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)] gap-px bg-border text-[10px] font-black text-muted-foreground sm:grid">
          <span className="bg-background p-3">영수증</span><span className="bg-background p-3">확인한 상태</span><span className="bg-background p-3">아직 모르는 상태</span>
        </div>
        {RECEIPTS.map(([receipt, proves, limit]) => (
          <div key={receipt} className="grid gap-px bg-border sm:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-[10px] leading-5 text-primary sm:text-xs">{receipt}</strong>
            <span className="bg-background p-3 text-xs leading-5">{proves}</span>
            <span className="bg-background p-3 text-xs leading-5 text-muted-foreground">{limit}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

const FAILURE_ROWS = [
  ["ABI·signer 검사 실패", "Precompile snapshot revert", "Sequence 8 · balance 100/0", "T7 실패 · nonce 소비"],
  ["EVM REVERT", "StateDB snapshot과 child queue 폐기", "Sequence 8 · balance 100/0", "T7 실패 · nonce 소비"],
  ["MsgSend 실패 · allowFailure=false", "Submessage cache 미반영 · error 전파", "Sequence 8 · balance 100/0", "Outer transaction 실패"],
  ["MsgSend 실패 · allowFailure=true", "Submessage cache 미반영 · optional callback", "Sequence 8 · balance 100/0", "Outer transaction 계속 가능"],
  ["모든 단계 성공", "Snapshot→parent→submessage→block commit", "Sequence 8 · balance 90/10", "Committed receipt"],
] as const;

export function MiniEvmFailureViz() {
  return (
    <figure data-viz="minievm-failure-boundary" className="not-prose my-8 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">실패한 위치마다 되돌아가는 branch가 다릅니다</p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">Ante를 통과했다면 message branch가 실패해도 sequence 8은 남을 수 있습니다. Queue·balance·outer transaction 결과를 따로 확인합니다.</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-px bg-border p-px">
        {FAILURE_ROWS.map(([failure, boundary, state, receipt], index) => (
          <section key={failure} className="grid gap-px bg-border lg:grid-cols-[2.5rem_12rem_minmax(0,1.2fr)_minmax(0,1fr)_10rem]">
            <span className="bg-background p-3 font-mono text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="bg-background p-3 text-xs leading-5">{failure}</strong>
            <span className="bg-background p-3 text-xs leading-5 text-muted-foreground">{boundary}</span>
            <span className="bg-background p-3 text-xs leading-5">{state}</span>
            <span className="bg-background p-3 text-xs font-bold leading-5">{receipt}</span>
          </section>
        ))}
      </div>
    </figure>
  );
}
