import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: n×n attention mask에서 query 행(i)이 실제로 보는 key 열(j)이
 * dense·window·sparse+global·hybrid-layer 마다 어떻게 달라지는지. 격자는 10×10 으로 줄였다.
 * stage 높이는 네 장면의 최대 필요 크기로 고정한다.
 */
const SCENES = ["Dense · 전체 과거", "Sliding-window · 최근 w 만", "Sparse · window + global token", "Hybrid · layer 마다 local/global"] as const;

const NOTES = [
  "Dense attention 은 query i 가 자기보다 앞선 key 전부를 봅니다. Mask 는 대각선 아래 전체이고 FLOP 은 n 의 제곱에 비례합니다.",
  "Window w=3 인 sliding-window attention 은 대각선을 따라가는 좁은 띠만 봅니다. 띠 밖의 칸은 아예 읽지 않습니다.",
  "같은 window 에 global token(0번)을 더하면 0번 행·열 전체가 열립니다. Global token 은 window 밖 정보를 한 layer 만에 주고받는 지름길입니다.",
  "Hybrid 는 attention 하나가 아니라 layer 를 나눕니다. Local layer(위)는 window 만, global layer(아래)는 대각선 아래 전체를 봅니다.",
] as const;

const N = 10;
const WINDOW = 3; // 대각선 포함 앞쪽 3칸
const GLOBAL_IDX = 0;

type CellKind = "on" | "off" | "global";

function denseKind(i: number, j: number): CellKind {
  return j <= i ? "on" : "off";
}

function windowKind(i: number, j: number): CellKind {
  if (j > i) return "off";
  return i - j < WINDOW ? "on" : "off";
}

function sparseKind(i: number, j: number): CellKind {
  if (j > i) return "off";
  if (j === GLOBAL_IDX || i === GLOBAL_IDX) return "global";
  return i - j < WINDOW ? "on" : "off";
}

function hybridKind(i: number, j: number, isGlobalLayer: boolean): CellKind {
  if (j > i) return "off";
  if (isGlobalLayer) return "on";
  return i - j < WINDOW ? "on" : "off";
}

const KIND_CLASS: Record<CellKind, string> = {
  on: "fill-primary/25 stroke-primary",
  off: "fill-transparent stroke-border",
  global: "fill-amber-500/30 stroke-amber-600",
};

const CELL = 22;
const GAP = 2;
const ORIGIN = 22;
const SIZE = ORIGIN + N * (CELL + GAP) + 6;
const GRID_GAP_Y = 16;

function Grid({
  label,
  kindOf,
}: {
  label: string;
  kindOf: (i: number, j: number) => CellKind;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-center text-[10px] font-bold text-muted-foreground">{label}</p>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto h-auto w-full max-w-[13rem]" role="img" aria-label={`${label} attention mask`}>
        <text x={ORIGIN + (N * (CELL + GAP)) / 2 - GAP} y={12} textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold">
          key j
        </text>
        <text
          x={8}
          y={ORIGIN + (N * (CELL + GAP)) / 2 - GAP}
          textAnchor="middle"
          transform={`rotate(-90 8 ${ORIGIN + (N * (CELL + GAP)) / 2 - GAP})`}
          className="fill-muted-foreground text-[8px] font-bold"
        >
          query i
        </text>
        {Array.from({ length: N }).flatMap((_, i) =>
          Array.from({ length: N }).map((_, j) => {
            const kind = kindOf(i, j);
            const x = ORIGIN + j * (CELL + GAP);
            const y = ORIGIN + i * (CELL + GAP);
            return <rect key={`${i}-${j}`} x={x} y={y} width={CELL} height={CELL} strokeWidth={1} className={KIND_CLASS[kind]} />;
          }),
        )}
      </svg>
    </div>
  );
}

const SUMMARY = [
  { visible: "55/100 칸", flop: "O(n²d)", note: "모든 과거를 봄" },
  { visible: "27/100 칸", flop: "O(n·w·d)", note: "최근 w=3 개만" },
  { visible: "≈ 34/100 칸", flop: "O(n·(w+g)·d)", note: "window + global 1개" },
  { visible: "layer 마다 다름", flop: "local: O(n·w·d), global: O(n²d)", note: "layer 비율이 평균을 정함" },
] as const;

export default function SparseWindowedAttentionPatternsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const summary = SUMMARY[scenes.active];
  return (
    <VizFrame
      eyebrow="Attention mask · 패턴 비교"
      title="같은 n×n mask 라도 query 가 실제로 보는 key 의 모양이 패턴마다 다릅니다"
      description="행은 query 위치 i, 열은 key 위치 j 입니다. 색이 있는 칸이 실제로 attention 을 계산하는 (i, j) 쌍이고, 빈 칸은 읽지 않는 쌍입니다."
      note="실제 n 은 32,768 이고 window 는 4,096 입니다. 그림은 10×10, window 3 으로 줄였습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Attention mask 패턴이 dense, window, sparse, hybrid 마다 달라지는 모습"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(36rem,calc(100dvh-15rem))] min-h-[29rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scenes.active + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
            {scenes.active < 3 ? (
              <Grid
                label={scenes.active === 0 ? "Dense" : scenes.active === 1 ? "Sliding-window" : "Window + global"}
                kindOf={scenes.active === 0 ? denseKind : scenes.active === 1 ? windowKind : sparseKind}
              />
            ) : (
              <div className="flex flex-col items-center" style={{ gap: GRID_GAP_Y }}>
                <Grid label="Local layer" kindOf={(i, j) => hybridKind(i, j, false)} />
                <Grid label="Global layer" kindOf={(i, j) => hybridKind(i, j, true)} />
              </div>
            )}
            <div className="min-w-0 space-y-1.5">
              {[
                { label: "실제로 계산하는 칸", value: summary.visible },
                { label: "Attention FLOP", value: summary.flop },
                { label: "비고", value: summary.note },
              ].map((row) => (
                <div key={row.label} className="flex min-h-8 items-center justify-between gap-3 border border-border px-2 text-xs">
                  <span className="shrink-0 text-muted-foreground">{row.label}</span>
                  <span className="truncate text-right font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[scenes.active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
