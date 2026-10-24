import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const STEPS = [
  {
    label: "DeltaNet 1",
    short: "Δ1",
    memory: "recurrent state 갱신",
    detail: "첫 mixer가 현재 token을 고정 크기 state에 반영합니다.",
    kind: "delta",
  },
  {
    label: "DeltaNet 2",
    short: "Δ2",
    memory: "recurrent state 갱신",
    detail: "두 번째 mixer도 과거 K/V 열을 새로 붙이지 않습니다.",
    kind: "delta",
  },
  {
    label: "DeltaNet 3",
    short: "Δ3",
    memory: "recurrent state 갱신",
    detail: "세 번째 압축 memory 뒤에 direct token retrieval layer가 옵니다.",
    kind: "delta",
  },
  {
    label: "Gated Attention",
    short: "ATTN",
    memory: "K/V token 한 칸 추가",
    detail: "이 layer만 과거 token의 K와 V를 sequence 축으로 보존합니다.",
    kind: "attention",
  },
] as const;

export default function HybridScheduleViz() {
  const scenes = useAnimatedScenes(STEPS.length, 2600);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="레이어 순서"
      title="3개의 압축 state layer 뒤에 1개의 direct retrieval layer가 온다"
      description="이 네 layer짜리 block을 16번 반복합니다. 그림에 초점을 둔 뒤 ← →로 layer를 넘기고 Space로 재생·일시정지할 수 있습니다."
      note="각 mixer 뒤에는 FFN과 residual update가 이어집니다. 이 그림은 두 memory 방식의 차이를 드러내기 위해 mixer만 전면에 놓았습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Qwen3.6 hybrid layer animation"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="min-w-0 rounded-lg border border-border bg-background p-3 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(15rem,.8fr)] md:items-stretch">
            <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-muted-foreground">Hybrid block × 16</p>
              <span className="font-mono text-xs font-bold text-foreground">48 Δ + 16 ATTN = 64</span>
            </div>
            <div className="mt-3 grid grid-cols-4 items-center gap-1.5 sm:mt-5 sm:gap-3">
              {STEPS.map((step, index) => {
                const selected = index === active;
                return (
                  <button
                    key={step.label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => scenes.setActive(index)}
                    className={`relative min-w-0 rounded-md border px-1 py-3 text-center transition-colors sm:px-3 sm:py-5 ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/15 text-foreground"
                    }`}
                  >
                    <span className="block font-mono text-xs font-black sm:text-sm">{step.short}</span>
                    <span className="mt-2 hidden text-[10px] leading-4 text-muted-foreground sm:block">FFN</span>
                    {index < STEPS.length - 1 ? (
                      <span
                        aria-hidden
                        className={`absolute -right-2.5 top-1/2 h-px w-3 sm:-right-4 sm:w-5 ${
                          selected ? "bg-primary" : "bg-border"
                        }`}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/70 pt-3 sm:mt-5 sm:pt-4">
              <span className="text-xs leading-5 text-muted-foreground">현재: {STEPS[active].label}</span>
            </div>
            </div>

            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 border-t border-border/70 pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-0">
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border text-xs font-black ${
                  STEPS[active].kind === "delta"
                    ? "border-sky-500/60 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                    : "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                }`}
              >
                {STEPS[active].kind === "delta" ? "Sₜ" : "K/V"}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-primary">{STEPS[active].memory}</p>
                <p className="mt-1 text-sm font-bold leading-5">{STEPS[active].label}</p>
              </div>
              <p className="col-span-2 mt-2 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                {STEPS[active].detail}
              </p>
              <div className="col-span-2 pt-2 sm:pt-4">
              {STEPS[active].kind === "delta" ? (
                <div className="grid grid-cols-6 gap-1" aria-label="fixed recurrent matrix">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <span key={index} className="h-5 rounded-sm border border-sky-500/25 bg-sky-500/10 sm:h-auto sm:aspect-square" />
                  ))}
                </div>
              ) : (
                <div className="flex items-end gap-1" aria-label="growing KV token history">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <span
                      key={index}
                      className="w-full rounded-sm border border-amber-500/30 bg-amber-500/10"
                      style={{ height: `${18 + index * 4}px` }}
                    />
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
        <AnimatedSceneControls
          {...scenes}
          labels={STEPS.map((step) => step.label)}
          playLabel="재생"
        />
      </div>
    </VizFrame>
  );
}
