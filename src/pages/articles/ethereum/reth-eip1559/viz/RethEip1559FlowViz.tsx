import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "Parent",
  "Target",
  "Base fee",
  "거래 cap",
  "정산",
  "구현 경계",
] as const;

const NOTES = [
  "설명용 parent block의 gas limit은 30,000,000, gas used는 18,000,000, base fee는 20 gwei입니다. Alice는 max fee 40 gwei, priority cap 3 gwei인 거래를 보냅니다.",
  "Mainnet 예시에서 elasticity는 2이므로 target은 15,000,000 gas입니다. Parent는 target보다 3,000,000 gas, 즉 20% 더 사용했습니다.",
  "초과 비율 20%를 denominator 8로 완화하면 2.5%입니다. 20 gwei의 2.5%인 0.5 gwei를 더해 다음 block base fee는 20.5 gwei가 됩니다.",
  "Alice의 max fee 40 gwei에서 base fee 20.5 gwei를 빼면 tip에 쓸 수 있는 cap은 19.5 gwei입니다. Priority cap 3 gwei와 비교해 작은 3 gwei가 effective tip입니다.",
  "거래가 실제로 25,000 gas를 쓰면 512,500 gwei는 burn되고 75,000 gwei는 beneficiary 몫입니다. Alice의 총 execution fee는 587,500 gwei, 즉 0.0005875 ETH입니다.",
  "Reth ChainSpec이 시점별 계수를 고르고 Alloy가 정수 계산을 수행합니다. Payload 작성, consensus header 검증과 TxPool 유지 경로가 같은 next base fee를 소비하지만 각 상태의 owner는 다릅니다.",
] as const;

function Cell({
  title,
  value,
  detail,
  tone = "plain",
  className = "",
}: {
  title: string;
  value: string;
  detail: string;
  tone?: "plain" | "active" | "burn";
  className?: string;
}) {
  const toneClass =
    tone === "active"
      ? "border-primary text-primary"
      : tone === "burn"
        ? "border-amber-500/70 text-amber-700 dark:text-amber-300"
        : "border-border";
  return (
    <div className={`min-w-0 border bg-background p-3 sm:p-4 ${toneClass} ${className}`}>
      <span className="block text-[9px] font-black tracking-[0.12em] text-muted-foreground">
        {title}
      </span>
      <strong className="mt-2 block break-keep text-sm leading-5 sm:text-base">
        {value}
      </strong>
      <span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
        {detail}
      </span>
    </div>
  );
}

function Equation({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-y border-primary/40 py-3 text-center font-mono text-xs font-bold leading-6 text-primary sm:text-sm">
      {children}
    </p>
  );
}

