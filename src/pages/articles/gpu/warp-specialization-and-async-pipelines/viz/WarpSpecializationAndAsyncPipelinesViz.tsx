import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에는 한 mechanism 만. 각 장면은 원인 → 계산/상태 변화 → 결과 중 한 단계.
 * stage 높이는 모든 장면의 최대 필요 크기로 고정하고(h-[min(...)] 아래 참고),
 * control row 는 stage 아래 고정 row 에 둔다. gradient·glow·shadow·굵은 선 금지.
 */
const SCENES = ["TODO 장면 1", "TODO 장면 2", "TODO 장면 3", "TODO 장면 4"] as const;

const NOTES = [
  "TODO 장면 1 에서 독자가 읽어야 할 한 문장",
  "TODO 장면 2",
  "TODO 장면 3",
  "TODO 장면 4",
] as const;

export default function WarpSpecializationAndAsyncPipelinesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  return (
    <VizFrame
      eyebrow="TODO 개념 이름"
      title="TODO 그림이 보여 주는 결론 한 문장"
      description="TODO 각 장면이 무엇의 상태인지"
      note="TODO 이 그림이 단순화한 것"
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Warp specialization 은 producer 와 consumer 를 나눠 TMA 와 계산을 겹칩니다"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          {/* TODO 장면별 diagram. SVG 를 쓰면 viewBox 고정, <text> 는 짧은 label 만, strokeWidth 1~1.25 */}
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`flex min-h-16 items-center justify-center border px-2 text-center text-xs font-bold ${
                  index <= scenes.active ? "border-primary/55 bg-primary/5 text-foreground" : "border-border bg-muted/40 text-muted-foreground"
                }`}
              >
                TODO {index + 1}
              </div>
            ))}
          </div>
          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
