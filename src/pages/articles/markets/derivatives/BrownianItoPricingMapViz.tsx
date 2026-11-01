import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["하루", "시간", "제곱", "이토", "장부", "복제", "가격", "경계"] as const;

const NOTES = [
  "주가 100과 연간 흔들림 20%를 거래일 252일로 나누면 하루의 한 표준 흔들림은 약 1.26입니다. 이는 내일 가격을 맞히는 예보가 아닙니다.",
  "평균 이동은 시간 길이 Δt에 비례하고 무작위 흔들림은 √Δt에 비례합니다. 시간을 4분의 1로 줄이면 둘은 각각 4분의 1과 2분의 1이 됩니다.",
  "가격이 1.26 오를 때 제곱값 변화 253.59에서 일차 근사 252를 빼면 약 1.59가 남습니다. 하락 방향에서도 제곱 몫은 같은 부호로 남습니다.",
  "이토 공식은 시간 변화, 일차 기울기와 함께 두 번째 미분에 무작위 변화의 제곱을 곱한 보정항을 남깁니다.",
  "실제 전망 장부에는 기업 실적과 위험 프리미엄이 들어갑니다. 가격 계산 장부는 평균 이동을 무위험금리에 맞춰 하루 평균을 약 100.0198로 둡니다.",
  "옵션과 주식을 델타만큼 반대로 묶으면 같은 순간의 무작위 주가 항이 상쇄됩니다. 남은 확정 몫은 무위험금리를 벌어야 합니다.",
  "복제로 만든 가격과 위험중립 장부에서 만기 지급을 할인한 평균은 같은 무차익 가격을 표현합니다. 위험중립 가중치는 실제 확률 예측이 아닙니다.",
  "점프, 불연속 거래, 호가 차이, 차입 한도와 잘못된 변동성 입력은 완전한 복제를 깨뜨립니다. 수학은 이 가정을 시장의 사실로 바꾸지 않습니다.",
] as const;

type Panel = "daily" | "time" | "square" | "ito" | "ledgers" | "replicate" | "price" | "boundary";

const SCENES = [
  {
    title: "연간 흔들림 20%는 주가 100에서 하루 약 1.26의 표준 움직임이 됩니다",
    detail: "연간 입력을 하루 크기로 바꾸되 내일 가격의 예보로 읽지 않습니다.",
    panel: "daily",
    formula: "20% × 100 ÷ √252 ≈ 1.26",
    conclusion: "연속시간 모형은 짧은 구간의 평균 이동과 뜻밖의 흔들림을 따로 적는 데서 시작합니다.",
  },
  {
    title: "시간을 4분의 1로 줄이면 평균 몫은 4분의 1, 흔들림은 2분의 1이 됩니다",
    detail: "두 항이 서로 다른 속도로 작아지는 것이 이토 계산의 핵심입니다.",
    panel: "time",
    formula: "평균 ∝ Δt · 표준 흔들림 ∝ √Δt",
    conclusion: "흔들림 자체는 방향이 바뀌어 상쇄될 수 있지만 그 제곱은 시간과 같은 크기로 누적됩니다.",
  },
  {
    title: "가격을 제곱하면 일차 근사에 없던 1.26²≈1.59가 방향과 무관하게 남습니다",
    detail: "굽은 함수에서는 보통 미분이 버리던 제곱항을 보존해야 합니다.",
    panel: "square",
    formula: "101.26²−100²≈253.59 · 2×100×1.26=252 · 차이≈1.59",
    conclusion: "가격이 내려간 경우에도 변화량의 제곱은 양수여서 같은 종류의 굽음 보정이 남습니다.",
  },
  {
    title: "이토 공식은 시간·기울기와 함께 두 번째 미분에 제곱 몫을 붙입니다",
    detail: "주가 변화가 가격 함수의 일차·이차 민감도로 들어가는 위치를 나눕니다.",
    panel: "ito",
    formula: "dV = Vₜdt + VₛdS + ½Vₛₛ(dS)²",
    conclusion: "옵션처럼 굽은 지급의 가격은 방향이 평균적으로 0인 흔들림에서도 이차 항의 영향을 받습니다.",
  },
  {
    title: "실제 전망 장부와 무차익 가격 장부는 같은 흔들림을 쓰되 평균 이동이 다릅니다",
    detail: "투자수익 예측과 계약 가격 계산을 한 확률로 섞지 않습니다.",
    panel: "ledgers",
    formula: "가격 장부의 하루 평균 = 100e^(5%/252) ≈ 100.0198",
    conclusion: "100.0198은 실제 내일 평균을 맞힌다는 값이 아니라 할인한 거래 가격을 서로 맞추는 장부 규칙입니다.",
  },
  {
    title: "옵션과 델타만큼의 주식을 반대로 묶으면 같은 순간의 무작위 항이 상쇄됩니다",
    detail: "복제 포트폴리오에서 가격 방향을 예측하지 않고 위험 항을 지웁니다.",
    panel: "replicate",
    formula: "옵션 변화 − 델타×주가 변화 → 무작위 dW 항 상쇄",
    conclusion: "남은 확정 현금흐름이 무위험금리와 다르면 싼 쪽을 사고 비싼 쪽을 파는 거래가 생깁니다.",
  },
  {
    title: "복제 비용과 위험중립 장부의 할인 평균은 같은 무차익 가격을 나타냅니다",
    detail: "미분방정식과 확률 가중치가 서로 다른 질문처럼 보이지만 같은 가격 경계를 만듭니다.",
    panel: "price",
    formula: "오늘 가격 = 복제 비용 = 위험중립 만기 지급의 할인 평균",
    conclusion: "위험중립 확률은 실제 사건 가능성을 예측하는 값이 아니라 현재 거래가격을 맞추는 계산 체계입니다.",
  },
  {
    title: "점프·거래 간격·호가 차이·차입 한도는 연속 복제 밖에 남는 위험입니다",
    detail: "모형 안의 정확한 계산과 실제 시장에서 실행 가능한 헤지를 구분합니다.",
    panel: "boundary",
    formula: "연속 경로·연속 거래·고정 입력·완전한 차입이 깨지면 헤지 오차 발생",
    conclusion: "좋은 가격 보고서는 모형값과 함께 입력, 점프 스트레스, 거래비용과 실제 헤지 오차를 따로 보여 줍니다.",
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

function DailyPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="연간 흔들림을 하루 주가 움직임으로 바꾸는 계산">
      <Box label="연간 입력" value="주가 100 · 흔들림 20%" />
      <Arrow />
      <Box label="하루 한 표준 움직임" value="98.74 ↔ 101.26" active />
    </div>
  );
}

function TimePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="시간 간격을 줄일 때 평균과 표준 흔들림의 크기 변화">
      <Box label="평균 이동" value="Δt → ¼" />
      <Box label="표준 흔들림" value="√Δt → ½" active />
    </div>
  );
}

function SquarePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="가격 제곱 변화에서 일차 근사를 빼 남는 이차 항">
      <Box label="실제 제곱 변화" value="253.59" />
      <Arrow>−</Arrow>
      <Box label="일차 근사" value="252" />
      <Arrow>=</Arrow>
      <Box label="남은 제곱 몫" value="1.59" active />
    </div>
  );
}

function ItoPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="이토 공식의 시간 일차 이차 항">
      <Box label="시간" value="Vₜdt" />
      <Box label="기울기" value="VₛdS" />
      <Box label="굽음 보정" value="½Vₛₛ(dS)²" active />
    </div>
  );
}

function LedgersPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="실제 전망과 위험중립 가격 계산 장부 비교">
      <Box label="실제 전망 장부" value="실적·위험 프리미엄 · 실제 평균 미확정" />
      <Box label="무차익 가격 장부" value="금리 5% · 하루 평균 100.0198" active />
    </div>
  );
}

function ReplicatePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="옵션과 델타 주식의 무작위 항 상쇄">
      <Box label="옵션" value="델타×dS + 굽음" />
      <Arrow>−</Arrow>
      <Box label="델타 주식" value="델타×dS" />
      <Arrow>=</Arrow>
      <Box label="남은 장부" value="시간·굽음·금리" active />
    </div>
  );
}

function PricePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="복제 비용과 위험중립 할인 평균의 동일한 가격 관계">
      <Box label="복제 방식" value="주식·현금 조합의 오늘 비용" />
      <Arrow>=</Arrow>
      <Box label="위험중립 방식" value="만기 지급의 할인 평균" active />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="연속시간 복제 밖에 남는 네 시장 위험">
      <Box label="경로" value="부도·발표 뒤 점프" />
      <Box label="거래" value="불연속 조정·호가 차이" />
      <Box label="자금" value="차입·공매도 한도" active />
      <Box label="입력" value="변동성·상관 오차" />
    </div>
  );
}

export default function BrownianItoPricingMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="연속시간 가격 · 주가 100의 전체 지도"
      title="하루 흔들림 1.26에서 남는 제곱 몫 1.59가 옵션의 굽음 가격으로 이어집니다"
      description="연간 흔들림을 하루 크기로 바꾸고, 시간과 제곱근 시간의 차이에서 이토 보정을 확인한 뒤 실제 전망과 위험중립 장부를 나누고 복제로 무작위 항을 없애는 과정까지 이어 봅니다."
      note="주가 100·연간 흔들림 20%·거래일 252일·금리 5%는 작동 원리를 설명하기 위한 가정입니다. 하루 1.26과 가격 장부 평균 100.0198은 실제 내일 가격이나 수익률을 예측한 값이 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-brownian-ito-pricing-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "daily" && <DailyPanel />}
          {scene.panel === "time" && <TimePanel />}
          {scene.panel === "square" && <SquarePanel />}
          {scene.panel === "ito" && <ItoPanel />}
          {scene.panel === "ledgers" && <LedgersPanel />}
          {scene.panel === "replicate" && <ReplicatePanel />}
          {scene.panel === "price" && <PricePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="연속시간 가격 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
