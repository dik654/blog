import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["완공가치", "잔여", "취득", "스트레스", "지연", "시간", "조건"] as const;

const NOTES = [
  "설명용 개발의 완공 후 매각액을 100억 원으로 둡니다. 아직 토지대금·공사비·금융비가 빠지지 않은 총개발가치 가정입니다.",
  "100억 원에서 토지를 제외한 개발비 70억 원과 목표 이익 15억 원을 빼면 토지와 취득에 쓸 수 있는 잔여는 15억 원입니다.",
  "취득 세금·법률·중개비를 설명용 2억 원으로 두면 토지 매도자에게 배정할 예산은 13억 원입니다.",
  "매각액이 90억 원으로 낮아지거나 개발비가 80억 원으로 오르면 잔여는 각각 5억 원입니다. 둘이 함께 일어나면 −5억 원으로 이 조건의 사업 예산이 성립하지 않습니다.",
  "대출 잔액 50억 원이 6개월 더 유지되고 연 8% 단리만 추가된다는 가정에서는 이자 2억 원이 늘어 토지·취득 잔여가 13억 원으로 줄어듭니다.",
  "토지·취득비와 개발비는 먼저 나가고 매각대금은 완공 뒤 들어옵니다. 같은 합계라도 지급 시점에 따라 중간 자금과 금융비가 달라집니다.",
  "소유권·경계, 계획 가능한 용도와 면적, 도로·전기·수도, 인허가, 자금 조달이 매각액과 비용 가정을 바꿉니다. 잔여값은 이런 조건을 통과한 뒤에만 실행 가능한 예산이 됩니다.",
] as const;

type Scene = {
  title: string;
  detail: string;
  sale: number;
  developmentCost: number;
  targetProfit: number;
  acquisitionCost: number;
  showWaterfall: boolean;
  showStress: boolean;
  showDelay: boolean;
  showTimeline: boolean;
  showGates: boolean;
  formula: string;
  conclusion: string;
};

