import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: scheduler 하나의 warp 4개가 clock 마다 어떤 상태(selected · not selected ·
 * long scoreboard · short scoreboard · barrier)에 있는지와, sampler 가 그 상태를 표본으로
 * 쌓아 stall reason 분포가 되는 과정. 장면 = clock 하나. stage 높이 고정, control row 는 아래 고정.
 */
const SCENES = [
  "clock 1 · W0 선택",
  "clock 2 · W1 선택",
  "clock 3 · eligible 없음",
  "clock 4 · W0 복귀",
  "clock 5 · W2 복귀",
  "clock 6 · W3 선택",
] as const;

type State = "sel" | "elig" | "long" | "short" | "bar";

const WARPS = ["W0", "W1", "W2", "W3"] as const;

/** 각 clock 에서 warp 4개의 상태. 열 = warp, 행 = clock. */
const CLOCKS: readonly (readonly State[])[] = [
  ["sel", "elig", "long", "long"],
  ["short", "sel", "long", "long"],
  ["short", "bar", "long", "long"],
  ["sel", "bar", "long", "long"],
  ["bar", "bar", "sel", "elig"],
  ["bar", "bar", "bar", "sel"],
];

const LABEL: Record<State, string> = {
  sel: "selected",
  elig: "not selected",
  long: "long scoreboard",
  short: "short scoreboard",
  bar: "barrier",
};

const CLASS: Record<State, string> = {
  sel: "border-primary bg-primary/25 text-foreground",
  elig: "border-emerald-600 bg-emerald-500/10 text-foreground",
  long: "border-dashed border-amber-600 bg-amber-500/10 text-muted-foreground",
  short: "border-dashed border-sky-600 bg-sky-500/10 text-muted-foreground",
  bar: "border-dashed border-border bg-muted/50 text-muted-foreground",
};

const ORDER: readonly State[] = ["sel", "elig", "long", "short", "bar"];

const NOTES = [
  "W0 과 W1 이 eligible 입니다. Scheduler 는 W0 를 골라 shared load 를 issue 하고, W1 은 준비됐지만 밀려 not selected 로 찍힙니다. W2·W3 는 global load 결과를 기다리는 long scoreboard 입니다.",
  "W0 는 shared load 결과를 기다리는 short scoreboard 가 됐고 W1 이 유일한 eligible 이라 선택됩니다. Sampler 가 이 clock 에 W1 을 뽑으면 selected, W0 를 뽑으면 short scoreboard 표본이 하나 늘어납니다.",
  "W1 이 __syncthreads() 에 도착해 barrier 에서 멈췄고 W0 는 아직 short scoreboard, W2·W3 는 long scoreboard 입니다. Eligible 이 0 이라 이 clock 의 issue slot 은 비고, 어떤 warp 를 뽑아도 표본은 stall 입니다.",
  "W0 의 shared load 결과가 도착해 scoreboard 표시가 지워지고 다시 선택됩니다. Short scoreboard 는 이렇게 몇 clock 만에 풀리지만 W2·W3 의 long scoreboard 는 아직 수백 clock 이 남았습니다.",
  "W2 의 global load 가 돌아와 선택되고 W3 도 같은 clock 에 돌아와 not selected 로 밀립니다. W0 는 barrier 에 도착해 W1 과 함께 W2·W3 를 기다립니다.",
  "W3 이 선택되고 나머지 셋은 barrier 에서 기다립니다. 6 clock 동안 slot 은 5번 채워져 issue active 83% 이고, 표본 24개는 selected 5·not selected 2·long 8·short 2·barrier 7 로 쌓였습니다. Long scoreboard 가 가장 큰 stall 이지만 이 kernel 의 slot 은 대부분 채워졌으므로 문서의 지침대로 stall 처방은 아직 이릅니다.",
] as const;

