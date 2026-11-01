import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["보호료", "강도", "생존", "지급", "곡선", "동시", "장부", "경계"] as const;

const NOTES = [
  "원금 100의 연 보호료가 1.2%이고 부도 뒤 40을 회수한다고 가정합니다. 보호계약이 떠안는 손실률은 60%입니다.",
  "평평한 1년 근사에서 연 보호료 1.2%를 손실률 60%로 나누면 부도 도착 세기 약 2%가 됩니다.",
  "도착 세기 2%가 1년 동안 일정하면 생존확률은 exp(−0.02)≈98.02%, 가격 장부의 부도확률은 약 1.98%입니다.",
  "회사가 생존하는 동안 보호료를 내고, 부도가 도착하면 보호료가 멈추며 원금 100에서 회수 40을 뺀 60이 보호금으로 움직입니다.",
  "1년 보호료로 첫 구간을 푼 뒤 3년·5년 보호료와 앞서 계산한 생존확률을 사용해 다음 구간의 위험강도를 차례로 풉니다.",
  "회사 두 곳의 기대손실 합은 12로 같아도 독립이면 동시부도 1%, 완전한 공통 충격이면 10%라 한 번에 120을 잃는 꼬리가 달라집니다.",
  "시장 보호료에서 역산한 가격용 확률과 실제 부도 빈도 추정은 목적과 입력이 다릅니다. 같은 2%를 모든 장부에 복사하지 않습니다.",
  "유동성·위험보상·회수율·상관과 자료 공백을 남기고 가격, 실제 손실, 포트폴리오 꼬리를 서로 다른 검증으로 확인합니다.",
] as const;

type Panel = "spread" | "intensity" | "survival" | "cashflow" | "curve" | "joint" | "ledgers" | "boundary";

const SCENES = [
  {
    title: "연 보호료 1.2%와 회수 40%에서 손실률 60%를 먼저 분리합니다",
    detail: "보호료 한 숫자 안에는 부도가 얼마나 자주 오는지와 부도 때 얼마나 잃는지가 함께 들어 있습니다.",
    panel: "spread",
    formula: "원금 100 · 연 보호료 1.2 · 회수 40 · 부도 손실 60",
    conclusion: "부도 가능성을 읽기 전에 계약이 실제로 보상하는 손실 몫을 확인해야 합니다.",
  },
  {
    title: "보호료 1.2%를 손실률 60%로 나누면 연 도착 세기는 약 2%입니다",
    detail: "할인과 분기 지급, 기간 중 부도를 생략한 평평한 1년 설명용 근사입니다.",
    panel: "intensity",
    formula: "λ≈1.2%÷(1−40%)=1.2%÷60%=2%/년",
    conclusion: "2%는 아직 시장가격에서 역산한 도착 세기이며 실제 기업의 장기 부도 빈도와 같다고 단정하지 않습니다.",
  },
  {
    title: "연 도착 세기 2%는 1년 생존 98.02%와 부도확률 약 1.98%를 만듭니다",
    detail: "회사가 아직 살아 있다는 조건을 시간에 따라 줄여 생존 장부와 부도 장부를 나눕니다.",
    panel: "survival",
    formula: "S(1)=e⁻⁰·⁰²≈98.02% · Q(τ≤1)=1−S(1)≈1.98%",
    conclusion: "세기 2%와 1년 확률 1.98%는 비슷하지만 시간 단위와 조건이 다른 값입니다.",
  },
  {
    title: "생존 중에는 보호료가 흐르고 부도가 도착하면 60의 보호금이 움직입니다",
    detail: "부도 날짜를 기준으로 평소 지급과 부도 지급을 갈라야 각 현금흐름의 확률과 할인을 맞출 수 있습니다.",
    panel: "cashflow",
    formula: "생존: 정기 보호료 지급 · 부도: 보호료 중단 + (100−40)=60 지급",
    conclusion: "복제나 분산만으로 해결되는 문제가 아니라 계약의 두 지급 경로를 같은 날짜 장부에서 맞추는 계산입니다.",
  },
  {
    title: "1년 구간을 푼 뒤 3년·5년 보호료로 다음 위험강도 구간을 이어 붙입니다",
    detail: "앞 구간의 생존확률을 고정한 채 다음 만기의 보호료와 부도 지급이 같아지도록 새 구간의 값을 풉니다.",
    panel: "curve",
    formula: "1년 호가 → λ₁ · 3년 호가+S(1) → λ₂ · 5년 호가+S(3) → λ₃",
    conclusion: "한 개의 2%를 모든 만기에 복사하지 않고 시장의 기간별 가격을 설명하는 위험강도곡선을 만듭니다.",
  },
  {
    title: "평균손실 12가 같아도 두 회사가 함께 무너질 확률은 1%와 10%로 달라집니다",
    detail: "각 회사 원금 100·부도확률 10%·손실률 60%인 설명용 장부에서 독립과 완전한 공통 충격을 비교합니다.",
    panel: "joint",
    formula: "회사별 기대손실 100×10%×60%=6 · 합 12 · 동시부도 1% 또는 10%",
    conclusion: "개별 곡선만으로는 한 번에 120을 잃는 포트폴리오 꼬리를 정할 수 없어 동시부도 구조가 따로 필요합니다.",
  },
  {
    title: "시장가격용 확률과 실제 부도 추정, 포트폴리오 꼬리 장부를 분리합니다",
    detail: "시장 보호료에는 예상손실뿐 아니라 위험보상과 유동성이 들어갈 수 있어 목적이 다른 숫자를 공유하지 않습니다.",
    panel: "ledgers",
    formula: "시장 호가 → 가격용 곡선 · 재무자료·이력 → 실제 추정 · 공통 충격 → 꼬리손실",
    conclusion: "같은 2%를 가격, 충당금, 자본과 한도에 그대로 복사하면 서로 다른 질문의 답을 섞게 됩니다.",
  },
  {
    title: "가격 적합도 밖의 회수·유동성·상관·자료 경계를 함께 남깁니다",
    detail: "회수율과 세기가 서로 대신 움직여 같은 가격을 만들 수 있고, 시장 상관과 실제 동시부도도 다를 수 있습니다.",
    panel: "boundary",
    formula: "가격 적합 + 회수 민감도 + 유동성·위험보상 + 동시손실 + 실제 빈도 검증",
    conclusion: "좋은 신용 장부는 하나의 확률을 찾는 대신 어떤 가정이 어떤 지급과 손실을 소유하는지 공개합니다.",
  },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Box({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function SpreadPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="보호료와 회수 뒤 손실"><Box label="연 보호료" value="1.2%" /><Box label="부도 뒤 회수" value="40%" /><Box label="떠안는 손실" value="60%" active /></div>;
}

function IntensityPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="보호료에서 위험강도 계산"><Box label="보호료" value="1.2%" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">÷</span><Box label="손실률" value="60%" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="연 도착 세기" value="2%" active /></div>;
}

function SurvivalPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="위험강도와 1년 생존 및 부도 확률"><Box label="연 도착 세기" value="2%" /><Box label="1년 생존" value="약 98.02%" /><Box label="1년 부도" value="약 1.98%" active /></div>;
}

function CashflowPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="생존과 부도 때 신용보호 현금흐름"><Box label="생존 중" value="정기 보호료 지급" /><div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground">τ</div><Box label="부도 도착" value="보호료 중단 · 보호금 60" active /></div>;
}

function CurvePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="만기별 위험강도곡선 부트스트랩"><Box label="1년 호가" value="첫 구간 λ₁" /><Box label="3년 호가" value="생존 S(1)+λ₂" /><Box label="5년 호가" value="생존 S(3)+λ₃" active /></div>;
}

function JointPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="두 회사의 기대손실과 동시부도 비교"><Box label="회사 A 기대손실" value="6" /><Box label="회사 B 기대손실" value="6" /><Box label="독립 동시부도" value="1%" /><Box label="공통 충격" value="10% · 손실 120" active /></div>;
}

function LedgersPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="가격용 확률과 실제 부도 추정 및 꼬리손실 장부"><Box label="가격 장부" value="보호료·위험보상·유동성" /><Box label="실제 추정" value="재무자료·부도 이력" /><Box label="포트폴리오" value="공통 충격·동시손실" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="신용 모형의 다섯 검증 경계"><Box label="가격" value="만기별 호가" /><Box label="회수" value="손실률 변화" /><Box label="유동성" value="위험보상 분리" /><Box label="상관" value="동시손실" /><Box label="실제" value="부도 빈도" active /></div>;
}

export default function CreditIntensityMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="신용위험 · 보호료 1.2%에서 동시손실까지"
      title="보호료를 생존·부도·회수로 나누고 포트폴리오 꼬리까지 추적합니다"
      description="손실률 60%와 연 도착 세기 2%에서 출발해 1년 부도확률 1.98%, 만기별 위험강도곡선, 두 회사의 동시부도 1%와 10%, 가격용·실제 장부의 경계를 연결합니다."
      note="보호료 1.2%, 회수 40%, 회사별 1년 부도확률 10%와 완전한 공통 충격은 작동 원리를 설명하기 위한 가정입니다. 실제 계약은 지급일·할인·기간 중 부도와 시장 호가를 반영합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-credit-intensity-map data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "spread" && <SpreadPanel />}
          {scene.panel === "intensity" && <IntensityPanel />}
          {scene.panel === "survival" && <SurvivalPanel />}
          {scene.panel === "cashflow" && <CashflowPanel />}
          {scene.panel === "curve" && <CurvePanel />}
          {scene.panel === "joint" && <JointPanel />}
          {scene.panel === "ledgers" && <LedgersPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="신용위험 계산 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
