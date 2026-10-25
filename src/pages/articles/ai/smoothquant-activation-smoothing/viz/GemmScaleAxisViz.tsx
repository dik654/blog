import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * Y = X·W 에서 scale이 붙는 축을 칸으로 보여 준다.
 * 한 mechanism: 출력 칸 Y[t][c]는 입력 채널 j 네 개를 더한 값이다. t·c 축 scale은 합 밖으로 빼낼 수 있지만
 * j 축 scale은 합 안의 항마다 달라 정수 누산을 끊는다. SmoothQuant는 그 j 축 몫을 W에 미리 곱한다.
 */
const SCENES = ["token 축 scale", "출력 채널 축 scale", "입력 채널 축 scale", "W에 미리 곱하기"] as const;

const T = 2;
const CI = 4;
const CO = 2;

type Axis = "t" | "c" | "j" | "fold";
const AXES: readonly Axis[] = ["t", "c", "j", "fold"];

const FORMULAS = [
  "Y[t][c] = Δ_t · Σ_j x̄[t][j]·w̄[j][c] · Δ_c",
  "Y[t][c] = Δ_t · Σ_j x̄[t][j]·w̄[j][c] · Δ_c",
  "Y[t][c] = Σ_j Δ_j · x̄[t][j]·w̄[j][c]",
  "Y[t][c] = Δ_t · Σ_j x̄[t][j]·(s_j·w)̄[j][c] · Δ_c",
] as const;

const NOTES = [
  "token마다 다른 Δ_t는 X의 행 전체에 같은 값입니다. 정수 합을 끝낸 뒤 Y의 행에 한 번 곱하면 됩니다.",
  "출력 채널마다 다른 Δ_c는 W의 열 전체에 같은 값입니다. 이것도 합이 끝난 뒤 Y의 열에 곱합니다.",
  "입력 채널마다 다른 Δ_j는 합 안의 네 항이 각각 다른 값을 곱해야 합니다. 정수 누산 중간에 실수 곱셈이 끼어듭니다.",
  "j 축의 크기 차이를 s_j로 X에서 나누고 W 행에 곱해 두면, 실행 중에는 바깥 축 scale만 남습니다.",
] as const;

function cellTone(active: boolean, color: string) {
  return active
    ? { borderColor: color, backgroundColor: `${color}1f` }
    : { borderColor: "#d4d4d8", backgroundColor: "transparent" };
}

export default function GemmScaleAxisViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const scene = scenes.reducedMotion ? SCENES.length - 1 : scenes.active;
  const axis = AXES[scene];
  const blocked = axis === "j";
  const xColor = axis === "j" ? "#dc2626" : "#d97706";
  const wColor = "#2563eb";

  const xActive = (t: number, j: number) =>
    (axis === "t" && t === 0) || (axis === "j" && j === 2) || (axis === "fold" && j === 2);
  const wActive = (j: number, c: number) =>
    (axis === "c" && c === 0) || (axis === "j" && j === 2) || (axis === "fold" && j === 2);
  const yActive = (t: number, c: number) =>
    (axis === "t" && t === 0) || (axis === "c" && c === 0) || ((axis === "j" || axis === "fold") && t === 0 && c === 0);

  return (
    <VizFrame
      eyebrow="INT8 GEMM scale axis"
      title="정수 곱셈은 합 밖의 두 축에만 scale을 되돌릴 수 있습니다"
      description="왼쪽은 X(token 2 × 입력 채널 4), 가운데는 W(입력 채널 4 × 출력 채널 2), 오른쪽은 Y입니다. 색칠한 칸이 같은 scale을 공유하는 칸입니다."
      note="X·W 크기는 3절의 설명용 사례입니다. Δ는 INT8 code를 실수로 되돌리는 간격입니다."
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="INT8 행렬곱에서 scale을 적용할 수 있는 축"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            장면 · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:gap-x-3">
            <div>
              <p className="mb-1 text-center font-mono text-[11px] font-bold text-muted-foreground">X</p>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: T * CI }, (_, k) => {
                  const t = Math.floor(k / CI);
                  const j = k % CI;
                  return (
                    <div
                      key={k}
                      className="flex h-7 w-7 items-center justify-center rounded-sm border font-mono text-[10px] transition-colors duration-300 sm:h-8 sm:w-8"
                      style={cellTone(xActive(t, j), xColor)}
                    >
                      {t + 1},{j + 1}
                    </div>
                  );
                })}
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-muted-foreground">×</span>
            <div>
              <p className="mb-1 text-center font-mono text-[11px] font-bold text-muted-foreground">
                {axis === "fold" ? "diag(s)·W" : "W"}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: CI * CO }, (_, k) => {
                  const j = Math.floor(k / CO);
                  const c = k % CO;
                  return (
                    <div
                      key={k}
                      className="flex h-7 w-7 items-center justify-center rounded-sm border font-mono text-[10px] transition-colors duration-300 sm:h-8 sm:w-8"
                      style={cellTone(wActive(j, c), axis === "j" ? "#dc2626" : wColor)}
                    >
                      {j + 1},{c + 1}
                    </div>
                  );
                })}
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-muted-foreground">=</span>
            <div>
              <p className="mb-1 text-center font-mono text-[11px] font-bold text-muted-foreground">Y</p>
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: T * CO }, (_, k) => {
                  const t = Math.floor(k / CO);
                  const c = k % CO;
                  return (
                    <div
                      key={k}
                      className="flex h-7 w-7 items-center justify-center rounded-sm border font-mono text-[10px] transition-colors duration-300 sm:h-8 sm:w-8"
                      style={cellTone(yActive(t, c), blocked ? "#dc2626" : "#0d9488")}
                    >
                      {t + 1},{c + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p
            className="mt-2 break-words rounded-sm border px-3 py-2 text-center font-mono text-xs sm:mt-4"
            style={{ borderColor: blocked ? "#dc2626" : "#d4d4d8" }}
          >
            {FORMULAS[scene]}
          </p>

          <p className="mt-2 min-h-[6.25rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:mt-4 sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} active={scene} labels={SCENES} />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
