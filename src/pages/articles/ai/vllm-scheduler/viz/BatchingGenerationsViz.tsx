import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: batch 를 언제 다시 고르느냐에 따라 같은 4 slot 이 얼마나 비는지.
 * 장면 = batching 세대 하나. 4 slot × 10 iteration 의 고정 grid 위에 busy·idle 을 칠한다.
 * stage 높이 고정, control row 는 아래 고정 row. gradient·glow 없음, strokeWidth 1.
 */
const SCENES = ["Static batching", "Dynamic batching", "Iteration-level scheduling"] as const;

const NOTES = [
  "A·B·C·D 가 함께 시작해 가장 긴 D(10) 가 끝날 때까지 batch 가 고정됩니다. A 는 1 iteration 만에 끝났지만 결과는 t=10 에야 돌아가고, 그 slot 은 9 iteration 동안 빕니다. E·F 는 t=10 까지 기다립니다.",
  "Batcher 가 window 1 iteration 동안 도착을 모아 batch 를 만듭니다. 시작은 t=1 로 늦어지고, 만들어진 batch 는 역시 끝까지 고정이라 idle 은 그대로입니다. Window 는 도착 편차를 줄일 뿐 길이 편차는 건드리지 못합니다.",
  "Iteration 경계마다 batch 를 다시 고릅니다. A 가 끝난 t=1 에 E 가 그 slot 을 받고, B 가 끝난 t=3 에 F 가 들어옵니다. 같은 10 iteration 에 6 요청이 끝나고 idle 은 40 칸 중 16 칸입니다.",
] as const;

const COLS = 10;
const ROWS = ["slot 0", "slot 1", "slot 2", "slot 3"] as const;

type Cell = { label: string; kind: "busy" | "late" } | null;

/** 각 장면의 grid: ROWS × COLS. null 은 idle. */
const GRID: readonly (readonly (readonly Cell[])[])[] = [
  [
    [{ label: "A", kind: "busy" }, null, null, null, null, null, null, null, null, null],
    [{ label: "B", kind: "busy" }, { label: "B", kind: "busy" }, { label: "B", kind: "busy" }, null, null, null, null, null, null, null],
    Array.from({ length: COLS }, (_, t): Cell => (t < 5 ? { label: "C", kind: "busy" } : null)),
    Array.from({ length: COLS }, (): Cell => ({ label: "D", kind: "busy" })),
  ],
  [
    [null, { label: "A", kind: "busy" }, null, null, null, null, null, null, null, null],
    [null, { label: "B", kind: "busy" }, { label: "B", kind: "busy" }, { label: "B", kind: "busy" }, null, null, null, null, null, null],
    Array.from({ length: COLS }, (_, t): Cell => (t >= 1 && t < 6 ? { label: "C", kind: "busy" } : null)),
    Array.from({ length: COLS }, (_, t): Cell => (t >= 1 ? { label: "D", kind: "busy" } : null)),
  ],
  [
    [{ label: "A", kind: "busy" }, { label: "E", kind: "late" }, { label: "E", kind: "late" }, null, null, null, null, null, null, null],
    [{ label: "B", kind: "busy" }, { label: "B", kind: "busy" }, { label: "B", kind: "busy" }, { label: "F", kind: "late" }, { label: "F", kind: "late" }, { label: "F", kind: "late" }, null, null, null, null],
    Array.from({ length: COLS }, (_, t): Cell => (t < 5 ? { label: "C", kind: "busy" } : null)),
    Array.from({ length: COLS }, (): Cell => ({ label: "D", kind: "busy" })),
  ],
];

const WAITING = [
  "E · F 는 t=10 까지 대기",
  "E · F 는 t=11 까지 대기",
  "E 는 t=1, F 는 t=3 에 admission",
] as const;

const IDLE = ["idle 21 / 40", "idle 22 / 40 (window 포함)", "idle 16 / 40"] as const;

const CELL = 34;
const LEFT = 52;
const TOP = 22;

export default function BatchingGenerationsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const grid = GRID[scenes.active];
  const width = LEFT + COLS * CELL + 8;
  const height = TOP + ROWS.length * CELL + 8;

  return (
    <VizFrame
      eyebrow="Batching generations"
      title="Batch 를 끝까지 고정하면 길이 편차가 그대로 idle slot 이 됩니다"
      description="각 장면은 같은 요청(A=1, B=3, C=5, D=10 iteration, 뒤이어 E=2, F=3)을 다른 batching 세대로 돌린 10 iteration 입니다. 칠해진 칸은 slot 이 일하는 iteration, 빈 칸은 idle 입니다."
      note="Iteration 하나를 같은 길이로 두었고 prefill·decode 의 시간 차이, token budget, KV block 은 생략했습니다. 숫자는 본문의 예(40·120·200·400 token 을 40 으로 나눈 값)입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Static·dynamic·iteration-level batching 에서 slot 이 비는 정도"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(29rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 min-w-0 overflow-x-auto border border-border">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-[11rem] w-full min-w-[24rem]" role="img" aria-label="slot × iteration grid">
              {Array.from({ length: COLS }, (_, t) => (
                <text key={`t${t}`} x={LEFT + t * CELL + CELL / 2} y={14} textAnchor="middle" className="fill-muted-foreground text-[9px]">
                  t{t}
                </text>
              ))}
              {ROWS.map((row, r) => (
                <text key={row} x={LEFT - 6} y={TOP + r * CELL + CELL / 2 + 3} textAnchor="end" className="fill-muted-foreground text-[9px]">
                  {row}
                </text>
              ))}
              {grid.map((cells, r) =>
                cells.map((cell, t) => (
                  <g key={`${r}-${t}`}>
                    <rect
                      x={LEFT + t * CELL + 1}
                      y={TOP + r * CELL + 1}
                      width={CELL - 2}
                      height={CELL - 2}
                      strokeWidth={1}
                      className={
                        cell === null
                          ? "fill-transparent stroke-border"
                          : cell.kind === "late"
                            ? "fill-amber-500/25 stroke-amber-600"
                            : "fill-primary/25 stroke-primary/70"
                      }
                      strokeDasharray={cell === null ? "2 2" : undefined}
                    />
                    {cell ? (
                      <text x={LEFT + t * CELL + CELL / 2} y={TOP + r * CELL + CELL / 2 + 3} textAnchor="middle" className="fill-foreground text-[9px] font-bold">
                        {cell.label}
                      </text>
                    ) : null}
                  </g>
                )),
              )}
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
            <span className="text-muted-foreground">{WAITING[scenes.active]}</span>
            <span className="text-primary">{IDLE[scenes.active]}</span>
          </div>
          <div className="mt-1.5 flex gap-4 font-mono text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-primary/70 bg-primary/25" /> 처음 batch</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-amber-600 bg-amber-500/25" /> 경계에서 admission</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 border border-dashed border-border" /> idle</span>
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
