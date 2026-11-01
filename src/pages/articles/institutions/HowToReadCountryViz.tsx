import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["안팎", "사례", "장부", "분배", "환율", "자료", "검증"] as const;

const NOTES = [
  "나라 안의 사람·기업·정부와 바깥의 고객·부품 판매자·채권자 사이로 사람·물건·돈·결정이 오갑니다. 결과는 다시 다음 정책과 기대를 바꿉니다.",
  "설명용 A국 생산 사슬은 수출 100에서 외국산 부품 60을 지급해 안쪽에 나눌 잔액 40을 남깁니다. 외화 부채 30은 기말 잔액, 정부 적자 5는 한 해 흐름이라 40에 더하지 않습니다.",
  "정치·법, 예산, 생산, 대외 거래, 생활 서비스, 정보, 기대라는 일곱 장부에 결정권자·돈을 내는 사람·손실을 받는 사람을 따로 적습니다. 이 글의 분석 틀이며 공식 통계 분류 이름은 아닙니다.",
  "생산 사슬 잔액 40이 임금·이익·세금·이자 중 어디로 갔는지 현재 숫자만으로 알 수 없습니다. 생산 증가를 곧바로 가계 생활 개선으로 바꾸지 않습니다.",
  "외화 1을 사는 데 자국 돈이 1에서 1.2로 늘면 외화 부채 30의 환산액은 30에서 36으로 6 증가합니다. 수출대금과 부품값도 함께 달라지므로 보유 주체를 확인합니다.",
  "수출 100은 1년 흐름, 외화 부채 30은 특정 날짜 잔액, 정부 적자 5는 정한 정부 범위의 기간 수지입니다. 지표마다 단위·대상·기준일·연도를 기록합니다.",
  "국가 지표에서 방향을 잡은 뒤 도시의 임금·교통·수요, 실제 건물의 임대차·용도·허가로 내려갑니다. 주장은 만기·통화·소유자·비교 대상을 넣어 반증 가능한 질문으로 바꿉니다.",
] as const;

type Panel = "flows" | "case" | "ledgers" | "distribution" | "fx" | "data" | "verification";

