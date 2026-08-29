import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 차원이 늘수록 거리가 무너지고(집중), 그 틈을 JL 사영과
 * intrinsic dimension·latent bottleneck이 메운다. 4 장면 모두 같은 "거리 막대"
 * 표현을 재사용해 stage 높이를 고정한다.
 */
const SCENES = [
  "2차원: 거리 차이가 크다",
  "1,000차원: 거리가 몰린다",
  "JL 사영: 낮은 차원에서도 거리 보존",
  "Latent bottleneck: intrinsic dimension만 남긴다",
] as const;

const NOTES = [
  "d=2에서 무작위 점 5개의 최근접·최원접 거리는 1.2와 8.7로, 비율이 7.3배나 됩니다.",
  "같은 방식으로 d=1,000이면 최근접·최원접 거리가 31.1과 33.4로 좁아져 비율이 1.07배까지 줄어듭니다.",
  "JL lemma는 n=1,000,000개 점을 k≈17,763차원에 사영해도 모든 거리가 (1±0.1)배 안에 남는다고 보장합니다.",
  "ImageNet은 150,528 ambient 차원이지만 intrinsic dimension은 26~43입니다. 32차원 bottleneck은 그 폭 바로 위에서 정보를 지킵니다.",
] as const;

type Bar = { label: string; value: number; max: number };

const SCENE_BARS: readonly Bar[][] = [
  [
    { label: "최근접", value: 1.2, max: 10 },
    { label: "최원접", value: 8.7, max: 10 },
  ],
  [
    { label: "최근접", value: 31.1, max: 40 },
    { label: "최원접", value: 33.4, max: 40 },
  ],
  [
    { label: "ambient d", value: 100000, max: 100000 },
    { label: "JL k (k≈17,763)", value: 17763, max: 100000 },
  ],
  [
    { label: "ambient (150,528px)", value: 150528, max: 150528 },
    { label: "bottleneck (32)", value: 32, max: 150528 },
    { label: "intrinsic dim (26~43)", value: 43, max: 150528 },
  ],
];

export default function MathHighDimensionalGeometryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const bars = SCENE_BARS[scenes.active];

  return (
    <VizFrame
      eyebrow="고차원 기하 · JL lemma · intrinsic dimension"
      title="차원이 늘수록 거리는 무너지지만, 낮은 intrinsic dimension이 그 틈을 메운다"
      description="같은 막대 비교를 네 장면에 재사용해 거리 집중 → JL 사영 → latent bottleneck으로 이어지는 흐름을 보여 줍니다."
      note="실제 분포는 데이터마다 다르며, 이 수치는 균등분포 무작위 점과 Dasgupta–Gupta 하한·Pope et al. 2021 추정치를 단순화한 예시입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="고차원 거리 집중과 JL 사영, latent bottleneck"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[24rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-6 space-y-3">
            {bars.map((bar) => {
              const width = Math.max(4, Math.round((bar.value / bar.max) * 100));
              return (
                <div key={bar.label} className="min-w-0">
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-bold text-foreground">{bar.label}</span>
                    <span className="font-mono text-muted-foreground">{bar.value.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-3 w-full overflow-hidden border border-border bg-muted/40">
                    <div
                      className="h-full bg-primary/60"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
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
