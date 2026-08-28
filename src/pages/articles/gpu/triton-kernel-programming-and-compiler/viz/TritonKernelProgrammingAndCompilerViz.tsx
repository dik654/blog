import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: program instance 가 BLOCK_SIZE 만큼의 원소를 하나씩 맡고,
 * 마지막 instance 의 mask 가 N 을 넘는 lane 을 잘라 내는 과정.
 * 장면 = grid 계산 → pid 0 의 block → pid 96 의 경계 block → masked load/store.
 * stage 높이는 고정, control row 는 아래 고정 row.
 */
const N = 98432;
const BLOCK = 1024;
const NUM_PROGRAMS = Math.ceil(N / BLOCK); // 97
const LAST_PID = NUM_PROGRAMS - 1; // 96
const LAST_VALID = N - LAST_PID * BLOCK; // 128
const CELLS = 32; // block 하나를 32칸으로 표시 (칸당 32 원소)
const ELEMS_PER_CELL = BLOCK / CELLS;

const SCENES = [
  "Grid · cdiv(N, BLOCK) = 97",
  "pid 0 · offsets 0…1023",
  "pid 96 · 마지막 block 과 mask",
  "tl.load · tl.store 가 mask 를 적용",
] as const;

const NOTES = [
  "N = 98432 를 BLOCK_SIZE 1024 로 나누면 96.125 이므로 올림해 program instance 97개를 띄웁니다. 각 instance 는 자기 pid 하나만 받습니다.",
  "pid 0 은 offsets = 0·1024 + arange(0, 1024) 로 0 부터 1023 까지를 맡습니다. 모든 offset 이 N 보다 작아 mask 가 전부 참입니다.",
  "pid 96 의 offsets 는 98304 부터 99327 까지입니다. N 보다 작은 것은 앞의 128개뿐이라 mask 의 나머지 896 lane 이 거짓이 됩니다.",
  "tl.load 는 mask 가 거짓인 lane 을 읽지 않고 other 값으로 채우며, tl.store 는 그 lane 에 쓰지 않습니다. 경계 처리가 if 문 없이 block 연산 안에서 끝납니다.",
] as const;

const PROGRAM_STRIP: (number | "gap")[] = [0, 1, 2, 3, "gap", 94, 95, 96];

function ProgramStrip({ highlight }: { highlight: number | null }) {
  return (
    <div className="flex items-center gap-1" aria-label={`program instance ${NUM_PROGRAMS}개`}>
      {PROGRAM_STRIP.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 font-mono text-[11px] text-muted-foreground">
            …
          </span>
        ) : (
          <span
            key={item}
            className={`flex h-9 w-11 items-center justify-center border font-mono text-[11px] ${
              highlight === item
                ? "border-primary bg-primary/15 text-foreground"
                : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            {item}
          </span>
        ),
      )}
    </div>
  );
}

function BlockLane({ validCells, showAccess }: { validCells: number; showAccess: boolean }) {
  return (
    <div className="flex h-8 w-full border border-border" aria-label={`block lane ${CELLS}칸`}>
      {Array.from({ length: CELLS }).map((_, index) => {
        const valid = index < validCells;
        return (
          <div
            key={index}
            className={`h-full flex-1 border-r border-background ${
              valid ? "bg-primary/35" : showAccess ? "bg-muted/40" : "bg-amber-500/45"
            }`}
          />
        );
      })}
    </div>
  );
}

export default function TritonKernelProgrammingAndCompilerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const active = scenes.active;
  const pid = active === 0 ? null : active === 1 ? 0 : LAST_PID;
  const validCells = pid === LAST_PID ? LAST_VALID / ELEMS_PER_CELL : CELLS;
  const start = pid === null ? null : pid * BLOCK;
  const validCount = pid === LAST_PID ? LAST_VALID : BLOCK;

  return (
    <VizFrame
      eyebrow="Triton block programming model"
      title="Program instance 가 block 하나씩 맡고 mask 가 경계를 자릅니다"
      description="Vector add 의 N = 98432, BLOCK_SIZE = 1024 예입니다. 위 줄은 grid 의 program instance, 아래 막대는 선택된 instance 의 block 1024 원소를 32칸으로 나눈 것입니다."
      note="칸 하나는 원소 32개입니다. Warp 배치, coalescing, 실제 메모리 트랜잭션은 그리지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Program instance 가 block 을 맡고 mask 가 경계를 자르는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[26rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <div className="mt-5 border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
              <span>grid = (cdiv({N}, {BLOCK}),) = ({NUM_PROGRAMS},)</span>
              <span>program_id(axis=0)</span>
            </div>
            <div className="mt-2">
              <ProgramStrip highlight={pid} />
            </div>
          </div>

          <div className="mt-4 min-h-[8.5rem] border border-border p-3">
            {pid === null ? (
              <div className="flex h-full min-h-[7rem] flex-col justify-center font-mono text-[11px] text-muted-foreground">
                <p>96 × 1024 = 98304 &lt; 98432 이므로 program 96개로는 128 원소가 남습니다.</p>
                <p className="mt-1">97번째 instance 가 그 128개를 맡고, 나머지 896 lane 은 mask 로 비웁니다.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-between gap-2 font-mono text-[11px] text-muted-foreground">
                  <span>pid {pid} · offsets {start}…{(start ?? 0) + BLOCK - 1}</span>
                  <span>mask 참 {validCount} / {BLOCK}</span>
                </div>
                <div className="mt-2">
                  <BlockLane validCells={validCells} showAccess={active === 3} />
                </div>
                <div className="mt-2 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 bg-primary/35" /> offsets &lt; N
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 bg-amber-500/45" /> offsets ≥ N (mask 거짓)
                  </span>
                  {active === 3 && (
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 bg-muted/40" /> load 는 other, store 는 생략
                    </span>
                  )}
                </div>
                <p className="mt-3 font-mono text-[11px] text-primary">
                  {active === 3
                    ? `tl.load(x_ptr + offsets, mask=mask, other=0.0) · tl.store(out_ptr + offsets, y, mask=mask)`
                    : `mask = offsets < ${N}`}
                </p>
              </>
            )}
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
