import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * load average가 세는 두 줄(CPU를 쓰거나 기다리는 task, 디스크 등을 끊김 없이 기다리는 task)을
 * 실제 칸으로 그린다. 같은 30이 서로 다른 원인에서 나오는 것을 칸 수로 세게 한다.
 * 한 mechanism: load에 더해지는 수 = CPU 줄(r) + D 줄(TASK_NOLOAD 제외). vmstat b는 이 중 I/O 대기만 센다.
 */
const SCENES = ["32 CPU · Gregg 사례", "16 vCPU · CPU 포화", "16 vCPU · 디스크 대기", "16 vCPU · TASK_IDLE"] as const;

interface Scene {
  cpus: number;
  onCpu: number;
  queued: number;
  dState: number;
  idleWait: number;
  verdict: string;
  note: string;
}

const STATES: readonly Scene[] = [
  {
    cpus: 32,
    onCpu: 32,
    queued: 1,
    dState: 0,
    idleWait: 0,
    verdict: "CPU 수요",
    note: "Gregg 글의 vmstat는 r이 32~34, b가 0입니다. CPU 32개가 모두 차고 한두 개가 줄을 섭니다. us가 96~99%라 사용자 코드가 CPU를 씁니다.",
  },
  {
    cpus: 16,
    onCpu: 16,
    queued: 14,
    dState: 0,
    idleWait: 0,
    verdict: "CPU 포화",
    note: "(가정) 같은 30이라도 16 vCPU에서 r이 30이면 14개가 CPU를 기다립니다. 요청 하나가 CPU를 다시 얻을 때까지 기다리는 시간이 지연으로 나타납니다.",
  },
  {
    cpus: 16,
    onCpu: 8,
    queued: 0,
    dState: 22,
    idleWait: 0,
    verdict: "디스크 대기",
    note: "(가정) r은 8이고 D 상태 22개가 모두 디스크 I/O를 기다려 b도 22입니다. CPU 절반이 비어 있는데 load는 30이므로 다음 명령은 iostat입니다.",
  },
  {
    cpus: 16,
    onCpu: 8,
    queued: 0,
    dState: 0,
    idleWait: 22,
    verdict: "세지 않음",
    note: "(가정) 22개가 TASK_IDLE로 잔다면 load는 8입니다. TASK_IDLE은 UNINTERRUPTIBLE에 NOLOAD 표시를 더한 상태라 core.c가 load에서 뺍니다. 조건을 보이려는 반사실 장면이고 ps에는 I로 보입니다.",
  },
];

function Cells({ count, filled, tone, minRows = 0 }: { count: number; filled: number; tone: string; minRows?: number }) {
  return (
    <div className="flex flex-wrap content-start gap-1" style={{ minHeight: minRows ? `${minRows * 1.25 - 0.25}rem` : undefined }}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="h-4 w-4 rounded-sm border border-border"
          style={{ backgroundColor: index < filled ? tone : "transparent" }}
        />
      ))}
    </div>
  );
}

export default function LoadSplitViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  const state = STATES[scene];
  const counted = state.onCpu + state.queued + state.dState;

  return (
    <VizFrame
      eyebrow="Load average split"
      title="같은 30이 CPU 줄에서 오는지 D 줄에서 오는지 셉니다"
      description="파란 칸은 CPU 위에서 도는 task, 하늘색 칸은 CPU를 기다리는 task, 주황 칸은 디스크 등을 끊김 없이 기다리는 task입니다. 회색 칸은 잠들어 있지만 load에 더하지 않는 task입니다."
      note="32 CPU 장면은 Gregg 글의 vmstat 출력입니다. 16 vCPU 세 장면의 task 수는 설명용 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="load average에 더해지는 task 줄"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-2 font-mono text-xs text-muted-foreground">CPU {state.cpus}개 · 위에서 도는 task {state.onCpu}</p>
              <Cells count={state.cpus} filled={state.onCpu} tone="#2563eb" minRows={3} />
              <p className="mb-2 mt-3 font-mono text-xs text-muted-foreground">CPU를 기다리는 줄 · {state.queued}</p>
              <Cells count={22} filled={state.queued} tone="#93c5fd" />
            </div>
            <div className="min-w-0">
              <p className="mb-2 font-mono text-xs text-muted-foreground">D 상태 · I/O 대기 {state.dState}</p>
              <Cells count={22} filled={state.dState} tone="#f59e0b" />
              <p className="mb-2 mt-3 font-mono text-xs text-muted-foreground">TASK_IDLE 대기 · 세지 않음 {state.idleWait}</p>
              <Cells count={22} filled={state.idleWait} tone="#9ca3af" />
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">CPU 줄 (r)</dt>
              <dd className="font-bold text-foreground">{state.onCpu + state.queued}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">D 줄</dt>
              <dd className="font-bold text-foreground">{state.dState}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">load에 더하는 수</dt>
              <dd className="font-bold text-foreground">{counted}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">판정</dt>
              <dd className="font-bold text-foreground">{state.verdict}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[12.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10.5rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
