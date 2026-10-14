import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * -ngl 값에 따라 어느 층이 GPU에 놓이는지와 GPU에 쌓이는 byte를 함께 센다.
 * 한 mechanism: i_gpu_start = 33 − ngl 보다 번호가 작은 층은 CPU, 나머지와 출력층은 GPU.
 */
const SCENES = ["-ngl 0", "-ngl 25", "-ngl 33", "-ngl 26은 넘침"] as const;
const NGL = [0, 25, 33, 26] as const;

const LAYERS = 32;
const LAYER_MB = 189.8;
const OUTPUT_MB = 295.5;
const BUDGET_MB = 5000;
const SCALE_MB = 7000;

const NOTES = [
  "모든 층이 CPU에 남습니다. GPU는 쓰지 않고, 토큰마다 32층과 출력층을 전부 CPU가 계산합니다.",
  "i_gpu_start = 33 − 25 = 8입니다. 층 8~31의 24개와 출력층이 GPU에 가고 4,851MB를 씁니다. 가정한 5,000MB 안입니다.",
  "i_gpu_start = 0입니다. 층 32개와 출력층이 모두 GPU에 가며 6,369MB가 필요해 가정한 5,000MB GPU에는 들어가지 않습니다.",
  "층 하나를 더 올리면 25층과 출력층으로 5,041MB가 되어 예산을 41MB 넘습니다. 그래서 이 가정에서는 25가 상한입니다.",
] as const;

export default function LayerOffloadViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const ngl = NGL[scene];
  const start = Math.max(LAYERS + 1 - ngl, 0);
  const gpuLayers = ngl === 0 ? 0 : Math.min(ngl, LAYERS + 1) - 1;
  const gpuMb = ngl === 0 ? 0 : gpuLayers * LAYER_MB + OUTPUT_MB;
  const over = gpuMb > BUDGET_MB;
  const gpuColor = over ? "bg-rose-600" : "bg-blue-600";

  return (
    <VizFrame
      eyebrow="Layer offload"
      title="-ngl은 뒤쪽 층부터 GPU에 올리고 출력층을 하나로 셉니다"
      description="칸 하나가 층 하나입니다. 맨 왼쪽은 입력 embedding, 그 뒤가 층 0~31, 맨 오른쪽이 출력층입니다. 색이 칠해진 칸이 GPU에 놓인 층입니다."
      note="층당 189.8MB는 Q4_K 가중치 122.7MB와 n_ctx 16,384의 f16 KV 67.1MB를 더한 가정값입니다. 실행 버퍼는 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GPU에 올린 층 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4" role="img" aria-label={`GPU 층 ${gpuLayers}개와 출력층`}>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>embd · 층 0</span>
              <span>층 31 · 출력</span>
            </div>
            <div className="mt-1 flex h-10 w-full gap-px">
              {Array.from({ length: LAYERS + 2 }, (_, index) => {
                const isInput = index === 0;
                const layer = index - 1;
                const onGpu = !isInput && ngl > 0 && layer >= start;
                return (
                  <div
                    key={index}
                    className={`h-full rounded-[1px] transition-colors duration-300 ${onGpu ? gpuColor : "bg-muted-foreground/25"} ${
                      isInput || index === LAYERS + 1 ? "flex-[1.6]" : "flex-1"
                    }`}
                  />
                );
              })}
            </div>

            <div className="mt-5 flex justify-between text-[11px] text-muted-foreground">
              <span>GPU 사용</span>
              <span>예산 5,000MB (점선)</span>
            </div>
            <div className="relative mt-1 h-3 w-full rounded-sm bg-muted/60">
              <div className={`h-full rounded-sm ${gpuColor} opacity-70`} style={{ width: `${Math.min(gpuMb / SCALE_MB, 1) * 100}%` }} />
              <div className="absolute -inset-y-1 border-r border-dashed border-foreground" style={{ left: `${(BUDGET_MB / SCALE_MB) * 100}%` }} />
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">i_gpu_start</dt>
              <dd className="font-bold text-foreground">{start}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">GPU 반복 층</dt>
              <dd className="font-bold text-foreground">{gpuLayers}개</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">GPU 사용</dt>
              <dd className={`font-bold ${over ? "text-rose-600" : "text-foreground"}`}>{Math.round(gpuMb).toLocaleString()}MB</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
