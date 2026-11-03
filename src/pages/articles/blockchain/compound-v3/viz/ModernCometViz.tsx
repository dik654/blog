import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type Mode = "market" | "principal" | "rate" | "liquidation";

type Scene = {
  label: string;
  title: string;
  now: string;
  evidence: string;
  pending: string;
  account: {
    stored: string;
    base: string;
    collateral: string;
    protocol: string;
  };
};

type Flow = {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  scenes: readonly Scene[];
};

const FLOWS: Record<Mode, Flow> = {
  market: {
    eyebrow: "한 계정의 전체 흐름 · 설명용 USDC base market",
    title: "WETH를 맡긴 Alice가 USDC를 빌리고 청산된 뒤 담보가 팔리기까지",
    description: "하나의 Comet 안에서 base와 collateral이 왜 서로 다른 장부를 쓰는지 일곱 장면으로 먼저 봅니다.",
    note: "가격·factor·금액은 회계 경계를 보이기 위한 예입니다. 실제 배포에서는 proxy 구현, oracle, scale과 governance 설정을 고정해야 합니다.",
    scenes: [
      {
        label: "담보 공급",
        title: "Alice가 1 WETH를 담보 칸에 넣습니다.",
        now: "WETH는 USDC를 빌릴 수 있는 한도를 만들지만 base supply index를 따라 이자를 받지는 않습니다.",
        evidence: "Alice의 collateral balance와 assetsIn 표시가 바뀝니다.",
        pending: "USDC를 공급하거나 빌린 것은 아니므로 signed base principal은 0입니다.",
        account: { stored: "principal 0", base: "USDC 0", collateral: "WETH 1 · $1,000", protocol: "변화 없음" },
      },
      {
        label: "USDC 차입",
        title: "Alice가 base asset인 USDC 750을 꺼내 principal이 음수가 됩니다.",
        now: "담보 $1,000에 borrow factor 75%를 곱한 새 차입 한도 $750까지 사용합니다.",
        evidence: "부호가 음수인 principal이 생기고 현재 base balance는 debt로 읽힙니다.",
        pending: "WETH 담보 수량은 그대로이며 담보가 base 이자로 바뀌지 않습니다.",
        account: { stored: "principal < 0", base: "debt $750", collateral: "WETH 1 · $1,000", protocol: "USDC 750 지급" },
      },
      {
        label: "이자 누적",
        title: "시간이 지나 borrow index가 오르면 저장값을 바꾸지 않아도 현재 부채는 $800이 됩니다.",
        now: "음수 principal의 절댓값에 현재 borrow index를 곱해 present value를 다시 계산합니다.",
        evidence: "저장 principal과 사용자가 갚아야 할 현재 debt가 서로 다른 값이 됩니다.",
        pending: "이자 증가만으로 담보 balance나 oracle 가격이 바뀐 것은 아닙니다.",
        account: { stored: "같은 음수 principal", base: "debt $800", collateral: "WETH 1 · $1,000", protocol: "borrow index ↑" },
      },
      {
        label: "추가 차입 차단",
        title: "Debt $800은 새 차입 한도 $750을 넘지만 아직 청산선 $850 안쪽입니다.",
        now: "Borrow gate는 $1,000×75%−$800=−$50이라 추가 차입과 위험한 담보 인출을 막습니다.",
        evidence: "새 위험을 더 만들 수 없다는 결과가 나옵니다.",
        pending: "Liquidation gate는 $1,000×85%−$800=$50이므로 계정은 아직 흡수 대상이 아닙니다.",
        account: { stored: "principal < 0", base: "debt $800", collateral: "WETH 1 · $1,000", protocol: "borrow/withdraw 거절" },
      },
      {
        label: "청산선 통과",
        title: "Debt가 $900이 되면 liquidation liquidity가 −$50으로 내려갑니다.",
        now: "$1,000×85%−$900=−$50이므로 isLiquidatable이 참이 됩니다.",
        evidence: "누구나 absorb를 호출할 수 있는 조건이 생깁니다.",
        pending: "판정만 끝났습니다. 담보와 부채는 absorb 거래가 실행되기 전까지 Alice 장부에 남습니다.",
        account: { stored: "principal < 0", base: "debt $900", collateral: "WETH 1 · credit $850", protocol: "absorb 가능" },
      },
      {
        label: "프로토콜 흡수",
        title: "Absorb가 Alice의 부채와 담보를 프로토콜 장부로 함께 옮깁니다.",
        now: "Alice의 debt와 collateral은 0이 되고, protocol은 base reserves로 $900 debt를 정리한 뒤 WETH inventory와 $50의 가치 차이를 함께 떠안습니다.",
        evidence: "Alice 포지션이 닫히고 protocol balance sheet에 담보와 손익이 기록됩니다.",
        pending: "Absorb 호출자가 WETH를 즉시 받는 것은 아닙니다. 별도 buyer 거래가 남습니다.",
        account: { stored: "principal 0", base: "debt 0", collateral: "WETH 0", protocol: "WETH 1 · debt $900 정리" },
      },
      {
        label: "담보 별도 판매",
        title: "판매 gate가 열리면 다른 buyer가 할인된 가격으로 protocol의 WETH를 삽니다.",
        now: "Buyer가 USDC base를 내고 minAmount 조건 안에서 buyCollateral을 실행합니다.",
        evidence: "Protocol inventory가 줄고 base reserves가 회수됩니다.",
        pending: "할인율은 absorb caller 보너스가 아니며 실제 회수액은 oracle·factor·rounding에 따라 달라집니다.",
        account: { stored: "Alice 변화 없음", base: "buyer가 USDC 지급", collateral: "buyer가 WETH 수령", protocol: "inventory ↓ · reserves ↑" },
      },
    ],
  },
  principal: {
    eyebrow: "Signed principal 확대",
    title: "한 숫자의 부호가 base 공급과 차입을 어떻게 나눌까요?",
    description: "저장 principal, 현재가치, 0을 건너는 출금과 이후 이자 누적을 분리합니다.",
    note: "표시 금액은 index scale을 1로 단순화한 예입니다. 실제 역산은 supply floor와 borrow ceil 규칙을 유지해야 합니다.",
    scenes: [
      {
        label: "양수 저장",
        title: "USDC 1,000을 공급하면 signed principal이 양수가 됩니다.",
        now: "양수 부호가 supply index를 선택합니다.",
        evidence: "한 저장 칸이 이 계정의 base 공급자 역할을 나타냅니다.",
        pending: "현재가치는 다음 index를 적용하기 전까지 계산되지 않았습니다.",
        account: { stored: "principal +1,000", base: "supply $1,000", collateral: "별도 장부", protocol: "supply index 1.00" },
      },
      {
        label: "공급 이자",
        title: "Supply index가 1.05가 되면 현재 공급액은 1,050입니다.",
        now: "저장 principal 1,000에 현재 supply index 1.05를 곱합니다.",
        evidence: "매번 사용자 저장값을 갱신하지 않아도 현재가치를 복원할 수 있습니다.",
        pending: "양수 principal에는 borrow index를 섞지 않습니다.",
        account: { stored: "principal +1,000", base: "supply $1,050", collateral: "별도 장부", protocol: "supply index 1.05" },
      },
      {
        label: "0을 통과",
        title: "USDC 1,200을 빼면 공급 1,050을 먼저 없애고 나머지 150이 차입이 됩니다.",
        now: "한 operation 안에서 양수 present value가 0을 지나 음수 principal로 다시 저장됩니다.",
        evidence: "Repay·supply와 borrow가 0이라는 한 경계에서 끊김 없이 연결됩니다.",
        pending: "새 음수 principal은 현재 borrow index와 올림 규칙으로 역산해야 합니다.",
        account: { stored: "principal < 0", base: "debt $150", collateral: "차입 한도 검사", protocol: "USDC 1,200 지급" },
      },
      {
        label: "차입 이자",
        title: "Borrow index가 오르면 같은 음수 principal에서 현재 부채만 커집니다.",
        now: "절댓값에 borrow index를 곱한 뒤 결과를 다시 음수 debt로 읽습니다.",
        evidence: "Supply index와 독립된 차입 비용이 반영됩니다.",
        pending: "담보 factor와 oracle을 통과해야 실제 인출이 유효합니다.",
        account: { stored: "같은 음수 principal", base: "debt $162", collateral: "별도 risk 검사", protocol: "borrow index 1.08" },
      },
    ],
  },
  rate: {
    eyebrow: "독립 금리 곡선 확대",
    title: "같은 utilization을 보고도 공급 금리와 차입 금리가 다른 이유",
    description: "U=90% 설명값에서 supply curve와 borrow curve를 각각 계산하고 index에 반영합니다.",
    note: "예시 연율은 곡선의 독립성을 보이기 위한 값입니다. 실제 on-chain rate는 per-second 1e18 scale과 배포 설정을 사용합니다.",
    scenes: [
      {
        label: "이용률 계산",
        title: "Base supply $1,000 중 $900이 빌려 나가 utilization은 90%입니다.",
        now: "현재가치로 전진시킨 totalBorrowBase를 totalSupplyBase로 나눕니다.",
        evidence: "두 금리 곡선이 함께 읽을 U=0.9가 생깁니다.",
        pending: "U 하나만으로 공급 금리와 차입 금리가 같아지는 것은 아닙니다.",
        account: { stored: "B/S", base: "U=$900/$1,000=90%", collateral: "계산에서 제외", protocol: "두 curve의 입력" },
      },
      {
        label: "공급 곡선",
        title: "Supply curve는 자체 base·kink·두 slope로 5.4%를 냅니다.",
        now: "1%+3%×0.8+20%×(0.9−0.8)=5.4%입니다.",
        evidence: "공급자가 받는 index 증가율이 정해집니다.",
        pending: "Borrow rate에 U와 reserve factor를 곱해 역산한 값이 아닙니다.",
        account: { stored: "supply params", base: "supply APR 5.4%", collateral: "영향 없음", protocol: "supply index rate" },
      },
      {
        label: "차입 곡선",
        title: "Borrow curve는 다른 slope를 써 같은 U에서 16%를 냅니다.",
        now: "2%+5%×0.8+100%×(0.9−0.8)=16%입니다.",
        evidence: "차입자가 내는 index 증가율이 별도로 정해집니다.",
        pending: "두 금리의 차이가 곧바로 특정 사용자의 실현 손익은 아닙니다.",
        account: { stored: "borrow params", base: "borrow APR 16%", collateral: "영향 없음", protocol: "borrow index rate" },
      },
      {
        label: "두 index 누적",
        title: "시간이 흐르면 양수 계정은 supply index, 음수 계정은 borrow index만 따라갑니다.",
        now: "같은 utilization snapshot에서 나온 두 rate가 서로 다른 global index를 전진시킵니다.",
        evidence: "Signed principal 하나로도 공급과 차입 현재가치를 따로 복원할 수 있습니다.",
        pending: "시간 구간, rounding과 다음 utilization 변화는 다음 accrue에서 다시 계산합니다.",
        account: { stored: "signed principal", base: "positive→Is · negative→Ib", collateral: "독립 balance", protocol: "두 index 갱신" },
      },
    ],
  },
  liquidation: {
    eyebrow: "청산 경로 확대 · debt $900 · collateral $1,000",
    title: "Absorb 호출자와 할인 담보 구매자가 왜 서로 다른 사람일까요?",
    description: "판정, protocol 흡수, 호출자 기록, 판매 gate와 buyer 거래를 여섯 장면으로 분리합니다.",
    note: "Compound III의 reserve-funded settlement 구조를 설명합니다. 실제 price feed·factor·pause·targetReserves와 구현 snapshot을 먼저 고정해야 합니다.",
    scenes: [
      {
        label: "청산 판정",
        title: "Liquidation liquidity가 −$50이라 계정이 흡수 가능해집니다.",
        now: "$1,000×85%−$900=−$50을 계산합니다.",
        evidence: "isLiquidatable(account)가 참이 됩니다.",
        pending: "아직 담보 이전이나 부채 정리는 실행되지 않았습니다.",
        account: { stored: "principal < 0", base: "debt $900", collateral: "WETH credit $850", protocol: "판정만 완료" },
      },
      {
        label: "Absorb 실행",
        title: "누구나 absorb를 호출해 계정 전체를 protocol로 넘길 수 있습니다.",
        now: "Protocol reserves가 base debt를 정리하고 WETH balance를 inventory로 받습니다.",
        evidence: "사용자 principal과 collateral이 0으로 바뀝니다.",
        pending: "호출자가 자기 USDC로 debt를 갚거나 WETH를 가져가는 구조가 아닙니다.",
        account: { stored: "principal 0", base: "debt 0", collateral: "WETH 0", protocol: "WETH 1 · debt $900 정리" },
      },
      {
        label: "호출자 기록",
        title: "Absorb caller에게는 liquidator points가 기록됩니다.",
        now: "프로토콜이 정한 방식으로 실행 기여를 추적합니다.",
        evidence: "누가 absorb를 실행했는지 별도 상태에 남습니다.",
        pending: "Points는 seized collateral의 즉시 소유권이 아닙니다.",
        account: { stored: "Alice 종료", base: "caller base 지급 없음", collateral: "caller WETH 수령 없음", protocol: "points 기록" },
      },
      {
        label: "판매 gate",
        title: "Protocol reserves와 targetReserves의 관계가 판매 가능 여부를 정합니다.",
        now: "Buy action pause와 fresh oracle을 함께 확인한 뒤 storefront를 엽니다.",
        evidence: "buyCollateral을 실행할 수 있는 시장 상태가 됩니다.",
        pending: "Gate가 닫혀 있으면 inventory가 있어도 buyer는 살 수 없습니다.",
        account: { stored: "Alice 변화 없음", base: "reserve gate", collateral: "WETH inventory 1", protocol: "sale 가능/불가" },
      },
      {
        label: "가격 견적",
        title: "Oracle 가격에서 LF와 storefront factor로 정한 할인만 뺍니다.",
        now: "SF=50%, LF=90%이면 할인은 5%이고 $100 상당 담보의 ask는 $95입니다.",
        evidence: "Buyer가 낼 baseAmount와 받을 collateral quote가 생깁니다.",
        pending: "이 할인은 absorb caller에게 소급 지급되지 않습니다.",
        account: { stored: "quote only", base: "ask $95", collateral: "oracle value $100", protocol: "5% 할인" },
      },
      {
        label: "별도 구매",
        title: "Buyer가 USDC를 내고 minAmount 이상 WETH를 받습니다.",
        now: "별도 transaction의 buyCollateral이 protocol inventory와 reserves를 동시에 바꿉니다.",
        evidence: "담보 판매와 base reserve 회수가 실제로 완료됩니다.",
        pending: "Slippage·rounding·revert까지 포함한 receipt를 확인해야 구매 성공입니다.",
        account: { stored: "Alice 변화 없음", base: "buyer USDC → protocol", collateral: "protocol WETH → buyer", protocol: "inventory ↓ · reserves ↑" },
      },
    ],
  },
};

