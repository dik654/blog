import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: attention의 KV 기록은 token마다 자라고, linear attention·SSM의 state는
 * 같은 자리를 계속 다시 쓸 뿐 크기가 늘지 않는다. d=128, n=64K, FP16 KV·FP32 state 기준.
 * stage 높이는 네 장면의 최대 필요 크기로 고정한다.
 */
const SCENES = ["Attention · token마다 KV 추가", "Linear attention · state는 제자리만 갱신", "n=64K 시점 · 512배 차이", "Hybrid · 8층 중 1층만 attention"] as const;

const NOTES = [
  "Token이 하나 늘 때마다 새 key·value 열이 기록 끝에 붙습니다. d=128, FP16이면 token 하나가 512 byte를 더하고, 기록 전체 크기는 문맥 길이에 정비례해 자랍니다.",
  "State는 d×d=16,384개 값을 가진 행렬 하나뿐입니다. 새 token은 이 행렬의 같은 좌표를 rank-1 항으로 다시 쓸 뿐이라, 문맥이 아무리 길어져도 칸 수는 늘지 않습니다.",
  "n=65,536(64K) token에서 attention 기록은 32 MiB, recurrent state는 64 KiB로 고정됩니다. 비는 512배이고, 문맥이 더 길어질수록 이 차이는 그대로 벌어집니다.",
  "Layer 8개 중 1개만 attention으로 남기면 KV 32 MiB짜리 layer는 1개, 나머지 7개는 64 KiB짜리 state입니다. 전부 attention일 때보다 총 기록이 약 8배 줄면서도 그 1개 layer가 정확한 조회를 맡습니다.",
] as const;

const KV_STEPS = [18, 34, 55, 82, 100] as const;

const SUMMARY = [
  { left: "KV 기록", leftValue: "token마다 +512 B", right: "State", rightValue: "항상 64 KiB" },
  { left: "State 칸 수", leftValue: "16,384 (고정)", right: "갱신", rightValue: "rank-1 항 1개/token" },
  { left: "Attention (n=64K)", leftValue: "32 MiB", right: "State (n=64K)", rightValue: "64 KiB · 1/512" },
  { left: "전부 attention (8층)", leftValue: "8 × 32 MiB", right: "Hybrid (1/8)", rightValue: "≈ 1/8 크기" },
] as const;

export default function LinearAttentionAndStateSpaceModelsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const active = scenes.active;
  const summary = SUMMARY[active];

  return (
    <VizFrame
      eyebrow="Sequence mixer · 기억의 두 형태"
      title="Attention의 기록은 token마다 자라고, linear attention·SSM의 state는 자리만 다시 씁니다"
      description="왼쪽은 attention이 쌓는 token별 key·value 기록이고, 오른쪽은 linear attention·SSM이 유지하는 고정 크기 state입니다. 장면을 넘기면 같은 문맥 길이에서 둘의 크기가 어떻게 갈리는지 보입니다."
      note="d=128, FP16 attention KV(2 byte/원소), FP32 recurrent state(4 byte/원소) 기준이며 batch 1·head 1 단순화입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Attention KV 성장과 recurrent state 고정 크기의 대비"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(active + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="border border-amber-500/35 p-3">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300">Attention · KV 기록</p>
              <div className="mt-4 flex h-24 items-end gap-1 border-b border-border">
                {KV_STEPS.map((height, index) => {
                  const isAttentionLayer = active !== 3 || index === 0;
                  return (
                    <span
                      key={index}
                      className={`w-full transition-[height] duration-500 ${
                        isAttentionLayer ? "border border-amber-500/45 bg-amber-500/20" : "border border-border bg-muted/40"
                      }`}
                      style={{ height: `${isAttentionLayer ? height : 8}%` }}
                    />
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {active < 2 ? "Token 5개 예시 · 기록이 계속 자람" : active === 2 ? "n=64K · 32 MiB" : "8층 중 1층만 attention · 나머지는 fixed state"}
              </p>
            </div>

            <div className="border border-sky-500/35 p-3">
              <p className="text-xs font-bold text-sky-700 dark:text-sky-300">Linear attention · SSM state</p>
              <div className="mt-4 grid h-24 grid-cols-8 gap-1" aria-label="고정 크기 state 행렬">
                {Array.from({ length: 32 }).map((_, index) => (
                  <span
                    key={index}
                    className={`border transition-colors duration-500 ${
                      active === 1 && index % 4 === 0
                        ? "border-sky-500/60 bg-sky-500/30"
                        : "border-sky-500/25 bg-sky-500/10"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {active < 2 ? "d×d = 16,384 칸 · 크기 고정" : active === 2 ? "n과 무관 · 64 KiB" : "7층 × 64 KiB ≈ 1.75 MiB"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex min-h-8 items-center justify-between gap-2 border border-border px-2">
              <span className="text-muted-foreground">{summary.left}</span>
              <span className="font-mono">{summary.leftValue}</span>
            </div>
            <div className="flex min-h-8 items-center justify-between gap-2 border border-border px-2">
              <span className="text-muted-foreground">{summary.right}</span>
              <span className="font-mono">{summary.rightValue}</span>
            </div>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
