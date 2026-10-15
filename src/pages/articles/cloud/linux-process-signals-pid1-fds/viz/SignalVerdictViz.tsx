import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 같은 kill 한 번이 대상·신호·보낸 쪽에 따라 sig_task_ignored의 검사 세 개를 어떻게 통과하는지 비교한다.
 * 한 mechanism: UNKILLABLE ∧ SIG_DFL ∧ ¬(force ∧ kernel_only)이면 버림, 아니면 처리기나 기본 동작으로 간다.
 */
const SCENES = ["host → PID 1 SIGTERM", "host → PID 1 SIGTERM, trap 있음", "host → PID 1 SIGKILL", "컨테이너 안 → PID 1 SIGKILL", "host → PID 7 SIGTERM"] as const;

type Mark = "yes" | "no";

interface Case {
  target: string;
  signal: string;
  from: string;
  unkillable: Mark;
  dfl: Mark;
  forcedKernelOnly: Mark;
  result: string;
  dropped: boolean;
  note: string;
}

const CASES: readonly Case[] = [
  {
    target: "PID 1 (sh)",
    signal: "SIGTERM 15",
    from: "host (조상 namespace)",
    unkillable: "yes",
    dfl: "yes",
    forcedKernelOnly: "no",
    result: "버림",
    dropped: true,
    note: "세 조건이 모두 버리는 쪽입니다. force는 true지만 SIGTERM이 SIGKILL·SIGSTOP이 아니라서 예외가 되지 못합니다.",
  },
  {
    target: "PID 1 (sh, trap + wait $child)",
    signal: "SIGTERM 15",
    from: "host (조상 namespace)",
    unkillable: "yes",
    dfl: "no",
    forcedKernelOnly: "no",
    result: "처리기 실행",
    dropped: false,
    note: "처리기를 등록하면 SIG_DFL 조건이 깨집니다. 커널은 신호를 넘기고, 자식을 &로 띄운 뒤 wait 중이던 셸이 곧바로 trap을 실행해 자식에게 SIGTERM을 다시 보냅니다.",
  },
  {
    target: "PID 1 (sh)",
    signal: "SIGKILL 9",
    from: "host (조상 namespace)",
    unkillable: "yes",
    dfl: "yes",
    forcedKernelOnly: "yes",
    result: "전달 → 종료",
    dropped: false,
    note: "조상 namespace에서 온 SIGKILL만 예외입니다. docker stop의 10초 뒤 신호와 docker kill이 이 경로입니다.",
  },
  {
    target: "PID 1 (sh)",
    signal: "SIGKILL 9",
    from: "컨테이너 안의 셸",
    unkillable: "yes",
    dfl: "yes",
    forcedKernelOnly: "no",
    result: "버림",
    dropped: true,
    note: "docker exec로 들어가 kill -9 1을 쳐도 같은 namespace라 force가 false입니다. 컨테이너 init은 안에서 죽일 수 없습니다.",
  },
  {
    target: "PID 7 (python)",
    signal: "SIGTERM 15",
    from: "host (조상 namespace)",
    unkillable: "no",
    dfl: "yes",
    forcedKernelOnly: "no",
    result: "기본 동작 Term → 143",
    dropped: false,
    note: "PID 1이 아니면 UNKILLABLE 표시가 없습니다. 처리기가 없어도 기본 동작으로 종료되고 종료 코드는 128 + 15 = 143입니다.",
  },
];

const CHECKS = [
  { key: "unkillable", label: "대상에 SIGNAL_UNKILLABLE" },
  { key: "dfl", label: "처리기가 SIG_DFL" },
  { key: "forcedKernelOnly", label: "force ∧ (SIGKILL 또는 SIGSTOP)" },
] as const;

export default function SignalVerdictViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const c = CASES[scene];

  return (
    <VizFrame
      eyebrow="sig_task_ignored verdict"
      title="같은 kill이라도 대상·신호·보낸 쪽에 따라 버려지거나 전달됩니다"
      description="한 장면이 한 경우입니다. 세 줄은 커널이 순서대로 보는 조건이고, 앞의 두 줄이 예이고 셋째 줄이 아니오이면 신호를 버립니다."
      note="kernel/signal.c v6.12의 sig_task_ignored를 그대로 따랐습니다. ptrace 중인 경우와 신호를 막아 둔(blocked) 경우는 뺐습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="경우별 신호 무시 판정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <dl className="mt-4 grid gap-2 font-mono text-xs sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">대상</dt>
              <dd className="break-words font-bold text-foreground">{c.target}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">신호</dt>
              <dd className="font-bold text-foreground">{c.signal}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">보낸 쪽</dt>
              <dd className="font-bold text-foreground">{c.from}</dd>
            </div>
          </dl>

          <ol className="mt-4 space-y-2">
            {CHECKS.map((check) => {
              const mark = c[check.key];
              const toward = check.key === "forcedKernelOnly" ? mark === "no" : mark === "yes";
              return (
                <li key={check.key} className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 rounded-sm border border-border px-3 py-2">
                  <span className="text-sm">{check.label}</span>
                  <span
                    className="rounded-sm border px-2 py-0.5 text-center font-mono text-xs font-bold"
                    style={{ borderColor: toward ? "#dc2626" : "#16a34a", color: toward ? "#dc2626" : "#16a34a" }}
                  >
                    {mark === "yes" ? "예" : "아니오"}
                  </span>
                </li>
              );
            })}
          </ol>

          <div
            className="mt-4 rounded-sm border px-3 py-2 text-center font-mono text-sm font-bold"
            style={{ borderColor: c.dropped ? "#dc2626" : "#16a34a", color: c.dropped ? "#dc2626" : "#16a34a" }}
          >
            {c.result}
          </div>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {c.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
