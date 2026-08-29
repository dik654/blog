import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 요청 하나가 cache key를 만든 뒤 exact-match → semantic → retrieval
 * 순서로 캐시 계층을 통과하다가, semantic 층에서 hit하면 그 자리에서 멈추고
 * retrieval 층은 아예 조회하지 않는다는 것을 보여 준다. 4 장면 모두 같은 3개
 * 계층(Exact-match·Semantic·Retrieval) 박스를 기준으로 두고, stage 높이는
 * 마지막 장면(결과 반환 화살표 포함)의 콘텐츠 기준으로 고정한다.
 */
const SCENES = [
  "요청 도착 · cache key 생성",
  "Exact-match 조회 → miss",
  "Semantic 조회 → hit(0.97 ≥ 0.95)",
  "Retrieval은 건너뛰고 hit 결과 반환",
] as const;

const NOTES = [
  "요청이 도착하면 prompt·model·옵션을 묶어 cache key를 만듭니다. 아직 어떤 계층도 조회하지 않았습니다.",
  "Exact-match 계층은 문자열이 완전히 같은 저장 항목을 찾지만 이번 요청과 정확히 같은 문자열이 없어 miss입니다.",
  "Semantic 계층은 이번 요청의 embedding과 저장된 요청들의 유사도를 비교합니다. 가장 가까운 후보가 0.97로 threshold 0.95를 넘어 hit입니다.",
  "Semantic 계층에서 이미 hit했으므로 retrieval 계층은 조회하지 않고 그대로 결과를 반환합니다. 세 계층을 항상 다 거치는 것이 아니라 hit한 자리에서 멈춥니다.",
] as const;

type LayerState = "pending" | "checking" | "miss" | "hit" | "skipped";

const LAYER_LABELS = ["Exact-match", "Semantic", "Retrieval"] as const;

function layerStatesForScene(scene: number): LayerState[] {
  if (scene === 0) return ["pending", "pending", "pending"];
  if (scene === 1) return ["checking", "pending", "pending"];
  if (scene === 2) return ["miss", "checking", "pending"];
  return ["miss", "hit", "skipped"];
}

function layerStyle(state: LayerState) {
  switch (state) {
    case "hit":
      return "border-primary bg-primary/10 text-foreground";
    case "checking":
      return "border-primary/60 bg-primary/5 text-foreground";
    case "miss":
      return "border-border bg-muted/30 text-muted-foreground";
    case "skipped":
      return "border-dashed border-border/60 bg-transparent text-muted-foreground/50";
    default:
      return "border-border bg-background text-muted-foreground/70";
  }
}

function layerBadge(state: LayerState) {
  switch (state) {
    case "hit":
      return "HIT";
    case "checking":
      return "조회 중";
    case "miss":
      return "miss";
    case "skipped":
      return "건너뜀";
    default:
      return "대기";
  }
}

function CacheKeyTag({ active }: { active: boolean }) {
  return (
    <div
      className={`mx-auto flex h-10 w-64 items-center justify-center border text-xs font-bold ${
        active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-muted/20 text-muted-foreground"
      }`}
    >
      cache key(prompt · model · options)
    </div>
  );
}

function LayerRow({ states }: { states: LayerState[] }) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {LAYER_LABELS.map((label, index) => (
        <div
          key={label}
          className={`flex h-20 flex-col items-center justify-center gap-1.5 border text-center ${layerStyle(states[index])}`}
        >
          <span className="text-xs font-bold leading-tight">{label}</span>
          <span className="text-[10px] font-bold">{layerBadge(states[index])}</span>
        </div>
      ))}
    </div>
  );
}

function ResultArrow({ show }: { show: boolean }) {
  if (!show) return <div className="mt-4 h-10" aria-hidden="true" />;
  return (
    <div className="mt-4 flex items-center justify-center gap-2 border border-primary/50 bg-primary/5 px-4 py-2.5 text-xs font-bold text-foreground">
      <span>Semantic hit 결과</span>
      <span className="text-primary">→</span>
      <span>그대로 반환</span>
    </div>
  );
}

export default function LlmApplicationCachingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const states = layerStatesForScene(scenes.active);

  return (
    <VizFrame
      eyebrow="Cache lookup 순서"
      title="요청은 cache 계층을 순서대로 통과하다가 hit한 자리에서 멈춥니다"
      description="같은 3개 계층(Exact-match·Semantic·Retrieval)이 각 장면에서 대기 → 조회 중 → miss/hit/건너뜀 상태로 바뀝니다."
      note="0.97·0.95 같은 유사도 값은 절차를 보여 주기 위한 예시이며 특정 배포의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="요청이 cache key를 만들고 exact-match, semantic, retrieval 계층을 순서대로 조회하다가 hit한 계층에서 멈추고 나머지는 건너뛰는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[24rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <CacheKeyTag active={scenes.active === 0} />
          <LayerRow states={states} />
          <ResultArrow show={scenes.active === 3} />

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
