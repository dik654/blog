import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["출발", "델타", "감마", "베가", "세타", "합계", "헤지", "경계"] as const;

const NOTES = [
  "옵션 한 단위의 시작 가격을 5로 두고 델타 0.50, 감마 0.04, 베가 0.09, 하루 세타 −0.08을 같은 시각의 민감도로 읽습니다.",
  "주가가 2 오르면 델타의 일차 몫은 0.50×2=+1.00입니다. 이는 출발점 근처의 직선 근사입니다.",
  "가격 곡률의 이차 몫은 0.5×0.04×2²=+0.08입니다. 같은 감마로 델타도 0.50에서 약 0.58로 바뀝니다.",
  "베가를 변동성 1%포인트당 0.09로 정의하면 내재변동성 5%포인트 상승 몫은 0.09×5=+0.45입니다. 시스템마다 베가 단위를 확인해야 합니다.",
  "다른 조건을 고정하고 하루가 지나면 세타 몫은 −0.08입니다. 주가가 그대로여도 시간 경과만으로 옵션 가격이 달라질 수 있습니다.",
  "네 몫을 단순히 더하면 +1.45이고 시작 가격 5는 약 6.45가 됩니다. 민감도가 움직이는 동안 고정됐다는 설명용 근사입니다.",
  "콜 한 단위를 판 쪽이 주식 0.50주를 샀다면 처음 델타는 0에 가깝습니다. 주가가 2 오른 뒤 콜 델타가 0.58이 되므로 주식 0.08주를 더 사야 합니다.",
  "큰 가격 이동, 변동성 미소 변화, 점프, 호가 차이, 수수료와 계약 승수는 단순 근사와 연속 헤지 밖에 남습니다. 그릭스 하나를 0으로 만든 것이 전체 위험 제거는 아닙니다.",
] as const;

type Panel = "start" | "delta" | "gamma" | "vega" | "theta" | "sum" | "hedge" | "boundary";

const SCENES = [
  {
    title: "가격 5인 옵션을 네 민감도로 나눠 같은 하루를 추적합니다",
    detail: "각 수치는 같은 평가 시각과 같은 옵션 한 단위를 기준으로 둡니다.",
    panel: "start",
    formula: "가격 5 · Δ=0.50 · Γ=0.04 · Vega=0.09 · 하루 Θ=−0.08",
    conclusion: "그릭스는 가격을 따로 만드는 네 계약이 아니라 한 가격 함수의 서로 다른 방향 민감도입니다.",
  },
  {
    title: "주가가 2 오르면 델타가 설명하는 일차 가격 변화는 +1.00입니다",
    detail: "출발점의 기울기 0.50을 주가 변화 +2에 곱합니다.",
    panel: "delta",
    formula: "델타 몫 = 0.50 × 2 = +1.00",
    conclusion: "직선 근사만 보면 옵션 가격은 5에서 6으로 움직입니다.",
  },
  {
    title: "곡률은 가격에 +0.08을 더하고 다음 델타를 0.58로 바꿉니다",
    detail: "감마는 가격의 이차 몫과 헤지 수량의 변화를 함께 보여 줍니다.",
    panel: "gamma",
    formula: "½×0.04×2²=+0.08 · 새 델타≈0.50+0.04×2=0.58",
    conclusion: "처음 맞춘 델타 헤지가 시장 이동 뒤 그대로 유지되지 않는 이유입니다.",
  },
  {
    title: "내재변동성이 5%포인트 오르면 베가 몫은 +0.45입니다",
    detail: "베가 0.09를 변동성 1%포인트당 옵션 가격 변화로 정의한 사례입니다.",
    panel: "vega",
    formula: "베가 몫 = 0.09 × 5 = +0.45",
    conclusion: "베가 단위가 1%포인트인지 변동성 1.00인지 시스템마다 먼저 확인해야 합니다.",
  },
  {
    title: "다른 조건을 고정하고 하루가 지나면 세타 몫은 −0.08입니다",
    detail: "주가가 움직이지 않아도 만기가 가까워지면서 시간가치가 달라집니다.",
    panel: "theta",
    formula: "하루 세타 몫 = −0.08 × 1일 = −0.08",
    conclusion: "세타는 달력 하루인지 거래일 하루인지와 부호 표시 방식을 함께 확인해야 합니다.",
  },
  {
    title: "네 몫을 더한 하루 근사는 +1.45이고 옵션 가격은 약 6.45입니다",
    detail: "주가·곡률·변동성·시간의 설명용 손익을 한 장부에 모읍니다.",
    panel: "sum",
    formula: "+1.00 + 0.08 + 0.45 − 0.08 = +1.45",
    conclusion: "실제 가격은 이동 중 민감도 변화와 교차 효과 때문에 이 합과 달라질 수 있습니다.",
  },
  {
    title: "콜 매도 헤지는 주식 0.50주에서 0.58주로 다시 맞춰야 합니다",
    detail: "감마 때문에 델타가 바뀌므로 주가 상승 뒤 주식 0.08주를 더 삽니다.",
    panel: "hedge",
    formula: "−콜 델타 0.58 + 주식 0.58 ≈ 0",
    conclusion: "동적 헤지는 방향 위험을 반복해서 줄이지만 상승 때 사고 하락 때 파는 비용과 점프 위험을 남깁니다.",
  },
  {
    title: "큰 이동·교차 효과·점프·거래비용은 작은 변화 근사 밖에 남습니다",
    detail: "그릭스 표와 실제 계약 손익·증거금·체결 가능성을 같은 것으로 보지 않습니다.",
    panel: "boundary",
    formula: "실제 손익 − 그릭스 근사 = 고차·교차·점프·체결·모형 오차",
    conclusion: "시나리오 손익과 스트레스, 계약 승수, 유동성, 담보 요구를 그릭스와 함께 봐야 합니다.",
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

function Arrow({ children = "→" }: { children?: string }) {
  return <div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground sm:text-base">{children}</div>;
}

function StartPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="옵션의 시작 가격과 네 그릭스 입력">
      <Box label="옵션 가격" value="5" active />
      <Box label="델타" value="0.50" />
      <Box label="감마" value="0.04" />
      <Box label="베가" value="0.09 / 1%p" />
      <Box label="하루 세타" value="−0.08" />
    </div>
  );
}

