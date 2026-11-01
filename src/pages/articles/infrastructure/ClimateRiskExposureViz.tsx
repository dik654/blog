import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["경로", "비교", "조치", "요소", "지급", "대응", "미래"] as const;

const NOTES = [
  "홍수 같은 물리적 사건이 사람·주택·기반 시설이 놓인 곳에 닿으면 손상이 생깁니다. 보험과 대출은 손실 뒤 돈을 나누지만 물이 닿는 물리 경로와는 다른 기능입니다.",
  "설명용 같은 홍수에서 지역 A는 자산 100의 10%가 손상돼 손실 10, 지역 B는 자산 300의 20%가 손상돼 손실 60입니다. 같은 사건이어도 노출과 손상 비율이 달라 결과는 여섯 배가 됩니다.",
  "B의 자산 노출을 300에서 150으로 줄이거나 손상 비율을 20%에서 10%로 낮추면 직접 자산 손실은 모두 30이 됩니다. 개발 제한과 방재는 서로 다른 숫자를 바꿉니다.",
  "위해는 손실을 일으킬 수 있는 물리적 사건, 노출은 그곳에 놓인 사람과 자산, 취약성은 피해받기 쉬운 성향과 대응 능력의 부족입니다. 실제 위험은 언제나 세 숫자의 단순 곱 하나로 정해지지 않습니다.",
  "B의 물리 손실 60 중 보험이 40을 지급하면 소유자의 남은 부담은 20입니다. 지급이 복구를 돕더라도 손상된 자산 60이 20으로 바뀌는 것은 아닙니다.",
  "방재로 손상 비율을 20%에서 10%로 낮추면 B의 직접 손실은 60에서 30으로 줄어듭니다. 다만 공사비와 유지비가 필요하므로 손실 감소 30을 곧바로 순편익 30으로 쓰지 않습니다.",
  "사건 한 번의 손실 60은 연간 예상 손실이 아닙니다. 서로 다른 세기의 사건이 일어날 확률과 각각의 손실을 함께 계산하고, 개발·노후화·기후 변화로 노출과 취약성, 사건 분포가 바뀌는지 다시 봅니다.",
] as const;

type Panel = "flow" | "compare" | "levers" | "factors" | "payment" | "response" | "future";

const SCENES = [
  {
    title: "물리적 사건이 노출된 자산에 닿아 손실이 되고 금융 계약으로 전달됩니다",
    detail: "피해가 생기는 경로와 사고 뒤 비용을 나누는 경로를 구분합니다.",
    panel: "flow",
    formula: "위해 → 노출·취약성 → 물리 손실 → 가구·기업·보험·대출",
    conclusion: "보험은 손실을 나눌 수 있지만 건물이 손상되는 비율을 자동으로 낮추지는 않습니다.",
  },
  {
    title: "같은 홍수에서도 A의 손실은 10, B의 손실은 60입니다",
    detail: "한 번의 사건이 이미 일어났다는 조건에서 직접 자산 손실만 비교합니다.",
    panel: "compare",
    formula: "A: 100×10%=10 · B: 300×20%=60",
    conclusion: "B의 손실이 큰 이유를 날씨 하나가 아니라 더 큰 노출과 더 높은 손상 비율로 나눕니다.",
  },
  {
    title: "노출을 절반으로 줄여도, 손상 비율을 절반으로 낮춰도 손실은 30입니다",
    detail: "같은 금액 감소를 만드는 서로 다른 조치와 비용을 구분합니다.",
    panel: "levers",
    formula: "노출 조정: 150×20%=30 · 방재: 300×10%=30",
    conclusion: "개발 제한은 놓이는 자산을, 배수·보강은 같은 사건에서의 손상 비율을 바꿉니다.",
  },
  {
    title: "위해·노출·취약성은 위험을 만드는 서로 다른 요소입니다",
    detail: "사건, 그곳에 놓인 대상, 피해받고 회복하는 조건을 따로 기록합니다.",
    panel: "factors",
    formula: "위해: 사건 · 노출: 사람·자산 · 취약성: 민감성·대응 능력",
    conclusion: "인명·영업 중단·복구 기간까지 포함한 실제 위험을 단순 자산 곱셈 하나로 대신하지 않습니다.",
  },
  {
    title: "손실 60을 보험 40과 소유자 부담 20으로 나누어도 물리 손실은 60입니다",
    detail: "손상된 양과 사고 뒤 지급자를 같은 숫자로 덮어쓰지 않습니다.",
    panel: "payment",
    formula: "물리 손실 60=보험 지급 40+소유자 부담 20",
    conclusion: "보험료·면책·보장 한도가 바뀌면 다음 사고의 현금 부담과 대출 조건도 달라질 수 있습니다.",
  },
  {
    title: "방재가 손실을 30 줄여도 공사비와 유지비를 빼야 순편익을 알 수 있습니다",
    detail: "피해 감소와 대응 사업의 자원 비용을 함께 봅니다.",
    panel: "response",
    formula: "300×20%=60 → 300×10%=30 · 손실 감소 30−공사·유지 비용",
    conclusion: "경보·대피처럼 인명을 지키는 대응은 자산 손실 장부만으로 가치를 판단하지 않습니다.",
  },
  {
    title: "한 번의 손실과 한 해의 예상 손실, 미래 시나리오는 다른 계산입니다",
    detail: "사건별 확률과 손실을 합치고 노출·취약성·기후 조건의 변화를 다시 반영합니다.",
    panel: "future",
    formula: "연간 예상 손실=Σ(사건별 발생확률×그 사건의 손실)",
    conclusion: "이번 손실 60만으로 보험료나 미래 대출 손실률을 정하지 않고 현지 자료와 시나리오를 확인합니다.",
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
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="기후 위해에서 금융 부담까지 이어지는 경로">
      <Stage title="위해" detail="홍수·폭염" />
      <Arrow />
      <Stage title="노출·취약" detail="사람·자산·상태" />
      <Arrow />
      <Stage title="손실" detail="손상·중단" strong />
      <Arrow />
      <Stage title="금융" detail="보험·대출" />
    </div>
  );
}

function ComparePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="같은 홍수에서 지역 A와 B의 손실 비교">
      <div className="border-y border-border py-3 text-center sm:py-4">
        <p className="text-[9px] font-black sm:text-xs">지역 A</p>
        <p className="mt-1 font-mono text-[9px] font-bold text-muted-foreground sm:text-xs">100×10%</p>
        <p className="mt-1 font-mono text-lg font-black sm:text-2xl">10</p>
      </div>
      <div className="border border-foreground/60 p-3 text-center sm:p-4">
        <p className="text-[9px] font-black text-primary sm:text-xs">지역 B</p>
        <p className="mt-1 font-mono text-[9px] font-bold text-muted-foreground sm:text-xs">300×20%</p>
        <p className="mt-1 font-mono text-lg font-black sm:text-2xl">60</p>
      </div>
    </div>
  );
}

function LeversPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="노출과 손상 비율을 줄이는 서로 다른 조치">
      <Stage title="노출 줄이기" detail="150×20%=30" />
      <Stage title="손상률 낮추기" detail="300×10%=30" strong />
    </div>
  );
}

function FactorsPanel() {
  const items = [["위해", "물리적 사건"], ["노출", "사람·자산"], ["취약성", "민감성·역량"]] as const;
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="위험을 만드는 위해 노출 취약성">
      {items.map(([title, detail]) => <Stage key={title} title={title} detail={detail} strong={title === "취약성"} />)}
    </div>
  );
}

function PaymentPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="보험 지급과 소유자 부담으로 나뉘는 물리 손실">
      <Stage title="물리 손실" detail="60" strong />
      <span className="font-mono text-sm font-black">=</span>
      <Stage title="보험 지급" detail="40" />
      <span className="font-mono text-sm font-black">+</span>
      <Stage title="소유자 부담" detail="20" />
    </div>
  );
}

function ResponsePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="방재 전후 직접 자산 손실">
      <Stage title="방재 전" detail="300×20%=60" />
      <Arrow />
      <Stage title="방재 뒤" detail="300×10%=30" strong />
      <Arrow />
      <Stage title="다음 계산" detail="공사·유지비" />
    </div>
  );
}

function FuturePanel() {
  const items = [["사건 1", "확률×작은 손실"], ["사건 2", "확률×중간 손실"], ["사건 3", "확률×큰 손실"]] as const;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="사건별 확률과 손실을 합치는 연간 예상 손실">
      {items.map(([title, detail]) => <Stage key={title} title={title} detail={detail} strong={title === "사건 3"} />)}
    </div>
  );
}

export default function ClimateRiskExposureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="기후 위험 · 설명용 두 지역 장부"
      title="같은 홍수가 자산 100과 300에서 서로 다른 손실을 만드는 과정"
      description="물리 사건, 노출, 취약성, 직접 손실, 보험 지급과 미래 확률을 나누어 어떤 조치가 어느 숫자를 바꾸는지 봅니다."
      note="자산·손상률·보험 지급은 설명용 가정입니다. 실제 피해 함수나 특정 지역의 위험도·보험료를 뜻하지 않습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-climate-risk-viz
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
          {scene.panel === "compare" && <ComparePanel />}
          {scene.panel === "levers" && <LeversPanel />}
          {scene.panel === "factors" && <FactorsPanel />}
          {scene.panel === "payment" && <PaymentPanel />}
          {scene.panel === "response" && <ResponsePanel />}
          {scene.panel === "future" && <FuturePanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="기후 위험과 손실 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
