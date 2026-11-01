import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["흐름", "조달", "분류", "수지", "시점", "범위", "위험"] as const;

const NOTES = [
  "가계·기업의 세금과 채권자의 자금이 정부 예산을 거쳐 의료·교육·도로·이자 지급으로 이동합니다. 승인, 현금 지급, 실제 서비스 제공은 서로 다른 시점일 수 있습니다.",
  "설명용 한 해에 세금 80과 새 차입 20으로 현금 100을 마련하고 의료 40·교육 30·도로 20·이자 10을 지급합니다.",
  "의료 40·교육 30·이자 10은 당기 비용 80으로, 도로 20은 비금융자산 취득으로 둡니다. 차입 20은 갚을 의무가 함께 생기는 금융 조달입니다.",
  "수입 80에서 비용 80을 빼면 순운영수지는 0이고, 여기서 비금융자산 순취득 20을 빼면 순융자·순차입은 −20입니다. 부채는 200에서 220으로 늘어납니다.",
  "사업을 승인한 날, 공사대금을 지급한 날, 도로를 실제 사용하기 시작한 날이 다르면 예산·현금·발생 장부의 기록 시점도 달라집니다.",
  "설명용 통합재정수지 −10에서 사회보장성기금 수지 +40을 빼면 관리재정수지는 −50입니다. 어느 정부 범위와 지표인지 먼저 확인합니다.",
  "같은 부채 220이라도 통화·금리·만기·차환 조건이 다르면 상환 부담이 달라집니다. 도로와 의료의 효과는 지출액이 아니라 별도 결과로 확인합니다.",
] as const;

type Panel = "flow" | "funding" | "classification" | "balances" | "timing" | "scope" | "risk";

