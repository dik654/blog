import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["경로", "비용", "회수", "효과", "재원", "상환", "판단"] as const;

const NOTES = [
  "학습자는 돈과 시간을 쓰고 교육기관은 수업·평가를 제공하며 고용주는 능력과 자격 정보를 보고 사람을 선택합니다. 정부·기업이 비용 일부를 낼 수도 있습니다.",
  "설명용 학비 1천만 원에 취업을 1년 늦춰 포기한 소득 2천만 원을 더하면 초기 비용은 3천만 원입니다. 포기 소득은 학교 수입이 아닙니다.",
  "교육 뒤 연 임금이 200만 원 늘고 세금·물가·이자·위험을 생략하면 3천만 원을 회수하는 단순 기간은 15년입니다. 학비만 나눈 5년은 비용 일부만 반영합니다.",
  "실제 직무 능력이 늘어나는 인적자본 축적, 자격이 능력 정보를 전하는 신호, 학교에서 얻은 연결망을 구분합니다. 세 효과는 함께 존재할 수 있습니다.",
  "학비 1천만 원 중 정부 장학금 400만 원과 가계 자금 600만 원을 가정하면 학교 수입은 1천만 원이지만 처음 돈을 낸 주체는 둘로 나뉩니다.",
  "소득 연계 상환은 대출 잔액만으로 당기 상환액을 정하지 않습니다. 적용 계획, 증가 전 총소득, 소득 기준과 비율을 알아야 합니다.",
  "졸업자 평균 임금 차이는 개인에게 약속된 수익이 아닙니다. 완료율·취업 기간·직무 연결·부채·대안 경로와 돈으로 바로 세기 어려운 편익을 함께 봅니다.",
] as const;

type Panel = "path" | "cost" | "payback" | "effects" | "funding" | "repayment" | "decision";

const SCENES = [
  { title: "돈과 시간이 수업·평가를 거쳐 일할 기회로 이어집니다", detail: "학습자·교육기관·고용주의 역할과 정부·기업의 비용 지원을 한 경로에 놓습니다.", panel: "path", formula: "돈·시간 투입 → 학습·평가 → 채용·업무 배치", conclusion: "학교가 받은 돈, 학습자가 부담한 돈, 고용주가 본 정보는 서로 다른 장부입니다." },
  { title: "학비 1천만 원과 포기한 소득 2천만 원을 함께 셉니다", detail: "교육 때문에 취업을 1년 늦추고 그동안 받을 수 있었던 소득을 포기한다는 설명용 가정입니다.", panel: "cost", formula: "학비 1천만 원 + 포기 소득 2천만 원 = 초기 비용 3천만 원", conclusion: "학비만 세면 교육 선택 때문에 포기한 2천만 원을 놓칩니다." },
  { title: "초기 비용 3천만 원을 연 추가 임금 200만 원으로 나눕니다", detail: "세금·물가·이자·실업·임금 성장을 생략한 단순 회수 기간이며 실제 수익률이 아닙니다.", panel: "payback", formula: "3천만 원 ÷ 연 200만 원 = 15년", conclusion: "학비 1천만 원만 나눈 5년은 비용의 일부만 회수하는 계산입니다." },
  { title: "배워서 달라진 능력과 자격이 전하는 정보를 분리합니다", detail: "수업 내용, 평가와 자격, 학교에서 만난 연결망은 모두 취업에 영향을 줄 수 있지만 같은 효과가 아닙니다.", panel: "effects", formula: "능력 축적 + 신호 + 연결망 → 관찰된 취업·임금", conclusion: "임금이 올랐다는 사실만으로 세 효과 중 하나를 원인으로 확정할 수 없습니다." },
  { title: "학교 수입 1천만 원의 처음 출처를 정부와 가계로 나눕니다", detail: "정부 장학금 400만 원과 가계 자금 600만 원을 가정합니다. 같은 돈을 학교 수입과 정부 지원에서 두 번 더하지 않습니다.", panel: "funding", formula: "정부 400만 원 + 가계 600만 원 = 학교 수입 1천만 원", conclusion: "교육기관 수입과 학습자의 직접 부담은 같은 금액일 필요가 없습니다." },
  { title: "학자금 상환액은 대출 잔액만이 아니라 소득 조건을 지납니다", detail: "영국의 해당 소득 연계 상환 설명처럼 적용 계획과 총소득·기준·비율을 확인해야 하는 경우가 있습니다.", panel: "repayment", formula: "적용 계획 + 총소득 − 소득 기준 → 기준 초과분에 상환 비율", conclusion: "추가 임금 200만 원만으로 실제 상환액을 계산할 수 없습니다." },
  { title: "평균 임금 차이 밖의 불확실성과 편익을 함께 둡니다", detail: "가정 배경·원래 능력·전공·지역·산업 수요가 결과에 섞이며 교육의 편익은 임금만으로 끝나지 않습니다.", panel: "decision", formula: "비용·완료율·취업·부채·대안 + 비금전 편익", conclusion: "15년은 가정한 현금의 단순 계산이며 특정 개인에게 보장된 회수 기간이 아닙니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function PathPanel() {
  const steps = [["학습자", "돈·시간"], ["교육기관", "수업·평가"], ["고용주", "채용·배치"]] as const;
  return (
    <div className="relative grid grid-cols-3 gap-2" aria-label="학습자에서 교육기관과 고용주로 이어지는 경로">
      <span className="absolute left-[15%] right-[15%] top-5 h-px bg-border" aria-hidden="true" />
      {steps.map(([title, detail], index) => <Step key={title} index={index + 1} title={title} detail={detail} />)}
    </div>
  );
}

function Step({ index, title, detail }: { index: number; title: string; detail: string }) {
  return (
    <div className="relative min-w-0 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index}</span>
      <p className="mt-1.5 text-[9px] font-black sm:text-xs">{title}</p>
      <p className="mt-0.5 break-keep text-[8px] text-muted-foreground sm:text-[10px]">{detail}</p>
    </div>
  );
}

function CostPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1.1fr] items-center gap-1.5 sm:gap-3" aria-label="학비와 포기 소득을 합친 초기 비용">
      <Amount label="학교에 지급" value="1천만" />
      <span className="font-black" aria-hidden="true">+</span>
      <Amount label="포기한 소득" value="2천만" />
      <span className="font-black" aria-hidden="true">=</span>
      <Amount label="초기 비용" value="3천만" primary />
    </div>
  );
}

