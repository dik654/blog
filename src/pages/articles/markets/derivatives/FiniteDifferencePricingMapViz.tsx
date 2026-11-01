import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["만기", "굽음", "방정식", "한 칸", "역진", "안정", "검산", "경계"] as const;

const NOTES = [
  "행사가 100인 콜은 만기 주가 90·100·110에서 각각 0·0·10을 지급합니다. 유한차분은 이 마지막 시간 줄에서 출발합니다.",
  "가운데 값 0을 기준으로 양옆 값의 차이를 두 번 취하면 (10−2×0+0)÷10²=0.1입니다. 이 값이 주가 방향의 굽음 근사입니다.",
  "블랙숄즈 편미분방정식은 시간 변화, 굽음, 주가 기울기와 금리를 하나의 무차익 관계로 묶습니다. 이 사례는 금리를 0으로 둡니다.",
  "연 흔들림 20%, 주가 100, 시간 칸 0.01년을 넣으면 격자 비율 λ는 0.02입니다. 0·0·10에 0.02·0.96·0.02를 곱해 한 칸 전 가운데 값 0.2를 얻습니다.",
  "만기에서 바로 앞 시간 줄을 만든 뒤 같은 계산을 오늘까지 반복합니다. 경계값도 매 시간 줄에 함께 지정해야 합니다.",
  "명시적 계산의 가중치가 음수가 되지 않으려면 λ가 0.5 이하여야 합니다. 주가 110에서 허용되는 시간 칸 약 0.207년보다 0.01년이 작습니다.",
  "주가·시간 칸을 함께 줄여 값이 모이는지 확인하고, 유럽형 기준상품은 닫힌 식·풋콜 등식·독립 구현과 비교합니다. 한 번 맞은 0.2만으로 구현을 승인하지 않습니다.",
  "격자를 촘촘히 하면 선택한 방정식의 해에 가까워집니다. 점프, 잘못된 변동성, 거래비용 같은 모형 바깥의 현실까지 정확해지는 것은 아닙니다.",
] as const;

type Panel = "payoff" | "curvature" | "pde" | "step" | "backward" | "stable" | "verify" | "boundary";

const SCENES = [
  {
    title: "만기 주가 90·100·110에서 콜 지급은 0·0·10입니다",
    detail: "격자 계산은 마지막 날에 계약이 실제로 지급하는 값부터 적습니다.",
    panel: "payoff",
    formula: "V(90,T)=0 · V(100,T)=0 · V(110,T)=10",
    conclusion: "이 마지막 시간 줄이 앞선 모든 시간 줄을 계산하는 출발점입니다.",
  },
  {
    title: "가운데 값을 기준으로 두 번 차이를 내면 굽음 0.1이 나옵니다",
    detail: "연속식의 두 번째 미분을 이웃한 세 격자점의 차이로 바꿉니다.",
    panel: "curvature",
    formula: "(10−2×0+0) ÷ 10² = 0.1",
    conclusion: "옵션 지급이 꺾이는 정도를 격자 안의 숫자로 측정한 값입니다.",
  },
  {
    title: "시간·굽음·기울기·금리가 서로 맞아야 차익이 남지 않습니다",
    detail: "블랙숄즈 방정식은 네 몫을 한 관계로 묶고 유한차분은 각 미분을 격자 차이로 바꿉니다.",
    panel: "pde",
    formula: "Vₜ + ½σ²S²Vₛₛ + rSVₛ − rV = 0",
    conclusion: "이 사례는 r=0으로 두어 굽음 몫이 한 시간 칸 전 값을 만드는 과정에 집중합니다.",
  },
  {
    title: "가중치 0.02·0.96·0.02를 0·0·10에 곱하면 한 칸 전 값은 0.2입니다",
    detail: "연 흔들림 20%, 주가 100, 주가 칸 10, 시간 칸 0.01년을 넣습니다.",
    panel: "step",
    formula: "λ=½×0.2²×100²×0.01÷10²=0.02",
    conclusion: "0.02×0 + 0.96×0 + 0.02×10 = 0.2이며 완성된 오늘 가격이 아니라 역진 한 번의 결과입니다.",
  },
  {
    title: "한 줄을 만든 뒤 같은 계산을 오늘까지 반복해 격자를 채웁니다",
    detail: "각 가운데 칸은 다음 시간 줄의 왼쪽·가운데·오른쪽 값에서 만들어집니다.",
    panel: "backward",
    formula: "만기 지급 → 직전 시간 줄 → … → 오늘 가격",
    conclusion: "주가가 0이거나 매우 큰 경계의 계약값도 매 시간 줄에 함께 지정해야 합니다.",
  },
  {
    title: "시간 칸 0.01년은 가장 높은 주가 칸의 안정 상한 0.207년보다 작습니다",
    detail: "명시적 방식에서는 가운데 가중치가 음수가 되지 않도록 시간 칸을 제한합니다.",
    panel: "stable",
    formula: "λ≤½ · Δt≤(ΔS)²÷(σ²S²)",
    conclusion: "주가 칸을 절반으로 줄이면 상한은 4분의 1이 되므로 시간 칸도 함께 줄여야 합니다.",
  },
  {
    title: "격자를 촘촘히 했을 때 값이 모이고 독립 가격과 맞는지 다시 확인합니다",
    detail: "한 점의 계산과 전체 구현의 정확성을 같은 증거로 취급하지 않습니다.",
    panel: "verify",
    formula: "격자 수렴 + 닫힌 식 + 풋콜 등식 + 독립 구현",
    conclusion: "음수·톱니 모양·경계 민감도와 오차가 줄어드는 방향까지 기록해야 합니다.",
  },
  {
    title: "수치오차를 줄여도 방정식의 시장 가정에서 생긴 오차는 남습니다",
    detail: "계산법의 정확성과 변동성·경로·거래 가정의 현실성을 분리합니다.",
    panel: "boundary",
    formula: "총 가격 차이 = 수치오차 + 입력·모형·계약 구현 차이",
    conclusion: "가격 보고서에는 격자 간격뿐 아니라 경계 조건, 변동성 입력, 점프와 거래비용 가정도 함께 남겨야 합니다.",
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
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="만기 주가 세 칸과 콜옵션 지급">
      <Box label="만기 주가 90" value="지급 0" />
      <Box label="만기 주가 100" value="지급 0" />
      <Box label="만기 주가 110" value="지급 10" active />
    </div>
  );
}

