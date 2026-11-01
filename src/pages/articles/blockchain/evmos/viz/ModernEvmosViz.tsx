import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "기준 상태",
  "RPC 접수",
  "Ante 분기",
  "비용·nonce",
  "EVM cache",
  "호출 실행",
  "성공 합치기",
  "Gas 반환",
  "Block commit",
] as const;

type Lane = "client" | "ante" | "evm" | "cosmos" | "receipt";

const STATES: readonly {
  action: string;
  client: string;
  ante: string;
  evm: string;
  cosmos: string;
  receipt: string;
  changed: readonly Lane[];
}[] = [
  {
    action: "Alice가 EIP-1559 value transfer T7에 서명",
    client: "nonce 7 · Bob에게 10 · gasLimit 30,000",
    ante: "Alice sequence 7 · balance 1,000,000",
    evm: "StateDB·journal·CacheContext 없음",
    cosmos: "Committed state · Alice 1,000,000 / Bob 0",
    receipt: "아직 hash·block·receipt 없음",
    changed: ["client", "ante", "cosmos"],
  },
  {
    action: "eth_sendRawTransaction(T7) → BroadcastTxSync",
    client: "Raw bytes를 MsgEthereumTx와 Cosmos tx로 변환",
    ante: "Node의 sync broadcast 검사 전 · block 실행 전",
    evm: "아직 실행하지 않음",
    cosmos: "Committed state 변화 없음",
    receipt: "Ethereum hash(T7) 반환 · inclusion/Commit은 미확정",
    changed: ["client", "receipt"],
  },
  {
    action: "ExtensionOptionsEthereumTx → mono EVM ante",
    client: "T7 identity와 서명 bytes 유지",
    ante: "Ethereum 전용 context·base fee·signature·account 검사 경로",
    evm: "EVM fork config와 signer를 block height에 맞춤",
    cosmos: "일반 Cosmos ante 경로와 분리",
    receipt: "지원하지 않는 extension은 여기서 거절",
    changed: ["ante", "evm", "cosmos", "receipt"],
  },
  {
    action: "sender 복구 → 최대 gas 비용 차감 → sequence 7→8",
    client: "effective gas price=min(30, 20+3)=23",
    ante: "690,000을 fee collector에 먼저 이동 · sequence 8",
    evm: "value 10을 보낼 잔액과 intrinsic gas 검사",
    cosmos: "Block working branch · Alice 310,000 / Bob 0",
    receipt: "Ante 성공 · EVM 성공과 block Commit은 아직 미확정",
    changed: ["client", "ante", "evm", "cosmos", "receipt"],
  },
  {
    action: "ApplyTransaction이 tmpCtx와 StateDB를 생성",
    client: "추가 요청 없음",
    ante: "fee·sequence 상태는 parent transaction context에 존재",
    evm: "tmpCtx 안에 StateDB journal·snapshot 생성",
    cosmos: "Parent와 분리된 임시 branch · Bob은 여전히 0",
    receipt: "StateDB.Commit과 durable Commit은 다른 단계",
    changed: ["ante", "evm", "cosmos", "receipt"],
  },
  {
    action: "EVM CALL이 Bob에게 value 10을 적용",
    client: "T7 calldata 없음 · contract code 실행 없음",
    ante: "sequence 8·fee 예산 690,000 유지",
    evm: "Intrinsic gas 21,000 · tmp StateDB에서 value 이동",
    cosmos: "임시 후보 · Alice 309,990 / Bob 10",
    receipt: "EVM frame 성공 · 아직 parent branch에 미반영",
    changed: ["evm", "cosmos", "receipt"],
  },
  {
    action: "StateDB.Commit → !res.Failed() → tmpCtx commit()",
    client: "hash(T7)는 동일",
    ante: "sequence 8·선차감 fee는 유지",
    evm: "dirty account를 keeper에 쓰고 tmpCtx를 parent에 합침",
    cosmos: "Transaction 후보 · Alice 309,990 / Bob 10",
    receipt: "VM success와 gasUsed 21,000을 Msg response에 기록",
    changed: ["evm", "cosmos", "receipt"],
  },
  {
    action: "남은 gas 9,000 × 23 = 207,000을 Alice에게 반환",
    client: "최종 gas fee 후보 21,000 × 23 = 483,000",
    ante: "선차감 690,000 중 207,000 refund",
    evm: "gasUsed=21,000 · leftoverGas=9,000",
    cosmos: "Transaction 후보 · Alice 516,990 / Bob 10",
    receipt: "사용량 계산 완료 · 아직 root store Commit 전",
    changed: ["client", "ante", "evm", "cosmos", "receipt"],
  },
  {
    action: "FinalizeBlock 결과가 application Commit으로 durable state가 됨",
    client: "eth_getTransactionReceipt로 committed status 조회",
    ante: "Durable sequence 8 · net gas fee 483,000",
    evm: "status=success · gasUsed=21,000 · logs 없음",
    cosmos: "Durable state · Alice 516,990 / Bob 10",
    receipt: "같은 height에서 block·receipt·balance·sequence를 함께 확인",
    changed: ["client", "ante", "evm", "cosmos", "receipt"],
  },
] as const;

