import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["손실", "문턱", "꼬리", "충격", "도구", "과정", "검증", "경계"] as const;

const NOTES = [
  "설명용 하루 손실을 작은 순서로 0·0·1·1·2·2·3·4·6·10이라 두고 같은 가능성의 열 상황으로 읽습니다.",
  "손실의 80%가 4 이하이므로 이 표본 규칙의 80% VaR는 4입니다. 최대손실이 4라는 뜻은 아닙니다.",
  "문턱 4를 넘은 손실 6과 10의 평균은 8이므로 설명용 80% Expected Shortfall은 8입니다.",
  "과거 최악 10 밖에 금리·주가·환율·유동성 충격을 함께 넣어 손실 18인 별도 스트레스를 만듭니다. 발생확률을 자동으로 뜻하지 않습니다.",
  "그릭스는 작은 현재 변화, VaR·ES는 손익분포, 스트레스는 지정 사건을 묻습니다. 서로 다른 질문의 답을 한 순위로 세우지 않습니다.",
  "포지션과 위험요인을 연결하고 시나리오마다 재평가해 분포를 만든 뒤 한도·헤지·자금 행동과 연결합니다.",
  "다음 날 실제 손익과 모형 손익을 비교하고 예외와 설명되지 않은 손익이 반복되면 모형·자료·한도·스트레스를 고칩니다.",
  "자료 창, 기간, 신뢰수준, 유동성, 비선형 재평가와 제외 포지션을 남기고 낮은 VaR를 안전의 증명으로 읽지 않습니다.",
] as const;

type Panel = "losses" | "threshold" | "tail" | "stress" | "tools" | "process" | "validation" | "boundary";

const SCENES = [
  {
    title: "열 번의 하루 손실을 작은 값부터 0·0·1·1·2·2·3·4·6·10으로 놓습니다",
    detail: "위험 숫자를 모형 이름에서 시작하지 않고 실제로 요약하려는 손실분포에서 출발합니다.",
    panel: "losses",
    formula: "L={0,0,1,1,2,2,3,4,6,10} · 열 상황은 같은 가능성이라는 가정",
    conclusion: "대부분의 손실과 드문 큰 손실을 같은 평균 하나로 합치기 전에 문턱과 꼬리를 따로 봅니다.",
  },
  {
    title: "여덟 번째 손실 4까지가 표본의 80%이므로 80% VaR는 4입니다",
    detail: "이 규칙에서는 열 상황 중 두 상황이 문턱을 넘을 수 있으며 문턱 밖 손실의 크기는 VaR가 말하지 않습니다.",
    panel: "threshold",
    formula: "P(L≤4)=8÷10=80% → VaR₈₀=4",
    conclusion: "VaR 4는 최대손실이나 손실 상한이 아니라 정한 기간·신뢰수준의 분위수입니다.",
  },
  {
    title: "문턱을 넘은 두 손실 6과 10의 평균은 8입니다",
    detail: "Expected Shortfall은 같은 신뢰수준에서 VaR 바깥에 들어간 손실이 평균적으로 얼마나 큰지 보여 줍니다.",
    panel: "tail",
    formula: "ES₈₀=(6+10)÷2=8",
    conclusion: "표본이 작거나 문턱에 같은 값이 몰리면 꼬리 포함 규칙과 추정 방법에 따라 결과가 달라질 수 있습니다.",
  },
  {
    title: "과거 최악 10 밖에 복합 시장 충격을 넣어 스트레스 손실 18을 따로 계산합니다",
    detail: "금리 2%포인트 상승·주가 25% 하락·환율 급등·매수호가 축소를 함께 적용한 설명용 시나리오입니다.",
    panel: "stress",
    formula: "과거 표본 최악 10 · 지정 복합 충격 재평가 18",
    conclusion: "스트레스 18은 발생확률을 맞힌 값이 아니라 포지션의 취약성과 한도·자금 대응을 시험하는 결과입니다.",
  },
  {
    title: "그릭스·VaR·ES·스트레스가 답하는 질문을 나눕니다",
    detail: "숫자가 다르면 하나가 틀렸다고 결론내리기 전에 포지션·시각·충격·기간·상관과 유동성 가정을 맞춥니다.",
    panel: "tools",
    formula: "현재 작은 변화 → 그릭스 · 분포 문턱 → VaR · 꼬리 평균 → ES · 지정 사건 → 스트레스",
    conclusion: "각 도구는 다른 시간과 손실 모양을 보므로 하나의 수치가 전체 위험을 대신하지 않습니다.",
  },
  {
    title: "거래 장부에서 시나리오 재평가·분포·한도·행동까지 한 경로로 잇습니다",
    detail: "위험 수치가 보고서에 머물지 않도록 한도 초과 때 포지션 축소·헤지·자금 확보의 책임을 연결합니다.",
    panel: "process",
    formula: "포지션 → 위험요인 → 시나리오 재평가 → 손익분포 → VaR·ES·스트레스 → 행동",
    conclusion: "위기 때 실제로 거래할 수 있는지와 여러 부서가 같은 포지션을 중복 계산하지 않는지도 과정 안에서 검증합니다.",
  },
  {
    title: "다음 날 실제 손익과 모형 손익을 비교해 반복되는 설명 공백을 찾습니다",
    detail: "예외 횟수뿐 아니라 신규 거래·시간 경과·수수료와 모형이 놓친 위험요인을 분리해 다음 판단을 고칩니다.",
    panel: "validation",
    formula: "실제 손익 − 모형 손익 = 신규 거래 + 시간·수수료 + 모형·자료 공백",
    conclusion: "반복되는 차이는 다음 글의 백테스트와 손익귀속에서 모형 승인·한도·변경의 근거가 됩니다.",
  },
  {
    title: "자료·기간·유동성·비선형·구현 경계를 위험 숫자 옆에 남깁니다",
    detail: "평온한 자료는 변동성과 상관을 낮춰 보이고 위기 때 매수호가가 사라지면 이론가격으로 포지션을 닫지 못할 수 있습니다.",
    panel: "boundary",
    formula: "자료 창 + 보유기간·신뢰수준 + 유동성 + 비선형 재평가 + 제외·구현 기록",
    conclusion: "낮은 VaR를 안전의 증명으로 쓰지 않고 측정값이 실패하는 조건과 스트레스·실제 손익을 함께 보여 줍니다.",
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

function LossesPanel() {
  const losses = [0, 0, 1, 1, 2, 2, 3, 4, 6, 10];
  return <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10 sm:gap-2" aria-label="작은 순서로 정렬한 열 개의 하루 손실">{losses.map((loss, index) => <Box key={`${loss}-${index}`} label={`${index + 1}번`} value={String(loss)} active={index >= 8} />)}</div>;
}

function ThresholdPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="80퍼센트 VaR 문턱"><Box label="문턱 안" value="8개 손실" /><Box label="80% VaR" value="4" active /><Box label="문턱 밖" value="6 · 10" /></div>;
}

function TailPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="80퍼센트 Expected Shortfall 계산"><Box label="꼬리 손실 1" value="6" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">+</span><Box label="꼬리 손실 2" value="10" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="평균" value="8" active /></div>;
}

function StressPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="과거 표본 최악 손실과 별도 스트레스 비교"><Box label="과거 표본 최악" value="10" /><Box label="복합 스트레스" value="18" active /></div>;
}

function ToolsPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="시장위험 측정 도구가 답하는 질문"><Box label="그릭스" value="작은 현재 변화" /><Box label="VaR" value="분포 문턱" /><Box label="ES" value="문턱 밖 평균" /><Box label="스트레스" value="지정 복합 사건" active /></div>;
}

function ProcessPanel() {
  const steps = ["포지션", "위험요인", "재평가", "분포", "행동"];
  return <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="시장위험 측정과 대응 과정">{steps.map((step, index) => <Box key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function ValidationPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="실제 손익과 모형 손익 비교"><Box label="실제 손익" value="거래·시장·비용 전체" /><div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground">−</div><Box label="모형 손익" value="모형 위험요인 재평가" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="시장위험 측정의 다섯 검증 경계"><Box label="자료" value="창·품질" /><Box label="기간" value="보유·유동성" /><Box label="분포" value="상관·꼬리" /><Box label="가격" value="비선형 재평가" /><Box label="구현" value="제외·변경" active /></div>;
}

export default function MarketRiskMeasuresMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="시장위험 · 열 손실의 문턱과 꼬리"
      title="VaR 4와 Expected Shortfall 8을 계산하고 표본 밖 스트레스 18까지 연결합니다"
      description="열 개의 하루 손실에서 출발해 분위수 문턱과 꼬리 평균, 지정 복합 충격, 그릭스와 위험 측정 도구의 역할, 재평가·한도·검증 경계를 추적합니다."
      note="손실 목록과 80% 신뢰수준, 스트레스 손실 18은 손계산을 위한 가정입니다. 실제 위험 측정은 목적에 맞는 기간·신뢰수준·시장자료·유동성 기간과 승인된 평가 모형을 사용합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-market-risk-measures-map data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "losses" && <LossesPanel />}
          {scene.panel === "threshold" && <ThresholdPanel />}
          {scene.panel === "tail" && <TailPanel />}
          {scene.panel === "stress" && <StressPanel />}
          {scene.panel === "tools" && <ToolsPanel />}
          {scene.panel === "process" && <ProcessPanel />}
          {scene.panel === "validation" && <ValidationPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="시장위험 측정 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