const SCENES: readonly Scene[] = [
  {
    title: "완공 뒤 받을 100억 원에서 계산을 시작합니다",
    detail: "100억 원은 토지의 현재 가격이 아니라 계획한 공간을 완공해 매각할 때의 설명용 총액입니다.",
    sale: 100, developmentCost: 70, targetProfit: 15, acquisitionCost: 0,
    showWaterfall: false, showStress: false, showDelay: false, showTimeline: false, showGates: false,
    formula: "총개발가치 가정 = 100억 원",
    conclusion: "나중의 총수입을 지금 토지에 모두 지불할 수는 없습니다.",
  },
  {
    title: "개발비와 목표 이익을 빼 토지·취득 잔여를 구합니다",
    detail: "토지를 제외한 공사·금융·판매 등 개발비 70억 원과 목표 이익 15억 원을 한 번씩 뺍니다.",
    sale: 100, developmentCost: 70, targetProfit: 15, acquisitionCost: 0,
    showWaterfall: true, showStress: false, showDelay: false, showTimeline: false, showGates: false,
    formula: "100억 원 − 70억 원 − 15억 원 = 잔여 15억 원",
    conclusion: "잔여 15억 원은 입력 가정의 결과이며 확정된 토지 시세가 아닙니다.",
  },
  {
    title: "취득 부대비용을 빼 매도자에게 줄 예산을 구합니다",
    detail: "잔여 15억 원 안에 취득 세금·법률·중개비 2억 원이 들어간다는 설명용 가정입니다.",
    sale: 100, developmentCost: 70, targetProfit: 15, acquisitionCost: 2,
    showWaterfall: true, showStress: false, showDelay: false, showTimeline: false, showGates: false,
    formula: "잔여 15억 원 − 취득 부대비용 2억 원 = 매도자 예산 13억 원",
    conclusion: "토지와 취득에 쓸 돈과 토지 매도자가 받는 돈도 구분합니다.",
  },
  {
    title: "매각액 하락과 비용 상승을 각각, 또 함께 넣습니다",
    detail: "한 가정만 바뀔 때와 두 가정이 동시에 틀릴 때 사업 예산이 얼마나 달라지는지 비교합니다.",
    sale: 100, developmentCost: 70, targetProfit: 15, acquisitionCost: 0,
    showWaterfall: false, showStress: true, showDelay: false, showTimeline: false, showGates: false,
    formula: "90 − 80 − 15 = −5억 원",
    conclusion: "음수 잔여는 토지 가격이 음수라는 뜻이 아니라 이 조건에서 목표 사업이 성립하지 않는다는 뜻입니다.",
  },
  {
    title: "6개월 지연이 만든 이자 2억 원을 비용에 더합니다",
    detail: "대출 잔액 50억 원, 연 8%, 6개월 단리만 추가된다는 설명용 지연 가정입니다.",
    sale: 100, developmentCost: 72, targetProfit: 15, acquisitionCost: 0,
    showWaterfall: true, showStress: false, showDelay: true, showTimeline: false, showGates: false,
    formula: "50억 원 × 0.08 × 6/12 = 2억 원 · 잔여 13억 원",
    conclusion: "같은 매각액이어도 회수 날짜가 늦으면 토지에 쓸 수 있는 돈이 줄어듭니다.",
  },
  {
    title: "먼저 나가는 돈과 나중에 들어오는 돈을 시간축에 놓습니다",
    detail: "토지·취득비와 개발비 지급은 완공 매각보다 앞섭니다. 합계 뺄셈만으로는 중간 자금 부족이 보이지 않습니다.",
    sale: 100, developmentCost: 70, targetProfit: 15, acquisitionCost: 0,
    showWaterfall: false, showStress: false, showDelay: false, showTimeline: true, showGates: false,
    formula: "취득 15억 원 → 개발비 70억 원 → 완공 매각 100억 원",
    conclusion: "월별 지급 시점과 자금 조달을 붙여야 실행 가능한 계획이 됩니다.",
  },
  {
    title: "허가·인프라·권리·자금 조건이 숫자의 입력을 바꿉니다",
    detail: "지을 수 있는 면적이 줄면 매각액이, 도로·전기·수도 조건이 늘면 개발비가 바뀝니다.",
    sale: 100, developmentCost: 70, targetProfit: 15, acquisitionCost: 0,
    showWaterfall: false, showStress: false, showDelay: false, showTimeline: false, showGates: true,
    formula: "실행 가능한 권리·허가·인프라·자금 → 매각액과 비용 입력 → 잔여",
    conclusion: "잔여법은 불확실성을 없애지 않고 어떤 가정을 검증해야 하는지 드러냅니다.",
  },
];

function billion(value: number) {
  return `${value.toLocaleString("ko-KR")}억 원`;
}

function CoreNumbers({ scene }: { scene: Scene }) {
  const residual = scene.sale - scene.developmentCost - scene.targetProfit;
  const sellerBudget = residual - scene.acquisitionCost;
  const items = [
    ["완공 매각", scene.sale],
    ["개발비", -scene.developmentCost],
    ["목표 이익", -scene.targetProfit],
    [scene.acquisitionCost > 0 ? "매도자 예산" : "토지·취득 잔여", sellerBudget],
  ];
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="잔여법 핵심 숫자">
      {items.map(([label, raw], index) => {
        const value = Number(raw);
        return (
          <div key={String(label)} className={`min-w-0 border-y py-2.5 text-center ${index === 3 ? "border-foreground/50" : "border-border"}`}>
            <p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label}</p>
            <p className={`mt-1 break-keep font-mono text-[9px] font-black sm:text-xs ${index === 3 ? "text-primary" : ""}`}>{value < 0 ? "−" : ""}{billion(Math.abs(value))}</p>
          </div>
        );
      })}
    </div>
  );
}

