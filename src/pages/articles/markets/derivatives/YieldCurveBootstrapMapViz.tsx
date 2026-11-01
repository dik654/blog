import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["입력", "1년", "차감", "2년", "금리", "다중", "헤지", "경계"] as const;

const NOTES = [
  "1년 뒤 100을 주는 무이표채의 오늘 가격 96과, 1년 뒤 5·2년 뒤 105를 지급하는 2년 고정금리 5% 계약에서 시작합니다.",
  "1년 무이표채에서 1년 할인계수 DF₁=96÷100=0.96을 바로 읽습니다. 미래 1원의 오늘값이 0.96이라는 뜻입니다.",
  "2년 고정 지급의 첫 쿠폰 5는 오늘 5×0.96=4.8입니다. 전체 현재가치 100에서 이를 빼면 마지막 지급이 설명할 95.2가 남습니다.",
  "마지막 지급 105가 오늘 95.2가 되어야 하므로 DF₂=95.2÷105≈0.9067입니다. 4.8+105×0.9067≈100으로 원래 가격을 다시 만듭니다.",
  "2년 스왑 고정금리 5%, DF₂를 연복리로 바꾼 무이표금리 약 5.02%, DF₁÷DF₂−1로 구한 1년 뒤 1년 선도금리 약 5.88%는 서로 다른 질문입니다.",
  "담보 현금흐름은 담보 이자에 맞는 곡선으로 할인하고, 기준금리 지급은 별도 예상 곡선으로 전망할 수 있습니다. 두 곡선을 한 줄의 금리로 합치지 않습니다.",
  "곡선 전체의 듀레이션만 0으로 맞추면 2년과 10년 지점이 반대 방향으로 움직이는 위험은 남습니다. 핵심만기별 민감도에 맞는 계약을 따로 배치합니다.",
  "실제 곡선은 결제일, 일수계산, 휴일, 복리, 보간과 유동성 공백에 민감합니다. 각 기준상품을 다시 가격 내고 입력·순서·오차를 기록해야 합니다.",
] as const;

type Panel = "inputs" | "df1" | "subtract" | "df2" | "rates" | "multi" | "hedge" | "boundary";

const SCENES = [
  {
    title: "1년 가격 96과 2년 고정 지급 5·105를 같은 장부에 놓습니다",
    detail: "짧은 만기의 이미 아는 가격부터 다음 만기의 미지수를 차례로 풉니다.",
    panel: "inputs",
    formula: "1년: 100 ↔ 오늘 96 · 2년: 5와 105 ↔ 오늘 100",
    conclusion: "부트스트랩은 여러 지급이 섞인 장기 상품에서 앞서 푼 지급의 가치를 먼저 떼어 내는 과정입니다.",
  },
  {
    title: "1년 뒤 100의 오늘 가격이 96이므로 DF₁은 0.96입니다",
    detail: "할인계수는 미래 1원을 오늘 얼마로 보는지를 나타냅니다.",
    panel: "df1",
    formula: "DF₁ = 96 ÷ 100 = 0.96",
    conclusion: "이제 1년 시점에 지급되는 모든 현금흐름을 같은 기준으로 오늘 가치로 바꿀 수 있습니다.",
  },
  {
    title: "2년 계약의 첫 쿠폰 5는 오늘 4.8이고 전체 가격에서 95.2가 남습니다",
    detail: "이미 아는 DF₁로 첫 지급을 할인한 뒤 미지의 2년 지급만 남깁니다.",
    panel: "subtract",
    formula: "5×0.96=4.8 · 100−4.8=95.2",
    conclusion: "95.2는 2년 뒤 마지막 105가 오늘 설명해야 하는 현재가치입니다.",
  },
  {
    title: "95.2를 마지막 지급 105로 나누면 DF₂는 약 0.9067입니다",
    detail: "구한 할인계수로 원래 두 지급의 현재가치가 100으로 돌아오는지 확인합니다.",
    panel: "df2",
    formula: "DF₂=95.2÷105≈0.9067 · 4.8+105×0.9067≈100",
    conclusion: "재가격이 맞지 않으면 지급주기, 단위, 일수계산이나 시장 관행을 잘못 넣었는지 확인합니다.",
  },
  {
    title: "스왑 5%·2년 무이표 5.02%·1년 뒤 선도 5.88%는 서로 다른 금리입니다",
    detail: "같은 두 할인계수에서 현재의 평균 금리와 미래 한 구간의 금리를 나눠 읽습니다.",
    panel: "rates",
    formula: "z₂≈(1÷0.9067)^(1/2)−1=5.02% · f₁,₂≈0.96÷0.9067−1=5.88%",
    conclusion: "2년 스왑금리 5%를 모든 지급을 할인하는 하나의 금리로 다시 쓰면 각 숫자의 뜻이 섞입니다.",
  },
  {
    title: "담보 할인 곡선과 기준금리 지급 예상 곡선을 서로 다른 장부로 둡니다",
    detail: "현금흐름을 오늘로 옮기는 일과 미래 변동지급을 예상하는 일을 분리합니다.",
    panel: "multi",
    formula: "거래가치 = 예상 곡선으로 만든 지급 × 담보 곡선의 할인계수",
    conclusion: "통화·담보·기준금리가 다르면 각 곡선의 입력 상품과 베이시스 위험도 따로 관리합니다.",
  },
  {
    title: "2년과 10년 위험을 따로 움직여 각 만기에 맞는 헤지를 배치합니다",
    detail: "총 듀레이션 하나가 0이어도 곡선의 기울기와 굽음 위험은 남을 수 있습니다.",
    panel: "hedge",
    formula: "핵심만기 손익 ≈ Σ(만기별 민감도 × 해당 지점의 금리 충격)",
    conclusion: "2년 위험은 단기 수단으로, 10년 위험은 장기 수단으로 맞추고 잔여 베이시스를 다시 봅니다.",
  },
  {
    title: "입력 상품을 다시 가격 내고 보간·관행·유동성 공백을 함께 기록합니다",
    detail: "매끈한 곡선보다 원래 시장가격을 재현하고 변경 원인을 설명할 수 있는지가 중요합니다.",
    panel: "boundary",
    formula: "입력 정렬 → 순차 계산 → 보간 → 재가격 → 핵심만기 충격",
    conclusion: "평가 시각, 결제일, 일수계산, 복리, 보간법과 재가격 오차가 없으면 같은 곡선을 다시 만들 수 없습니다.",
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

function InputsPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="1년 무이표채와 2년 고정금리 계약의 시장 입력">
      <Box label="1년 무이표채" value="1년 뒤 100 · 오늘 96" active />
      <Box label="2년 고정 지급" value="1년 5 · 2년 105 · 오늘 100" />
    </div>
  );
}

