import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["위험", "선도", "선물", "상승", "하락", "정산", "베이시스", "경계"] as const;

const NOTES = [
  "제빵업자는 빵 판매가격을 이미 정했지만 3개월 뒤 밀값은 모릅니다. 농가는 반대로 수확 때 밀값이 떨어질 위험을 가집니다. 두 사람은 밀 100톤의 미래 가격을 톤당 30만 원으로 정합니다.",
  "선도에서는 제빵업자와 농가가 수량·품질·장소·날짜·가격을 직접 맞춥니다. 사업에 꼭 맞는 대신, 상대방이 약속을 지키지 못할 위험도 서로 부담합니다.",
  "선물에서는 거래소 규격과 청산기관이 두 당사자 사이에 놓입니다. 계약을 바꿔 넘기기 쉬워지지만 증거금과 일일 정산 때문에 만기 전에 현금이 필요할 수 있습니다.",
  "만기 밀값이 톤당 35만 원이면 제빵업자는 현물 100톤에 3500만 원을 내고 계약에서 500만 원을 받습니다. 합친 순지출은 약정한 3000만 원입니다.",
  "만기 밀값이 톤당 25만 원이면 현물에는 2500만 원을 내지만 계약에서 500만 원을 잃습니다. 합친 순지출은 역시 3000만 원입니다.",
  "선물가격이 30만 원에서 31만 원으로 오른 날에는 매수자가 100만 원을 받고 매도자가 냅니다. 이후 35만 원까지 오르면 400만 원이 더 이동해 누적 차액은 500만 원이 됩니다.",
  "실제 밀을 톤당 36만 원에 사야 하지만 계약 정산가는 35만 원이면 제빵업자의 순지출은 3100만 원입니다. 현물과 계약이 정확히 같은 가격을 따라가지 않는 100만 원의 베이시스 위험이 남습니다.",
  "농가 수확량이 60톤으로 줄면 100톤 매도 계약 중 40톤은 현물 매출로 상쇄되지 않습니다. 증거금 부족이나 만기 교체 비용까지 생기면 가격 약속만으로 사업 전체 위험을 고정할 수 없습니다.",
] as const;

type Panel = "risk" | "forward" | "futures" | "high" | "low" | "margin" | "basis" | "boundary";

const SCENES = [
  {
    title: "제빵업자와 농가는 반대 방향의 밀값 위험을 한 가격 약속으로 맞춥니다",
    detail: "3개월 뒤 밀 100톤의 가격을 지금 톤당 30만 원으로 정합니다.",
    panel: "risk",
    formula: "100톤 × 30만 원 = 약정대금 3000만 원",
    conclusion: "계약은 가격 변동을 없애지 않고 한쪽 손익을 다른 쪽에 같은 크기로 옮깁니다.",
  },
  {
    title: "선도는 두 당사자가 수량·품질·장소·날짜를 직접 맞추는 계약입니다",
    detail: "맞춤 조건을 얻는 대신 상대방의 지급과 인도 능력을 직접 확인합니다.",
    panel: "forward",
    formula: "제빵업자 ↔ 100톤·30만 원·3개월 ↔ 농가",
    conclusion: "내 사업과 잘 맞는 계약도 상대방이 이행하지 못하면 같은 조건으로 다시 구해야 합니다.",
  },
  {
    title: "선물은 표준 계약과 청산기관을 두고 손익을 만기 전부터 정산합니다",
    detail: "직접 상대방보다 청산 구조와 증거금 계좌가 계약 이행을 관리합니다.",
    panel: "futures",
    formula: "매수자 → 거래소·청산기관 ← 매도자",
    conclusion: "계약을 바꿔 넘기기 쉬워지는 대신 오늘의 가격 변화가 오늘의 현금 요구가 됩니다.",
  },
  {
    title: "만기 밀값이 35만 원이면 현물 3500만 원에서 계약 이익 500만 원을 뺍니다",
    detail: "제빵업자의 실제 구매와 매수 계약을 한 장부에 합칩니다.",
    panel: "high",
    formula: "현물 3500만 원 − 계약이익 500만 원 = 순지출 3000만 원",
    conclusion: "시장가격은 올랐지만 계약 손익이 반대로 움직여 계획한 원료비를 지킵니다.",
  },
  {
    title: "만기 밀값이 25만 원이면 현물 2500만 원에 계약 손실 500만 원을 더합니다",
    detail: "가격이 내려가도 유리한 현물 구매와 불리한 계약을 함께 계산합니다.",
    panel: "low",
    formula: "현물 2500만 원 + 계약손실 500만 원 = 순지출 3000만 원",
    conclusion: "헤지는 더 싸게 살 기회도 내놓고 사업계획에 필요한 가격을 남기는 선택입니다.",
  },
  {
    title: "선물가격이 30→31→35만 원으로 오르면 100만 원과 400만 원이 나뉘어 이동합니다",
    detail: "전체 차액 500만 원은 같아도 돈이 필요한 날짜는 만기보다 앞섭니다.",
    panel: "margin",
    formula: "100톤×1만 원=100만 원 · 100톤×4만 원=400만 원",
    conclusion: "농가는 수확대금을 받기 전에 증거금을 내야 하므로 가격 위험과 유동성 위험을 따로 관리합니다.",
  },
  {
    title: "실제 밀값 36만 원과 계약 정산가 35만 원의 차이 100만 원은 남습니다",
    detail: "품질·장소가 다른 현물과 표준 계약이 완전히 같은 가격으로 움직이지 않는 경우입니다.",
    panel: "basis",
    formula: "현물 3600만 원 − 계약이익 500만 원 = 순지출 3100만 원",
    conclusion: "계약 방향이 맞아도 베이시스가 움직이면 처음 의도한 3000만 원과 차이가 납니다.",
  },
  {
    title: "수확량·증거금·만기 교체가 맞지 않으면 가격을 고정한 효과가 깨집니다",
    detail: "100톤 계약에 실제 수확 60톤인 상황과 중간 현금 부족을 함께 봅니다.",
    panel: "boundary",
    formula: "계약 100톤 − 실제 수확 60톤 = 현물로 상쇄되지 않는 40톤",
    conclusion: "헤지는 가격·수량·시점·참조가격이 함께 맞을 때만 계획한 사업 위험을 줄입니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Cell({ title, value, active = false }: { title: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{title}</p>
      <p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="text-center" aria-hidden="true">
      {label && <p className="mb-0.5 hidden text-[8px] font-bold text-muted-foreground sm:block">{label}</p>}
      <span className="font-mono text-sm font-black text-primary">→</span>
    </div>
  );
}

function RiskPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="제빵업자와 농가의 반대 방향 가격 위험">
      <Cell title="제빵업자" value="밀값 상승이 원료비를 높임" active />
      <div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground">30만 원</div>
      <Cell title="농가" value="밀값 하락이 매출을 줄임" />
    </div>
  );
}

function ForwardPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1.25fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="맞춤 선도계약의 당사자와 조건">
      <Cell title="매수자" value="제빵업자" />
      <Arrow />
      <Cell title="맞춤 선도" value="100톤 · 30만 원 · 3개월" active />
      <Arrow />
      <Cell title="매도자" value="농가" />
    </div>
  );
}

function FuturesPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1.25fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="청산기관이 사이에 놓인 선물계약">
      <Cell title="매수자" value="증거금 계좌" />
      <Arrow />
      <Cell title="거래소·청산" value="표준화 · 일일 정산" active />
      <Arrow />
      <Cell title="매도자" value="증거금 계좌" />
    </div>
  );
}

function HedgeLedger({ direction }: { direction: "high" | "low" }) {
  const high = direction === "high";
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label={high ? "밀값 상승 시 헤지 장부" : "밀값 하락 시 헤지 장부"}>
      <Cell title="현물 구매" value={high ? "−3500만 원" : "−2500만 원"} />
      <div className="font-mono text-sm font-black text-muted-foreground">+</div>
      <Cell title="계약 손익" value={high ? "+500만 원" : "−500만 원"} />
      <div className="font-mono text-sm font-black text-muted-foreground">=</div>
      <Cell title="순지출" value="3000만 원" active />
    </div>
  );
}

function MarginPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="선물가격 변화에 따른 일일 정산">
      <Cell title="계약 시작" value="30만 원" />
      <Arrow label="+1만 원" />
      <Cell title="첫 정산" value="매수 +100만 원" active />
      <Arrow label="+4만 원" />
      <Cell title="누적 정산" value="매수 +500만 원" active />
    </div>
  );
}

function BasisPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="실제 현물가격과 계약 정산가 차이">
      <Cell title="실제 밀" value="36만 원" />
      <div className="font-mono text-sm font-black text-muted-foreground">−</div>
      <Cell title="선물 정산" value="35만 원" />
      <div className="font-mono text-sm font-black text-muted-foreground">=</div>
      <Cell title="남은 베이시스" value="1만 원 × 100톤" active />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="헤지 뒤에도 남는 수량 유동성 만기 위험">
      <Cell title="수량" value="계약 100톤 · 수확 60톤" active />
      <Cell title="유동성" value="수확대금 전 증거금 납부" />
      <Cell title="만기" value="다음 계약 가격으로 교체" />
    </div>
  );
}

export default function ForwardsFuturesMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="선도·선물 · 밀 100톤 계약의 전체 지도"
      title="톤당 30만 원의 약속은 만기 손익과 중간 현금을 서로 다르게 움직입니다"
      description="제빵업자와 농가가 가격을 정하는 이유부터 선도·선물의 계약 경로, 35만 원과 25만 원의 헤지 손익, 일일 정산, 베이시스와 수량 불일치까지 같은 100톤 사례로 추적합니다."
      note="금액·가격·수확량은 작동 원리를 설명하기 위한 가정입니다. 실제 상품의 계약 승수, 품질, 인도 장소, 정산가, 증거금과 납부 시한은 거래소·청산기관·중개 계약에 따라 달라집니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-forwards-futures-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "risk" && <RiskPanel />}
          {scene.panel === "forward" && <ForwardPanel />}
          {scene.panel === "futures" && <FuturesPanel />}
          {scene.panel === "high" && <HedgeLedger direction="high" />}
          {scene.panel === "low" && <HedgeLedger direction="low" />}
          {scene.panel === "margin" && <MarginPanel />}
          {scene.panel === "basis" && <BasisPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="선도와 선물 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