const NOTES = [
  "설명용 fixture입니다. Alice는 1,000,000 base unit을 가지고 있고 Bob에게 10을 보냅니다. Gas limit 30,000, base fee 20, priority cap 3, max fee 30입니다.",
  "Evmos v20 RPC는 raw Ethereum transaction을 MsgEthereumTx가 든 Cosmos transaction으로 encode하고 BroadcastTxSync를 호출합니다. 반환된 Ethereum hash만으로 block 포함이나 state 확정을 말할 수 없습니다.",
  "첫 extension option이 EthereumTx이면 전용 mono ante handler를 선택합니다. 같은 Cosmos app 안에서도 일반 SDK transaction과 Ethereum transaction의 검증 계약은 다릅니다.",
  "Ante는 sender가 fee와 value를 감당하는지 확인하고 gas limit 전체에 대한 effective fee를 먼저 걷습니다. Nonce 7은 현재 account sequence 7과 같아야 하며, 통과하면 sequence가 8이 됩니다.",
  "ApplyTransaction의 tmpCtx는 EVM state와 hook을 함께 버릴 수 있는 바깥 cache입니다. StateDB 안에도 EVM frame용 journal과 precompile용 cache가 있어 rollback 경계가 한 겹이 아닙니다.",
  "Data와 contract code가 없는 단순 value transfer는 이 fixture의 fork 규칙에서 intrinsic gas 21,000을 사용합니다. EVM이 바꾸는 balance는 아직 tmp StateDB에만 있습니다.",
  "StateDB.Commit은 dirty account·code·storage를 tmpCtx의 keeper에 씁니다. res.Failed()가 false일 때만 tmpCtx commit()이 parent transaction branch로 합칩니다. 이것도 block database root Commit은 아닙니다.",
  "Mainnet MinGasMultiplier 0.5에 따른 최소값은 15,000이고 실제 21,000이 더 크므로 gasUsed는 21,000입니다. 선차감 690,000에서 207,000을 돌려줘 net fee는 483,000입니다.",
  "완료 판정은 RPC hash가 아니라 committed block의 receipt status, gasUsed, sequence 8, Alice·Bob balance를 같은 height에서 대조하는 것입니다. 이 수치는 실측 benchmark가 아니라 source path를 설명하는 계산 fixture입니다.",
] as const;

const laneClass = (active: boolean) =>
  `grid min-w-0 grid-cols-[5.2rem_minmax(0,1fr)] gap-px border bg-border sm:grid-cols-[8.4rem_minmax(0,1fr)] ${active ? "border-l-4 border-primary" : "border-border"}`;

