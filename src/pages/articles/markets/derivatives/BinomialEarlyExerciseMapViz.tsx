import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["나무", "가중치", "보유", "행사", "역진", "비교", "수렴", "경계"] as const;

const NOTES = [
  "오늘 주가 100은 한 기간 뒤 120 또는 80, 두 기간 뒤 144·96·64가 됩니다. 행사가 100인 풋의 만기 지급은 0·4·36입니다.",
  "무위험 증가율 1.05가 상승배수 1.2와 하락배수 0.8 사이에 있으므로 복제가 가능합니다. 가격 계산용 상승 가중치는 0.625입니다.",
  "주가 80에서 한 기간을 더 기다리면 풋 지급은 4 또는 36입니다. 이를 가중하고 1.05로 할인한 보유가치는 약 15.24입니다.",
  "주가 80에서 즉시 행사하면 20을 받습니다. 20이 보유가치 15.24보다 크므로 미국형 풋은 이 가지에서 바로 행사합니다.",
  "상승 노드의 보유가치 약 1.43과 하락 노드에서 선택한 20을 다시 가중·할인하면 오늘 미국형 풋은 약 7.99입니다.",
  "중간 행사를 막은 유럽형 풋은 약 6.29입니다. 미국형 풋이 약 1.70 더 비싼 부분은 하락 노드의 조기행사 선택권에서 나옵니다.",
  "변동성 20%와 연속복리 금리 약 4.88%를 넣은 별도 CRR 나무는 2·10·100·1,000단계에서 5.42·6.42·6.67·6.70으로 블랙숄즈 값 6.70에 가까워집니다.",
  "이항모형은 입력 배수와 복제 가능 조건, 행사 방식에 기대어 가격을 만듭니다. 실제 확률·시장 호가·거래비용을 자동으로 보장하지 않습니다.",
] as const;

type Panel = "tree" | "weight" | "hold" | "exercise" | "rollback" | "compare" | "converge" | "boundary";

const SCENES = [
  {
    title: "주가 100에서 시작한 두 기간 나무의 만기 풋 지급은 0·4·36입니다",
    detail: "공식보다 먼저 시간별 주가와 행사가 100인 풋의 지급을 펼칩니다.",
    panel: "tree",
    formula: "만기 풋 지급 = max(100−만기 주가, 0)",
    conclusion: "유럽형은 이 만기 지급만 보지만 미국형은 중간 노드에서도 지금 행사할지 결정합니다.",
  },
  {
    title: "상승배수 1.2와 하락배수 0.8 사이에 1.05가 있어 가격 가중치 0.625를 만듭니다",
    detail: "실제 상승 확률을 예측하지 않고 주식과 현금의 복제 가격을 맞춥니다.",
    panel: "weight",
    formula: "q = (1.05−0.8) ÷ (1.2−0.8) = 0.625",
    conclusion: "0.625와 0.375는 상승·하락 지급을 오늘 가격으로 접는 계산 가중치입니다.",
  },
  {
    title: "주가 80에서 한 기간을 기다린 가치는 4와 36을 가중·할인한 15.24입니다",
    detail: "하락 노드에서 계속 보유했을 때 받을 미래 지급을 먼저 계산합니다.",
    panel: "hold",
    formula: "(0.625×4 + 0.375×36) ÷ 1.05 ≈ 15.24",
    conclusion: "미국형 가격은 이 보유가치와 지금 행사해 받을 돈을 같은 노드에서 비교해야 합니다.",
  },
  {
    title: "주가 80에서 즉시 행사한 20이 보유가치 15.24보다 커서 지금 행사합니다",
    detail: "미국형 풋의 선택권이 실제 가격으로 바뀌는 한 노드를 봅니다.",
    panel: "exercise",
    formula: "max(즉시 행사 100−80, 보유 15.24) = 20",
    conclusion: "미국형이라는 이유만으로 항상 일찍 행사하는 것은 아니며 노드마다 두 값을 다시 비교합니다.",
  },
  {
    title: "상승 노드 1.43과 하락 노드 20을 오늘로 접으면 미국형 풋은 약 7.99입니다",
    detail: "만기에서 고른 값을 한 단계씩 뒤로 가져와 오늘 가격을 만듭니다.",
    panel: "rollback",
    formula: "(0.625×1.43 + 0.375×20) ÷ 1.05 ≈ 7.99",
    conclusion: "이 과정을 모든 노드에서 반복하는 것이 이항모형의 역진 계산입니다.",
  },
  {
    title: "중간 행사를 막으면 유럽형 풋은 6.29이고 조기행사권의 차이는 약 1.70입니다",
    detail: "같은 만기 지급에서 중간 선택 하나가 오늘 가격을 어떻게 바꾸는지 비교합니다.",
    panel: "compare",
    formula: "미국형 7.99 − 유럽형 6.29 ≈ 조기행사 가치 1.70",
    conclusion: "배당이 없는 미국형 콜처럼 조기행사가 유리하지 않은 계약도 있어 선택권과 실제 행사를 구분해야 합니다.",
  },
  {
    title: "별도 CRR 나무는 단계를 늘릴수록 블랙숄즈 풋 가격 6.70에 가까워집니다",
    detail: "손계산용 1.2·0.8 나무와 수렴을 확인하는 변동성 기반 나무를 구분합니다.",
    panel: "converge",
    formula: "2단계 5.42 → 10단계 6.42 → 100단계 6.67 → 1,000단계 6.70",
    conclusion: "기간을 잘게 나누는 것만으로 충분하지 않으며 CRR 규칙에 맞춰 각 단계의 상승·하락 배수를 다시 정합니다.",
  },
  {
    title: "모형가격을 쓰기 전 복제 가능 조건·입력·행사 방식·시장 마찰을 확인합니다",
    detail: "계산이 정확해도 가정과 실제 계약이 다르면 가격 기준이 어긋납니다.",
    panel: "boundary",
    formula: "d < 무위험 증가율 < u · 계약 조건 일치 · 입력 검증 · 비용 반영",
    conclusion: "이항가격은 시장 호가를 보장하는 답이 아니라 가정을 바꿨을 때 값을 비교하는 기준입니다.",
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

function TreePanel() {
  return (
    <div className="grid grid-cols-[0.8fr_auto_1fr_auto_1.2fr] gap-1 sm:gap-2" aria-label="오늘부터 만기까지 두 기간의 주가와 풋 지급 나무">
      <Box label="오늘" value="주가 100" />
      <Arrow />
      <div className="grid gap-2">
        <Box label="1기 상승" value="120" />
        <Box label="1기 하락" value="80" active />
      </div>
      <Arrow />
      <div className="grid gap-1.5">
        <Box label="만기" value="144 · 풋 0" />
        <Box label="만기" value="96 · 풋 4" />
        <Box label="만기" value="64 · 풋 36" active />
      </div>
    </div>
  );
}

function WeightPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="무위험 증가율과 상승 하락 배수로 구한 가격 가중치">
      <Box label="상승배수" value="1.2" />
      <Arrow>·</Arrow>
      <Box label="무위험 증가율" value="1.05" active />
      <Arrow>·</Arrow>
      <Box label="하락배수" value="0.8" />
    </div>
  );
}

function HoldPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="주가 80 노드에서 풋을 계속 보유한 가치 계산">
      <Box label="상승 뒤 지급" value="4 × 0.625" />
      <Arrow>+</Arrow>
      <Box label="하락 뒤 지급" value="36 × 0.375" />
      <Arrow>→</Arrow>
      <Box label="1.05로 할인" value="15.24" active />
    </div>
  );
}

function ExercisePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="주가 80에서 즉시 행사와 계속 보유 비교">
      <Box label="지금 행사" value="100−80=20" active />
      <Arrow>&gt;</Arrow>
      <Box label="계속 보유" value="15.24" />
    </div>
  );
}

function RollbackPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1 sm:gap-2" aria-label="중간 노드 값을 오늘 미국형 풋 가격으로 접는 계산">
      <Box label="상승 노드" value="1.43 × 0.625" />
      <Arrow>+</Arrow>
      <Box label="하락 노드" value="20 × 0.375" active />
      <Arrow>→</Arrow>
      <Box label="오늘" value="7.99" active />
    </div>
  );
}

function ComparePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4" aria-label="유럽형과 미국형 풋 가격 비교">
      <Box label="유럽형 풋" value="6.29 · 만기만 행사" />
      <Arrow>→</Arrow>
      <Box label="미국형 풋" value="7.99 · 중간 행사 가능" active />
    </div>
  );
}

function ConvergePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="CRR 나무의 단계 수가 늘 때 블랙숄즈 가격으로 수렴하는 값">
      <Box label="2단계" value="5.42" />
      <Box label="10단계" value="6.42" />
      <Box label="100단계" value="6.67" />
      <Box label="1,000단계" value="6.70" active />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="이항모형 가격을 적용하기 전에 확인할 네 경계">
      <Box label="복제 조건" value="0.8 < 1.05 < 1.2" />
      <Box label="입력" value="금리·변동성·배당" />
      <Box label="계약" value="유럽형·미국형" active />
      <Box label="시장" value="호가·비용·점프" />
    </div>
  );
}

export default function BinomialEarlyExerciseMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="이항모형 · 두 기간 풋의 전체 지도"
      title="만기 지급을 뒤로 접으며 보유가치와 즉시 행사를 노드마다 비교합니다"
      description="주가 100에서 시작한 두 기간 나무에 만기 풋 지급을 적고, 가격 가중치 0.625로 하락 노드의 보유가치 15.24를 계산한 뒤 즉시 행사 20을 선택해 오늘 미국형 가격 7.99로 돌아옵니다."
      note="1.2·0.8 나무는 손계산용 가정입니다. 2·10·100·1,000단계 수렴값은 변동성 20%와 연속복리 금리 약 4.88%로 각 단계의 배수를 다시 정한 별도 CRR 예이며, 손계산 나무의 단계를 단순히 늘린 값이 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-binomial-early-exercise-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "tree" && <TreePanel />}
          {scene.panel === "weight" && <WeightPanel />}
          {scene.panel === "hold" && <HoldPanel />}
          {scene.panel === "exercise" && <ExercisePanel />}
          {scene.panel === "rollback" && <RollbackPanel />}
          {scene.panel === "compare" && <ComparePanel />}
          {scene.panel === "converge" && <ConvergePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="이항모형 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
