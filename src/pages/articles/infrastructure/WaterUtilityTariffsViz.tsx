import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["서비스", "비용", "부담", "유지", "공백", "요금", "접근"] as const;

const NOTES = [
  "물은 취수·정수·배관을 거쳐 집에 도착하고, 사용 뒤에는 하수 처리라는 별도 기능을 지납니다. 가구 요금과 정부 지원은 공급자에게 들어오는 돈의 출처이며 물의 물리 경로와 다릅니다.",
  "설명용 한 해에 정수·운영 60과 배관 교체 30이 필요하면 서비스에 필요한 현금은 90입니다. 교체를 미루면 올해 지출은 줄어도 누수와 단수 위험이 미래 이용자에게 넘어갑니다.",
  "가구가 80을 내고 정부가 취약 가구를 대신해 10을 내면 공급자는 90을 받습니다. 같은 요금 10의 지급자를 바꾼 것이므로 서비스 비용에 다시 더해 100이라고 쓰지 않습니다.",
  "사용량이 줄면 약품과 전력 일부는 줄 수 있지만 이미 묻힌 배관의 점검·수리·교체와 필요한 인력은 같은 비율로 줄지 않습니다. 사용량 요금만 낮아지면 수입이 유지비보다 먼저 줄 수 있습니다.",
  "가구 요금 수입이 60이면 서비스 비용 90과의 요금 공백은 30입니다. 정부가 10을 지급해도 총수입은 70이어서 최종 재원 공백 20이 남습니다.",
  "기본요금은 수입을 안정시키지만 적게 쓰는 집의 부담이 커질 수 있고, 사용량 요금은 절수를 유도하지만 가구원 수가 많은 저소득 가구에 불리할 수 있습니다. 대상 지원은 부담자를 바꾸지만 지급 재원이 필요합니다.",
  "이미 연결된 집의 요금 지원과 배관이 없는 집의 연결 지원은 다른 문제를 풉니다. 청구액뿐 아니라 가구 소득, 수질, 공급 시간, 누수, 미연결 가구를 함께 봐야 부담 가능성과 안정 공급을 판단할 수 있습니다.",
] as const;

type Panel = "service" | "cost" | "payer" | "maintenance" | "gap" | "tariff" | "access";

