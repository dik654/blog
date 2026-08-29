import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 2-stream toy에서 doubly-stochastic mixing 행렬은 layer를 32개 쌓아도
 * norm이 1 근처에 머물지만, 제약 없는 행렬은 같은 깊이에서 급격히 커진다.
 * 두 행렬의 거듭제곱을 미리 계산해 둔 값이라 layer 32 까지도 클라이언트 계산이 없다.
 */
const SCENES = ["1 layer", "8 layer", "16 layer", "32 layer"] as const;
const DEPTHS = [1, 8, 16, 32] as const;

// Frobenius norm of Mᴸ, M = [[0.9,0.1],[0.1,0.9]] (doubly-stochastic) vs [[1.2,0.1],[0.1,0.9]] (제약 없음)
const DS_NORM = [1.2806, 1.014, 1.0004, 1.0];
const BAD_NORM = [1.51, 5.26, 27.55, 758.75];

const NOTES = [
  "두 mixing 행렬 모두 1 layer 뒤에는 원소 크기가 비슷합니다. 차이는 아직 드러나지 않습니다.",
  "8 layer 를 지나면 doubly-stochastic 행렬의 norm 은 이미 1.01 로 안정됐지만, 제약 없는 행렬은 5.26 으로 커졌습니다.",
  "16 layer 에서 doubly-stochastic 행렬은 1.0004 로 사실상 고정됩니다. 제약 없는 행렬은 27.55 로 한 자리 더 커집니다.",
  "32 layer 뒤 doubly-stochastic 행렬의 norm 은 1.0000 이지만, 제약 없는 행렬은 758.75 배로 커집니다. 실제 mHC 논문은 27B 모델에서 이와 같은 종류의 증폭이 최대 3000 배까지 관측된다고 보고합니다.",
] as const;

function barWidth(value: number, max: number) {
  const pct = Math.min(100, (Math.log10(value + 1) / Math.log10(max + 1)) * 100);
  return `${Math.max(4, pct)}%`;
}

export default function HyperConnectionsResidualStreamsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const idx = scenes.active;
  const depth = DEPTHS[idx];
  const dsValue = DS_NORM[idx];
  const badValue = BAD_NORM[idx];
  const maxScale = BAD_NORM[BAD_NORM.length - 1];
  return (
    <VizFrame
      eyebrow="Residual mixing · doubly-stochastic constraint"
      title="같은 2-stream mixing 을 32번 반복하면 doubly-stochastic 행렬만 norm 이 그대로 남습니다"
      description="행·열 합이 1인 mixing 행렬과 그렇지 않은 mixing 행렬을 같은 깊이만큼 반복해서 곱한 결과입니다."
      note="M^L 의 Frobenius norm 을 직접 계산한 toy 값입니다. 실제 model 은 n>2 stream, 학습된 행렬, RMSNorm 을 함께 씁니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Doubly-stochastic mixing 과 제약 없는 mixing 의 깊이별 norm 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[24rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(idx + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[idx]} 뒤의 norm</h4>
          <div className="mt-5 space-y-3 border border-border p-3">
            <div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-foreground">Doubly-stochastic mixing</span>
                <span className="font-mono text-foreground">{dsValue.toFixed(4)}</span>
              </div>
              <div className="mt-1 h-3 w-full border border-border">
                <div className="h-full bg-primary/30" style={{ width: barWidth(dsValue, maxScale) }} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-foreground">제약 없는 mixing</span>
                <span className="font-mono text-foreground">{badValue.toFixed(2)}</span>
              </div>
              <div className="mt-1 h-3 w-full border border-border">
                <div className="h-full bg-primary/70" style={{ width: barWidth(badValue, maxScale) }} />
              </div>
            </div>
            <p className="border-t border-dashed border-border pt-2 font-mono text-[10px] text-muted-foreground">
              depth L = {depth} · 막대 길이는 log 축입니다
            </p>
          </div>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[idx]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
