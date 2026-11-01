import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["호가", "역산", "한 달", "스큐", "만기", "장부", "검사", "경계"] as const;

const NOTES = [
  "내재변동성의 출발점은 미래 가격 예측이 아니라 현재 옵션의 매수·매도 호가입니다. 행사가·만기·평가 시각과 함께 보존해야 합니다.",
  "기초자산, 선도값, 할인과 배당을 고정하고 모형가격이 시장가격과 같아지는 변동성을 수치적으로 찾습니다. 직접 관측한 변동성이 아닙니다.",
  "한 달 만기에서 행사가 90·100·110의 역산값을 30%·20%·24%로 놓습니다. 한 만기의 여러 점을 이으면 변동성 곡선이 됩니다.",
  "비슷한 절댓값의 델타라고 가정하면 110 콜 24%에서 90 풋 30%를 뺀 위험반전은 −6%포인트입니다. 하락 위험 가격이 더 높은 비대칭입니다.",
  "중앙 행사가의 한 달·세 달·여섯 달 값을 20%·22%·24%로 쌓으면 만기 방향의 시간 구조가 생깁니다. 행사가와 만기 두 축을 합친 것이 표면입니다.",
  "90 풋을 팔고 110 콜을 산 장부는 중앙 변동성이 그대로여도 하락 날개만 오르면 손실이 날 수 있습니다. 표면의 평행 이동뿐 아니라 기울기·굽음·만기 충격을 봐야 합니다.",
  "호가를 거른 뒤 각 점을 역산하고 빈 칸을 보간합니다. 만든 표면으로 기준 옵션을 다시 가격 내 호가 오차와 행사가·만기 방향의 무차익 조건을 검사합니다.",
  "매끈한 빈 구간은 관측값이 아니라 모형 결과입니다. 기준 시각, 좌표, 사용 호가, 보간법, 유동성 공백과 대용 표면을 기록해야 하며 표면은 미래 확률 예언이 아닙니다.",
] as const;

type Panel = "quotes" | "invert" | "slice" | "skew" | "tenor" | "book" | "checks" | "boundary";

const SCENES = [
  {
    title: "표면은 행사가·만기별 현재 옵션 호가에서 시작합니다",
    detail: "같은 시각의 매수·매도 가격과 거래 상태를 먼저 모읍니다.",
    panel: "quotes",
    formula: "호가 + 행사가 K + 만기 T + 선도·할인·배당 입력",
    conclusion: "오래된 호가와 거래가 드문 점을 그대로 섞으면 매끈해 보여도 잘못된 표면이 됩니다.",
  },
  {
    title: "시장가격을 다시 만드는 변동성을 한 점씩 거꾸로 찾습니다",
    detail: "나머지 입력을 고정하고 모형가격과 시장가격의 차이가 0이 되게 풉니다.",
    panel: "invert",
    formula: "모형가격(K,T,σᵢₘₚ)=시장가격",
    conclusion: "역산된 σᵢₘₚ는 가격을 다른 단위로 표현한 값이며 과거 수익률에서 직접 잰 변동성과 다릅니다.",
  },
  {
    title: "한 달 만기의 90·100·110 행사가에는 30%·20%·24%가 놓입니다",
    detail: "한 만기 안에서 중앙과 두 날개의 상대가격을 곡선으로 읽습니다.",
    panel: "slice",
    formula: "K=90 → 30% · K=100 → 20% · K=110 → 24%",
    conclusion: "중앙보다 양쪽 날개가 높고 하락 날개가 더 높은 비대칭 모양입니다.",
  },
  {
    title: "상승 쪽 24%에서 하락 쪽 30%를 빼면 스큐는 −6%포인트입니다",
    detail: "같은 만기와 비슷한 절댓값의 델타라는 조건 아래 두 날개의 차이를 봅니다.",
    panel: "skew",
    formula: "위험반전 = 110 콜 24% − 90 풋 30% = −6%p",
    conclusion: "−6은 하락 위험의 상대가격이 높다는 뜻이지 실제 하락 확률을 그대로 뜻하지 않습니다.",
  },
  {
    title: "한 달·세 달·여섯 달 중앙값 20%·22%·24%를 쌓아 시간축을 만듭니다",
    detail: "각 만기의 행사가 곡선을 세로로 쌓으면 두 축의 변동성 표면이 됩니다.",
    panel: "tenor",
    formula: "표면 좌표 = 행사가 또는 델타 × 만기",
    conclusion: "주가가 바뀌면 고정 행사가 대신 선도 대비 비율이나 델타로 좌표를 맞춰야 단순 이동과 모양 변화를 나눌 수 있습니다.",
  },
  {
    title: "중앙값이 그대로여도 하락 날개만 오르면 옵션 장부 손익이 바뀝니다",
    detail: "평행 이동 하나가 아니라 날개 기울기와 만기별 충격을 각 포지션 민감도에 적용합니다.",
    panel: "book",
    formula: "표면 손익 근사 = Σ(각 옵션 베가 × 해당 좌표의 변동성 충격)",
    conclusion: "중앙 베가 하나만 보고하면 풋 날개와 장기 옵션에 숨어 있는 위험을 놓칠 수 있습니다.",
  },
  {
    title: "역산·보간 뒤 기준 옵션을 다시 가격 내고 무차익 조건을 검사합니다",
    detail: "매끈한 그림보다 원래 호가를 재현하고 모순된 가격을 만들지 않는지가 먼저입니다.",
    panel: "checks",
    formula: "호가 선별 → 역산 → 보간 → 재가격 → 단조성·볼록성 검사",
    conclusion: "새 호가가 들어오면 보정 결과와 빈 구간의 변화, 장부 손익 영향을 다시 검증합니다.",
  },
  {
    title: "빈 칸의 매끈한 값은 관측이 아니라 보간과 모형의 결과입니다",
    detail: "현재 상대가격 지도와 미래 변동성 예측을 구분하고 데이터 공백을 표시합니다.",
    panel: "boundary",
    formula: "관측 호가 ≠ 보간값 ≠ 미래 실현변동성",
    conclusion: "평가 시각, 좌표, 사용 호가, 보간법, 유동성 공백과 대용 표면을 함께 남겨야 합니다.",
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

function QuotesPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="행사가와 만기가 다른 세 옵션 호가">
      <Box label="90 풋" value="매수·매도 호가" />
      <Box label="100 중앙" value="매수·매도 호가" active />
      <Box label="110 콜" value="매수·매도 호가" />
    </div>
  );
}

function InvertPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]" aria-label="시장가격에서 내재변동성을 역산하는 반복">
      <Box label="시장가격" value="관측 호가" />
      <span className="hidden sm:flex"><Arrow>−</Arrow></span>
      <Box label="모형가격" value="σ를 바꿔 계산" />
      <span className="hidden sm:flex"><Arrow>→</Arrow></span>
      <Box label="가격차 0" value="σᵢₘₚ 확정" active />
    </div>
  );
}

function SlicePanel() {
  const points = [
    { strike: "90 풋", vol: "30%", height: "h-20" },
    { strike: "100 중앙", vol: "20%", height: "h-12" },
    { strike: "110 콜", vol: "24%", height: "h-16" },
  ] as const;
  return (
    <div className="grid grid-cols-3 items-end gap-3 border-b border-border px-2 pb-2 sm:gap-6 sm:px-8" aria-label="한 달 만기의 행사가별 내재변동성 곡선">
      {points.map((point, index) => (
        <div key={point.strike} className="flex min-w-0 flex-col items-center gap-1.5">
          <span className="text-[10px] font-black sm:text-sm">{point.vol}</span>
          <span className={`w-full border border-foreground/50 ${point.height} ${index === 1 ? "bg-muted/45" : "bg-transparent"}`} />
          <span className="break-keep text-center text-[9px] font-bold text-muted-foreground sm:text-xs">{point.strike}</span>
        </div>
      ))}
    </div>
  );
}

function SkewPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]" aria-label="풋과 콜 내재변동성의 위험반전 계산">
      <Box label="110 콜" value="24%" />
      <span className="hidden sm:flex"><Arrow>−</Arrow></span>
      <Box label="90 풋" value="30%" />
      <span className="hidden sm:flex"><Arrow>=</Arrow></span>
      <Box label="위험반전" value="−6%p" active />
    </div>
  );
}

function TenorPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="중앙 행사가의 만기별 내재변동성 시간 구조">
      <Box label="1개월" value="20%" />
      <Box label="3개월" value="22%" />
      <Box label="6개월" value="24%" active />
    </div>
  );
}

function BookPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="하락 날개 충격이 옵션 포트폴리오에 전달되는 과정">
      <Box label="표면 충격" value="90 풋 날개만 +3%p" />
      <Arrow />
      <Box label="장부 영향" value="풋 매도 손실 · 중앙값은 그대로" active />
    </div>
  );
}

function ChecksPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="내재변동성 표면을 만드는 네 단계">
      <Box label="1. 입력" value="호가·선도·할인" />
      <Box label="2. 계산" value="점별 역산·보간" />
      <Box label="3. 재가격" value="원래 호가 오차" active />
      <Box label="4. 제약" value="단조성·볼록성" />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="표면에서 구분해야 할 관측과 모형 결과">
      <Box label="관측" value="거래 가능한 호가" active />
      <Box label="보간" value="빈 좌표의 모형값" />
      <Box label="대용" value="다른 종목·지수 표면" />
      <Box label="미래" value="실현변동성 미확정" />
    </div>
  );
}

export default function VolatilitySurfaceMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="내재변동성 표면 · 한 달 옵션 세 점의 전체 지도"
      title="90·100·110 행사가의 30%·20%·24%를 만기별 표면으로 쌓습니다"
      description="옵션 호가를 변동성으로 역산하고 한 만기의 스큐를 계산한 뒤 여러 만기를 쌓아 표면을 만들고, 포트폴리오 충격과 보간·재가격·무차익 검사를 이어 봅니다."
      note="30%·20%·24%와 한 달·세 달·여섯 달 중앙값 20%·22%·24%는 작동 원리를 설명하기 위한 가정입니다. 실제 표면은 같은 평가 시각의 거래 가능한 호가와 일관된 선도·할인·배당 입력으로 만들어야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-volatility-surface-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "quotes" && <QuotesPanel />}
          {scene.panel === "invert" && <InvertPanel />}
          {scene.panel === "slice" && <SlicePanel />}
          {scene.panel === "skew" && <SkewPanel />}
          {scene.panel === "tenor" && <TenorPanel />}
          {scene.panel === "book" && <BookPanel />}
          {scene.panel === "checks" && <ChecksPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="내재변동성 표면 생성 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
