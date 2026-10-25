import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 3절의 X(2×4)·W(4×2)에서 입력 채널 네 개가 INT8 눈금을 몇 개씩 얻는지 보여 준다.
 * 한 mechanism: s_j = max|X_j|^α / max|W_j|^(1-α) 로 나누고 곱한 뒤, 채널 j의 유효 눈금 = 2^8 · m_j / m.
 * 막대는 0~256 같은 눈금이라 장면 사이 길이를 직접 비교할 수 있다.
 */
const SCENES = ["옮기기 전", "α = 0", "α = 0.5", "α = 1"] as const;

const X_MAX = [1, 2, 64, 1] as const;
const W_MAX = [0.5, 0.5, 0.25, 0.5] as const;
const ALPHAS = [null, 0, 0.5, 1] as const;

const NOTES = [
  "activation은 채널 3의 64가 전체 최댓값이라 채널 1·4가 눈금 4개만 씁니다. weight는 고르게 128~256개를 씁니다.",
  "s_j = 1/max|W_j|로 weight를 평평하게 만들면 activation 채널 3이 여전히 16으로 커서 채널 1·4는 8개입니다.",
  "두 쪽 최댓값이 채널마다 √(m_X·m_W)로 같아집니다. 가장 적은 눈금이 양쪽 모두 45개로 올라갑니다.",
  "s_j = max|X_j|로 activation을 모두 1로 맞추면 weight 채널 3이 16이 되어 채널 1·4의 weight가 8개로 떨어집니다.",
] as const;

function scales(alpha: number | null) {
  return X_MAX.map((x, j) => (alpha === null ? 1 : x ** alpha / W_MAX[j] ** (1 - alpha)));
}

function levels(values: readonly number[]) {
  const top = Math.max(...values);
  return values.map((v) => (256 * v) / top);
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3 min-w-0 flex-1 rounded-sm bg-muted/60">
        <div
          className="h-full rounded-sm transition-[width] duration-500"
          style={{ width: `${Math.max((value / 256) * 100, 1)}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-9 shrink-0 text-right font-mono text-[11px] font-bold text-foreground">{Math.round(value)}</span>
    </div>
  );
}

export default function SmoothquantActivationSmoothingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const scene = scenes.reducedMotion ? SCENES.length - 1 : scenes.active;
  const s = scales(ALPHAS[scene]);
  const xHat = X_MAX.map((x, j) => x / s[j]);
  const wHat = W_MAX.map((w, j) => w * s[j]);
  const xLevels = levels(xHat);
  const wLevels = levels(wHat);

  return (
    <VizFrame
      eyebrow="Activation smoothing"
      title="나누는 비율 α에 따라 눈금이 activation과 weight 사이를 오갑니다"
      description="행은 입력 채널 1~4입니다. 주황 막대는 activation, 파랑 막대는 weight가 그 채널에서 쓰는 INT8 눈금 수이며 최대 256입니다."
      note="X·W 값은 3절의 설명용 가정입니다. 눈금 수는 논문 3절의 2^8·m_j/m 근사를 따릅니다."
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="채널별 activation과 weight의 INT8 눈금 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            장면 · {String(scene + 1).padStart(2, "0")}
          </p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h4 className="text-base font-bold">{SCENES[scene]}</h4>
            <p className="font-mono text-xs text-muted-foreground">
              X 최댓값 <span className="font-bold text-foreground">{Math.max(...xHat).toFixed(Math.max(...xHat) < 10 ? 2 : 0)}</span>
              {" · "}최소 눈금{" "}
              <span className="font-bold text-foreground">
                X {Math.round(Math.min(...xLevels))} / W {Math.round(Math.min(...wLevels))}
              </span>
            </p>
          </div>

          <div className="mt-3 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs">
            <span />
            <div className="flex justify-between font-bold">
              <span style={{ color: "#d97706" }}>activation 눈금</span>
              <span style={{ color: "#2563eb" }}>weight 눈금</span>
            </div>
            {X_MAX.map((_, j) => (
              <div key={j} className="contents">
                <div className="flex flex-col justify-center font-mono leading-5">
                  <span className="font-bold text-foreground">ch {j + 1}</span>
                  <span className="text-[10px] text-muted-foreground">s={s[j] >= 10 ? s[j].toFixed(0) : s[j].toFixed(2)}</span>
                </div>
                <div className="space-y-1">
                  <Bar value={xLevels[j]} color="#d97706" />
                  <Bar value={wLevels[j]} color="#2563eb" />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 min-h-[6.25rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} active={scene} labels={SCENES} />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
