import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["지급", "델타", "현금", "검산", "오늘", "가격 차이", "가중치", "등식"] as const;

const NOTES = [
  "오늘 100인 주식이 만기에 120 또는 80이 됩니다. 행사가 100인 콜은 두 상태에서 각각 20과 0을 지급합니다.",
  "콜 지급 차이 20을 주가 차이 40으로 나누면 주식 0.5주가 두 상태 사이의 지급 차이를 똑같이 만듭니다.",
  "주식 반 주만 들면 60 또는 40이 남습니다. 두 상태에서 각각 40을 빼야 콜의 20 또는 0과 맞으므로 40을 빌립니다.",
  "상승 상태에서는 0.5×120−40=20, 하락 상태에서는 0.5×80−40=0입니다. 복제 조합과 콜의 지급이 모두 같습니다.",
  "오늘 주식 반 주는 50이고 차입금은 40이므로 복제 비용은 10입니다. 같은 미래 지급을 가진 콜의 무차익 가격도 10입니다.",
  "콜이 14라면 10인 복제 조합을 사고 콜을 팔아 가격 차이 4를 잠글 수 있습니다. 실제 시장에서는 거래비용과 이행 제약을 먼저 뺍니다.",
  "주식 100이 120과 80의 가중평균이 되도록 만든 계산 가중치는 각각 0.5입니다. 실제 상승 가능성을 예측한 값이 아닙니다.",
  "같은 조건의 유럽형 콜·풋은 C+K=S+P를 만족합니다. 이 사례에서 C=10, S=K=100이므로 풋도 10입니다.",
] as const;

type Panel = "payoff" | "delta" | "cash" | "verify" | "today" | "gap" | "weight" | "parity";

const SCENES = [
  {
    title: "만기 주가 120과 80에서 콜은 각각 20과 0을 지급합니다",
    detail: "상품 이름보다 먼저 모든 미래 상태의 지급표를 적습니다.",
    panel: "payoff",
    formula: "콜 지급 = max(만기 주가 − 행사가 100, 0)",
    conclusion: "이 두 지급을 주식과 현금으로 똑같이 만들 수 있는지가 가격 계산의 출발점입니다.",
  },
  {
    title: "지급 차이 20을 주가 차이 40으로 나누면 주식 수량은 0.5주입니다",
    detail: "먼저 상승·하락 상태 사이의 높이 차이를 맞춥니다.",
    panel: "delta",
    formula: "델타 = (20−0) ÷ (120−80) = 0.5",
    conclusion: "주식 반 주는 만기 주가가 40 벌어질 때 가치가 20 벌어져 콜과 같은 폭으로 움직입니다.",
  },
  {
    title: "주식 반 주의 지급에서 40을 빼면 콜의 지급 높이까지 맞습니다",
    detail: "차이는 주식으로, 두 상태에 공통인 높이는 현금 차입으로 맞춥니다.",
    panel: "cash",
    formula: "상승 60−40=20 · 하락 40−40=0",
    conclusion: "금리 0인 설명용 시장에서는 오늘 40을 빌리고 만기에 같은 40을 갚습니다.",
  },
  {
    title: "상승과 하락 모두에서 콜과 복제 조합의 지급이 같습니다",
    detail: "한 상태만 비슷한 것이 아니라 관련된 모든 상태를 나란히 검산합니다.",
    panel: "verify",
    formula: "주식 0.5주 − 차입 40 ≡ 콜 1개",
    conclusion: "지급이 한 칸이라도 다르면 완전한 복제가 아니며 같은 가격을 강제할 수 없습니다.",
  },
  {
    title: "오늘 주식 반 주 50에서 빌린 돈 40을 빼 복제 비용 10을 얻습니다",
    detail: "미래의 두 식을 맞춘 뒤 오늘 거래할 수 있는 가격으로 돌아옵니다.",
    panel: "today",
    formula: "0.5×오늘 주가 100 − 차입 40 = 10",
    conclusion: "같은 만기 지급을 만드는 콜과 복제 조합은 오늘도 같은 가격이어야 합니다.",
  },
  {
    title: "콜 호가가 14라면 복제 비용 10과의 차이 4가 거래를 부릅니다",
    detail: "비싼 지급을 팔고 같은 지급을 더 싸게 만들어 가격 차이를 잠급니다.",
    panel: "gap",
    formula: "콜 매도 +14 − 복제 조합 매수 10 = 오늘 +4",
    conclusion: "만기에는 복제 조합의 20 또는 0으로 판 콜의 의무를 맞춥니다. 현실에서는 비용과 제약을 차감해야 합니다.",
  },
  {
    title: "0.5는 실제 상승 확률이 아니라 현재 주가를 맞추는 가격 계산용 가중치입니다",
    detail: "복제 계산과 시장 전망을 같은 확률로 읽지 않습니다.",
    panel: "weight",
    formula: "100 = 0.5×120 + 0.5×80 → 콜 10 = 0.5×20 + 0.5×0",
    conclusion: "위험중립 가중치는 무차익 가격을 기대값처럼 쓰게 하지만 실제 발생 가능성을 말하지 않습니다.",
  },
  {
    title: "같은 조건의 콜·풋·주식·현금은 풋콜 등식 하나로 연결됩니다",
    detail: "콜 한 개의 복제를 네 계약의 동일한 만기 지급 관계로 넓힙니다.",
    panel: "parity",
    formula: "C+K=S+P → 10+100=100+P → P=10",
    conclusion: "유럽형·같은 행사가와 만기·배당 없음·금리 0이라는 조건이 달라지면 등식의 항도 바뀝니다.",
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

function PayoffPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="만기 주가별 콜옵션 지급">
      <Box label="만기 주가 120" value="콜 지급 20" active />
      <Box label="만기 주가 80" value="콜 지급 0" />
    </div>
  );
}

function DeltaPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="콜 지급 차이를 주가 차이로 나누는 델타 계산">
      <Box label="지급 차이" value="20−0=20" />
      <Arrow>÷</Arrow>
      <Box label="주가 차이" value="120−80=40" />
      <Arrow>=</Arrow>
      <Box label="주식 수량" value="0.5주" active />
    </div>
  );
}

function CashPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="주식 반 주에서 차입금 40을 빼 콜 지급을 만드는 계산">
      <Box label="상승 상태" value="0.5×120−40=20" active />
      <Box label="하락 상태" value="0.5×80−40=0" active />
    </div>
  );
}

function VerifyPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="콜과 복제 조합의 두 상태 지급 비교">
      <div className="grid gap-2">
        <Box label="콜 1개" value="상승 20" />
        <Box label="콜 1개" value="하락 0" />
      </div>
      <Arrow>=</Arrow>
      <div className="grid gap-2">
        <Box label="주식 0.5주−차입 40" value="상승 20" active />
        <Box label="주식 0.5주−차입 40" value="하락 0" active />
      </div>
    </div>
  );
}

function TodayPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="오늘의 복제 비용 계산">
      <Box label="주식 반 주" value="50" />
      <Arrow>−</Arrow>
      <Box label="오늘 차입" value="40" />
      <Arrow>=</Arrow>
      <Box label="복제 비용" value="10" active />
    </div>
  );
}

function GapPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="콜 호가와 복제 비용의 가격 차이">
      <Box label="콜 매도" value="+14" />
      <Arrow>−</Arrow>
      <Box label="복제 조합 매수" value="−10" />
      <Arrow>=</Arrow>
      <Box label="오늘 가격 차이" value="+4" active />
    </div>
  );
}

function WeightPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="위험중립 가중치로 주식과 콜의 현재 가격을 맞추는 계산">
      <Box label="주식 가격" value="0.5×120+0.5×80=100" />
      <Arrow />
      <Box label="콜 가격" value="0.5×20+0.5×0=10" active />
    </div>
  );
}

function ParityPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="콜과 현금 묶음을 주식과 풋 묶음과 비교하는 풋콜 등식">
      <Box label="콜 + 행사가 현금" value="10+100=110" />
      <Arrow>=</Arrow>
      <Box label="주식 + 풋" value="100+10=110" active />
    </div>
  );
}

export default function OptionReplicationMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="옵션 복제 · 두 상태의 전체 지도"
      title="콜의 20과 0을 주식 반 주와 차입금 40으로 다시 만듭니다"
      description="만기 지급표에서 델타 0.5와 차입금 40을 구하고, 두 상태를 검산해 오늘 가격 10으로 돌아온 뒤 차익거래·위험중립 가중치·풋콜 등식까지 이어 봅니다."
      note="주가 100·만기 120 또는 80·행사가 100·금리 0은 작동 원리를 설명하기 위한 가정입니다. 실제 거래에는 배당, 금리, 호가 차이, 거래비용, 공매도·차입 제약과 행사 방식을 반영해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-option-replication-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "payoff" && <PayoffPanel />}
          {scene.panel === "delta" && <DeltaPanel />}
          {scene.panel === "cash" && <CashPanel />}
          {scene.panel === "verify" && <VerifyPanel />}
          {scene.panel === "today" && <TodayPanel />}
          {scene.panel === "gap" && <GapPanel />}
          {scene.panel === "weight" && <WeightPanel />}
          {scene.panel === "parity" && <ParityPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="옵션 복제 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
