import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 delta-rule 기억 쓰기가 순차 recurrence 로도, chunk 안에서
 * 한꺼번에 처리되는 병렬 형태로도 계산될 수 있다는 것. Chunk 크기 C=4, 상태는
 * 2×2 로 줄여 표현한다. Chunk 사이에서만 상태가 순차로 전달된다.
 */
const SCENES = ["순차 recurrence", "Chunk 안 준비", "Chunk 안 병렬 처리", "다음 chunk 로 전달"] as const;

type StepState = {
  label: string;
  active: boolean;
  written: boolean;
};

type SceneState = {
  steps: readonly StepState[];
  stateLabel: string;
  note: string;
  mode: "순차" | "병렬";
  changed: readonly string[];
};

const STATES: readonly SceneState[] = [
  {
    steps: [
      { label: "t1", active: true, written: true },
      { label: "t2", active: false, written: false },
      { label: "t3", active: false, written: false },
      { label: "t4", active: false, written: false },
    ],
    stateLabel: "S₀ → S₁ (t1 만 반영)",
    note: "t2 의 delta 를 구하려면 S₁ 이 먼저 확정돼야 합니다. 표준 recurrence 는 이렇게 한 step씩 기다립니다.",
    mode: "순차",
    changed: ["t1"],
  },
  {
    steps: [
      { label: "t1", active: false, written: false },
      { label: "t2", active: false, written: false },
      { label: "t3", active: false, written: false },
      { label: "t4", active: false, written: false },
    ],
    stateLabel: "S (chunk 진입 상태, 고정)",
    note: "Chunk 안 4개 step 전체를 UT transform 으로 한 번에 재표현합니다. C×C 하삼각행렬 역행렬 하나로 t1~t4 의 순차 의존성을 미리 풀어 둡니다.",
    mode: "병렬",
    changed: [],
  },
  {
    steps: [
      { label: "t1", active: true, written: true },
      { label: "t2", active: true, written: true },
      { label: "t3", active: true, written: true },
      { label: "t4", active: true, written: true },
    ],
    stateLabel: "Õ = QSᵀ + (QKᵀ⊙M) Ũ",
    note: "네 step 의 출력이 하나의 행렬곱으로 동시에 나옵니다. Causal mask M 이 t2 는 t1 만, t4 는 t1~t3 만 보게 막습니다.",
    mode: "병렬",
    changed: ["t1", "t2", "t3", "t4"],
  },
  {
    steps: [
      { label: "t1", active: false, written: true },
      { label: "t2", active: false, written: true },
      { label: "t3", active: false, written: true },
      { label: "t4", active: false, written: true },
    ],
    stateLabel: "S_next = S + Ũᵀ K",
    note: "Chunk 전체가 쓴 correction 을 한 번에 합쳐 다음 chunk 로 넘길 상태 하나만 만듭니다. 다음 chunk 는 이 상태만 받고, 그 안에서 다시 병렬로 처리합니다.",
    mode: "병렬",
    changed: ["state"],
  },
];

export default function FastWeightMemoryAndChunkwiseRecurrenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const state = STATES[scenes.active];
  return (
    <VizFrame
      eyebrow="Delta rule · chunkwise scan"
      title="같은 기억 쓰기를 한 step씩 기다리거나, chunk 안에서 한꺼번에 계산합니다"
      description="4개 token 짜리 chunk 하나가 순차 recurrence 형태(왼쪽 장면)와 chunkwise 병렬 형태(오른쪽 장면들)로 같은 결과를 만드는 과정입니다."
      note="실제 상태는 d×d(수십~수백 차원) 행렬이고 chunk 는 보통 C=64~128 입니다. 그림은 상태를 라벨 하나로, chunk 를 4 step 으로 줄였습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Delta rule 기억 쓰기가 순차·병렬 두 형태로 계산되는 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(36rem,calc(100dvh-15rem))] min-h-[28rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-5 border border-border p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-bold text-muted-foreground">Chunk 안 4개 step</p>
              <p className="font-mono text-[10px] text-muted-foreground">모드 · {state.mode}</p>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {state.steps.map((step) => (
                <div
                  key={step.label}
                  className={`flex min-h-12 flex-col items-center justify-center gap-1 border px-2 font-mono text-xs ${
                    step.active
                      ? "border-primary bg-primary/10 text-foreground"
                      : step.written
                        ? "border-primary/40 text-foreground"
                        : "border-dashed border-border text-muted-foreground"
                  }`}
                >
                  <span className="font-bold">{step.label}</span>
                  <span className="text-[9px]">{step.written ? "기록됨" : "대기"}</span>
                </div>
              ))}
            </div>
            <div
              className={`mt-3 flex min-h-9 items-center justify-between border px-2 text-xs ${
                state.changed.length > 0 ? "border-amber-600 bg-amber-500/5 text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              <span className="shrink-0">상태(다음 chunk 로 전달)</span>
              <span className="truncate pl-3 font-mono text-right">{state.stateLabel}</span>
            </div>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
