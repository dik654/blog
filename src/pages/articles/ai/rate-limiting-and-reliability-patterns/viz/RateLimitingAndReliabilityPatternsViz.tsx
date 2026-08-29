import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: circuit breaker가 closed(0) → 실패율 임계값 초과로 open(1)
 * → 일정 시간 뒤 half-open에서 시험 요청 1건 통과(2) → 시험 성공이면 closed
 * 복귀, 실패면 다시 open(3)으로 돌아가는 상태 전이를 보여 준다. 4 장면 모두
 * 같은 3개 상태(Closed·Open·Half-Open) 박스를 기준으로 두고, stage 높이는
 * 마지막 장면(분기 결과 두 줄)의 콘텐츠 기준으로 고정한다.
 */
const SCENES = [
  "Closed · 정상 요청 통과",
  "실패율 임계값 초과 → Open",
  "일정 시간 후 Half-Open · 시험 요청 1건",
  "시험 성공 → Closed 복귀 · 실패 → 다시 Open",
] as const;

const NOTES = [
  "평소 상태인 closed에서는 모든 요청을 backend로 그대로 통과시키고 실패율을 계속 관측합니다.",
  "실패율이 임계값(예: 50%)을 넘으면 open으로 전환합니다. 이후 도착하는 요청은 backend를 부르지 않고 즉시 실패를 반환합니다.",
  "Open 상태로 일정 시간(cooldown)이 지나면 half-open으로 바뀌어 시험 요청 딱 1건만 backend에 통과시켜 봅니다.",
  "시험 요청이 성공하면 closed로 복귀해 다시 모든 요청을 통과시키고, 실패하면 다시 open으로 돌아가 cooldown부터 반복합니다.",
] as const;

type BreakerState = "closed" | "open" | "half-open";

const STATES = [
  { key: "closed", label: "Closed" },
  { key: "open", label: "Open" },
  { key: "half-open", label: "Half-Open" },
] as const;

function activeStateForScene(scene: number): BreakerState {
  if (scene === 0) return "closed";
  if (scene === 1) return "open";
  if (scene === 2) return "half-open";
  return "closed";
}

function requestLabelForScene(scene: number) {
  if (scene === 0) return "요청 → backend 통과";
  if (scene === 1) return "요청 → 즉시 실패(fail fast)";
  if (scene === 2) return "시험 요청 1건 → backend";
  return "성공 → closed 복귀 / 실패 → open 재전환";
}

function StateBox({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`flex h-16 items-center justify-center border text-sm font-bold ${
        active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-muted/20 text-muted-foreground/60"
      }`}
    >
      {label}
    </div>
  );
}

function StateRow({ active }: { active: BreakerState }) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {STATES.map((state) => (
        <StateBox key={state.key} label={state.label} active={state.key === active} />
      ))}
    </div>
  );
}

function RequestLine({ text, branched }: { text: string; branched: boolean }) {
  return (
    <div
      className={`mt-4 flex min-h-10 items-center justify-center border px-4 py-2.5 text-center text-xs font-bold ${
        branched
          ? "border-dashed border-primary/50 bg-primary/5 text-foreground"
          : "border-primary/50 bg-primary/5 text-foreground"
      }`}
    >
      {text}
    </div>
  );
}

export default function RateLimitingAndReliabilityPatternsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const active = activeStateForScene(scenes.active);

  return (
    <VizFrame
      eyebrow="Circuit breaker 상태 전이"
      title="Circuit breaker는 closed·open·half-open 세 상태를 오갑니다"
      description="같은 3개 상태 박스가 각 장면에서 강조가 옮겨 가며, 그 상태에서 요청이 실제로 어떻게 처리되는지 아래 줄이 함께 바뀝니다."
      note="실패율 50%·cooldown 같은 값은 절차를 보여 주기 위한 예시이며 특정 배포의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Circuit breaker가 closed에서 open으로, 다시 half-open을 거쳐 closed 또는 open으로 돌아가는 상태 전이와 각 상태에서의 요청 처리 방식"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(28rem,calc(100dvh-15rem))] min-h-[22rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <StateRow active={active} />
          <RequestLine text={requestLabelForScene(scenes.active)} branched={scenes.active === 3} />

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