const SCENES = [
  { title: "국경 안팎으로 사람·물건·돈·결정이 오가고 결과가 다시 결정을 바꿉니다", detail: "나라 안의 생산·생활·정치와 바깥의 고객·공급자·채권자를 한 흐름에 놓습니다.", panel: "flows", formula: "안쪽 생산·생활 ↔ 물건·돈·사람 ↔ 바깥 고객·공급자·채권자", conclusion: "한 흐름이 막히면 생산뿐 아니라 가격·재정·생활·기대가 함께 달라질 수 있습니다." },
  { title: "수출 100에서 부품 60을 빼 40을 남기고, 부채 30과 적자 5는 따로 둡니다", detail: "금액 단위는 같은 외화이지만 무엇을 세는지와 시점이 다른 설명용 A국 사례입니다.", panel: "case", formula: "100 − 60 = 40 · 외화 부채 잔액 30 · 정부 기간 적자 5", conclusion: "40은 이 생산 사슬의 잔액이며 국가 전체 소득·회사 순이익·정부 수입이 아닙니다." },
  { title: "나라를 일곱 장부로 나눠 빠진 결정권자와 부담자를 찾습니다", detail: "공식 통계표 하나가 아니라 서로 연결할 질문 칸을 만든 이 글의 분석 틀입니다.", panel: "ledgers", formula: "정치·법 + 예산 + 생산 + 대외 + 생활 + 정보 + 기대", conclusion: "각 장부에 누가 결정하고 돈을 내며 이익과 손실을 받는지 적습니다." },
  { title: "안쪽에 남은 40이 누구의 생활로 이어졌는지는 아직 모릅니다", detail: "임금·이익·세금·이자와 실제 입금 시점을 확인해야 생산 사슬 잔액을 생활과 상환 능력에 연결할 수 있습니다.", panel: "distribution", formula: "잔액 40 → 임금 ? + 이익 ? + 세금 ? + 이자 ?", conclusion: "수출 증가만으로 가계 소득·분배·서비스 접근이 모두 좋아졌다고 결론 내리지 않습니다." },
  { title: "환율이 1에서 1.2로 바뀌면 외화 부채 30의 자국 돈 환산액은 36이 됩니다", detail: "외화 부채를 진 기업과 수출대금을 받는 기업이 같은지 모르는 상태의 설명용 계산입니다.", panel: "fx", formula: "30 × 1 = 30 → 30 × 1.2 = 36 · 증가 6", conclusion: "수출 100과 부품 60의 환산액도 함께 변하므로 국가 합계만으로 순효과를 확정할 수 없습니다." },
  { title: "흐름·잔액·비율의 단위와 기준 시점을 맞춘 뒤 나라를 비교합니다", detail: "한 기관에서 내려받은 자료도 지표마다 정의·대상·연도와 결측 이유가 다를 수 있습니다.", panel: "data", formula: "지표 이름 + 단위 + 대상 범위 + 기준일·기간 + 관측 연도", conclusion: "연간 수출과 기말 부채, 서로 다른 연도의 지표를 같은 한 해의 합계처럼 더하지 않습니다." },
  { title: "국가 평균에서 도시와 실제 계약으로 내려가며 이야기를 틀릴 수 있는 질문으로 바꿉니다", detail: "국가 지표는 출발점이고 실제 투자·생활 판단은 지역과 건물, 권리와 허가까지 확인해야 합니다.", panel: "verification", formula: "국가 방향 → 도시 조건 → 건물·계약 → 실제 측정·반증", conclusion: "나라를 다 안다는 결론 대신 다음에 확인할 장부와 결론을 뒤집을 자료를 고릅니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function FlowsPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="A국 안과 밖을 오가는 흐름">
      <Box title="A국 안쪽" detail="사람·기업·정부·생활" primary /><div className="space-y-1 text-center font-mono text-[8px] font-black sm:text-[10px]"><p>물건 →</p><p>← 부품·돈</p><p>사람 ↔</p></div><Box title="국경 바깥" detail="고객·공급자·채권자" />
    </div>
  );
}

function Box({ title, detail, primary = false }: { title: string; detail: string; primary?: boolean }) {
  return <div className={`min-w-0 border p-3 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className={`text-[10px] font-black sm:text-sm ${primary ? "text-primary" : ""}`}>{title}</p><p className="mt-1 break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{detail}</p></div>;
}

function CasePanel() {
  return (
    <div className="space-y-3" aria-label="A국의 수출과 부품과 부채와 적자 사례">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1.1fr] items-center gap-1.5 sm:gap-3"><Amount label="수출 판매" value="100" /><span className="font-black">−</span><Amount label="외국산 부품" value="60" /><span className="font-black">=</span><Amount label="안쪽 잔액" value="40" primary /></div>
      <div className="grid grid-cols-2 gap-2"><Mini label="기말 외화 부채" value="30 · 잔액" /><Mini label="정부 재정" value="−5 · 기간 흐름" /></div>
    </div>
  );
}

function Amount({ label, value, primary = false }: { label: string; value: string; primary?: boolean }) {
  return <div className={`min-w-0 border p-2.5 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label}</p><p className={`mt-1 font-mono text-base font-black sm:text-xl ${primary ? "text-primary" : ""}`}>{value}</p></div>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="border-y border-border py-2 text-center"><p className="text-[8px] font-bold text-muted-foreground">{label}</p><p className="mt-1 font-mono text-[10px] font-black sm:text-xs">{value}</p></div>;
}