export default function WarpStallReasonsAndIssueUtilizationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const current = CLOCKS[scenes.active];
  const eligible = current.filter((state) => state === "sel" || state === "elig").length;
  const tally = ORDER.map((state) => ({
    state,
    count: CLOCKS.slice(0, scenes.active + 1).reduce(
      (sum, clock) => sum + clock.filter((value) => value === state).length,
      0,
    ),
  }));
  const issued = CLOCKS.slice(0, scenes.active + 1).filter((clock) => clock.includes("sel")).length;

  return (
    <VizFrame
      eyebrow="Warp state sampling · stall reason"
      title="Sampler 는 clock 마다 warp 의 상태를 뽑고, 그 표본의 분포가 stall reason 이 됩니다"
      description="Scheduler 하나에 warp 4개가 resident 한 상황입니다. 위 표는 clock 마다 각 warp 가 어떤 상태였는지, 아래는 지금까지의 표본 분포와 issue slot 이 채워진 clock 수입니다."
      note="실제 sampler 는 매 clock 이 아니라 수십에서 수천 clock 간격으로 warp 하나만 뽑습니다. 여기서는 셈을 보이려고 모든 warp 의 모든 clock 을 표본으로 세었고, latency 값은 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Scheduler 하나의 warp 4개가 clock 마다 selected, not selected, long scoreboard, short scoreboard, barrier 상태를 오가며 표본이 쌓이는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(36rem,calc(100dvh-15rem))] min-h-[29rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-5 min-w-0 overflow-x-auto">
            <div className="grid min-w-[20rem] grid-cols-[3.25rem_repeat(4,minmax(0,1fr))] gap-1 font-mono text-[10px]">
              <div className="flex h-6 items-center text-muted-foreground">clock</div>
              {WARPS.map((name) => (
                <div key={name} className="flex h-6 items-center justify-center font-bold text-muted-foreground">
                  {name}
                </div>
              ))}
              {CLOCKS.map((clock, clockIndex) => {
                const isActive = clockIndex === scenes.active;
                const isPast = clockIndex < scenes.active;
                return [
                  <div
                    key={`c${clockIndex}`}
                    className={`flex h-9 items-center ${isActive ? "font-bold text-foreground" : "text-muted-foreground"}`}
                  >
                    c{clockIndex + 1}
                    {isActive ? " ◀" : ""}
                  </div>,
                  ...clock.map((state, warpIndex) => (
                    <div
                      key={`c${clockIndex}w${warpIndex}`}
                      className={`flex h-9 items-center justify-center border px-1 text-center leading-3 ${
                        isActive || isPast ? CLASS[state] : "border-border/40 text-transparent"
                      } ${isActive ? "outline outline-1 outline-primary" : ""}`}
                    >
                      {isActive || isPast ? LABEL[state] : "·"}
                    </div>
                  )),
                ];
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr]">
            <div className="border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">
                이번 clock · eligible {eligible} · {eligible > 0 ? "issue 1" : "issue slot 비움"}
              </p>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                Eligible 이 하나 이상이면 scheduler 는 그중 하나만 issue 하고 나머지는 not
                selected 가 됩니다. 0 이면 slot 이 빕니다.
              </p>
              <p className="mt-2 font-mono text-[11px]">
                issue slot 채움 {issued} / {scenes.active + 1} clock
              </p>
            </div>
            <div className="border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">
                표본 분포 · {(scenes.active + 1) * WARPS.length}개
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {tally.map(({ state, count }) => (
                  <div key={state} className="flex items-center gap-2 font-mono text-[10px]">
                    <span className={`inline-block h-2.5 w-2.5 shrink-0 border ${CLASS[state]}`} />
                    <span className="w-28 shrink-0">{LABEL[state]}</span>
                    <span className="flex h-2.5 min-w-0 flex-1 items-center">
                      <span
                        className={`block h-2.5 border ${CLASS[state]}`}
                        style={{ width: `${Math.max(0, (count / ((scenes.active + 1) * WARPS.length)) * 100)}%` }}
                      />
                    </span>
                    <span className="w-5 text-right">{count}</span>
                  </div>
                ))}
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
