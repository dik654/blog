import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: Q block × K/V block 격자에서 kernel 이 실제로 계산하는 tile 이
 * prefill, causal, decode 마다 어떻게 달라지는지. 격자는 4×4 로 줄였다.
 * stage 높이는 네 장면의 최대 필요 크기로 고정하고 control row 는 아래 고정 row 에 둔다.
 */
const SCENES = ["Prefill · 전체 격자", "Causal · 대각선 위 skip", "Decode · query 한 행", "Decode · K/V 축 분할"] as const;

const NOTES = [
  "Prefill 은 Q block 4 개가 K/V block 4 개를 모두 만나 tile 16 개를 계산합니다. Tile 마다 QK matmul, softmax, PV matmul 이 register 안에서 끝납니다.",
  "Causal mask 에서는 j > i 인 tile 6 개를 읽지도 않고 건너뜁니다. 대각선 tile 4 개만 원소별 비교가 필요하고, 나머지 6 개는 비교 없이 통과합니다.",
  "Decode 는 query 가 한 행뿐이라 Q block 하나가 K/V block 4 개를 읽습니다. FLOP 은 작고 K/V byte 는 그대로라 byte 당 FLOP 이 1 근처로 떨어집니다.",
  "Q 축 병렬이 무의미하므로 K/V block 4 개를 SM 4 개가 나눠 맡고, 각자의 부분 max·normalizer·출력을 마지막에 online softmax 보정식으로 합칩니다.",
] as const;

type TileKind = "full" | "diag" | "skip" | "idle" | "split";

function tileKind(scene: number, i: number, j: number): TileKind {
  if (scene === 0) return "full";
  if (scene === 1) return j > i ? "skip" : j === i ? "diag" : "full";
  if (scene === 2) return i === 3 ? "full" : "idle";
  return i === 3 ? "split" : "idle";
}

const KIND_CLASS: Record<TileKind, string> = {
  full: "fill-primary/25 stroke-primary",
  diag: "fill-amber-500/25 stroke-amber-600",
  skip: "fill-transparent stroke-border",
  idle: "fill-transparent stroke-border",
  split: "fill-primary/25 stroke-primary",
};

const KIND_LABEL: Record<TileKind, string> = {
  full: "계산",
  diag: "mask",
  skip: "skip",
  idle: "",
  split: "SM",
};

const SUMMARY = [
  { tiles: "16 / 16", flop: "4N²d", bytes: "Q, K, V, O", intensity: "N/b ≈ 2,048 FLOP/B" },
  { tiles: "10 / 16", flop: "≈ 2N²d", bytes: "Q, K, V, O", intensity: "≈ N/2b ≈ 1,024 FLOP/B" },
  { tiles: "4 / 16", flop: "4Ld", bytes: "K, V 전체", intensity: "2/b = 1 FLOP/B" },
  { tiles: "4 / 16 · SM 4 개", flop: "4Ld", bytes: "K, V 전체", intensity: "2/b = 1 FLOP/B" },
] as const;

const CELL = 44;
const GAP = 6;
const ORIGIN = 40;
const SIZE = ORIGIN + 4 * (CELL + GAP) + 8;

export default function AttentionKernelAnatomyAndBackendsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const summary = SUMMARY[scenes.active];
  return (
    <VizFrame
      eyebrow="Attention kernel · tile 격자"
      title="같은 수식이라도 kernel 이 계산하는 tile 은 prefill, causal, decode 마다 다릅니다"
      description="행은 Q block i, 열은 K/V block j 입니다. 색이 있는 칸이 실제로 QK matmul 을 수행하는 tile 이고, 빈 칸은 읽지 않는 tile 입니다."
      note="실제 격자는 N/B_r × N/B_c 로 4096/128 이면 32×32 입니다. 그림은 4×4 로 줄였고 수치는 N=4096, d=128, FP16 기준입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Attention kernel 이 계산하는 tile 격자의 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="mx-auto h-auto w-full max-w-[16rem]"
              role="img"
              aria-label="Q block 과 K/V block 의 4×4 tile 격자"
            >
              <text x={ORIGIN + 2 * (CELL + GAP) - GAP / 2} y={14} textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">
                K/V block j
              </text>
              <text
                x={12}
                y={ORIGIN + 2 * (CELL + GAP) - GAP / 2}
                textAnchor="middle"
                transform={`rotate(-90 12 ${ORIGIN + 2 * (CELL + GAP) - GAP / 2})`}
                className="fill-muted-foreground text-[10px] font-bold"
              >
                Q block i
              </text>
              {[0, 1, 2, 3].map((j) => (
                <text key={`c${j}`} x={ORIGIN + j * (CELL + GAP) + CELL / 2} y={ORIGIN - 8} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">
                  {j}
                </text>
              ))}
              {[0, 1, 2, 3].map((i) => (
                <text key={`r${i}`} x={ORIGIN - 8} y={ORIGIN + i * (CELL + GAP) + CELL / 2 + 4} textAnchor="end" className="fill-muted-foreground font-mono text-[10px]">
                  {i}
                </text>
              ))}
              {[0, 1, 2, 3].flatMap((i) =>
                [0, 1, 2, 3].map((j) => {
                  const kind = tileKind(scenes.active, i, j);
                  const x = ORIGIN + j * (CELL + GAP);
                  const y = ORIGIN + i * (CELL + GAP);
                  return (
                    <g key={`${i}-${j}`}>
                      <rect
                        x={x}
                        y={y}
                        width={CELL}
                        height={CELL}
                        strokeWidth={1}
                        strokeDasharray={kind === "skip" || kind === "idle" ? "3 3" : undefined}
                        className={KIND_CLASS[kind]}
                      />
                      {KIND_LABEL[kind] && (
                        <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" className="fill-foreground font-mono text-[9px]">
                          {kind === "split" ? `SM ${j}` : KIND_LABEL[kind]}
                        </text>
                      )}
                    </g>
                  );
                }),
              )}
            </svg>
            <div className="min-w-0 space-y-1.5">
              {[
                { label: "계산하는 tile", value: summary.tiles },
                { label: "Head 당 FLOP", value: summary.flop },
                { label: "HBM 에서 읽는 것", value: summary.bytes },
                { label: "Compute intensity", value: summary.intensity },
              ].map((row) => (
                <div key={row.label} className="flex min-h-8 items-center justify-between gap-3 border border-border px-2 text-xs">
                  <span className="shrink-0 text-muted-foreground">{row.label}</span>
                  <span className="truncate text-right font-mono">{row.value}</span>
                </div>
              ))}
              <div className="flex min-h-8 items-center justify-between gap-3 border border-primary/50 px-2 text-xs">
                <span className="shrink-0 text-muted-foreground">Ridge point (H100)</span>
                <span className="font-mono">≈ 295 FLOP/B</span>
              </div>
            </div>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