function Amount({ label, value, primary = false }: { label: string; value: string; primary?: boolean }) {
  return (
    <div className={`min-w-0 border p-2.5 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}>
      <p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label}</p>
      <p className={`mt-1 font-mono text-[10px] font-black sm:text-base ${primary ? "text-primary" : ""}`}>{value} 원</p>
    </div>
  );
}

function PaybackPanel() {
  return (
    <div className="space-y-3" aria-label="교육비의 단순 회수 기간 비교">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="border border-border p-3 text-center sm:p-4"><p className="text-[9px] font-bold text-muted-foreground">학비만 계산</p><p className="mt-1 font-mono text-sm font-black sm:text-lg">1천만 ÷ 200만 = 5년</p></div>
        <div className="border border-foreground/50 p-3 text-center sm:p-4"><p className="text-[9px] font-bold text-muted-foreground">포기 소득 포함</p><p className="mt-1 font-mono text-sm font-black text-primary sm:text-lg">3천만 ÷ 200만 = 15년</p></div>
      </div>
      <div className="h-2 bg-muted"><div className="h-full w-full bg-primary" /></div>
    </div>
  );
}

function EffectsPanel() {
  const effects = [["능력 축적", "실제로 일을 더 잘함"], ["신호", "자격이 능력 정보를 전함"], ["연결망", "사람·채용 통로를 만남"]] as const;
  return <TriplePanel items={effects} label="교육이 취업과 임금에 영향을 주는 세 경로" />;
}

function FundingPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1.1fr] items-center gap-1.5 sm:gap-3" aria-label="학비의 초기 재원과 학교 수입">
      <Amount label="정부 장학금" value="400만" />
      <span className="font-black" aria-hidden="true">+</span>
      <Amount label="가계 자금" value="600만" />
      <span className="font-black" aria-hidden="true">=</span>
      <Amount label="학교 수입" value="1천만" primary />
    </div>
  );
}

function RepaymentPanel() {
  const steps = [["계획", "어떤 상환 규칙인가"], ["소득", "현재 총소득은 얼마인가"], ["기준", "기준을 얼마나 넘었나"], ["상환", "비율을 적용"]] as const;
  return (
    <div className="relative grid grid-cols-4 gap-1.5" aria-label="소득 연계 학자금 상환 계산에 필요한 순서">
      <span className="absolute left-[11%] right-[11%] top-4 h-px bg-border" aria-hidden="true" />
      {steps.map(([title, detail], index) => (
        <div key={title} className="relative min-w-0 text-center"><span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index + 1}</span><p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>
      ))}
    </div>
  );
}

function DecisionPanel() {
  const items = [["현금", "학비·포기 소득·부채"], ["경로", "완료율·취업·직무 연결"], ["불확실성", "원래 능력·산업 수요"], ["비금전", "건강·참여·선택 폭"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="교육 선택에서 함께 확인할 항목">
      {items.map(([title, detail], index) => (
        <div key={title} className="min-w-0 border border-border p-2 text-center sm:p-3"><span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[8px] font-black text-background">{index + 1}</span><p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>
      ))}
    </div>
  );
}

function TriplePanel({ items, label }: { items: readonly (readonly [string, string])[]; label: string }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label={label}>
      {items.map(([title, detail]) => <div key={title} className="min-w-0 border-y border-border py-3 text-center sm:py-4"><p className="text-[9px] font-black text-primary sm:text-sm">{title}</p><p className="mt-1 break-keep text-[8px] font-bold leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>)}
    </div>
  );
}

export default function EducationSkillsAndSignalsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="교육 · 설명용 선택 한 건"
      title="학비 1천만 원 뒤의 시간 비용과 교육 효과를 분리하는 과정"
      description="초기 비용 3천만 원의 회수 계산부터 능력 축적·신호·재원 출처·상환 조건과 판단 한계까지 따라갑니다."
      note="학비·포기 소득·추가 임금·장학금은 모두 설명용 가정입니다. 특정 학교·학위·대출의 실측 수익률이나 상환액이 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-education-signal-viz data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "path" && <PathPanel />}
          {scene.panel === "cost" && <CostPanel />}
          {scene.panel === "payback" && <PaybackPanel />}
          {scene.panel === "effects" && <EffectsPanel />}
          {scene.panel === "funding" && <FundingPanel />}
          {scene.panel === "repayment" && <RepaymentPanel />}
          {scene.panel === "decision" && <DecisionPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="교육 비용과 효과 분리 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