function Df1Panel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="1년 무이표채에서 할인계수를 읽는 계산">
      <Box label="미래 지급" value="100" />
      <Arrow>→</Arrow>
      <Box label="오늘 가격과 계수" value="96 · DF₁=0.96" active />
    </div>
  );
}

function SubtractPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]" aria-label="2년 계약 가격에서 첫 쿠폰 현재가치를 빼는 계산">
      <Box label="전체 현재가치" value="100" />
      <span className="hidden sm:flex"><Arrow>−</Arrow></span>
      <Box label="첫 지급 현재가치" value="5×0.96=4.8" />
      <span className="hidden sm:flex"><Arrow>=</Arrow></span>
      <Box label="마지막 지급 몫" value="95.2" active />
    </div>
  );
}

function Df2Panel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="마지막 지급 현재가치에서 2년 할인계수를 구하는 계산">
      <Box label="2년 뒤 지급" value="105" />
      <Arrow>→</Arrow>
      <Box label="오늘가치·할인계수" value="95.2 · DF₂≈0.9067" active />
    </div>
  );
}

function RatesPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="스왑금리 무이표금리 선도금리 비교">
      <Box label="2년 스왑" value="5.00%" />
      <Box label="2년 무이표" value="약 5.02%" />
      <Box label="1년 뒤 1년 선도" value="약 5.88%" active />
    </div>
  );
}

function MultiPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="미래 지급 예상과 현재가치 할인의 두 곡선">
      <Box label="예상 곡선" value="미래 기준금리 지급 계산" />
      <Arrow>×</Arrow>
      <Box label="담보 할인 곡선" value="각 지급을 오늘가치로 변환" active />
    </div>
  );
}

function HedgePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="곡선의 핵심만기별 민감도와 헤지">
      <Box label="2년 충격" value="2년 민감도" active />
      <Box label="2년 헤지" value="단기 선물·스왑" />
      <Box label="10년 충격" value="10년 민감도" />
      <Box label="10년 헤지" value="장기 선물·스왑" />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="금리곡선 계산의 네 검증 경계">
      <Box label="계약 관행" value="결제·일수·복리" />
      <Box label="자료" value="호가 시각·유동성" />
      <Box label="모형" value="보간·외삽" />
      <Box label="검산" value="재가격·만기 충격" active />
    </div>
  );
}

export default function YieldCurveBootstrapMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="금리곡선 · 1년 가격 96에서 시작하는 전체 지도"
      title="첫 지급 4.8을 빼고 2년 할인계수 0.9067을 차례로 풉니다"
      description="1년 할인계수 0.96에서 출발해 2년 고정 지급의 첫 쿠폰을 떼고 DF₂를 구한 뒤 무이표·선도금리를 나누고, 할인·예상 곡선과 핵심만기 헤지까지 이어 봅니다."
      note="1년 무이표채 가격 96과 2년 고정금리 5%는 작동 원리를 설명하기 위한 가정입니다. 실제 곡선은 정확한 지급주기·결제일·일수계산·복리·담보 조건과 거래 가능한 시장자료로 만듭니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-yield-curve-bootstrap-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "inputs" && <InputsPanel />}
          {scene.panel === "df1" && <Df1Panel />}
          {scene.panel === "subtract" && <SubtractPanel />}
          {scene.panel === "df2" && <Df2Panel />}
          {scene.panel === "rates" && <RatesPanel />}
          {scene.panel === "multi" && <MultiPanel />}
          {scene.panel === "hedge" && <HedgePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="금리곡선 부트스트랩 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
