import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["열흘", "장부", "250일", "두 손익", "귀속", "검사", "수정", "경계"] as const;

const NOTES = [
  "위험값 5와 열흘 손실 1·2·6·3·7·2·1·8·4·3을 비교하면 6·7·8의 세 날이 문턱을 넘습니다. 열흘은 작동 원리를 보는 설명용 표본입니다.",
  "위험값은 어제 장부의 다음 날 손실 문턱이고, 가상 손익은 어제 포지션을 고정한 결과, 실제 손익은 장중 거래까지 포함한 결과, 모형 손익은 위험요인만으로 다시 가격 낸 결과입니다.",
  "바젤의 250일 표에서는 예외 0~4번이 green, 5~9번이 amber, 10번 이상이 red입니다. 예외 7번은 amber이고 연동 승수는 1.83입니다.",
  "가상 손실 6에 장중 헤지 이익 2가 더해져 실제 손실이 4가 되면, 위험값 5에 대해 가상 손익만 예외이고 실제 손익은 예외가 아닙니다.",
  "P&L 귀속 검사는 같은 250일의 가상 손익과 위험이론 손익이 비슷한 순서와 분포를 보이는지 검사합니다. 예외 수를 세는 백테스트와 다른 질문입니다.",
  "백테스트는 손실 문턱을, P&L 귀속 검사는 장부 설명력을, 독립 검증은 개념·자료·구현·사용과 실제 변경 권한을 검사합니다.",
  "예외 한 건은 거래 누락, 가격 시각과 단위, 위험요인, 장중 거래와 운영 원인으로 분해한 뒤 수정·독립 검증·승인·지속 감시로 이어집니다.",
  "정확한 모형도 우연히 예외를 낼 수 있고 부정확한 모형도 평온한 표본에서 통과할 수 있습니다. 색깔은 조사 시작점이지 참이라는 증명서가 아닙니다.",
] as const;

type Panel = "tenDays" | "ledgers" | "zones" | "twoPnl" | "pla" | "checks" | "repair" | "boundary";

const SCENES = [
  {
    title: "열흘 손실 가운데 6·7·8이 위험값 5를 넘어 예외 세 건이 됩니다",
    detail: "어제 계산한 문턱과 다음 날 손실을 같은 장부·날짜·단위로 맞춘 뒤 초과한 날을 표시합니다.",
    panel: "tenDays",
    formula: "손실 > 5인 날 = 3일째 6 · 5일째 7 · 8일째 8",
    conclusion: "열흘의 예외 3건은 계산 원리를 보여 주지만 250일 감독 구간에 바로 대입할 표본은 아닙니다.",
  },
  {
    title: "위험값·가상·실제·모형 손익은 같은 숫자의 다른 이름이 아닙니다",
    detail: "각 값이 어느 포지션과 시장요인, 장중 거래를 포함하는지 먼저 고정해야 비교가 성립합니다.",
    panel: "ledgers",
    formula: "어제 장부 → 위험값 5 · 오늘 시장 → 가상 손익 · 장중 거래 포함 → 실제 손익 · 위험요인만 → 모형 손익",
    conclusion: "손익 정의를 섞으면 예외가 모형 때문인지 거래 활동이나 장부 변경 때문인지 알 수 없습니다.",
  },
  {
    title: "250일에 예외 7번이면 amber 구간이고 연동 승수는 1.83입니다",
    detail: "현행 99% 하루 위험값의 감독 표는 설명용 열흘과 별도로 최근 250개 관측을 사용합니다.",
    panel: "zones",
    formula: "0~4 green · 5~9 amber · 10 이상 red · 7회 → amber · 1.83",
    conclusion: "amber는 자동 실패 판정이 아니라 정확한 모형보다 이런 결과가 나올 가능성이 더 크므로 원인을 조사하라는 신호입니다.",
  },
  {
    title: "같은 날 가상 손실 6은 예외지만 실제 손실 4는 예외가 아닙니다",
    detail: "어제 포지션의 시장 손실 6에 장중 헤지 이익 2가 더해지면 실제 장부의 손실은 4로 줄어듭니다.",
    panel: "twoPnl",
    formula: "가상 손익 = −6 · 장중 헤지 = +2 · 실제 손익 = −4 · 위험값 = 5",
    conclusion: "가상 손익은 어제 장부의 위험 포착력을 보고 실제 손익은 그날 거래 활동까지 포함한 결과를 봅니다.",
  },
  {
    title: "가상 손익과 위험이론 손익이 같은 날 같은 방향으로 움직이는지 비교합니다",
    detail: "순위가 함께 움직이는지와 두 경험분포의 차이를 보면 위험모형이 가격 장부의 일상 변화를 얼마나 설명하는지 알 수 있습니다.",
    panel: "pla",
    formula: "같은 250일 · 같은 거래데스크 · 가상 손익 ↔ 위험이론 손익 · 순위와 분포 비교",
    conclusion: "예외가 적어도 두 손익이 계속 어긋나면 위험요인 누락이나 평가 방식 차이를 조사해야 합니다.",
  },
  {
    title: "세 검사는 각각 손실 문턱·장부 설명력·조직의 반박 기능을 봅니다",
    detail: "통계 결과 하나에 모든 책임을 맡기지 않고 서로 다른 질문과 후속 조치를 분리합니다.",
    panel: "checks",
    formula: "백테스트 ≠ P&L 귀속 검사 ≠ 독립 검증",
    conclusion: "독립 검증은 계산을 다시 돌리는 데서 끝나지 않고 개념·자료·구현·사용을 비판해 실제 변경을 요구할 수 있어야 합니다.",
  },
  {
    title: "예외 한 건을 원인으로 분해하고 수정·승인·지속 감시까지 연결합니다",
    detail: "거래 누락과 가격 자료, 위험요인, 장중 거래와 운영 문제를 같은 날짜와 장부에서 재현합니다.",
    panel: "repair",
    formula: "예외 → 재현 → 원인 분류 → 수정 → 독립 검증·승인 → 지속 감시",
    conclusion: "한도를 낮추거나 손익 정의를 바꿔 표면의 예외만 없애면 모형의 실제 결함은 남습니다.",
  },
  {
    title: "통과 색깔만으로 모형이 참이라고 결론내리지 않습니다",
    detail: "표본 오차, 시장 체제 변화, 거래데스크별 집중과 공통 자료 의존을 함께 남깁니다.",
    panel: "boundary",
    formula: "판정 결과 + 원인 증거 + 수정 책임자 + 버전·시행일 + 지속 감시",
    conclusion: "좋은 검증은 색깔보다 어떤 장부를 검사했고 왜 어긋났으며 누가 언제 무엇을 고쳤는지 다시 확인할 수 있게 합니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Box({ label, value, active = false, danger = false }: { label: string; value: string; active?: boolean; danger?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${danger ? "text-destructive" : active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function TenDaysPanel() {
  const losses = [1, 2, 6, 3, 7, 2, 1, 8, 4, 3];
  return (
    <div className="space-y-2.5" aria-label="위험값 5와 열흘 손실의 예외 비교">
      <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground sm:text-xs">
        <span>위험값 5</span><span className="h-px flex-1 bg-foreground/55" /><span>초과 3건</span>
      </div>
      <div className="grid grid-cols-10 gap-1 sm:gap-2">
        {losses.map((loss, index) => (
          <div key={index} className={`min-w-0 border px-0.5 py-2 text-center ${loss > 5 ? "border-destructive bg-destructive/10" : "border-border"}`}>
            <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">{index + 1}일</p>
            <p className={`mt-1 font-mono text-[10px] font-black sm:text-sm ${loss > 5 ? "text-destructive" : "text-foreground"}`}>{loss}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LedgersPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="시장위험 검증의 네 숫자">
      <Box label="위험값" value="어제 장부의 손실 문턱 5" active />
      <Box label="가상 손익" value="포지션 고정·오늘 시장" />
      <Box label="실제 손익" value="장중 거래·비용 포함" />
      <Box label="모형 손익" value="위험요인만 재평가" />
    </div>
  );
}

function ZonesPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="250일 백테스트 예외 구간">
      <Box label="green" value="예외 0~4" />
      <Box label="amber" value="예외 5~9 · 7회 → 1.83" active />
      <Box label="red" value="예외 10 이상" danger />
    </div>
  );
}

function TwoPnlPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="가상 손실과 실제 손실의 서로 다른 예외 판정">
      <Box label="가상 손실" value="6 · 예외" danger />
      <span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">+</span>
      <Box label="장중 헤지" value="이익 2" />
      <span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">=</span>
      <Box label="실제 손실" value="4 · 예외 아님" active />
    </div>
  );
}

function PlaPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="가상 손익과 위험이론 손익의 귀속 검사">
      <Box label="가상 손익 250일" value="가격 장부의 움직임" />
      <div className="flex flex-col items-center justify-center gap-1 text-[8px] font-black text-muted-foreground sm:text-xs"><span>순위</span><span>↔</span><span>분포</span></div>
      <Box label="위험이론 손익 250일" value="모형 위험요인의 움직임" active />
    </div>
  );
}

function ChecksPanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="시장위험 모형의 세 검증 층">
      <Box label="백테스트" value="손실 문턱 초과" />
      <Box label="P&L 귀속" value="장부 설명력" />
      <Box label="독립 검증" value="반박·변경 권한" active />
    </div>
  );
}

function RepairPanel() {
  const steps = ["예외", "재현", "원인", "수정", "검증", "감시"];
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-3" aria-label="시장위험 예외에서 수정과 지속 감시까지의 경로">
      {steps.map((step, index) => <Box key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="시장위험 모형 판정의 네 경계">
      <Box label="표본" value="250일·우연" />
      <Box label="시장" value="체제 변화·집중" />
      <Box label="장부" value="상품·거래·비용" />
      <Box label="책임" value="수정자·승인·버전" active />
    </div>
  );
}

export default function MarketRiskValidationMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="시장위험 검증 · 손실 한도 5에서 시작하는 전체 지도"
      title="예외를 센 뒤 세 손익을 나누고 원인·수정·감시까지 이어 갑니다"
      description="열흘 손실에서 예외를 찾는 작은 사례로 시작해 250일 감독 구간, 가상·실제·모형 손익, P&L 귀속 검사와 독립 검증이 서로 어떤 질문에 답하는지 연결합니다."
      note="열흘 손실과 같은 날의 헤지 이익은 계산을 설명하기 위한 가정입니다. 250일의 예외 구간과 7회·1.83은 글에 인용한 현행 바젤 표의 조건이며, 실제 판정은 정확한 손익 정의와 거래데스크 범위를 전제로 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-market-risk-validation-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "tenDays" && <TenDaysPanel />}
          {scene.panel === "ledgers" && <LedgersPanel />}
          {scene.panel === "zones" && <ZonesPanel />}
          {scene.panel === "twoPnl" && <TwoPnlPanel />}
          {scene.panel === "pla" && <PlaPanel />}
          {scene.panel === "checks" && <ChecksPanel />}
          {scene.panel === "repair" && <RepairPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="시장위험 검증 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