function LedgersPanel() {
  const ledgers = [["정치·법", "규칙·집행"], ["예산", "세입·지출·빚"], ["생산", "노동·재료·산출"], ["대외", "물건·자금 이동"], ["생활", "주거·의료·교육"], ["정보", "무엇을 보고 믿나"], ["기대", "소비·투자·투표"]] as const;
  return <div className="grid grid-cols-4 gap-1.5" aria-label="국가를 읽는 일곱 장부">{ledgers.map(([title, detail], index) => <div key={title} className={`min-w-0 border p-2 text-center ${index === 6 ? "col-start-2 col-span-2 border-foreground/50" : "border-border"}`}><p className={`text-[9px] font-black sm:text-xs ${index === 6 ? "text-primary" : ""}`}>{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px]">{detail}</p></div>)}</div>;
}

function DistributionPanel() {
  const items = [["임금", "?"], ["이익", "?"], ["세금", "?"], ["이자", "?"]] as const;
  return <div className="space-y-3" aria-label="생산 사슬 잔액 40의 분배"><div className="mx-auto w-24 border border-foreground/50 p-2 text-center"><p className="text-[8px] font-bold text-muted-foreground">안쪽 잔액</p><p className="font-mono text-xl font-black text-primary">40</p></div><div className="grid grid-cols-4 gap-1.5">{items.map(([title, value]) => <div key={title} className="border-y border-border py-2 text-center"><p className="text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 font-mono text-sm font-black text-muted-foreground">{value}</p></div>)}</div></div>;
}

function FxPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="환율 변화에 따른 외화 부채 환산액">
      <RateBox label="환율 1.0" calc="30 × 1.0" value="30" /><span className="font-black">→ +6 →</span><RateBox label="환율 1.2" calc="30 × 1.2" value="36" primary />
    </div>
  );
}

function RateBox({ label, calc, value, primary = false }: { label: string; calc: string; value: string; primary?: boolean }) {
  return <div className={`border p-3 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className="text-[9px] font-black sm:text-xs">{label}</p><p className="mt-1 font-mono text-[9px] text-muted-foreground sm:text-xs">{calc}</p><p className={`mt-1 font-mono text-xl font-black ${primary ? "text-primary" : ""}`}>{value}</p></div>;
}

function DataPanel() {
  const items = [["수출 100", "1년 동안의 흐름"], ["외화 부채 30", "기말의 잔액"], ["전력 접근률", "정한 인구의 비율"]] as const;
  return <div className="space-y-1.5" aria-label="국가 지표의 측정 단위 구분">{items.map(([title, detail]) => <div key={title} className="grid grid-cols-[0.8fr_1.2fr] gap-2 border-b border-border py-2"><p className="font-mono text-[9px] font-black sm:text-xs">{title}</p><p className="break-keep text-[9px] font-bold text-muted-foreground sm:text-xs">{detail} · 단위·대상·연도 확인</p></div>)}</div>;
}

function VerificationPanel() {
  const steps = [["국가", "생산·재정·대외 방향"], ["도시", "임금·교통·수요"], ["건물", "임대차·용도·허가"], ["현장", "실측·계약·반증"]] as const;
  return <div className="relative grid grid-cols-4 gap-1.5" aria-label="국가 지표에서 현장 검증까지 내려가는 경로"><span className="absolute left-[11%] right-[11%] top-4 h-px bg-border" aria-hidden="true" />{steps.map(([title, detail], index) => <div key={title} className="relative min-w-0 text-center"><span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index + 1}</span><p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>)}</div>;
}

export default function HowToReadCountryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="국가 읽기 · 설명용 A국" title="수출 100에서 생활과 상환 판단까지 일곱 장부로 내려가는 과정" description="수출·부품·부채·재정 숫자를 분리하고, 누가 벌고 부담하는지와 실제 판단에 필요한 지역·계약 검증을 연결합니다." note="A국과 모든 금액·환율·재정수지는 설명용 가정입니다. 특정 국가의 경제·위기·투자 가능성을 뜻하지 않습니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-country-reading-viz data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4"><div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "flows" && <FlowsPanel />}{scene.panel === "case" && <CasePanel />}{scene.panel === "ledgers" && <LedgersPanel />}{scene.panel === "distribution" && <DistributionPanel />}{scene.panel === "fx" && <FxPanel />}{scene.panel === "data" && <DataPanel />}{scene.panel === "verification" && <VerificationPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div></div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="국가 일곱 장부 읽기 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
