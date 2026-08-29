import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 5-token 분포가 temperature 로 모양이 바뀌고, top-k·top-p 로 잘려
 * 재정규화되는 과정. 막대 높이가 확률이고, 잘린 token 은 점선 테두리로 남아 재정규화 전
 * 값을 비교할 수 있게 한다. stage 높이는 다섯 장면의 최대 필요 크기로 고정한다.
 */
const SCENES = ["원본 분포", "T=0.5 로 날카롭게", "T=2 로 평평하게", "Top-k=2 절단·재정규화", "Top-p=0.8 절단·재정규화"] as const;

const NOTES = [
  "5개 token 분포 [0.50, 0.20, 0.15, 0.10, 0.05] 입니다. 이 값 위에서 temperature 와 truncation 이 차례로 적용됩니다.",
  "Logit 을 T=0.5 로 나누면 원래 확률을 p^(1/0.5)=p² 로 올린 것과 같아 [0.769, 0.123, 0.069, 0.031, 0.008] 로 1등에 더 몰립니다.",
  "T=2 는 p^(1/2)=√p 로 올린 것과 같아 [0.340, 0.215, 0.186, 0.152, 0.107] 로 다섯 token 이 서로 가까워집니다.",
  "원본 분포에 top-k=2 를 적용하면 A, B 만 남고(점선은 폐기) 합 0.7 로 나눠 0.714, 0.286 이 됩니다. C 는 B 와 큰 차이가 없어도 버려집니다.",
  "같은 분포에 top-p=0.8 을 적용하면 누적 0.85 에서 넘어 A, B, C 가 남고 0.588, 0.235, 0.176 으로 재정규화됩니다. Top-k=2 보다 하나 더 남습니다.",
] as const;

const LABELS = ["A", "B", "C", "D", "E"] as const;
const ORIGINAL = [0.5, 0.2, 0.15, 0.1, 0.05];
const T_SHARP = [0.769, 0.123, 0.069, 0.031, 0.008];
const T_FLAT = [0.34, 0.215, 0.186, 0.152, 0.107];
const TOPK2 = [0.714, 0.286, 0, 0, 0];
const TOPP8 = [0.588, 0.235, 0.176, 0, 0];

const BY_SCENE: readonly (readonly number[])[] = [ORIGINAL, T_SHARP, T_FLAT, TOPK2, TOPP8];
const KEPT_COUNT = [5, 5, 5, 2, 3];
const SUBTITLE = [
  "합 1.00 · truncation 이전",
  "합 1.00 · logit/0.5",
  "합 1.00 · logit/2",
  "합 0.70→1.00 · k=2 고정",
  "합 0.85→1.00 · p=0.8 가변",
];

const BAR_W = 26;
const GAP = 12;
const CHART_H = 96;
const ORIGIN_X = 20;
const ORIGIN_Y = 112;

export default function LlmSamplingStrategiesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = scenes.active;
  const values = BY_SCENE[scene];
  const isTruncation = scene >= 3;

  return (
    <VizFrame
      eyebrow="Temperature · top-k · top-p"
      title="같은 분포가 temperature 로 모양을 바꾸고 top-k·top-p 로 잘려 재정규화됩니다"
      description="막대 높이가 각 token 의 확률입니다. Truncation 장면에서 점선 막대는 폐기된 token 의 원래 확률을 보여 줍니다."
      note="분포는 5개 token 으로 단순화했습니다. 실제 vocabulary 는 수만 개 token 에 걸쳐 같은 규칙이 적용됩니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Temperature·top-k·top-p 가 분포를 바꾸고 자르는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
          <div className="mt-4 border border-border p-3">
            <svg
              viewBox={`0 0 ${ORIGIN_X + 5 * (BAR_W + GAP)} 130`}
              className="mx-auto h-auto w-full max-w-[22rem]"
              role="img"
              aria-label={`${SCENES[scene]} 막대 그래프`}
            >
              <line x1={ORIGIN_X - 4} y1={ORIGIN_Y} x2={ORIGIN_X + 5 * (BAR_W + GAP) - GAP + 4} y2={ORIGIN_Y} strokeWidth={1} className="stroke-border" />
              {values.map((v, i) => {
                const kept = v > 0;
                const barH = v * CHART_H;
                const x = ORIGIN_X + i * (BAR_W + GAP);
                const discardedH = isTruncation && !kept ? ORIGINAL[i] * CHART_H : 0;
                return (
                  <g key={LABELS[i]}>
                    {isTruncation && !kept && (
                      <rect
                        x={x}
                        y={ORIGIN_Y - discardedH}
                        width={BAR_W}
                        height={discardedH}
                        strokeWidth={1}
                        strokeDasharray="2 3"
                        className="fill-transparent stroke-muted-foreground"
                      />
                    )}
                    {kept && (
                      <rect
                        x={x}
                        y={ORIGIN_Y - barH}
                        width={BAR_W}
                        height={barH}
                        strokeWidth={1}
                        className={i < KEPT_COUNT[scene] && isTruncation ? "fill-primary/25 stroke-primary" : "fill-muted-foreground/15 stroke-muted-foreground"}
                      />
                    )}
                    <text x={x + BAR_W / 2} y={ORIGIN_Y + 12} textAnchor="middle" className="fill-muted-foreground font-mono text-[8px]">
                      {LABELS[i]}
                    </text>
                    <text
                      x={x + BAR_W / 2}
                      y={kept ? ORIGIN_Y - barH - 4 : ORIGIN_Y - discardedH - 4}
                      textAnchor="middle"
                      className={`font-mono text-[7px] ${kept ? "fill-foreground" : "fill-muted-foreground"}`}
                    >
                      {v > 0 ? v.toFixed(3) : `(${ORIGINAL[i].toFixed(2)})`}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">{SUBTITLE[scene]}</p>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
