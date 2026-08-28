import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: subpartition 하나의 scheduler 가 매 clock scoreboard 를 보고
 * ready warp 하나를 골라 issue 하고, 준비된 warp 가 없으면 slot 이 비는 과정.
 * 장면 = clock 하나. stage 높이는 고정, control row 는 아래 고정 row.
 */
const SCENES = [
  "clock 1 · W0 issue",
  "clock 2 · W1 load",
  "clock 3 · W2 issue",
  "clock 4 · W3 issue",
  "clock 5 · W0 다시 ready",
  "clock 6 · bubble",
] as const;

type WarpState = { status: "ready" | "issued" | "stalled"; wait?: number; reason?: string };

type Scene = {
  warps: readonly WarpState[];
  issued: string | null;
  slots: readonly ("issued" | "bubble")[];
};

const WARPS = ["W0", "W1", "W2", "W3"] as const;

const STATES: readonly Scene[] = [
  {
    warps: [
      { status: "issued" },
      { status: "ready" },
      { status: "ready" },
      { status: "ready" },
    ],
    issued: "W0 · FFMA (latency 4)",
    slots: ["issued"],
  },
  {
    warps: [
      { status: "stalled", wait: 3, reason: "wait" },
      { status: "issued" },
      { status: "ready" },
      { status: "ready" },
    ],
    issued: "W1 · LDG (latency 수백)",
    slots: ["issued", "issued"],
  },
  {
    warps: [
      { status: "stalled", wait: 2, reason: "wait" },
      { status: "stalled", wait: 400, reason: "long scoreboard" },
      { status: "issued" },
      { status: "ready" },
    ],
    issued: "W2 · FFMA (latency 4)",
    slots: ["issued", "issued", "issued"],
  },
  {
    warps: [
      { status: "stalled", wait: 1, reason: "wait" },
      { status: "stalled", wait: 399, reason: "long scoreboard" },
      { status: "stalled", wait: 3, reason: "wait" },
      { status: "issued" },
    ],
    issued: "W3 · FFMA (latency 4)",
    slots: ["issued", "issued", "issued", "issued"],
  },
  {
    warps: [
      { status: "issued" },
      { status: "stalled", wait: 398, reason: "long scoreboard" },
      { status: "stalled", wait: 2, reason: "wait" },
      { status: "stalled", wait: 3, reason: "wait" },
    ],
    issued: "W0 · 결과를 받은 dependent FFMA",
    slots: ["issued", "issued", "issued", "issued", "issued"],
  },
  {
    warps: [
      { status: "stalled", wait: 3, reason: "wait" },
      { status: "stalled", wait: 397, reason: "long scoreboard" },
      { status: "stalled", wait: 1, reason: "wait" },
      { status: "stalled", wait: 2, reason: "wait" },
    ],
    issued: null,
    slots: ["issued", "issued", "issued", "issued", "issued", "bubble"],
  },
];

const NOTES = [
  "네 warp 모두 ready 입니다. Scheduler 가 W0 를 골라 FFMA 를 issue 하고, 결과 register 에 scoreboard 표시가 남아 W0 는 4 clock 동안 stalled 가 됩니다.",
  "W1 이 global load 를 issue 합니다. 결과는 수백 clock 뒤에 오므로 W1 은 long scoreboard 상태로 오래 빠집니다. W0 의 wait 는 3 으로 줄었습니다.",
  "W2 가 issue 합니다. Ready warp 가 아직 하나(W3) 남아 있어 다음 clock 도 채울 수 있습니다.",
  "W3 가 issue 합니다. 이 순간 ready warp 는 0 이지만 W0 의 결과가 다음 clock 에 도착합니다. Latency 4 를 warp 4개가 정확히 메운 상태입니다.",
  "W0 의 scoreboard 표시가 지워져 다시 ready 가 됐고 dependent FFMA 를 issue 합니다. 다섯 clock 연속 issue slot 이 채워졌습니다.",
  "준비된 warp 가 하나도 없습니다. W1 은 memory 를, 나머지는 산술 결과를 기다려 이 clock 의 issue slot 이 비는 pipeline bubble 이 생깁니다. Ready warp 가 하나 더 있었거나 W0 가 독립 instruction 을 하나 더 가졌으면 채워졌을 slot 입니다.",
] as const;

function statusClass(state: WarpState) {
  if (state.status === "issued") return "border-primary bg-primary/15 text-foreground";
  if (state.status === "ready") return "border-emerald-600 bg-emerald-500/10 text-foreground";
  return "border-dashed border-border bg-muted/40 text-muted-foreground";
}

export default function SmWarpSchedulingAndIssueViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const state = STATES[scenes.active];
  const readyCount = state.warps.filter((warp) => warp.status === "ready" || warp.status === "issued").length;

  return (
    <VizFrame
      eyebrow="Warp scheduler · scoreboard"
      title="Scheduler 는 매 clock scoreboard 가 지운 warp 하나만 issue 합니다"
      description="Subpartition 하나에 warp 4개가 resident 한 상황입니다. 왼쪽 표는 각 warp 의 scoreboard 상태, 아래 줄은 clock 마다 issue slot 이 채워졌는지를 보여 줍니다."
      note="산술 latency 4 clock, global load latency 수백 clock 은 본문의 가정값입니다. 실제 scheduler 의 선택 우선순위와 pipe 폭은 생략했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Warp scheduler 가 clock 마다 scoreboard 를 보고 ready warp 를 issue 하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
            <div className="min-h-[11rem] border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">
                subpartition 0 · active warp 4 · eligible {readyCount}
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {WARPS.map((name, index) => {
                  const warp = state.warps[index];
                  return (
                    <div
                      key={name}
                      className={`flex min-h-9 items-center justify-between border px-2 font-mono text-[11px] ${statusClass(warp)}`}
                    >
                      <span className="font-bold">{name}</span>
                      <span>
                        {warp.status === "issued" && "issue ←"}
                        {warp.status === "ready" && "ready"}
                        {warp.status === "stalled" && `${warp.reason} · ${warp.wait} clock 남음`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="min-h-[11rem] border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">이번 clock 의 issue</p>
              <div className="mt-2 flex min-h-[3.25rem] items-center border border-dashed border-border px-2 py-1.5 font-mono text-[11px]">
                {state.issued ?? "eligible 없음 → issue slot 비움"}
              </div>
              <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                scheduler 는 eligible 가운데 하나를 고르고, 그 warp 의 결과 register 에
                scoreboard 표시를 남깁니다.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>issue slot · clock 1–6</span>
              <span>
                채움 {state.slots.filter((slot) => slot === "issued").length} / {state.slots.length}
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-6 gap-1">
              {Array.from({ length: 6 }).map((_, index) => {
                const slot = state.slots[index];
                const cls =
                  slot === "issued"
                    ? "border-primary bg-primary/35"
                    : slot === "bubble"
                      ? "border-dashed border-amber-600 bg-amber-500/10"
                      : "border-border bg-muted/30";
                return (
                  <div
                    key={index}
                    className={`flex h-7 items-center justify-center border font-mono text-[10px] ${cls}`}
                  >
                    {slot === "bubble" ? "bubble" : slot === "issued" ? `c${index + 1}` : ""}
                  </div>
                );
              })}
            </div>
            <div className="mt-1.5 flex gap-4 font-mono text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 border border-emerald-600 bg-emerald-500/10" /> ready
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 border border-primary bg-primary/35" /> issued
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 border border-dashed border-amber-600" /> bubble
              </span>
            </div>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
