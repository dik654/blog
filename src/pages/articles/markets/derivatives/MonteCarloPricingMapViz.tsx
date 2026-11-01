import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["한 경로", "과정", "네 지급", "짝짓기", "경로 수", "기억", "검산", "경계"] as const;

const NOTES = [
  "월말 가격 100·102·106·112의 평균은 105이므로 행사가 100인 평균가격 콜의 지급은 5입니다. 마지막 가격 112만 쓴 지급 12와 다릅니다.",
  "무작위 입력을 월별 가격 경로로 바꾸고 계약 지급식을 적용한 뒤, 여러 경로의 지급을 평균하고 현재로 할인합니다.",
  "설명용 네 경로의 지급 5·0·10·0을 평균하면 3.75입니다. 이 값은 할인율을 0으로 둔 작은 표본의 계산입니다.",
  "같은 무작위 수와 반대 부호를 묶으면 첫 쌍은 2.5, 둘째 쌍은 5가 됩니다. 작은 표본의 표준오차는 약 2.39에서 1.25로 줄어듭니다.",
  "독립 경로 수를 네 배로 늘리면 표준오차는 대체로 절반이 됩니다. 정확도를 열 배 높이려면 경로가 약 백 배 필요합니다.",
  "평균가격은 누적합, 장벽은 중간 통과 여부, 조기상환은 관찰일 상태를 기억합니다. 미국형은 여러 경로의 계속 보유 가치를 추정해 즉시 행사와 비교합니다.",
  "난수 시작값, 시간 격자와 경로 수를 고정하고 단순 상품의 닫힌 식이나 나무 가격과 비교한 뒤 경로·시간 수렴을 확인합니다.",
  "신뢰구간은 표본오차만 설명합니다. 시간격자, 가격 과정, 상관·점프, 계약 지급식이 틀리면 많은 경로가 정밀하게 틀린 답을 만들 수 있습니다.",
] as const;

type Panel = "onePath" | "pipeline" | "payoffs" | "pairs" | "scale" | "memory" | "validate" | "boundary";

const SCENES = [
  {
    title: "월말 네 가격의 평균 105가 지급 5를 만들고 마지막 가격만 쓰면 12가 됩니다",
    detail: "경로의존 계약은 만기 가격 하나가 아니라 지나온 가격 전체를 지급식에 넣습니다.",
    panel: "onePath",
    formula: "(100+102+106+112)÷4=105 · max(105−100,0)=5 · max(112−100,0)=12",
    conclusion: "같은 마지막 가격에도 중간 경로가 다르면 평균·장벽·조기상환 지급은 달라질 수 있습니다.",
  },
  {
    title: "무작위 입력을 경로·지급·평균으로 바꿔 옵션값 한 개를 만듭니다",
    detail: "각 단계의 입력과 출력을 기록해야 모형 변경과 계산 잡음을 같은 조건에서 비교할 수 있습니다.",
    panel: "pipeline",
    formula: "난수 → 가격 경로 → 계약 지급 → 표본 평균 → 현재가치",
    conclusion: "같은 난수 시작값을 재사용하면 코드나 모형을 바꾼 효과가 새로운 난수의 우연에 가려지지 않습니다.",
  },
  {
    title: "설명용 네 경로의 지급 5·0·10·0을 평균하면 가격 근사는 3.75입니다",
    detail: "할인율을 0으로 둔 작은 표본에서 각 경로가 최종 평균에 같은 무게로 들어갑니다.",
    panel: "payoffs",
    formula: "(5+0+10+0)÷4 = 15÷4 = 3.75",
    conclusion: "경로를 다시 만들면 표본 평균도 달라지므로 가격과 함께 계산 오차를 보고해야 합니다.",
  },
  {
    title: "반대 방향 경로를 묶으면 두 쌍의 평균은 2.5와 5가 됩니다",
    detail: "한 무작위 입력과 부호를 뒤집은 입력이 서로의 방향 잡음을 상쇄하는지 확인합니다.",
    panel: "pairs",
    formula: "(5+0)÷2=2.5 · (10+0)÷2=5 · 표준오차 약 2.39 → 1.25",
    conclusion: "대칭표본은 값을 바꾸는 편법이 아니라 같은 기대값을 유지하면서 표본의 흔들림을 줄이는 방법입니다.",
  },
  {
    title: "독립 경로를 네 배로 늘려야 표준오차가 대체로 절반이 됩니다",
    detail: "경로 수만 늘리는 방법은 단순하지만 원하는 정확도가 높아질수록 계산비용이 제곱으로 커집니다.",
    panel: "scale",
    formula: "표준오차 ∝ 1÷√N · N×4 → 오차×1/2 · 오차×1/10 → N×100",
    conclusion: "대칭표본과 통제변수는 같은 계산 시간에서 한 경로가 주는 정보를 늘리지만 상관이 약하면 개선 폭도 작습니다.",
  },
  {
    title: "평균·장벽·조기상환은 경로에서 기억해야 할 상태가 서로 다릅니다",
    detail: "만기 가격만 저장하면 평균 누적값, 중간 장벽 통과와 관찰일별 종료 조건을 복원할 수 없습니다.",
    panel: "memory",
    formula: "평균가격: 누적합 · 장벽: 통과 여부 · 조기상환: 관찰일 상태 · 미국형: 즉시 행사 ↔ 계속 보유 가치",
    conclusion: "시간 격자가 너무 거칠면 실제 장벽 통과를 놓치고 미국형 옵션은 한 경로만으로 계속 보유 가치를 알 수 없습니다.",
  },
  {
    title: "난수·격자·경로 수를 기록하고 단순 상품과 수렴을 차례로 검산합니다",
    detail: "복잡한 경로 상품을 믿기 전에 같은 경로 생성기와 할인 코드로 답을 아는 상품을 먼저 가격 냅니다.",
    panel: "validate",
    formula: "시작값 고정 → 기준 상품 재가격 → 경로 수렴 → 시간 수렴 → 스트레스 → 독립 재현",
    conclusion: "값이 안정되어도 계약 조건과 시장모형이 맞다는 뜻은 아니므로 계산 검산과 모형 검증을 나눕니다.",
  },
  {
    title: "좁은 신뢰구간을 정확한 시장가치의 증명으로 쓰지 않습니다",
    detail: "표본오차가 작아져도 시간격자, 가격 과정, 상관·점프와 계약 구현 오류는 그대로 남을 수 있습니다.",
    panel: "boundary",
    formula: "총오차 = 표본 + 시간격자 + 수치구현 + 계약구현 + 모형선택",
    conclusion: "백만 경로가 모두 같은 잘못된 세계에서 만들어지면 계산은 정밀해져도 시장에 대한 답은 정밀하게 틀릴 수 있습니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Box({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function OnePathPanel() {
  const values = [100, 102, 106, 112];
  return (
    <div className="space-y-2.5" aria-label="네 월말 가격에서 평균가격 옵션 지급을 계산하는 경로">
      <div className="grid grid-cols-4 gap-2">
        {values.map((value, index) => <Box key={value} label={`${index + 1}개월`} value={String(value)} active={index === values.length - 1} />)}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Box label="네 값의 평균" value="105 → 지급 5" active />
        <Box label="마지막 값만 사용" value="112 → 지급 12" />
      </div>
    </div>
  );
}

function PipelinePanel() {
  const steps = [["난수", "Z"], ["경로", "S₁…S₄"], ["지급", "max(평균−100,0)"], ["평균", "가격·오차"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="무작위 입력에서 몬테카를로 가격까지의 계산 경로">
      {steps.map(([label, value], index) => <Box key={label} label={`${index + 1} · ${label}`} value={value} active={index === steps.length - 1} />)}
    </div>
  );
}

function PayoffsPanel() {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="네 경로 지급을 평균해 3.75를 구하는 계산">
      {[5, 0, 10, 0].map((value, index) => <Box key={index} label={`경로 ${index + 1}`} value={String(value)} />)}
      <Box label="평균" value="3.75" active />
    </div>
  );
}

function PairsPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="대칭 경로를 두 쌍으로 묶어 표준오차를 줄이는 계산">
      <Box label="첫 대칭 쌍" value="5와 0 → 2.5" />
      <Box label="둘째 대칭 쌍" value="10과 0 → 5" />
      <Box label="개별 지급 표준오차" value="약 2.39" />
      <Box label="쌍 평균 표준오차" value="약 1.25" active />
    </div>
  );
}

function ScalePanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="경로 수 증가와 표준오차 감소 관계">
      <Box label="기준" value="N 경로 · 오차 e" />
      <Box label="경로 4배" value="4N · 오차 e/2" active />
      <Box label="경로 100배" value="100N · 오차 e/10" />
    </div>
  );
}

function MemoryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="경로의존 상품별로 기억해야 하는 상태">
      <Box label="평균가격" value="누적합·관측 수" />
      <Box label="장벽" value="중간 통과 여부" />
      <Box label="조기상환" value="관찰일 조건·종료" />
      <Box label="미국형" value="행사와 계속 가치 비교" active />
    </div>
  );
}

function ValidatePanel() {
  const steps = ["시작값", "기준가격", "경로 수", "시간격자", "스트레스", "재현"];
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-3" aria-label="몬테카를로 가격의 단계별 검산 경로">
      {steps.map((step, index) => <Box key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="몬테카를로 가격의 다섯 오차 경계">
      <Box label="표본" value="경로 수·난수" />
      <Box label="시간" value="격자 간격" />
      <Box label="수치" value="할인·회귀" />
      <Box label="계약" value="지급·장벽" />
      <Box label="모형" value="변동성·상관·점프" active />
    </div>
  );
}

export default function MonteCarloPricingMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="몬테카를로 · 월말 네 가격에서 시작하는 전체 지도"
      title="한 경로의 지급을 만들고 네 지급의 평균 3.75와 오차를 함께 계산합니다"
      description="평균가격 옵션 한 경로에서 시작해 무작위 입력이 가격이 되는 순서, 대칭표본으로 표준오차를 줄이는 이유, 경로 수와 계산비용, 경로의존 상태와 모형 검증까지 연결합니다."
      note="월말 가격 100·102·106·112와 지급 5·0·10·0은 작동 원리를 설명하기 위한 가정입니다. 실제 가격은 위험중립 경로, 할인, 계약 관찰일과 시장자료를 사용하며 작은 표본의 오차 감소를 성능 보장으로 일반화하지 않습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-monte-carlo-pricing-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "onePath" && <OnePathPanel />}
          {scene.panel === "pipeline" && <PipelinePanel />}
          {scene.panel === "payoffs" && <PayoffsPanel />}
          {scene.panel === "pairs" && <PairsPanel />}
          {scene.panel === "scale" && <ScalePanel />}
          {scene.panel === "memory" && <MemoryPanel />}
          {scene.panel === "validate" && <ValidatePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="몬테카를로 가격 계산 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
