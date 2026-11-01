import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["경로", "잔여", "협상", "지연", "손익", "권리", "결과"] as const;

const NOTES = [
  "토지의 사용권과 인허가 범위를 확인한 뒤 자금을 마련하고 공사·기반 시설을 완성해야 입주 가능한 집이 됩니다. 구매자의 돈은 토지·공사·금융과 사업 위험을 부담한 곳으로 나뉩니다.",
  "설명용 사업에서 예상 판매 10억 원에서 공사 5억 원, 금융·허가 등 1억 원, 정상 이익 1억 원을 빼면 토지에 지불할 수 있는 잔여금액은 3억 원입니다.",
  "계산한 토지 잔여가치가 3억 원인데 토지 소유자가 4억 원을 요구하면 1억 원 차이가 납니다. 판매 전망이나 비용이 그대로라면 거래가 성립하기 어렵습니다.",
  "허가나 공사가 늦어 금융·관리 비용이 5천만 원 늘면 토지에 남는 여유는 3억 원에서 2억5천만 원으로 줄어듭니다. 허가 건수와 실제 입주 물량은 같은 시점의 숫자가 아닙니다.",
  "토지를 사기 전에는 제안 가격을 2억5천만 원으로 낮출 수 있지만 이미 3억 원을 지급했다면 땅값을 소급해 줄일 수 없습니다. 다른 조건이 같으면 요구 이익 1억 원 중 5천만 원이 줄어듭니다.",
  "같은 가격의 주택도 권리 기간, 최소 거주 기간, 임대·매각 제한, 보조금 환수 조건이 다르면 같은 자산이 아닙니다. 판매대금은 어떤 권리를 넘기는지와 함께 읽습니다.",
  "허가·착공·완공·입주는 서로 다른 공급 단계입니다. 집 수가 늘어도 보증금·대출·소득 조건을 맞추지 못하거나 일자리와 기반 시설에서 멀면 현재 가구의 거주 안정이 바로 좋아지지는 않습니다.",
] as const;

type Panel = "flow" | "residual" | "bargain" | "delay" | "profit" | "rights" | "outcome";

const SCENES = [
  {
    title: "토지 권리·자금·공사·기반 시설이 이어져야 입주할 집이 됩니다",
    detail: "건물 수가 아니라 지을 수 있는 권리에서 실제 입주까지의 경로를 봅니다.",
    panel: "flow",
    formula: "토지 권리 → 인허가·자금 → 공사·기반 시설 → 완공 → 입주",
    conclusion: "어느 한 단계가 늦으면 수요가 늘어도 당장 살 수 있는 집은 늘지 않습니다.",
  },
  {
    title: "판매 10억 원에서 비용과 정상 이익 7억 원을 빼면 토지 몫은 3억 원입니다",
    detail: "정상 이익을 이미 비용 묶음에 넣은 설명용 주택 개발 장부입니다.",
    panel: "residual",
    formula: "10억−공사 5억−금융·허가 1억−정상 이익 1억=토지 3억",
    conclusion: "3억은 자동으로 정해진 시세가 아니라 이 예상과 비용에서 감당할 수 있는 최대 토지비입니다.",
  },
  {
    title: "토지 요구가 4억 원이면 사업 장부에는 1억 원 차이가 생깁니다",
    detail: "계산한 잔여금액과 토지 소유자의 매도 요구를 같은 숫자로 보지 않습니다.",
    panel: "bargain",
    formula: "토지 요구 4억−감당 가능 3억=차이 1억",
    conclusion: "판매가를 높이거나 다른 비용·이익을 줄일 근거가 없으면 거래가 성립하기 어렵습니다.",
  },
  {
    title: "지연 비용 5천만 원이 늘면 토지에 남는 여유는 2억5천만 원입니다",
    detail: "허가와 공사 시간을 금융·관리 비용으로 연결합니다.",
    panel: "delay",
    formula: "기존 토지 여유 3억−지연 비용 0.5억=2.5억",
    conclusion: "허가가 났다는 기록과 착공·완공·입주가 이루어진 시점을 따로 추적합니다.",
  },
  {
    title: "토지를 이미 샀다면 늘어난 비용은 사업자의 이익에서 먼저 빠질 수 있습니다",
    detail: "토지 거래 전 제안 가격과 거래 뒤 확정된 손익의 결정을 나눕니다.",
    panel: "profit",
    formula: "이미 지급한 토지 3억 · 정상 이익 1억−지연 0.5억=남은 이익 0.5억",
    conclusion: "확정된 토지비를 소급해 낮출 수 없으므로 같은 지연도 시점에 따라 부담자가 달라집니다.",
  },
  {
    title: "같은 가격이라도 기간과 처분 조건이 다르면 같은 주택 권리가 아닙니다",
    detail: "권리 기간·최소 거주·임대·매각·보조금 환수 조건을 가격과 함께 확인합니다.",
    panel: "rights",
    formula: "가격 + 권리 기간 + 거주 의무 + 임대·매각 조건 + 환수 조건",
    conclusion: "기간 있는 권리와 영구 소유, 단순 임차를 이름만으로 같은 자산처럼 비교하지 않습니다.",
  },
  {
    title: "새 집 수와 현재 가구가 계속 살 수 있는지는 다른 결과입니다",
    detail: "공급 단계와 가구의 실제 부담·위치·권리 조건을 함께 봅니다.",
    panel: "outcome",
    formula: "허가 → 착공 → 완공 → 입주 · 소득·대출·교통·거주 안정은 별도 확인",
    conclusion: "집 수가 늘었다는 사실만으로 누가 입주했고 기존 주민이 남았는지까지 확정하지 않습니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Stage({ title, detail, strong = false }: { title: string; detail: string; strong?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${strong ? "border-foreground/60" : "border-border"}`}>
      <p className={`break-keep text-[8px] font-black sm:text-xs ${strong ? "text-primary" : ""}`}>{title}</p>
      <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
    </div>
  );
}

