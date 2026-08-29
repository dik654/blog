import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 유효숫자가 적을수록(precision) 반올림 오차가 커지고, 계산
 * 순서(stability)에 따라 그 오차가 폭발하거나 사라지며, shape가 어긋나면
 * 예외 없이 다른 축으로 계산된다. 4 장면 모두 같은 막대·격자 표현을 재사용한다.
 */
const SCENES = [
  "FP32·FP16·BF16의 유효숫자",
  "Softmax: 불안정한 계산 순서",
  "Softmax: 안정화된 계산 순서",
  "Broadcasting: shape가 조용히 어긋난다",
] as const;

const NOTES = [
  "Mantissa bit가 많을수록(FP32=23) 유효숫자가 늘고, BF16(7bit)은 FP32와 표현 범위는 같지만 유효숫자는 더 적습니다.",
  "Logit [1000,1001,1002]를 그대로 exp에 넣으면 FP32 표현 범위(약 e^88.7)를 넘어 inf·NaN이 됩니다.",
  "최댓값 1002를 먼저 빼면 [-2,-1,0]이 되어 exp가 [0.135,0.368,1.0]으로 안전한 범위에 남고 결과는 수학적으로 동일합니다.",
  "Shape (3,1)+(3,)은 예외 없이 (3,3)으로 broadcast되어, 의도한 원소별 합 3개 대신 조합 9개가 조용히 나옵니다.",
] as const;

type Bar = { label: string; value: number; max: number };

const SCENE_BARS: readonly Bar[][] = [
  [
    { label: "FP32 유효숫자(자리)", value: 7.2, max: 8 },
    { label: "FP16 유효숫자(자리)", value: 3.3, max: 8 },
    { label: "BF16 유효숫자(자리)", value: 2.3, max: 8 },
  ],
  [
    { label: "exp(1000) → inf", value: 100, max: 100 },
    { label: "FP32 표현 상한(≈e^88.7)", value: 89, max: 100 },
  ],
  [
    { label: "exp(-2)", value: 13.5, max: 100 },
    { label: "exp(-1)", value: 36.8, max: 100 },
    { label: "exp(0)", value: 100, max: 100 },
  ],
  [
    { label: "의도: (3,) 원소별 합 3개", value: 3, max: 9 },
    { label: "실제: (3,3) broadcast 9개", value: 9, max: 9 },
  ],
];

export default function MathNumericalPrecisionStabilityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const bars = SCENE_BARS[scenes.active];

  return (
    <VizFrame
      eyebrow="Floating-point precision · numerical stability · tensor shape"
      title="유효숫자가 적을수록, 계산 순서가 나쁠수록, shape가 어긋날수록 결과가 조용히 틀어진다"
      description="같은 막대 비교를 네 장면에 재사용해 precision → stability → shape 계약으로 이어지는 세 가지 조용한 실패를 보여 줍니다."
      note="수치는 IEEE 754 정의와 표준 softmax 안정화 기법을 단순화한 예시이며, 실제 하드웨어 rounding 결과는 구현마다 미세하게 다를 수 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="부동소수점 정밀도, 수치 안정성, tensor shape 계약"
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
                    <span className="font-mono text-muted-foreground">{bar.value}</span>
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