export default function RethEip1559FlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7800, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      className="scroll-mt-20"
      eyebrow="개념 경로 · 한 거래의 가격과 정산"
      title="Parent block 하나에서 다음 가격과 Alice의 실제 지불액을 계산합니다"
      description="같은 숫자를 유지한 채 header 규칙, transaction cap, burn과 구현 owner를 차례로 연결합니다."
      note="30M·18M·20 gwei·25,000 gas는 계산을 추적하기 위한 고정 예시이며 네트워크 현재값이 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-eip1559-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Parent block에서 EIP-1559 next base fee와 거래 수수료 정산까지 계산하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">
          {SCENES.map((label, index) => (
            <div
              key={label}
              className={`min-w-0 bg-background px-2 py-2.5 ${
                index === active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className={`mb-2 block h-1 w-7 ${
                  index === active
                    ? "bg-primary"
                    : index < active
                      ? "bg-primary/35"
                      : "bg-border"
                }`}
              />
              <span className="font-mono text-[9px] font-black">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-1 block break-keep text-[11px] leading-4">
                {label}
              </strong>
            </div>
          ))}
        </div>

        <section className="mt-3 min-h-[24rem] border border-border bg-background p-3 sm:min-h-[20rem] sm:p-5">
          {active === 0 ? (
            <div className="grid min-h-[17rem] content-center gap-3 sm:grid-cols-2">
              <div className="grid grid-cols-2 gap-2">
                <Cell title="PARENT LIMIT" value="30,000,000" detail="block gas limit" />
                <Cell title="PARENT USED" value="18,000,000" detail="실제 사용량" tone="active" />
                <Cell title="PARENT BASE" value="20 gwei" detail="다음 계산의 입력" />
                <Cell title="CHAIN PARAM" value="E=2 · D=8" detail="Mainnet 예시" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Cell title="ALICE MAX" value="40 gwei" detail="총 가격 상한" />
                <Cell title="ALICE TIP" value="3 gwei" detail="priority 상한" />
                <Cell title="ACTUAL GAS" value="25,000" detail="receipt에서 확정" />
                <Cell title="QUESTION" value="얼마를 내나?" detail="다음 block 문맥" tone="active" />
              </div>
            </div>
          ) : null}

          {active === 1 ? (
            <div className="grid min-h-[17rem] content-center gap-4">
              <div className="grid grid-cols-3 gap-2">
                <Cell title="LIMIT" value="30M" detail="Parent header" />
                <Cell title="ELASTICITY" value="÷ 2" detail="ChainSpec" />
                <Cell title="TARGET" value="15M gas" detail="유지 기준" tone="active" />
              </div>
              <Equation>18M − 15M = 3M · target보다 20% 초과</Equation>
              <p className="text-center text-xs leading-5 text-muted-foreground">
                현재 mempool 크기나 Alice의 max fee는 이 계산에 들어가지 않습니다.
              </p>
            </div>
          ) : null}

          {active === 2 ? (
            <div className="grid min-h-[17rem] content-center gap-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Cell title="OVER TARGET" value="20%" detail="3M ÷ 15M" />
                <Cell title="DENOMINATOR" value="÷ 8" detail="변화 완화" />
                <Cell title="CHANGE" value="+2.5%" detail="0.5 gwei" tone="active" />
                <Cell title="NEXT BASE" value="20.5 gwei" detail="다음 header" tone="active" />
              </div>
              <Equation>20 gwei × 3M ÷ 15M ÷ 8 = 0.5 gwei</Equation>
              <p className="text-center text-xs leading-5 text-muted-foreground">
                정수 wei로 계산하며 증가분이 0이 되면 increase branch만 최소 1 wei를 더합니다.
              </p>
            </div>
          ) : null}

          {active === 3 ? (
            <div className="grid min-h-[17rem] content-center gap-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Cell title="MAX FEE" value="40" detail="gwei/gas" />
                <Cell title="BASE FEE" value="−20.5" detail="protocol price" />
                <Cell title="REMAINING CAP" value="19.5" detail="tip에 쓸 수 있음" />
                <Cell title="EFFECTIVE TIP" value="min(3, 19.5) = 3" detail="gwei/gas" tone="active" />
              </div>
              <Equation>effective tip = min(priority cap, max fee − base fee)</Equation>
              <p className="text-center text-xs leading-5 text-muted-foreground">
                Max fee가 base fee보다 작으면 현재 block에서는 fee-eligible하지 않습니다.
              </p>
            </div>
          ) : null}

          {active === 4 ? (
            <div className="grid min-h-[17rem] content-center gap-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Cell title="BURN" value="20.5 × 25,000" detail="512,500 gwei" tone="burn" />
                <Cell title="BENEFICIARY" value="3 × 25,000" detail="75,000 gwei" tone="active" />
                <Cell title="ALICE TOTAL" value="587,500 gwei" detail="0.0005875 ETH" />
              </div>
              <Equation>actual gas used × (base fee + effective tip)</Equation>
              <p className="text-center text-xs leading-5 text-muted-foreground">
                Gas limit이나 max fee 전액이 아니라 receipt의 actual gas used와 실제 가격을 곱합니다.
              </p>
            </div>
          ) : null}

          {active === 5 ? (
            <div className="grid min-h-[17rem] content-center gap-3">
              <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5">
                <Cell title="CHAIN SPEC" value="계수 선택" detail="timestamp·fork" />
                <Cell title="ALLOY" value="정수 계산" detail="next base fee·tip" tone="active" />
                <Cell title="PAYLOAD" value="후보 작성" detail="next block env" />
                <Cell title="CONSENSUS" value="Header 검증" detail="expected와 비교" />
                <Cell
                  title="TXPOOL"
                  value="Fee 분류"
                  detail="pending base fee"
                  className="col-span-2 sm:col-span-1"
                />
              </div>
              <div className="grid grid-cols-3 gap-px bg-border p-px">
                <Cell title="정본" value="Canonical header" detail="합의 상태" />
                <Cell title="계산 owner" value="ChainSpec + Alloy" detail="공유 함수" tone="active" />
                <Cell title="소비자" value="Builder·검증·Pool" detail="서로 다른 상태" />
              </div>
            </div>
          ) : null}
        </section>

        <p
          data-scene-note
          className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6"
        >
          {NOTES[active]}
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["Parent", "Target", "Base", "Cap", "정산", "구현"]}
          playLabel="EIP-1559 계산 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