function Arrow() {
  return <span className="font-mono text-sm font-black text-primary" aria-hidden="true">→</span>;
}

function FlowPanel() {
  return (
    <div aria-label="토지 권리에서 입주까지 주택 공급 경로">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
        <Stage title="권리" detail="용도·세대 수" />
        <Arrow />
        <Stage title="준비" detail="허가·자금" />
        <Arrow />
        <Stage title="공사" detail="건물·기반 시설" />
        <Arrow />
        <Stage title="입주" detail="완공·거주" strong />
      </div>
      <p className="mt-3 border-t border-dashed border-border pt-2 text-center text-[8px] font-bold text-muted-foreground sm:text-[10px]">구매자 지급 → 토지·공사·금융·사업 위험을 부담한 곳에 배분</p>
    </div>
  );
}

function ResidualPanel() {
  const rows = [["예상 판매", "10억"], ["공사", "−5억"], ["금융·허가", "−1억"], ["정상 이익", "−1억"], ["토지 잔여", "3억"]] as const;
  return (
    <div className="space-y-0.5" aria-label="주택 개발 토지 잔여가치 계산">
      {rows.map(([label, value], index) => (
        <div key={label} className={`grid grid-cols-[1fr_0.7fr] items-center border-b py-1.5 sm:py-2 ${index === rows.length - 1 ? "border-foreground/60" : "border-border"}`}>
          <p className="text-[9px] font-black sm:text-xs">{label}</p>
          <p className={`text-right font-mono text-xs font-black sm:text-sm ${index === rows.length - 1 ? "text-primary" : ""}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

function BargainPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="토지 요구 가격과 감당 가능한 가격 차이">
      <Stage title="매도 요구" detail="4억" />
      <span className="font-mono text-sm font-black">−</span>
      <Stage title="감당 가능" detail="3억" />
      <span className="font-mono text-sm font-black">=</span>
      <Stage title="차이" detail="1억" strong />
    </div>
  );
}

function DelayPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="지연 비용으로 줄어드는 토지 여유">
      <Stage title="기존 여유" detail="3억" />
      <span className="font-mono text-sm font-black">−</span>
      <Stage title="지연 비용" detail="0.5억" />
      <span className="font-mono text-sm font-black">=</span>
      <Stage title="새 여유" detail="2.5억" strong />
    </div>
  );
}

function ProfitPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="토지 거래 전과 거래 뒤 지연 비용 부담">
      <div className="border-y border-border py-3 text-center sm:py-4">
        <p className="text-[9px] font-black sm:text-xs">토지 사기 전</p>
        <p className="mt-1 break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">제안 가격 3억 → 2.5억</p>
      </div>
      <div className="border border-foreground/60 p-3 text-center sm:p-4">
        <p className="text-[9px] font-black text-primary sm:text-xs">토지 산 뒤</p>
        <p className="mt-1 break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">이익 1억 → 0.5억</p>
      </div>
    </div>
  );
}

function RightsPanel() {
  const items = [["기간", "몇 년의 권리"], ["거주", "최소 기간"], ["처분", "임대·매각"], ["환수", "보조금 조건"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="주택 권리를 비교하는 네 조건">
      {items.map(([title, detail]) => (
        <div key={title} className="min-w-0 border-y border-border py-3 text-center sm:py-4">
          <p className="text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function OutcomePanel() {
  return (
    <div aria-label="주택 공급 단계와 거주 결과">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
        <Stage title="허가" detail="지을 권리" />
        <Arrow />
        <Stage title="착공" detail="공사 시작" />
        <Arrow />
        <Stage title="완공" detail="건물 준비" />
        <Arrow />
        <Stage title="입주" detail="실제 거주" strong />
      </div>
      <p className="mt-3 border-t border-dashed border-border pt-2 text-center text-[8px] font-bold text-muted-foreground sm:text-[10px]">소득·보증금·대출·일자리 거리·기존 주민의 이주 여부는 별도 결과</p>
    </div>
  );
}

export default function HousingLandSupplyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="주택 공급 · 설명용 개발 장부"
      title="판매 10억 원에서 토지 3억 원이 남고 입주로 이어지는 과정"
      description="토지 권리에서 입주까지의 공급 경로와 잔여가치, 지연, 권리 조건, 가구의 실제 거주 결과를 나누어 봅니다."
      note="금액은 설명용 가정이며 세금과 시간 차이를 단순화했습니다. 실제 토지·주택 가격이나 특정 사업의 수익성을 뜻하지 않습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-housing-supply-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "flow" && <FlowPanel />}
          {scene.panel === "residual" && <ResidualPanel />}
          {scene.panel === "bargain" && <BargainPanel />}
          {scene.panel === "delay" && <DelayPanel />}
          {scene.panel === "profit" && <ProfitPanel />}
          {scene.panel === "rights" && <RightsPanel />}
          {scene.panel === "outcome" && <OutcomePanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="주택 공급과 토지 잔여가치 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