function StateLane({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={laneClass(active)}>
      <div className={`bg-background p-2 text-[8px] font-black sm:p-3 sm:text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</div>
      <strong className="min-w-0 break-keep bg-background p-2 text-[9px] leading-5 sm:p-3 sm:text-xs sm:leading-6">{value}</strong>
    </div>
  );
}

export function EvmosTransactionViz() {
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
    const observer = new ResizeObserver(keepSelectedVisible);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="Evmos v20 · Ethereum transaction T7"
      title="Hash가 돌아온 뒤에도 네 상태 경계를 더 지나야 합니다"
      description="RPC·ante·EVM cache·Cosmos block state에서 Alice의 fee·sequence·balance가 언제 바뀌는지 같은 요청으로 추적합니다."
      note="설명용 수치는 Evmos v20.0.0 commit eca13ef2의 mainnet MinGasMultiplier 0.5와 단순 value transfer를 기준으로 하며 성능 측정값이 아닙니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-evmos-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Evmos transaction T7의 RPC 접수부터 block commit까지 아홉 장면으로 추적"
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
              <StateLane label="CLIENT · RPC" value={state.client} active={active("client")} />
              <StateLane label="ANTE" value={state.ante} active={active("ante")} />
              <StateLane label="EVM · StateDB" value={state.evm} active={active("evm")} />
              <StateLane label="COSMOS STATE" value={state.cosmos} active={active("cosmos")} />
            </div>
            <div className="mt-2 grid grid-cols-[5.2rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8.4rem_minmax(0,1fr)]">
              <div className="bg-background p-2 text-[8px] font-bold text-muted-foreground sm:p-3 sm:text-[10px]">현재 동작</div>
              <div className="min-w-0 break-keep bg-background p-2 text-[9px] font-bold leading-5 sm:p-3 sm:text-xs">{state.action}</div>
            </div>
            <div className={`mt-2 border-l-2 p-2.5 ${active("receipt") ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
              <span className="text-[8px] font-black text-muted-foreground sm:text-[9px]">이 장면에서 확인한 영수증</span>
              <p className="mt-1 break-keep text-[9px] font-bold leading-5 sm:text-xs sm:leading-6">{state.receipt}</p>
            </div>
            <p data-scene-note className="mt-3 min-h-[5.5rem] border-l-2 border-primary/50 pl-3 text-[9px] leading-5 text-muted-foreground sm:min-h-[6.5rem] sm:text-sm sm:leading-6">{NOTES[scenes.active]}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="Evmos transaction lifecycle 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

const FAILURE_ROWS = [
  ["서명·nonce·잔액 실패", "Ante에서 거절", "fee·sequence·value 변화 없음", "ABCI error"],
  ["EVM REVERT", "EVM state와 value를 합치지 않음", "sequence 증가·사용 gas fee는 남음", "receipt status=0 · VmError"],
  ["StateDB/hook Go error", "Msg error로 전파하고 transaction state를 버림", "Ante 상태 보존 여부는 BaseApp branch 계약과 함께 확인", "Cosmos tx error"],
  ["Block 미포함", "Mempool에 남거나 제거", "Committed state 변화 없음", "hash만 있고 committed receipt 없음"],
  ["Block Commit 성공", "성공 branch와 ante 결과를 root state에 반영", "sequence·net fee·성공한 EVM state가 durable", "height·AppHash·receipt"],
] as const;

export function EvmosFailureViz() {
  return (
    <figure data-viz="evmos-failure-boundaries" className="not-prose my-8 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">실패 종류마다 남는 상태가 다릅니다</p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">거절·REVERT·내부 오류·미포함을 한 단어인 실패로 묶으면 fee와 nonce를 잘못 설명하게 됩니다.</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-px bg-border p-px">
        {FAILURE_ROWS.map(([failure, action, remains, evidence], index) => (
          <section key={failure} className="grid gap-px bg-border md:grid-cols-[2.6rem_10.5rem_minmax(0,1.15fr)_minmax(0,1.25fr)_minmax(0,1fr)]">
            <span className="bg-background p-3 font-mono text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="bg-background p-3 text-xs leading-5">{failure}</strong>
            <span className="bg-background p-3 text-xs leading-5 text-muted-foreground">{action}</span>
            <span className="bg-background p-3 text-xs font-bold leading-5">{remains}</span>
            <span className="bg-background p-3 text-xs leading-5 text-muted-foreground">{evidence}</span>
          </section>
        ))}
      </div>
    </figure>
  );
}

const BOUNDARIES = [
  ["로컬 Ethereum tx", "RPC hash → ante → EVM receipt → block Commit", "한 chain의 account·fee·EVM state"],
  ["IBC packet", "local send → relay proof → remote receive → ack 또는 timeout", "두 chain과 channel의 packet state"],
  ["ERC-20 representation", "성공한 ICS-20 callback 뒤 conversion·refund", "bank coin과 EVM contract balance"],
] as const;

export function EvmosIbcBoundaryViz() {
  return (
    <figure data-viz="evmos-ibc-boundary" className="not-prose my-8 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">IBC는 T7 뒤에 자동으로 붙는 다음 단계가 아닙니다</p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">로컬 Ethereum transaction과 interchain packet은 정본·영수증·실패 복구 주체가 다른 생명주기입니다.</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-px bg-border p-px">
        {BOUNDARIES.map(([flow, receipts, owner], index) => (
          <section key={flow} className="grid gap-px bg-border md:grid-cols-[2.6rem_10rem_minmax(0,1.7fr)_minmax(0,1fr)]">
            <span className="bg-background p-3 font-mono text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="bg-background p-3 text-xs leading-5">{flow}</strong>
            <span className="bg-background p-3 text-xs font-bold leading-5">{receipts}</span>
            <span className="bg-background p-3 text-xs leading-5 text-muted-foreground">{owner}</span>
          </section>
        ))}
      </div>
    </figure>
  );
}

export default EvmosTransactionViz;