function ChangePanel({ inputLabel, input, outputLabel, output }: { inputLabel: string; input: string; outputLabel: string; output: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4">
      <Box label={inputLabel} value={input} />
      <Arrow />
      <Box label={outputLabel} value={output} active />
    </div>
  );
}

function GammaPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="감마가 가격과 델타에 미치는 두 변화">
      <Box label="주가 변화" value="+2" />
      <Box label="감마 가격 몫" value="+0.08" active />
      <Box label="이전 델타" value="0.50" />
      <Box label="새 델타" value="0.58" active />
    </div>
  );
}

function SumPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="그릭스 네 몫을 옵션의 하루 가격 변화로 합산">
      <Box label="델타" value="+1.00" />
      <Box label="감마" value="+0.08" />
      <Box label="베가" value="+0.45" />
      <Box label="세타" value="−0.08" />
      <Box label="가격 5의 새 근사" value="6.45" active />
    </div>
  );
}

function HedgePanel() {
  return (
    <div className="space-y-2" aria-label="콜 매도 뒤 델타 헤지를 다시 맞추는 과정">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4">
        <Box label="처음 콜 매도 델타" value="−0.50" />
        <Arrow>+</Arrow>
        <Box label="처음 보유 주식" value="+0.50주 → 합계 0" />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4">
        <Box label="주가 +2 뒤 콜 매도" value="−0.58" />
        <Arrow>+</Arrow>
        <Box label="주식 0.08주 추가" value="+0.58주 → 합계 0" active />
      </div>
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="그릭스 근사 밖에 남는 네 위험">
      <Box label="크기" value="큰 이동·고차항" active />
      <Box label="동시 변화" value="가격×변동성" />
      <Box label="경로" value="점프·거래 간격" />
      <Box label="실행" value="호가·비용·승수" />
    </div>
  );
}

export default function OptionGreeksHedgeMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="옵션 그릭스 · 가격 5인 한 계약의 전체 지도"
      title="주가·곡률·변동성·시간을 더해 하루 가격 6.45를 근사합니다"
      description="가격 5인 옵션에 주가 +2, 내재변동성 +5%포인트, 하루 경과를 넣어 각 민감도의 몫을 계산하고, 델타 헤지를 0.50주에서 0.58주로 다시 맞추는 과정까지 이어 봅니다."
      note="델타 0.50·감마 0.04·베가 0.09·하루 세타 −0.08은 작동 원리를 설명하기 위한 옵션 한 단위의 가정입니다. 계약 승수와 실제 체결가격은 넣지 않았습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-option-greeks-hedge-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "start" && <StartPanel />}
          {scene.panel === "delta" && <ChangePanel inputLabel="주가 변화" input="+2" outputLabel="델타 가격 몫" output="+1.00" />}
          {scene.panel === "gamma" && <GammaPanel />}
          {scene.panel === "vega" && <ChangePanel inputLabel="내재변동성 변화" input="+5%p" outputLabel="베가 가격 몫" output="+0.45" />}
          {scene.panel === "theta" && <ChangePanel inputLabel="시간 경과" input="+1일" outputLabel="세타 가격 몫" output="−0.08" />}
          {scene.panel === "sum" && <SumPanel />}
          {scene.panel === "hedge" && <HedgePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="옵션 그릭스와 헤지 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
