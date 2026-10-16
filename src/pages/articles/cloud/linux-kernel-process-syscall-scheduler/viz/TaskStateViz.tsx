import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * (가정) CPU 2개 서버에서 웹 서버 스레드 네 개(T1~T4)와 로그 수집 자식 프로세스 C의 상태가 어떻게 바뀌는지 그린다.
 * 한 mechanism: 상태는 R(실행 중이거나 run queue 대기)·S(깨울 수 있는 잠)·D(깨울 수 없는 잠)·Z(거두지 않은 종료) 넷뿐이고,
 * CPU에 올라가는 것은 R 가운데 스케줄러가 고른 것, load average에 들어가는 것은 R과 D다(include/linux/sched.h, fs/proc/array.c).
 */
type State = "R" | "S" | "D" | "Z";

interface Task {
  id: string;
  role: string;
}

interface Scene {
  label: string;
  states: readonly State[];
  onCpu: readonly string[];
  note: string;
}

const TASKS: readonly Task[] = [
  { id: "T1", role: "응답 생성" },
  { id: "T2", role: "accept() 대기" },
  { id: "T3", role: "파일 read()" },
  { id: "T4", role: "응답 생성" },
  { id: "C", role: "로그 수집 자식" },
];

const SCENES: readonly Scene[] = [
  {
    label: "요청 처리 중",
    states: ["R", "S", "D", "R", "S"],
    onCpu: ["T1", "T4"],
    note: "CPU 2개에 T1·T4가 올라가 있습니다. T2는 새 연결을 기다리는 S, T3는 디스크 응답을 기다리는 D입니다. load average에 들어가는 수는 R 2 + D 1 = 3입니다.",
  },
  {
    label: "디스크 응답 도착",
    states: ["R", "S", "R", "R", "S"],
    onCpu: ["T1", "T4"],
    note: "블록 장치 인터럽트가 T3를 깨워 R로 바꿉니다. CPU는 둘 다 차 있어 T3는 run queue에서 차례를 기다립니다. R이 셋이라 CPU 2개보다 많고 vmstat의 r 열은 3입니다.",
  },
  {
    label: "T1이 쓰기를 마치고 잠듦",
    states: ["S", "S", "R", "R", "S"],
    onCpu: ["T3", "T4"],
    note: "T1이 응답을 다 보내고 다음 요청을 기다리며 S가 됩니다. 스케줄러가 run queue의 T3를 CPU에 올립니다. 이 교체 한 번이 /proc/stat의 ctxt를 1 올립니다.",
  },
  {
    label: "T4가 디스크를 기다림",
    states: ["S", "S", "R", "D", "S"],
    onCpu: ["T3"],
    note: "T4의 read()가 page cache에 없는 블록을 요청해 D로 들어갑니다. SIGTERM을 보내도 디스크가 답할 때까지 깨어나지 않습니다. CPU 하나가 비었지만 R은 T3뿐입니다.",
  },
  {
    label: "자식이 종료, 부모가 wait 안 함",
    states: ["S", "S", "R", "D", "Z"],
    onCpu: ["T3"],
    note: "로그 수집 자식 C가 exit했지만 부모가 wait()로 거두지 않아 Z로 남습니다. 메모리는 이미 돌려줬고 PID와 종료 코드만 남아 있습니다. load에는 들어가지 않습니다.",
  },
];

const COLOR: Record<State, string> = { R: "#2563eb", S: "#94a3b8", D: "#dc2626", Z: "#a16207" };
const LABEL: Record<State, string> = { R: "R · 실행 가능", S: "S · 깨울 수 있는 잠", D: "D · 깨울 수 없는 잠", Z: "Z · 거두지 않은 종료" };

export default function TaskStateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const running = scene.states.filter((s) => s === "R").length;
  const blocked = scene.states.filter((s) => s === "D").length;
  const queued = TASKS.filter((t, i) => scene.states[i] === "R" && !scene.onCpu.includes(t.id)).map((t) => t.id);

  return (
    <VizFrame
      eyebrow="Task states · 5 tasks · 2 CPUs"
      title="CPU에 올라가는 것은 R 가운데 뽑힌 것이고, load에 세는 것은 R과 D입니다"
      description="왼쪽 다섯 줄이 task이고 글자가 /proc/PID/status의 State입니다. 오른쪽 위 두 칸이 CPU, 그 아래가 run queue입니다."
      note="(가정) 스레드 네 개와 자식 프로세스 하나를 둔 웹 서버입니다. 상태 글자는 fs/proc/array.c의 task_state_array, 비트 값은 include/linux/sched.h를 따릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="다섯 task의 상태 변화와 CPU·run queue"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,11rem)]">
            <ul className="space-y-1.5">
              {TASKS.map((task, i) => {
                const state = scene.states[i];
                const onCpu = scene.onCpu.includes(task.id);
                return (
                  <li key={task.id} className="grid grid-cols-[2.25rem_minmax(0,1fr)_7.5rem] items-center gap-2 text-sm">
                    <span className="font-mono font-bold text-foreground">{task.id}</span>
                    <span className="truncate text-muted-foreground">{task.role}</span>
                    <span
                      className="flex h-7 items-center justify-center rounded-sm border font-mono text-xs font-black transition-colors duration-300"
                      style={{ borderColor: COLOR[state], backgroundColor: onCpu ? COLOR[state] : `${COLOR[state]}22`, color: onCpu ? "#ffffff" : COLOR[state] }}
                    >
                      {state}
                      {onCpu ? " · CPU" : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((cpu) => {
                  const id = scene.onCpu[cpu];
                  return (
                    <div key={cpu} className="flex h-12 flex-col items-center justify-center rounded-sm border border-border font-mono text-xs">
                      <span className="text-[10px] text-muted-foreground">CPU {cpu}</span>
                      <span className="font-black" style={{ color: id ? "#2563eb" : "#94a3b8" }}>
                        {id ?? "idle"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex h-12 flex-col justify-center rounded-sm border border-dashed border-border px-2 font-mono text-xs">
                <span className="text-[10px] text-muted-foreground">run queue (R인데 CPU 밖)</span>
                <span className="font-black text-foreground">{queued.length ? queued.join(" · ") : "비어 있음"}</span>
              </div>
              <dl className="grid grid-cols-3 gap-1 font-mono text-[11px] sm:grid-cols-1">
                <div>
                  <dt className="text-muted-foreground">procs_running</dt>
                  <dd className="font-bold text-[#2563eb]">{running}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">procs_blocked</dt>
                  <dd className="font-bold text-[#dc2626]">{blocked}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">load에 세는 수</dt>
                  <dd className="font-bold text-foreground">{running + blocked}</dd>
                </div>
              </dl>
            </div>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] sm:grid-cols-4">
            {(Object.keys(LABEL) as State[]).map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: COLOR[s] }} />
                <span className="text-muted-foreground">{LABEL[s]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
