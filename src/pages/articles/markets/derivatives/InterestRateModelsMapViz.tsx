import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["출발", "하루", "상태", "곡선", "제약", "보정", "헤지", "경계"] as const;

const NOTES = [
  "오늘의 아주 짧은 금리는 3%, 오래 머무는 중심은 4%라고 가정합니다. 한 점의 미래를 그릴지 만기별 곡선 전체를 그릴지 먼저 나눕니다.",
  "되돌림 속도 0.5에서 하루 평균 이동은 약 0.2bp지만 연 흔들림 1%의 하루 표준 움직임은 약 6.3bp입니다.",
  "단기금리 모형은 한 상태에서 곡선을 만들고, HJM은 1년·2년·5년처럼 만기별 선도금리 곡선을 직접 움직입니다.",
  "만기별 흔들림이 모두 1%이고 남은 만기가 2년이면 쌓인 흔들림은 2%, 2년 앞 금리의 평균 몫은 연 2bp입니다.",
  "HJM에서는 흔들림 구조를 고르면 무차익 조건이 평균 이동을 정합니다. 2bp는 금리 전망이 아니라 가격 일관성을 위한 제약입니다.",
  "오늘의 할인·선도곡선과 옵션 표면을 입력하고 후보 모형을 보정한 뒤 다른 만기와 행사가, 매개변수 안정성을 다시 검사합니다.",
  "두 모형이 오늘 가격을 같이 맞춰도 미래 곡선과 민감도, 실제 헤지 손익은 달라질 수 있습니다. 적합도와 헤지 검증은 별개입니다.",
  "음수 금리, 자료가 드문 장기 구간, 상관 변화와 재보정 불안정을 남기고 가장 단순한 후보부터 같은 조건에서 비교합니다.",
] as const;

type Panel = "start" | "daily" | "state" | "curve" | "constraint" | "calibrate" | "hedge" | "boundary";

const SCENES = [
  {
    title: "오늘 3%인 한 점과 만기별 금리 곡선에서 출발합니다",
    detail: "금리 옵션은 오늘의 할인값뿐 아니라 내일 곡선이 기울고 휘는 방식에도 가격이 붙습니다.",
    panel: "start",
    formula: "현재 단기금리 3% · 장기 중심 4% · 연 흔들림 1%",
    conclusion: "먼저 한 점의 경로로 곡선을 만들지, 곡선의 각 만기를 상태로 둘지 선택해야 합니다.",
  },
  {
    title: "하루 평균복귀 약 0.2bp보다 무작위 표준 움직임 약 6.3bp가 큽니다",
    detail: "짧은 하루에는 중심으로 돌아가려는 힘보다 무작위 변화가 약 31.5배 크게 보이는 설명용 사례입니다.",
    panel: "daily",
    formula: "0.5×(4%−3%)÷252≈0.2bp · 1%÷√252≈6.3bp",
    conclusion: "평균복귀는 하루 예측값이 아니라 긴 경로의 분포를 묶는 성질로 읽어야 합니다.",
  },
  {
    title: "한 상태에서 곡선을 만드는 방법과 곡선 전체를 상태로 두는 방법을 나눕니다",
    detail: "바시첵·헐화이트 계열은 단기금리 한 상태를, HJM 틀은 만기별 순간 선도금리를 직접 움직입니다.",
    panel: "state",
    formula: "단기금리 rₜ → P(t,T) · HJM f(t,1년), f(t,2년), f(t,5년)…",
    conclusion: "상태가 많으면 현재 곡선을 유연하게 표현하지만 만기별 흔들림과 상관, 보정 자료도 더 필요합니다.",
  },
  {
    title: "상수 1% 흔들림을 2년 동안 쌓으면 2년 앞 평균 몫은 연 2bp입니다",
    detail: "높이 1%·폭 2년의 넓이를 다시 2년 만기 흔들림 1%와 곱해 무차익 평균을 계산합니다.",
    panel: "curve",
    formula: "∫₀² 1% ds=2% · μ(0,2)=1%×2%=0.02%=2bp/년",
    conclusion: "작아 보이는 평균 몫도 만기별 채권가격을 서로 모순 없이 묶는 제약입니다.",
  },
  {
    title: "흔들림 구조를 고르면 평균 이동은 무차익 조건에 따라 정해집니다",
    detail: "시장 전망과 가격 장부를 섞지 않도록 사용자가 정하는 입력과 식이 결정하는 값을 구분합니다.",
    panel: "constraint",
    formula: "σ(t,T)를 선택 → μ(t,T)=σ(t,T)∫ₜᵀσ(t,s)ds → 채권·옵션 가격",
    conclusion: "2bp는 2년 금리가 오를 것이라는 예측이 아니라 같은 시장 안에서 차익이 생기지 않게 하는 평균입니다.",
  },
  {
    title: "오늘 곡선과 옵션 표면을 맞춘 뒤 다른 구간과 재보정 안정성을 시험합니다",
    detail: "시장 입력을 고정하고 후보 모형을 같은 조건에서 보정한 뒤 표본 밖 가격과 매개변수 변화를 확인합니다.",
    panel: "calibrate",
    formula: "곡선 고정 → 변동성 표면 → 후보 보정 → 다른 만기 가격 → 재보정·스트레스",
    conclusion: "오늘의 적합도가 좋다는 사실만으로 자료가 드문 장기·외가격 구간의 위험까지 확인되지는 않습니다.",
  },
  {
    title: "오늘 가격을 함께 맞춘 두 모형이 내일의 곡선과 헤지 손익을 다르게 만듭니다",
    detail: "한 점 모형과 곡선 모형의 민감도를 같은 실제 곡선 이동에 적용해 반복되는 헤지 차이를 비교합니다.",
    panel: "hedge",
    formula: "오늘 가격 적합도 + 내일 곡선 이동 + 실제 헤지 손익 + 후보 간 가격 차이",
    conclusion: "모형위험은 복잡성의 이름이 아니라 같은 거래에서 가격·민감도·헤지가 얼마나 달라지는지로 관측합니다.",
  },
  {
    title: "가격 적합도 밖의 네 경계를 남기고 선택이 바뀌는 조건을 기록합니다",
    detail: "음수 금리와 장기 자료 공백, 상관 변화, 재보정 불안정과 실제 헤지 손실을 독립적으로 확인합니다.",
    panel: "boundary",
    formula: "현재 곡선 + 옵션 표면 + 매개변수 안정성 + 헤지 손익 + 극단 상황",
    conclusion: "좋은 선택은 거래 목적에 필요한 최소 상태를 쓰고 후보 간 실패 조건과 준비금·한도를 함께 공개합니다.",
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

function StartPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="현재 단기금리와 만기별 곡선"><Box label="오늘 한 점" value="3%" active /><Box label="오래 머무는 중심" value="4%" /><Box label="만기별 곡선" value="1년 · 2년 · 5년" /></div>;
}

function DailyPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="하루 평균복귀와 무작위 움직임 비교"><Box label="평균복귀" value="약 0.2bp" /><Box label="표준 움직임" value="약 6.3bp" active /><Box label="크기 비교" value="약 31.5배" /></div>;
}

function StatePanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="단기금리 모형과 HJM 상태 비교"><Box label="단기금리 모형" value="rₜ 한 상태 → 전체 곡선" /><Box label="HJM 틀" value="만기별 f(t,T) → 곡선 전체" active /></div>;
}

function CurvePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="HJM 평균 이동 계산"><Box label="만기 흔들림" value="1%" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">×</span><Box label="쌓인 흔들림" value="1%×2년=2%" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="평균 이동" value="2bp/년" active /></div>;
}

function ConstraintPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="HJM 무차익 평균 제약"><Box label="사용자가 정함" value="만기별 흔들림 σ" /><Box label="식이 정함" value="평균 이동 μ" active /><Box label="결과" value="모순 없는 채권가격" /></div>;
}

function CalibratePanel() {
  const steps = ["오늘 곡선", "옵션 표면", "후보 보정", "표본 밖 가격", "재보정"];
  return <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="금리 모형 보정과 검증 순서">{steps.map((step, index) => <Box key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function HedgePanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="같은 현재 가격과 다른 미래 헤지 결과"><Box label="한 점 모형" value="오늘 가격 일치 · 한 상태 민감도" /><div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground">≠</div><Box label="곡선 모형" value="오늘 가격 일치 · 만기별 민감도" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="금리 모형 선택의 다섯 검증 경계"><Box label="곡선" value="오늘 값 재현" /><Box label="표면" value="옵션가격" /><Box label="안정" value="재보정 변화" /><Box label="헤지" value="실제 손익" /><Box label="꼬리" value="음수·상관 충격" active /></div>;
}

export default function InterestRateModelsMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="금리 모형 · 3% 한 점에서 만기별 곡선까지"
      title="한 점과 곡선 전체의 미래를 나누고 무차익 제약과 모형위험을 추적합니다"
      description="하루 평균복귀 0.2bp와 표준 움직임 6.3bp에서 출발해 단기금리 모형과 HJM의 상태, 2년 앞 평균 2bp, 보정·헤지·검증 경계를 연결합니다."
      note="3%·4%·0.5·1%와 모든 만기의 흔들림 1%는 작동 원리를 설명하기 위한 가정입니다. 실제 금리 모형은 통화·담보·기준금리별 곡선, 시장 호가와 계약 조건을 사용합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-interest-rate-models-map data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "start" && <StartPanel />}
          {scene.panel === "daily" && <DailyPanel />}
          {scene.panel === "state" && <StatePanel />}
          {scene.panel === "curve" && <CurvePanel />}
          {scene.panel === "constraint" && <ConstraintPanel />}
          {scene.panel === "calibrate" && <CalibratePanel />}
          {scene.panel === "hedge" && <HedgePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="금리 모형 검증 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
