import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["재고", "보유비용", "1,000배럴", "콘탱고", "백워데이션", "재고 부족", "인도", "전체수익"] as const;

const NOTES = [
  "정유공장에 오늘 있는 원유 1,000배럴은 생산 중단을 막지만, 석 달 뒤 받을 선물 1,000배럴은 오늘의 급한 주문을 채우지 못합니다.",
  "현물 75달러에 석 달 자금비용 0.75달러와 보관·보험비 1달러를 더하고, 지금 재고를 쓸 수 있는 편익 2달러를 빼면 설명용 선물값은 74.75달러입니다.",
  "1,000배럴 기준 자금·보관비는 1,750달러이고 편의수익은 2,000달러입니다. 순보유비용은 −250달러가 됩니다.",
  "가까운 계약 75달러를 팔고 다음 계약 78달러를 사면 같은 수량을 유지하는 데 배럴당 3달러가 더 듭니다. 현물이 그대로여도 롤 과정에서 비용이 생깁니다.",
  "재고를 지금 쓸 편익이 보유비용보다 크면 가까운 가격이 먼 가격보다 높을 수 있습니다. 사례의 75달러와 석 달 74.75달러는 이 방향을 보여 주는 설명용 장부입니다.",
  "재고가 줄면 지금 가진 한 배럴의 운영 가치가 커집니다. 편의수익과 가까운 만기 가격이 함께 오를 수 있지만 계절·생산·인도 가능 재고도 함께 봐야 합니다.",
  "WTI 선물의 만기 인도 규칙은 계약을 쿠싱의 정해진 원유와 연결합니다. 가격 헤지의 이익은 항만·품질·운송 문제를 대신 해결하지 않습니다.",
  "전체 투자 결과는 현물 변화, 롤수익, 담보 이자와 거래비용을 합쳐야 알 수 있습니다. 콘탱고나 백워데이션 하나만으로 수익을 보장할 수 없습니다.",
] as const;

type Panel = "inventory" | "carry" | "scale" | "contango" | "backwardation" | "scarcity" | "delivery" | "return";

const SCENES = [
  {
    title: "오늘 쓸 원유 1,000배럴과 석 달 뒤 받을 1,000배럴은 같은 일을 하지 못합니다",
    detail: "가격표가 같아 보여도 현재 재고는 생산을 이어 가게 하는 운영 자원입니다.",
    panel: "inventory",
    formula: "오늘 재고 → 즉시 투입 가능 · 석 달 선물 → 만기 뒤 인도",
    conclusion: "실물을 지금 보유하는 가치가 편의수익의 출발점입니다.",
  },
  {
    title: "현물 75달러에 자금 0.75와 보관 1을 더하고 편익 2를 빼면 74.75달러입니다",
    detail: "미래 가격 전망이 아니라 같은 원유를 석 달 보유하는 장부를 맞춥니다.",
    panel: "carry",
    formula: "$75 + $0.75 + $1.00 − $2.00 = $74.75",
    conclusion: "보유비용보다 편의수익이 0.25달러 커서 설명용 선물값이 현물보다 낮습니다.",
  },
  {
    title: "1,000배럴에서는 현금비용 1,750달러와 비현금 편익 2,000달러를 나눠 봅니다",
    detail: "배럴당 계산을 물량 장부로 키워 비용과 편익의 성격을 구분합니다.",
    panel: "scale",
    formula: "$750 + $1,000 − $2,000 = 순보유비용 −$250",
    conclusion: "편의수익은 통장에 들어오는 이자가 아니므로 재고와 시장 가격에서 추정합니다.",
  },
  {
    title: "75달러 계약을 팔고 78달러의 다음 계약을 사면 롤에 배럴당 3달러가 듭니다",
    detail: "먼 만기가 더 비싼 콘탱고에서 계약을 유지하는 현금 이동을 봅니다.",
    panel: "contango",
    formula: "가까운 계약 매도 $75 − 다음 계약 매수 $78 = −$3",
    conclusion: "현물 가격이 움직이지 않아도 반복 롤에서 손익이 생길 수 있습니다.",
  },
  {
    title: "가까운 가격 75가 석 달 가격 74.75보다 높으면 곡선은 아래로 기울 수 있습니다",
    detail: "지금 쓸 재고의 편익이 보유비용보다 큰 설명용 백워데이션 사례입니다.",
    panel: "backwardation",
    formula: "가까운 가격 $75.00 > 석 달 가격 $74.75",
    conclusion: "곡선의 기울기는 보유 장부를 반영하지만 미래 현물가격을 확정하지는 않습니다.",
  },
  {
    title: "재고가 줄면 지금 가진 한 배럴의 편익과 가까운 만기 가격이 함께 커질 수 있습니다",
    detail: "창고 상태가 편의수익을 거쳐 선물곡선 앞부분에 번지는 경로입니다.",
    panel: "scarcity",
    formula: "재고 감소 → 생산 중단 비용 증가 → 편의수익 증가 → 근월물 압력",
    conclusion: "계절 수요와 인도 가능 재고가 다르면 같은 총재고에서도 곡선은 다를 수 있습니다.",
  },
  {
    title: "WTI 계약의 만기 가격은 쿠싱에서 인도 가능한 원유와 연결됩니다",
    detail: "금융 계약이 실물 기준에서 멀어지지 않게 하는 마지막 연결을 봅니다.",
    panel: "delivery",
    formula: "계약 규격 → 품질·장소·기간 → 인도 또는 포지션 종료",
    conclusion: "선물 손익은 가격 위험을 줄일 수 있지만 원유의 품질·운송·도착을 대신하지 않습니다.",
  },
  {
    title: "전체 결과는 현물 변화·롤수익·담보 이자·거래비용을 합친 뒤에 알 수 있습니다",
    detail: "곡선 이름과 투자자의 실제 손익을 서로 다른 장부로 마무리합니다.",
    panel: "return",
    formula: "전체수익 = 현물 변화 + 롤수익 + 담보 이자 − 거래비용",
    conclusion: "백워데이션이어도 현물이 크게 떨어지면 손실이고, 콘탱고만으로 과잉공급을 단정할 수도 없습니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Box({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Arrow({ children = "→" }: { children?: string }) {
  return <div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground sm:text-base">{children}</div>;
}

function InventoryPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="오늘의 현물 재고와 석 달 뒤 선물 인도 비교">
      <Box label="오늘 창고" value="원유 1,000배럴 · 바로 생산" active />
      <Arrow>≠</Arrow>
      <Box label="석 달 선물" value="1,000배럴 · 오늘은 사용 불가" />
    </div>
  );
}

function CarryPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="현물에 자금비용과 보관비를 더하고 편의수익을 빼는 계산">
      <Box label="현물" value="$75.00" />
      <Arrow>+</Arrow>
      <Box label="자금·보관" value="$1.75" />
      <Arrow>−</Arrow>
      <Box label="편의수익" value="$2.00" />
      <Arrow>=</Arrow>
      <Box label="석 달 선물" value="$74.75" active />
    </div>
  );
}

function ScalePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="원유 1,000배럴의 보유비용 장부">
      <Box label="자금비용" value="$750 현금 지출" />
      <Box label="보관·보험" value="$1,000 현금 지출" />
      <Box label="편의수익" value="$2,000 비현금 편익" />
      <Box label="순보유비용" value="−$250" active />
    </div>
  );
}

function CurvePanel({ backward = false }: { backward?: boolean }) {
  const near = backward ? 75 : 75;
  const far = backward ? 74.75 : 78;
  const nearY = backward ? 48 : 150;
  const farY = backward ? 150 : 48;
  return (
    <svg viewBox="0 0 640 205" className="block w-full" role="img" aria-label={backward ? "가까운 가격이 먼 가격보다 높은 백워데이션 곡선" : "먼 가격이 가까운 가격보다 높은 콘탱고 곡선"}>
      <line x1="72" y1="174" x2="590" y2="174" className="stroke-border" strokeWidth="1" />
      <line x1="72" y1="26" x2="72" y2="174" className="stroke-border" strokeWidth="1" />
      <path d={`M120 ${nearY} C260 ${nearY}, 420 ${farY}, 560 ${farY}`} fill="none" className="stroke-primary" strokeWidth="1.25" />
      <circle cx="120" cy={nearY} r="8" className="fill-foreground" />
      <circle cx="560" cy={farY} r="8" className="fill-primary" />
      <text x="120" y={nearY - 18} textAnchor="middle" className="fill-foreground text-[17px] font-black">가까운 계약 ${near.toFixed(2)}</text>
      <text x="560" y={farY - 18} textAnchor="middle" className="fill-primary text-[17px] font-black">다음 계약 ${far.toFixed(2)}</text>
      <text x="120" y="199" textAnchor="middle" className="fill-muted-foreground text-[15px] font-bold">지금</text>
      <text x="560" y="199" textAnchor="middle" className="fill-muted-foreground text-[15px] font-bold">석 달</text>
    </svg>
  );
}

function ScarcityPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="재고 감소가 편의수익과 가까운 선물가격에 전해지는 순서">
      <Box label="창고" value="인도 가능 재고 감소" active />
      <Arrow />
      <Box label="공장" value="중단 위험 증가" />
      <Arrow />
      <Box label="곡선 앞부분" value="편의수익·근월물 압력" active />
    </div>
  );
}

function DeliveryPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="WTI 선물계약에서 쿠싱 실물 인도까지의 연결">
      <Box label="WTI 계약" value="수량·품질·만기" />
      <Arrow />
      <Box label="쿠싱" value="정해진 인도 장소" active />
      <Arrow />
      <Box label="실물 사업" value="운송·저장·생산" />
    </div>
  );
}

function ReturnPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="원자재 투자 전체수익을 이루는 네 장부">
      <Box label="현물 변화" value="기초 원자재 가격" />
      <Box label="롤수익" value="계약 교체 가격차" active />
      <Box label="담보 이자" value="현금 운용 결과" />
      <Box label="거래비용" value="수수료·호가 차이" />
    </div>
  );
}

export default function CommodityCarryMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="원자재 선물 · 원유 한 배럴의 전체 지도"
      title="선물가격은 현물에 보유비용을 더하고 지금 재고의 편익을 뺀 값에서 출발합니다"
      description="현물 75달러에 자금·보관비 1.75달러와 편의수익 2달러를 넣어 석 달 74.75달러를 만든 뒤, 곡선·롤·재고 부족·실물 인도·전체수익까지 이어 봅니다."
      note="가격과 물량은 작동 원리를 설명하기 위한 가정입니다. 실제 곡선에는 금리, 저장 능력, 계절, 품질, 장소, 인도 가능 재고와 거래비용이 함께 반영됩니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-commodity-carry-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "inventory" && <InventoryPanel />}
          {scene.panel === "carry" && <CarryPanel />}
          {scene.panel === "scale" && <ScalePanel />}
          {scene.panel === "contango" && <CurvePanel />}
          {scene.panel === "backwardation" && <CurvePanel backward />}
          {scene.panel === "scarcity" && <ScarcityPanel />}
          {scene.panel === "delivery" && <DeliveryPanel />}
          {scene.panel === "return" && <ReturnPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="원자재 선물 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
