import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["노출", "금액 일치", "기울기", "계약 수", "하락일", "표본", "베이시스", "경계"] as const;

const NOTES = [
  "석 달 뒤 팔 재고 1,000개의 현재 가치는 1억 원입니다. 가격이 1% 떨어지면 재고에서 약 100만 원의 손실이 생깁니다.",
  "선물 한 계약의 가치가 250만 원이면 금액만 맞춘 출발점은 1억 원을 250만 원으로 나눈 40계약입니다.",
  "같은 기간의 현물·선물 변화를 맞춰 보니 회귀 기울기가 0.8이라고 가정합니다. 이는 공분산을 선물 변화의 분산으로 나눈 값이며 가격 방향 예측은 아닙니다.",
  "금액 일치 40계약에 기울기 0.8을 곱해 선물 32계약을 매도합니다. 계약 단위와 담보 한도는 그다음에 반영합니다.",
  "현물이 2% 떨어지고 선물이 1.6% 떨어진 날, 재고 손실은 200만 원이고 32계약 매도 이익은 128만 원이어서 72만 원이 남습니다.",
  "같은 날 40계약을 팔았다면 남은 손실은 40만 원으로 더 작습니다. 그래도 여러 날을 합친 표본의 잔여 분산은 32계약에서 더 작을 수 있습니다.",
  "품질·지역·만기가 다르거나 공급 충격이 생기면 과거 기울기 0.8이 깨집니다. 이 차이가 움직이는 위험이 베이시스 위험입니다.",
  "최소분산은 선택한 표본의 평균 제곱 흔들림을 줄입니다. 꼬리손실·담보 현금·거래 중단·법률 위험을 함께 최소화하지는 않습니다.",
] as const;

type Panel = "exposure" | "notional" | "slope" | "contracts" | "day" | "sample" | "basis" | "boundary";

const SCENES = [
  {
    title: "재고 가치 1억 원은 가격이 1% 떨어질 때 약 100만 원을 잃습니다",
    detail: "헤지 계약보다 먼저 실제로 흔들리는 재고 장부를 확인합니다.",
    panel: "exposure",
    formula: "재고 1억 원 × 가격 하락 1% = 손실 100만 원",
    conclusion: "목표는 선물 수익을 키우는 일이 아니라 재고와 선물을 합친 손익의 흔들림을 줄이는 일입니다.",
  },
  {
    title: "계약 한 개가 250만 원이면 금액만 맞춘 출발점은 40계약입니다",
    detail: "현물과 선물이 얼마나 함께 움직이는지 넣기 전의 단순 수량입니다.",
    panel: "notional",
    formula: "1억 원 ÷ 계약당 250만 원 = 40계약",
    conclusion: "금액이 같아도 두 가격의 변화 폭이 다르면 40계약이 최소분산 수량은 아닙니다.",
  },
  {
    title: "현물·선물 변화의 회귀 기울기를 0.8로 구해 함께 움직이는 폭을 넣습니다",
    detail: "같은 날짜와 단위의 여러 관측값에서 잔여 흔들림이 가장 작은 직선 기울기를 찾습니다.",
    panel: "slope",
    formula: "h* = 공분산(현물, 선물) ÷ 선물 변화의 분산 = 0.8",
    conclusion: "한 날의 −2%와 −1.6%도 0.8 방향을 보여 주지만 실제 기울기는 전체 표본에서 계산합니다.",
  },
  {
    title: "금액 일치 40계약에 기울기 0.8을 곱해 32계약을 매도합니다",
    detail: "노출 가치·계약 가치·가격 관계를 한 줄의 계약 수로 연결합니다.",
    panel: "contracts",
    formula: "0.8 × 1억 원 ÷ 250만 원 = 32계약 매도",
    conclusion: "32는 가격 방향을 맞히는 수가 아니라 선택한 표본에서 잔여 분산을 줄인 설명용 수량입니다.",
  },
  {
    title: "현물 −2%·선물 −1.6%인 날 32계약은 128만 원을 벌어 손실 72만 원을 남깁니다",
    detail: "재고 손실과 선물 매도 이익을 같은 원화 장부에서 상계합니다.",
    panel: "day",
    formula: "−200만 원 + 8,000만 원×1.6% = −72만 원",
    conclusion: "헤지는 손실을 반드시 0으로 만드는 계약이 아니라 함께 움직이는 만큼 흔들림을 줄입니다.",
  },
  {
    title: "같은 날 40계약의 손실은 40만 원뿐이어도 전체 표본의 최적 수량은 32일 수 있습니다",
    detail: "한 번의 결과와 여러 날의 분산을 서로 다른 평가로 놓습니다.",
    panel: "sample",
    formula: "한 날의 잔여손실: 32계약 72만 원 · 40계약 40만 원",
    conclusion: "최소분산은 가장 잘 맞은 하루를 고르는 규칙이 아니라 표본 전체의 제곱 오차를 줄이는 규칙입니다.",
  },
  {
    title: "품질·지역·만기나 공급 환경이 달라지면 기울기 0.8과 32계약도 다시 계산해야 합니다",
    detail: "실제 노출과 표준 선물의 차이가 움직이는 베이시스 위험을 봅니다.",
    panel: "basis",
    formula: "자료 갱신 → 기울기 재추정 → 계약 수·담보 검토 → 재조정",
    conclusion: "자주 고치면 관계 변화에 빨리 대응하지만 거래비용과 증거금 현금이 늘어납니다.",
  },
  {
    title: "작은 과거 분산은 꼬리손실·현금 부족·거래 중단까지 작다는 뜻이 아닙니다",
    detail: "수학적 목표와 실제로 계약을 유지할 능력을 구분합니다.",
    panel: "boundary",
    formula: "최소 표본분산 ≠ 최소 꼬리손실 ≠ 최소 담보현금 ≠ 미래 보장",
    conclusion: "좋은 보고서는 수량과 함께 자료 기간, 기울기 오차, 재조정 기준과 한 계약당 담보 부담을 보여 줍니다.",
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

function ExposurePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="재고 가치가 1퍼센트 떨어질 때 생기는 손실">
      <Box label="석 달 뒤 팔 재고" value="1,000개 · 현재 1억 원" />
      <Arrow />
      <Box label="가격 −1%" value="손실 약 100만 원" active />
    </div>
  );
}

function NotionalPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="재고 금액을 선물 한 계약 가치로 나누는 계산">
      <Box label="재고 가치" value="1억 원" />
      <Arrow>÷</Arrow>
      <Box label="계약 한 개" value="250만 원" />
      <Arrow>=</Arrow>
      <Box label="금액 일치" value="40계약" active />
    </div>
  );
}

function SlopePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="현물과 선물 변화의 공분산을 선물 분산으로 나눈 기울기">
      <Box label="함께 움직임" value="공분산" />
      <Arrow>÷</Arrow>
      <Box label="선물 흔들림" value="분산" />
      <Arrow>=</Arrow>
      <Box label="회귀 기울기" value="0.8" active />
    </div>
  );
}

function ContractsPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="금액 일치 계약 수에 회귀 기울기를 곱한 최소분산 수량">
      <Box label="금액 일치" value="40계약" />
      <Arrow>×</Arrow>
      <Box label="기울기" value="0.8" />
      <Arrow>=</Arrow>
      <Box label="최소분산 수량" value="32계약 매도" active />
    </div>
  );
}

function DayPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="현물 하락일의 재고 손실과 선물 매도 이익">
      <Box label="재고 −2%" value="−200만 원" />
      <Arrow>+</Arrow>
      <Box label="선물 −1.6%" value="매도 이익 +128만 원" />
      <Arrow>=</Arrow>
      <Box label="남은 손실" value="−72만 원" active />
    </div>
  );
}

function SamplePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="한 날의 남은 손실과 전체 표본의 분산 비교">
      <Box label="32계약" value="이날 손실 72만 원 · 표본 전체로 선택" active />
      <Box label="40계약" value="이날 손실 40만 원 · 한 날에는 더 작음" />
    </div>
  );
}

function BasisPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="베이시스 변화 뒤 헤지 계약을 다시 계산하는 순서">
      <Box label="실제 노출" value="품질·지역·판매일" />
      <Arrow>≠</Arrow>
      <Box label="표준 선물" value="규격·인도지·만기" active />
      <Arrow />
      <Box label="재추정" value="0.8과 32계약 갱신" />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="최소분산 계산 밖에 남는 네 위험">
      <Box label="표본" value="기간·이상값·오차" />
      <Box label="꼬리" value="급변·비선형 손실" />
      <Box label="현금" value="증거금·거래비용" active />
      <Box label="실행" value="거래 중단·법률" />
    </div>
  );
}

export default function MinimumVarianceHedgeMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="최소분산 헤지 · 재고 1억 원의 전체 지도"
      title="금액을 똑같이 맞추지 않고 두 가격이 함께 움직인 기록으로 계약 수를 정합니다"
      description="재고 1억 원과 계약당 250만 원에서 40계약을 구하고, 현물·선물 변화의 기울기 0.8을 적용해 32계약을 만든 뒤 한 날의 손익·전체 표본·베이시스 변화·재조정 경계까지 이어 봅니다."
      note="가격·기울기·계약가치는 작동 원리를 설명하기 위한 가정입니다. 실제 수량은 같은 단위와 시각의 자료, 계약 규격, 표본 오차, 거래비용, 증거금과 회사의 손실 한도를 함께 반영해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-minimum-variance-hedge-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "exposure" && <ExposurePanel />}
          {scene.panel === "notional" && <NotionalPanel />}
          {scene.panel === "slope" && <SlopePanel />}
          {scene.panel === "contracts" && <ContractsPanel />}
          {scene.panel === "day" && <DayPanel />}
          {scene.panel === "sample" && <SamplePanel />}
          {scene.panel === "basis" && <BasisPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="최소분산 헤지 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