const SCENES = [
  {
    title: "취수·정수·배관·사용·하수 처리는 서로 다른 기능입니다",
    detail: "물의 물리 경로와 가구 요금·정부 지원이 들어오는 자금 경로를 나누어 봅니다.",
    panel: "service",
    formula: "물: 취수 → 정수 → 배관 → 가구 → 하수 처리 · 돈: 가구·정부 → 공급자",
    conclusion: "하나의 청구서 안에서도 급수와 사용 뒤 처리의 비용 범위를 구분해야 빠뜨리거나 두 번 세지 않습니다.",
  },
  {
    title: "정수·운영 60과 배관 교체 30을 합치면 한 해 필요액은 90입니다",
    detail: "현금 지출을 단순화한 설명용 장부이며 감가상각을 계산한 회계 비용과 같지는 않습니다.",
    panel: "cost",
    formula: "정수·운영 60 + 배관 교체 30 = 서비스 필요액 90",
    conclusion: "교체 30을 미루면 올해 요금은 낮출 수 있어도 누수·단수와 더 큰 공사비를 뒤로 넘길 수 있습니다.",
  },
  {
    title: "가구 80과 정부 10은 같은 90의 부담자를 나눕니다",
    detail: "정부가 취약 가구의 요금 10을 대신 지급하고 별도 행정비는 없다는 설명용 사례입니다.",
    panel: "payer",
    formula: "가구 지급 80 + 정부 대납 10 = 공급자 수입 90",
    conclusion: "지원 10은 새로운 서비스 비용이 아니라 지급자의 변경이므로 90에 다시 더하지 않습니다.",
  },
  {
    title: "물을 적게 써도 묻힌 관의 점검·수리·교체 비용은 남습니다",
    detail: "사용량에 따라 움직이는 비용과 망을 유지하기 위해 계속 필요한 비용을 분리합니다.",
    panel: "maintenance",
    formula: "사용량 감소 → 전력·약품 일부 감소 · 배관·인력 비용은 그대로 남을 수 있음",
    conclusion: "사용량 요금만으로 수입을 만들면 절수가 먼저 수입을 줄여 유지보수 재원이 부족해질 수 있습니다.",
  },
  {
    title: "요금 60과 지원 10을 받아도 서비스 90에는 20이 모자랍니다",
    detail: "요금만 볼 때의 공백과 모든 지급원을 합친 뒤의 공백을 따로 계산합니다.",
    panel: "gap",
    formula: "요금 공백 90−60=30 · 총수입 60+10=70 · 최종 공백 90−70=20",
    conclusion: "20을 메울 재원이 없으면 운영·교체를 줄이거나 차입해야 하며, 차입에는 뒤의 상환 재원이 필요합니다.",
  },
  {
    title: "기본요금·사용량 요금·대상 지원은 서로 다른 문제를 풉니다",
    detail: "수입 안정·절수 유도·부담 완화를 한 수단이 동시에 완벽하게 해결하지는 못합니다.",
    panel: "tariff",
    formula: "기본요금: 고정비 | 사용량 요금: 소비 신호 | 대상 지원: 부담자 조정",
    conclusion: "요금표의 각 항목이 급수·하수·희소성·지원 중 무엇을 위한 돈인지 적용 범위를 확인합니다.",
  },
  {
    title: "낮은 요금이 안전한 물에 연결되지 않은 집에는 도착하지 않을 수 있습니다",
    detail: "매달 요금 지원과 최초 연결 공사 지원을 나누고 실제 서비스 결과를 함께 봅니다.",
    panel: "access",
    formula: "부담 가능성 + 수질 + 공급 시간 + 누수 + 미연결 가구",
    conclusion: "낮은 청구액 하나로 공정성을 판정하지 않고 누가 연결돼 있으며 공급이 지속되는지 확인합니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Arrow() {
  return <span className="font-mono text-sm font-black text-primary" aria-hidden="true">→</span>;
}

function Stage({ title, detail, strong = false }: { title: string; detail: string; strong?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${strong ? "border-foreground/60" : "border-border"}`}>
      <p className={`break-keep text-[8px] font-black sm:text-xs ${strong ? "text-primary" : ""}`}>{title}</p>
      <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
    </div>
  );
}

function ServicePanel() {
  return (
    <div aria-label="취수에서 하수 처리까지 물 서비스 경로">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
        <Stage title="취수·정수" detail="모아 깨끗하게" />
        <Arrow />
        <Stage title="배관" detail="집까지 전달" />
        <Arrow />
        <Stage title="가구" detail="사용·요금" strong />
        <Arrow />
        <Stage title="하수 처리" detail="사용 뒤 처리" />
      </div>
      <p className="mt-3 border-t border-dashed border-border pt-2 text-center text-[8px] font-bold text-muted-foreground sm:text-[10px]">가구 요금 + 정부 지원 → 공급자의 운영·교체 재원</p>
    </div>
  );
}

function CostPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="수도 서비스 한 해 필요액 계산">
      <Stage title="정수·운영" detail="60" />
      <span className="font-mono text-sm font-black">+</span>
      <Stage title="배관 교체" detail="30" />
      <span className="font-mono text-sm font-black">=</span>
      <Stage title="필요액" detail="90" strong />
    </div>
  );
}

function PayerPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="가구와 정부가 나누어 내는 수도 서비스 비용">
      <Stage title="가구 지급" detail="80" />
      <span className="font-mono text-sm font-black">+</span>
      <Stage title="정부 대납" detail="10" />
      <span className="font-mono text-sm font-black">=</span>
      <Stage title="공급자 수입" detail="90" strong />
    </div>
  );
}

function MaintenancePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="사용량에 따라 달라지는 비용과 남는 비용">
      <div className="border-y border-border py-3 text-center sm:py-4">
        <p className="text-[9px] font-black sm:text-xs">일부 줄 수 있음</p>
        <p className="mt-1 break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">전력·약품·취수량</p>
      </div>
      <div className="border border-foreground/60 p-3 text-center sm:p-4">
        <p className="text-[9px] font-black text-primary sm:text-xs">계속 필요함</p>
        <p className="mt-1 break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">배관·점검·인력</p>
      </div>
    </div>
  );
}

function GapPanel() {
  const rows = [["서비스 필요액", "90", ""], ["가구 요금", "−60", "요금 공백 30"], ["정부 지급", "−10", "최종 공백 20"]] as const;
  return (
    <div className="space-y-1" aria-label="수도 요금과 지원 뒤 남는 재원 공백">
      {rows.map(([label, value, result], index) => (
        <div key={label} className={`grid grid-cols-[1fr_0.5fr_1fr] items-center gap-2 border-b py-2 ${index === rows.length - 1 ? "border-foreground/60" : "border-border"}`}>
          <p className="text-[9px] font-black sm:text-xs">{label}</p>
          <p className="text-right font-mono text-sm font-black">{value}</p>
          <p className={`break-keep text-right text-[8px] font-bold sm:text-[10px] ${index === rows.length - 1 ? "text-primary" : "text-muted-foreground"}`}>{result}</p>
        </div>
      ))}
    </div>
  );
}

function TariffPanel() {
  const items = [["기본요금", "수입 안정", "적게 써도 부담"], ["사용량 요금", "절수 신호", "가구원 수 영향"], ["대상 지원", "부담 완화", "재원·선정 필요"]] as const;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="수도 요금 설계의 세 수단">
      {items.map(([title, effect, boundary]) => (
        <div key={title} className="min-w-0 border-y border-border py-3 text-center sm:py-4">
          <p className="text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[8px] font-bold sm:text-[10px]">{effect}</p>
          <p className="mt-1 break-keep text-[7px] leading-3 text-muted-foreground sm:text-[9px]">{boundary}</p>
        </div>
      ))}
    </div>
  );
}

function AccessPanel() {
  const items = [["연결", "배관이 닿는가"], ["부담", "소득 대비 청구액"], ["품질", "안전한 물인가"], ["지속", "공급 시간·누수"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="수도 서비스 접근성을 확인하는 네 조건">
      {items.map(([title, detail]) => (
        <div key={title} className="min-w-0 border-y border-border py-3 text-center sm:py-4">
          <p className="text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

export default function WaterUtilityTariffsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="수도 요금 · 설명용 한 해 장부"
      title="서비스 비용 90을 가구·정부가 나누고, 부족한 재원을 확인하는 과정"
      description="물의 경로와 비용·부담자·요금 구조·접근성을 나누어 오늘의 낮은 요금과 내일의 안정 공급을 함께 봅니다."
      note="비용·요금·지원 수치는 설명용 가정입니다. 현금 필요액을 단순화한 값이며 실제 회계 비용·요금표·공사 수명을 대신하지 않습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-water-utility-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "service" && <ServicePanel />}
          {scene.panel === "cost" && <CostPanel />}
          {scene.panel === "payer" && <PayerPanel />}
          {scene.panel === "maintenance" && <MaintenancePanel />}
          {scene.panel === "gap" && <GapPanel />}
          {scene.panel === "tariff" && <TariffPanel />}
          {scene.panel === "access" && <AccessPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="수도 서비스 비용과 부담 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