function LedgerCard({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border p-2.5 ${active ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
      <p className="text-[9px] font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 break-keep text-xs font-black leading-5">{value}</p>
    </div>
  );
}

export default function ModernCometViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  const labels = flow.scenes.map((scene) => scene.label);
  const notes = flow.scenes.map((scene) => `${scene.title} ${scene.evidence} ${scene.pending}`);
  const scenes = useAnimatedScenes(flow.scenes.length, 6500, { loop: false });
  const state = flow.scenes[scenes.active];

  return (
    <VizFrame
      eyebrow={flow.eyebrow}
      title={flow.title}
      description={flow.description}
      note={flow.note}
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        tabIndex={0}
        role="group"
        aria-label={`Compound III ${mode} 흐름 ${flow.scenes.length}단계`}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage className="min-h-[716px] sm:min-h-[626px] xl:min-h-[455px]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {state.label}</p>
          <h4 className="mt-2 min-h-14 break-keep text-base font-bold leading-7">{state.title}</h4>

          <div className="mt-3 grid gap-3 xl:grid-cols-[.9fr_1.1fr]">
            <div className="border border-border bg-card p-3">
              <p className="text-[10px] font-black">Alice와 protocol의 현재 장부</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <LedgerCard label="저장된 base 상태" value={state.account.stored} active />
                <LedgerCard label="현재 base 가치" value={state.account.base} />
                <LedgerCard label="담보 장부" value={state.account.collateral} />
                <LedgerCard label="Protocol 쪽 변화" value={state.account.protocol} />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                <span className="border border-primary bg-primary/5 px-2 py-1 text-primary">base</span>
                <span aria-hidden="true">≠</span>
                <span className="border border-border bg-background px-2 py-1">collateral</span>
              </div>
            </div>

            <div className="grid gap-px border border-border bg-border p-px">
              <div className="min-w-0 bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">지금 실행하는 일</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.now}</p></div>
              <div className="min-w-0 bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">이번 단계에서 확정</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.evidence}</p></div>
              <div className="min-w-0 bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">아직 확정되지 않음</p><p className="mt-1 break-keep text-xs font-semibold leading-5">{state.pending}</p></div>
            </div>
          </div>

          <div className="mt-4 grid gap-1" style={{ gridTemplateColumns: `repeat(${flow.scenes.length}, minmax(0, 1fr))` }} aria-hidden="true">
            {labels.map((label, index) => <span key={label} className={`h-1.5 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />)}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={labels} controlLabels={labels} playLabel={`${flow.title} 재생`} />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