function CurvaturePanel() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]" aria-label="세 만기 지급에서 굽음을 구하는 계산">
      <Box label="오른쪽" value="10" />
      <span className="hidden sm:flex"><Arrow>−</Arrow></span>
      <Box label="가운데 두 배" value="2×0" />
      <span className="hidden sm:flex"><Arrow>+</Arrow></span>
      <Box label="왼쪽·칸 제곱" value="0 ÷ 100 → 0.1" active />
    </div>
  );
}

function PdePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="블랙숄즈 편미분방정식의 네 몫">
      <Box label="시간" value="Vₜ" />
      <Box label="굽음" value="½σ²S²Vₛₛ" active />
      <Box label="기울기" value="rSVₛ" />
      <Box label="할인" value="−rV" />
    </div>
  );
}

function StepPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:gap-1" aria-label="명시적 유한차분 한 칸 계산">
      <Box label="왼쪽 지급" value="0.02×0" />
      <span className="hidden sm:flex"><Arrow>+</Arrow></span>
      <Box label="가운데 지급" value="0.96×0" />
      <span className="hidden sm:flex"><Arrow>+</Arrow></span>
      <Box label="오른쪽 지급" value="0.02×10" />
      <span className="hidden sm:flex"><Arrow>=</Arrow></span>
      <Box label="한 칸 전" value="0.2" active />
    </div>
  );
}

function BackwardPanel() {
  return (
    <div className="space-y-2" aria-label="만기에서 오늘까지 시간 줄을 거꾸로 채우는 격자">
      <div className="grid grid-cols-[4.5rem_repeat(3,1fr)] gap-1 sm:grid-cols-[7rem_repeat(3,1fr)] sm:gap-2">
        <Box label="시간 줄" value="주가 칸" />
        <Box label="90" value="0" />
        <Box label="100" value="0" />
        <Box label="110" value="10" />
      </div>
      <div className="grid grid-cols-[4.5rem_repeat(3,1fr)] gap-1 sm:grid-cols-[7rem_repeat(3,1fr)] sm:gap-2">
        <Box label="0.01년 전" value="직전 줄" />
        <Box label="왼쪽 경계" value="경계값" />
        <Box label="가운데" value="0.2" active />
        <Box label="오른쪽 경계" value="경계값" />
      </div>
    </div>
  );
}

function StablePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="명시적 유한차분의 시간 간격과 안정 상한 비교">
      <Box label="선택한 시간 칸" value="0.01년" active />
      <Arrow>≤</Arrow>
      <Box label="주가 110의 상한" value="100 ÷ (0.2²×110²) ≈ 0.207년" />
    </div>
  );
}

function VerifyPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="유한차분 구현을 검산하는 네 증거">
      <Box label="격자 수렴" value="ΔS·Δt 축소" active />
      <Box label="기준상품" value="닫힌 식 비교" />
      <Box label="계약 관계" value="풋콜 등식" />
      <Box label="다른 구현" value="독립 가격 비교" />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="수치오차와 모형오차를 나누는 네 검사">
      <Box label="수치" value="격자·보간·경계" active />
      <Box label="입력" value="변동성·금리" />
      <Box label="경로" value="점프·장벽" />
      <Box label="시장" value="호가·거래비용" />
    </div>
  );
}

export default function FiniteDifferencePricingMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="유한차분 · 만기 지급 0·0·10의 전체 지도"
      title="만기 지급을 한 시간 칸 거슬러 가운데 값 0.2를 만듭니다"
      description="만기 지급을 격자에 적고 굽음을 계산한 뒤 블랙숄즈 방정식을 가중치로 바꿔 한 줄씩 오늘까지 거슬러 가는 과정과 안정성·검산 경계를 함께 봅니다."
      note="행사가 100·연 흔들림 20%·금리 0·주가 칸 10·시간 칸 0.01년은 작동 원리를 설명하기 위한 가정입니다. 0.2는 역진 한 번의 값이지 실제 옵션의 완성 가격이 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-finite-difference-pricing-map
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
          {scene.panel === "curvature" && <CurvaturePanel />}
          {scene.panel === "pde" && <PdePanel />}
          {scene.panel === "step" && <StepPanel />}
          {scene.panel === "backward" && <BackwardPanel />}
          {scene.panel === "stable" && <StablePanel />}
          {scene.panel === "verify" && <VerifyPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="유한차분 역진 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
