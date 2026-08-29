import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 요청이 저비용 model(0) → 확신도가 낮아 상위 model로 escalate(1)
 * → 상위 model이 실행 자체에 실패해 provider fallback으로 전환(2) → fallback
 * provider가 최종 응답을 반환(3)하는 과정을 보여 준다. Cascade(확신도 기반
 * escalation)와 fallback(실패 기반 전환)이 같은 "다른 model로 넘어간다"는
 * 동작이지만 서로 다른 신호에 반응한다는 것이 핵심이다. 4 장면 모두 같은 3개
 * 단계(저비용 model·상위 model·fallback provider) 박스를 기준으로 둔다.
 */
const SCENES = [
  "요청 도착 · 저비용 model 우선 시도",
  "확신도 낮음 → 상위 model로 escalate",
  "상위 model 실행 실패 → provider fallback",
  "Fallback provider가 최종 응답 반환",
] as const;

const NOTES = [
  "요청이 도착하면 cascade의 첫 단계인 저비용·저지연 model부터 호출합니다. 아직 다른 단계는 시도하지 않았습니다.",
  "저비용 model의 응답 확신도가 threshold보다 낮아 그 응답을 채택하지 않고, cascade의 다음 단계인 상위 model로 넘어갑니다. 이 전환은 확신도라는 품질 신호에 반응한 것입니다.",
  "상위 model 호출이 timeout으로 실패했습니다. 이번에는 확신도가 아니라 실행 자체의 실패이므로 cascade를 벗어나 provider fallback으로 전환합니다.",
  "Fallback provider가 같은 요청을 처리해 응답을 돌려줍니다. 저비용 model → 상위 model → fallback provider까지 총 세 번의 시도 끝에 결과가 확정됩니다.",
] as const;

type StageState = "active" | "escalated" | "failed" | "success" | "pending";

const STAGES = [
  { key: "small", label: "저비용 model" },
  { key: "large", label: "상위 model" },
  { key: "fallback", label: "Fallback provider" },
] as const;

function statesForScene(scene: number): StageState[] {
  if (scene === 0) return ["active", "pending", "pending"];
  if (scene === 1) return ["escalated", "active", "pending"];
  if (scene === 2) return ["escalated", "failed", "active"];
  return ["escalated", "failed", "success"];
}

function stageStyle(state: StageState) {
  switch (state) {
    case "success":
      return "border-primary bg-primary/10 text-foreground";
    case "active":
      return "border-primary/60 bg-primary/5 text-foreground";
    case "escalated":
      return "border-border bg-muted/30 text-muted-foreground";
    case "failed":
      return "border-dashed border-border/60 bg-transparent text-muted-foreground/50";
    default:
      return "border-border bg-background text-muted-foreground/70";
  }
}

function stageBadge(state: StageState) {
  switch (state) {
    case "success":
      return "응답 채택";
    case "active":
      return "호출 중";
    case "escalated":
      return "확신도 낮음";
    case "failed":
      return "실행 실패";
    default:
      return "대기";
  }
}

function StageRow({ states }: { states: StageState[] }) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {STAGES.map((stage, index) => (
        <div
          key={stage.key}
          className={`flex h-20 flex-col items-center justify-center gap-1.5 border text-center ${stageStyle(states[index])}`}
        >
          <span className="text-xs font-bold leading-tight">{stage.label}</span>
          <span className="text-[10px] font-bold">{stageBadge(states[index])}</span>
        </div>
      ))}
    </div>
  );
}

function ResultArrow({ show }: { show: boolean }) {
  if (!show) return <div className="mt-4 h-10" aria-hidden="true" />;
  return (
    <div className="mt-4 flex items-center justify-center gap-2 border border-primary/50 bg-primary/5 px-4 py-2.5 text-xs font-bold text-foreground">
      <span>Fallback 응답</span>
      <span className="text-primary">→</span>
      <span>사용자에게 반환</span>
    </div>
  );
}

export default function LlmGatewayAndModelRoutingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const states = statesForScene(scenes.active);

  return (
    <VizFrame
      eyebrow="Cascade escalation · provider fallback"
      title="Cascade는 확신도에, fallback은 실행 실패에 반응해 다음 model로 넘어갑니다"
      description="같은 3단계(저비용 model·상위 model·fallback provider)가 각 장면에서 대기 → 호출 중 → escalate/실패/응답 채택 상태로 바뀝니다."
      note="Threshold·timeout 같은 조건은 절차를 보여 주기 위한 예시이며 특정 배포의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="요청이 저비용 model부터 시도해 확신도가 낮으면 상위 model로 escalate하고, 상위 model이 실행에 실패하면 provider fallback으로 전환해 최종 응답을 받는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[24rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <StageRow states={states} />
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
