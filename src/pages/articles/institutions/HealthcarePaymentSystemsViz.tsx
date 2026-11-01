import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["총지급", "심사", "비용", "세 기능", "지급 단위", "적용 범위", "결과"] as const;

const NOTES = [
  "설명용 진료 한 건에서 환자는 창구에 2만 원을 내고 공동 재원은 의료기관에 8만 원을 지급합니다. 의료기관이 받는 총액은 10만 원입니다.",
  "의료기관이 청구하면 지급자는 자격·보장 대상·정한 가격을 확인합니다. 조정하거나 거절하면 실제 지급액은 처음 청구한 금액과 달라질 수 있습니다.",
  "의료기관 관련 비용을 설명용 7만 원으로 두면 총수입 10만 원과의 차이는 3만 원입니다. 공통 인건비·시설비를 어디까지 넣었는지 확인하기 전에는 이 차이를 이익으로 확정하지 않습니다.",
  "보험료·세금 등으로 돈을 모으는 재원 조달, 여러 사람의 위험을 함께 부담하는 위험 풀, 의료기관에 무엇을 얼마에 지급할지 정하는 구매를 구분합니다.",
  "같은 진료를 두 번 건별로 지급하면 총 20만 원이지만 치료 과정 전체에 10만 원을 묶어 지급하면 진료 횟수가 늘어도 수입이 20만 원이 되지 않습니다. 지급 단위가 의료기관의 선택을 바꿉니다.",
  "한국·잉글랜드·미국의 공식 지급 규칙은 적용하는 서비스와 기관이 다릅니다. 한 제도의 가격표나 본인부담률을 다른 나라와 모든 진료에 그대로 적용하지 않습니다.",
  "총지급이 줄었는지만 보지 않고 대기·미충족 의료·치료 결과·가계 부담을 함께 확인합니다. 환자가 낸 2만 원과 공동 지급 8만 원은 더하지만 이미 모은 보험료를 다시 더하지 않습니다.",
] as const;

type Scene = {
  title: string;
  detail: string;
  panel: "payment" | "review" | "cost" | "functions" | "units" | "scope" | "outcomes";
  formula: string;
  conclusion: string;
};

const SCENES: readonly Scene[] = [
  {
    title: "환자 2만 원과 공동 재원 8만 원이 의료기관에서 합쳐집니다",
    detail: "진료실 창구에서 보이는 금액은 전체 지급의 일부입니다. 금액은 특정 국가의 실제 본인부담률이 아닌 설명용 가정입니다.",
    panel: "payment",
    formula: "환자 2만 원 + 공동 재원 8만 원 = 의료기관 총수입 10만 원",
    conclusion: "환자가 낸 돈만 보면 진료 한 건에 지급된 총액을 8만 원 적게 셉니다.",
  },
  {
    title: "진료 기록과 청구가 보장·가격 확인을 통과해야 지급됩니다",
    detail: "의료기관은 진료를 제공한 뒤 청구하고, 지급자는 자격과 보장 대상, 정한 가격을 확인해 지급액을 결정합니다.",
    panel: "review",
    formula: "진료 → 청구 → 자격·보장·가격 확인 → 공동 재원 지급",
    conclusion: "진료를 결정하는 사람, 청구하는 기관, 돈을 지급하는 주체가 같지 않을 수 있습니다.",
  },
  {
    title: "총수입 10만 원과 관련 비용 7만 원의 차이를 바로 이익으로 보지 않습니다",
    detail: "시설 유지와 공통 인건비를 비용 7만 원에 얼마나 포함했는지에 따라 남은 3만 원의 의미가 달라집니다.",
    panel: "cost",
    formula: "총수입 10만 원 − 관련 비용 7만 원 = 비용 범위 확인 전 차이 3만 원",
    conclusion: "지급액과 의료기관의 순이익은 같은 숫자가 아닙니다.",
  },
  {
    title: "돈을 모으고, 위험을 묶고, 서비스를 사는 세 기능을 나눕니다",
    detail: "한 기관이 세 기능을 함께 맡을 수도 있고 여러 기관이 나눌 수도 있습니다. 기능을 나누면 제도 간 차이를 더 정확히 비교할 수 있습니다.",
    panel: "functions",
    formula: "재원 조달 → 위험 풀 → 의료 서비스 구매",
    conclusion: "보험료의 출처, 위험을 함께 지는 범위, 의료기관 지급 규칙은 서로 다른 결정입니다.",
  },
  {
    title: "진료 건마다 지급할지 치료 과정을 묶어 지급할지 정합니다",
    detail: "같은 조건의 진료 두 번을 건별로 지급하는 경우와 전체 치료에 정액을 지급하는 설명용 경우를 비교합니다.",
    panel: "units",
    formula: "건별 지급 2회 = 20만 원 · 묶음 지급 1건 = 10만 원",
    conclusion: "건별 지급은 진료량을 늘릴 수 있고 정액 지급은 비용을 아끼게 하지만 두 방식 모두 다른 과잉·과소 유인이 있습니다.",
  },
  {
    title: "같은 이름의 제도라도 적용 대상과 가격표의 범위를 확인합니다",
    detail: "한국의 급여·수가, 미국 Original Medicare의 지급표, 잉글랜드 NHS 지급 규칙은 각자 적용 범위가 다릅니다.",
    panel: "scope",
    formula: "국가 이름보다 대상 서비스·지급 주체·가격표·본인부담 규칙 확인",
    conclusion: "한 제도의 10만 원 지급 규칙을 다른 나라와 모든 진료의 공통 가격으로 쓰지 않습니다.",
  },
  {
    title: "비용과 함께 대기·치료 결과·가계 부담을 확인합니다",
    detail: "지출이 줄어도 필요한 진료를 못 받거나 대기가 길어졌다면 비용 숫자 하나만으로 좋은 제도라고 할 수 없습니다.",
    panel: "outcomes",
    formula: "총지급·가계 부담 + 대기·미충족 의료 + 건강 결과",
    conclusion: "재정 효율은 같은 건강 결과를 더 적은 자원으로 얻었는지까지 확인해야 판단할 수 있습니다.",
  },
];

function PaymentPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1.1fr] items-center gap-1.5 sm:gap-3" aria-label="환자와 공동 재원이 의료기관에 지급하는 경로">
      <MoneyBox label="환자" value="2만 원" detail="창구 지급" />
      <span aria-hidden="true" className="font-black">+</span>
      <MoneyBox label="공동 재원" value="8만 원" detail="별도 지급" />
      <span aria-hidden="true" className="font-black">=</span>
      <MoneyBox label="의료기관" value="10만 원" detail="총수입" primary />
    </div>
  );
}

function MoneyBox({ label, value, detail, primary = false }: { label: string; value: string; detail: string; primary?: boolean }) {
  return (
    <div className={`min-w-0 border p-2 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}>
      <p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label}</p>
      <p className={`mt-1 break-keep font-mono text-[10px] font-black sm:text-base ${primary ? "text-primary" : ""}`}>{value}</p>
      <p className="mt-1 break-keep text-[7px] font-bold text-muted-foreground sm:text-[9px]">{detail}</p>
    </div>
  );
}

function ReviewPanel() {
  const steps = [["진료", "기록"], ["청구", "내역 제출"], ["확인", "자격·보장·가격"], ["지급", "8만 원"]] as const;
  return (
    <div className="relative grid grid-cols-4 gap-1.5" aria-label="진료부터 공동 재원 지급까지의 확인 순서">
      <span className="absolute left-[11%] right-[11%] top-4 h-px bg-border" aria-hidden="true" />
      {steps.map(([title, detail], index) => (
        <div key={title} className="relative min-w-0 text-center">
          <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index + 1}</span>
          <p className="mt-1.5 text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-0.5 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function CostPanel() {
  const rows = [["의료기관 총수입", 10, "bg-foreground"], ["관련 비용", 7, "bg-muted-foreground"], ["차이", 3, "bg-primary"]] as const;
  return (
    <div className="space-y-2" aria-label="의료기관 총수입과 비용의 차이">
      {rows.map(([label, amount, tone]) => (
        <div key={label} className="grid grid-cols-[90px_1fr_55px] items-center gap-2 sm:grid-cols-[130px_1fr_70px]">
          <p className="break-keep text-[8px] font-bold sm:text-[11px]">{label}</p>
          <div className="h-2.5 bg-muted sm:h-3"><div className={`h-full ${tone}`} style={{ width: `${amount * 10}%` }} /></div>
          <p className="text-right font-mono text-[9px] font-black sm:text-xs">{amount}만 원</p>
        </div>
      ))}
    </div>
  );
}

function FunctionsPanel() {
  const items = [["재원 조달", "보험료·세금 등을 미리 모음"], ["위험 풀", "건강한 때와 아픈 때의 부담을 묶음"], ["구매", "무엇을 얼마에 지급할지 정함"]] as const;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="의료 재정의 세 기능">
      {items.map(([title, detail], index) => (
        <div key={title} className="min-w-0 border border-border p-2.5 text-center sm:p-4">
          <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[8px] font-black text-background">{index + 1}</span>
          <p className="mt-1.5 text-[9px] font-black sm:text-sm">{title}</p>
          <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function UnitsPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="건별 지급과 묶음 지급 비교">
      <div className="border border-border p-3 sm:p-4">
        <p className="text-[9px] font-black text-primary sm:text-xs">건별 지급</p>
        <p className="mt-2 font-mono text-sm font-black sm:text-lg">10만 × 2회 = 20만 원</p>
        <p className="mt-1.5 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">진료 건수가 늘면 지급액도 늘어납니다.</p>
      </div>
      <div className="border border-border p-3 sm:p-4">
        <p className="text-[9px] font-black text-primary sm:text-xs">묶음 지급</p>
        <p className="mt-2 font-mono text-sm font-black sm:text-lg">치료 과정 = 10만 원</p>
        <p className="mt-1.5 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">두 번 진료해도 총액이 20만 원으로 늘지 않습니다.</p>
      </div>
    </div>
  );
}

function ScopePanel() {
  const rows = [["한국", "급여·수가", "진료·기관별 범위"], ["미국", "Original Medicare", "해당 서비스 지급표"], ["잉글랜드", "NHS 지급 규칙", "적용 대상 서비스"]] as const;
  return (
    <div className="space-y-1.5" aria-label="나라별 지급 규칙의 적용 범위">
      {rows.map(([place, system, scope]) => (
        <div key={place} className="grid grid-cols-[52px_1fr_1fr] items-center gap-2 border-b border-border py-2 sm:grid-cols-[80px_1fr_1fr]">
          <p className="text-[9px] font-black sm:text-xs">{place}</p>
          <p className="break-keep text-[8px] font-bold sm:text-[11px]">{system}</p>
          <p className="break-keep text-[8px] text-muted-foreground sm:text-[10px]">{scope}</p>
        </div>
      ))}
    </div>
  );
}

function OutcomesPanel() {
  const items = [["돈", "총지급·가계 부담"], ["접근", "대기·미충족 의료"], ["결과", "치료 뒤 건강 변화"]] as const;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="의료제도를 함께 평가할 세 결과">
      {items.map(([title, detail]) => (
        <div key={title} className="min-w-0 border-y border-border py-3 text-center sm:py-4">
          <p className="text-[10px] font-black text-primary sm:text-sm">{title}</p>
          <p className="mt-1 break-keep text-[8px] font-bold leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

export default function HealthcarePaymentSystemsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="의료 재정 · 설명용 진료 한 건"
      title="환자가 낸 2만 원 뒤에서 공동 재원 8만 원과 지급 규칙이 움직이는 과정"
      description="돈을 모으는 기능, 위험을 함께 지는 범위, 의료기관에 가격을 지급하는 규칙을 한 진료에서 분리합니다."
      note="10만 원 진료비·2만 원 본인부담·7만 원 비용은 모두 설명용 가정입니다. 실제 급여·본인부담·지급 방식은 대상 제도와 진료를 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-healthcare-payment-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "payment" && <PaymentPanel />}
          {scene.panel === "review" && <ReviewPanel />}
          {scene.panel === "cost" && <CostPanel />}
          {scene.panel === "functions" && <FunctionsPanel />}
          {scene.panel === "units" && <UnitsPanel />}
          {scene.panel === "scope" && <ScopePanel />}
          {scene.panel === "outcomes" && <OutcomesPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="의료비 지급과 평가 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