const SCENES = [
  { title: "세금과 빌린 돈이 승인된 예산을 거쳐 서비스와 자산으로 이동합니다", detail: "돈을 낸 사람, 예산을 승인한 기관, 지급받아 서비스를 만드는 주체의 역할을 나눕니다.", panel: "flow", formula: "세금·차입 → 예산 승인·집행 → 서비스·자산·이자", conclusion: "돈을 승인했다는 사실과 현금이 나갔다는 사실, 서비스가 제공됐다는 사실은 같지 않습니다." },
  { title: "세금 80과 새 차입 20으로 한 해의 지급 100을 맞춥니다", detail: "기존 빚의 원금 상환과 다른 수입은 없다는 설명용 현금 장부입니다.", panel: "funding", formula: "80 + 20 = 40 + 30 + 20 + 10 = 100", conclusion: "세금 80은 상환 의무가 없지만 차입 20은 미래에 갚아야 할 부채를 남깁니다." },
  { title: "같은 현금 지출 100을 비용 80과 자산 취득 20으로 나눕니다", detail: "의료·교육·이자는 당기 비용, 도로 건설은 앞으로 사용할 비금융자산 취득으로 두는 가정입니다.", panel: "classification", formula: "당기 비용 80 + 비금융자산 취득 20 = 현금 지출 100", conclusion: "도로 20을 현금 지출과 당기 비용 양쪽에 다시 더하면 같은 금액을 두 번 셉니다." },
  { title: "순운영수지 0과 순차입 20, 부채 증가 20이 같은 해에 함께 나타납니다", detail: "모든 발생과 지급이 그해에 일치하고 감가상각·자산 매각·평가 변화를 생략합니다.", panel: "balances", formula: "80 − 80 = 0 · 0 − 20 = −20 · 200 + 20 = 220", conclusion: "운영수지·순차입은 한 기간의 흐름이고 부채 220은 기말에 남은 잔액입니다." },
  { title: "승인·현금 지급·서비스 제공의 날짜를 각각 기록합니다", detail: "도로 공사가 지연되면 예산은 승인됐지만 현금 지급과 자산 취득은 다음 기간으로 넘어갈 수 있습니다.", panel: "timing", formula: "승인 시점 ≠ 지급 시점 ≠ 서비스·자산 사용 시점", conclusion: "미집행 예산을 이미 제공된 서비스나 완성된 자산으로 읽지 않습니다." },
  { title: "같은 해의 적자도 포함한 정부 범위와 기금 처리에 따라 달라집니다", detail: "통합재정수지와 사회보장성기금 수지를 분리하는 설명용 계산입니다.", panel: "scope", formula: "관리재정수지 = −10 − (+40) = −50", conclusion: "‘적자 10’과 ‘적자 50’을 비교하려면 지표 이름과 중앙·지방·사회보험의 포함 범위를 맞춰야 합니다." },
  { title: "부채 220의 숫자 밖에서 통화·만기·금리와 사업 결과를 확인합니다", detail: "같은 부채 잔액도 외화 비중과 차환 시점이 다르면 위험이 달라지고, 지출액만으로 사업 효과를 알 수 없습니다.", panel: "risk", formula: "부채 잔액 + 통화·금리·만기·차환 + 세입 기반 · 사업 결과", conclusion: "재정 여력과 사업의 정당성·효과는 연결되지만 서로 다른 근거로 판단합니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function FlowPanel() {
  const steps = [["가계·기업·채권자", "세금·빌려준 돈"], ["정부 예산", "승인·배분·지급"], ["제공 주체", "병원·학교·공사"], ["사람과 경제", "서비스·자산 사용"]] as const;
  return <Steps items={steps} label="재정 조달에서 서비스 제공까지의 흐름" />;
}

function Steps({ items, label }: { items: readonly (readonly [string, string])[]; label: string }) {
  return (
    <div className="relative grid grid-cols-4 gap-1.5" aria-label={label}>
      <span className="absolute left-[11%] right-[11%] top-4 h-px bg-border" aria-hidden="true" />
      {items.map(([title, detail], index) => <div key={title} className="relative min-w-0 text-center"><span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index + 1}</span><p className="mt-1 break-keep text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>)}
    </div>
  );
}

function FundingPanel() {
  return (
    <div className="space-y-3" aria-label="세금과 차입으로 조달한 100의 사용">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1.1fr] items-center gap-1.5 sm:gap-3"><Amount label="세금" value="80" /><span className="font-black">+</span><Amount label="새 차입" value="20" /><span className="font-black">=</span><Amount label="조달" value="100" primary /></div>
      <div className="flex h-9 overflow-hidden border border-border text-[8px] font-black sm:text-[10px]"><Segment width="40%" label="의료 40" tone="bg-foreground text-background" /><Segment width="30%" label="교육 30" tone="bg-muted-foreground text-background" /><Segment width="20%" label="도로 20" tone="bg-primary text-primary-foreground" /><Segment width="10%" label="이자 10" tone="bg-muted" /></div>
    </div>
  );
}

function Segment({ width, label, tone }: { width: string; label: string; tone: string }) {
  return <div className={`${tone} flex min-w-0 items-center justify-center text-center`} style={{ width }}>{label}</div>;
}

function Amount({ label, value, primary = false }: { label: string; value: string; primary?: boolean }) {
  return <div className={`min-w-0 border p-2.5 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label}</p><p className={`mt-1 font-mono text-sm font-black sm:text-lg ${primary ? "text-primary" : ""}`}>{value}</p></div>;
}

function ClassificationPanel() {
  const items = [["당기 비용", "의료40+교육30+이자10", "80"], ["자산 취득", "도로 건설", "20"], ["금융 조달", "새 차입·상환 의무", "20"]] as const;
  return <ThreeColumns items={items} label="비용과 자산 취득과 금융 조달의 구분" />;
}

function ThreeColumns({ items, label }: { items: readonly (readonly [string, string, string])[]; label: string }) {
  return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label={label}>{items.map(([title, detail, value], index) => <div key={title} className={`min-w-0 border-y py-3 text-center sm:py-4 ${index === 0 ? "border-foreground/50" : "border-border"}`}><p className={`text-[9px] font-black sm:text-sm ${index === 0 ? "text-primary" : ""}`}>{title}</p><p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p><p className="mt-1 font-mono text-sm font-black">{value}</p></div>)}</div>;
}

function BalancesPanel() {
  const rows = [["순운영수지", "수입80 − 비용80", "0"], ["순융자·순차입", "운영수지0 − 자산20", "−20"], ["기말 부채", "기초200 + 차입20", "220"]] as const;
  return <div className="space-y-1.5" aria-label="순운영수지와 순차입과 기말 부채 계산">{rows.map(([title, calc, value], index) => <div key={title} className={`grid grid-cols-[0.8fr_1.4fr_0.5fr] items-center gap-2 border-b py-2 ${index === 2 ? "border-foreground/50" : "border-border"}`}><p className="break-keep text-[9px] font-black sm:text-xs">{title}</p><p className="break-keep font-mono text-[8px] text-muted-foreground sm:text-[10px]">{calc}</p><p className={`text-right font-mono text-sm font-black sm:text-base ${index > 0 ? "text-primary" : ""}`}>{value}</p></div>)}</div>;
}

function TimingPanel() {
  const steps = [["예산 승인", "쓸 수 있는 권한"], ["계약·공사", "의무와 작업 발생"], ["현금 지급", "통장에서 지출"], ["서비스 사용", "도로·진료 제공"]] as const;
  return <Steps items={steps} label="예산 승인에서 서비스 사용까지의 서로 다른 시점" />;
}

function ScopePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="통합재정수지에서 관리재정수지를 계산하는 사례">
      <SmallBox title="통합재정수지" detail="설명용 적자" value="−10" /><span className="font-black">− 사회보장성기금 +40 =</span><SmallBox title="관리재정수지" detail="기금 수지 제외" value="−50" primary />
    </div>
  );
}

function SmallBox({ title, detail, value, primary = false }: { title: string; detail: string; value: string; primary?: boolean }) {
  return <div className={`min-w-0 border p-3 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className="break-keep text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 text-[8px] text-muted-foreground sm:text-[10px]">{detail}</p><p className={`mt-1 font-mono text-lg font-black ${primary ? "text-primary" : ""}`}>{value}</p></div>;
}

function RiskPanel() {
  const items = [["통화", "외화면 환율 변화"], ["금리", "새 이자 부담"], ["만기", "언제 갚고 빌리나"], ["결과", "서비스·자산의 효과"]] as const;
  return <Steps items={items} label="같은 부채 잔액 밖에서 확인할 조건" />;
}

export default function PublicBudgetTaxesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="공공 예산 · 설명용 한 해" title="현금 100이 운영수지 0·순차입 20·기말 부채 220으로 갈리는 과정" description="세금과 차입의 출처, 서비스 비용과 자산 취득, 승인·지급 시점과 정부 범위를 같은 장부로 연결합니다." note="금액·재정수지·기금 수지는 모두 설명용 가정입니다. 특정 국가의 실제 예산·부채·정책 효과가 아닙니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-public-budget-viz data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4"><div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "flow" && <FlowPanel />}{scene.panel === "funding" && <FundingPanel />}{scene.panel === "classification" && <ClassificationPanel />}{scene.panel === "balances" && <BalancesPanel />}{scene.panel === "timing" && <TimingPanel />}{scene.panel === "scope" && <ScopePanel />}{scene.panel === "risk" && <RiskPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div></div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="공공 예산 장부 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