function Waterfall({ scene }: { scene: Scene }) {
  const residual = scene.sale - scene.developmentCost - scene.targetProfit;
  const rows = [
    ["완공 가치", scene.sale, "bg-foreground"],
    ["개발비", scene.developmentCost, "bg-muted-foreground"],
    ["목표 이익", scene.targetProfit, "bg-primary/60"],
    ["남은 잔여", residual, "bg-primary"],
  ] as const;
  return (
    <div className="space-y-1.5" aria-label="완공 가치에서 비용과 이익을 빼는 막대">
      {rows.map(([label, value, tone]) => (
        <div key={label} className="grid grid-cols-[70px_1fr_auto] items-center gap-2 sm:grid-cols-[90px_1fr_auto]">
          <p className="break-keep text-[8px] font-bold sm:text-[10px]">{label}</p>
          <div className="h-2 bg-muted sm:h-2.5"><div className={`h-full transition-[width] duration-500 motion-reduce:transition-none ${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
          <p className="w-14 text-right font-mono text-[8px] font-black sm:w-16 sm:text-[10px]">{billion(value)}</p>
        </div>
      ))}
    </div>
  );
}

function StressPanel() {
  const cases = [
    ["기준", "100−70−15", 15],
    ["매각 90", "90−70−15", 5],
    ["비용 80", "100−80−15", 5],
    ["둘 다", "90−80−15", -5],
  ] as const;
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="매각액과 비용 변화에 따른 잔여 비교">
      {cases.map(([label, formula, result]) => (
        <div key={label} className={`min-w-0 border p-2 text-center sm:p-3 ${result < 0 ? "border-primary" : "border-border"}`}>
          <p className="text-[8px] font-black sm:text-[10px]">{label}</p>
          <p className="mt-1 font-mono text-[7px] text-muted-foreground sm:text-[9px]">{formula}</p>
          <p className={`mt-1 font-mono text-[10px] font-black sm:text-sm ${result < 0 ? "text-primary" : ""}`}>{billion(result)}</p>
        </div>
      ))}
    </div>
  );
}

function DelayPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="6개월 지연의 금융비 증가">
      <div className="border border-border p-2.5 text-center sm:p-4">
        <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">대출 50억 · 연 8%</p>
        <p className="mt-1.5 font-mono text-xs font-black sm:text-base">6개월 지연</p>
      </div>
      <span aria-hidden="true">→</span>
      <div className="border border-foreground/30 p-2.5 text-center sm:p-4">
        <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">추가 단리</p>
        <p className="mt-1.5 font-mono text-xs font-black text-primary sm:text-base">2억 원</p>
        <p className="mt-1 text-[8px] font-bold sm:text-[10px]">잔여 15억 → 13억</p>
      </div>
    </div>
  );
}

function TimelinePanel() {
  const steps = [["취득", "−15억"], ["설계·공사", "−70억"], ["완공 매각", "+100억"]] as const;
  return (
    <div className="relative grid grid-cols-3 gap-2" aria-label="개발사업의 현금 시간축">
      <span className="absolute left-[12%] right-[12%] top-5 h-px bg-border" aria-hidden="true" />
      {steps.map(([title, cash], index) => (
        <div key={title} className="relative min-w-0 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index + 1}</span>
          <p className="mt-1.5 text-[9px] font-black sm:text-xs">{title}</p>
          <p className={`mt-0.5 font-mono text-[9px] font-black sm:text-xs ${cash.startsWith("+") ? "text-primary" : ""}`}>{cash}</p>
        </div>
      ))}
    </div>
  );
}

function GatePanel() {
  const gates = [["권리", "소유권·경계·점유"], ["계획", "용도·면적·허가"], ["인프라", "도로·전기·수도"], ["자금", "지급일·대출·조건"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="잔여값 전에 확인할 실행 조건">
      {gates.map(([title, detail], index) => (
        <div key={title} className="min-w-0 border border-border p-2 text-center sm:p-3">
          <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[8px] font-black text-background">{index + 1}</span>
          <p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

export default function LandDevelopmentResidualViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="토지 개발 · 설명용 잔여 계산"
      title="완공 매각액 100억 원에서 실행 가능한 토지 예산을 거꾸로 찾는 과정"
      description="개발비·목표 이익·취득 부대비용과 시간·허가 조건이 잔여값을 어떻게 바꾸는지 따라갑니다."
      note="모든 금액·이율·기간은 설명용 가정입니다. 계산 결과는 토지 시세나 감정평가 결과가 아니며 실제 권리·허가·비용·일정·금융 조건을 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-land-residual-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          <CoreNumbers scene={scene} />
          {scene.showWaterfall && <Waterfall scene={scene} />}
          {scene.showStress && <StressPanel />}
          {scene.showDelay && <DelayPanel />}
          {scene.showTimeline && <TimelinePanel />}
          {scene.showGates && <GatePanel />}
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="토지 개발 잔여와 실행 조건 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
