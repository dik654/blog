import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 부모가 wait하지 않는 helper가 PID 칸을 하나씩 붙잡아 pid_max 32,768칸을 채우는 과정을 그린다.
 * 한 mechanism: 남은 PID = pid_max − (wait되지 않은 좀비 수). 칸 하나 = PID 512개.
 * 다른 프로세스가 쓰는 PID는 설명을 위해 빼고 셉니다.
 */
const PID_MAX = 32768;
const PER_CELL = 512;
const CELLS = PID_MAX / PER_CELL;
const SCENES = ["시작", "1분 뒤", "1시간 뒤", "3시간 2분 뒤", "부모가 wait하면"] as const;

interface Scene {
  zombies: number;
  clock: string;
  fork: string;
  note: string;
}

const STATES: readonly Scene[] = [
  {
    zombies: 0,
    clock: "0초",
    fork: "성공",
    note: "server.py가 썸네일 요청마다 helper를 하나 fork합니다. helper는 0.2초 만에 끝나지만 server.py는 wait를 부르지 않습니다.",
  },
  {
    zombies: 180,
    clock: "60초",
    fork: "성공",
    note: "초당 3개씩 60초면 180개입니다. 끝난 helper는 메모리를 거의 돌려주지만 PID와 종료 상태 칸은 부모가 읽을 때까지 남습니다.",
  },
  {
    zombies: 10800,
    clock: "1시간",
    fork: "성공",
    note: "3 × 3,600 = 10,800개입니다. ps에서 STAT이 Z인 줄이 이만큼 보이고 모두 같은 PPID(server.py)를 가리킵니다.",
  },
  {
    zombies: 32768,
    clock: "3시간 2분",
    fork: "EAGAIN",
    note: "32,768 ÷ 3 = 10,923초에 칸이 모두 찹니다. 이제 fork가 EAGAIN으로 실패해 새 helper도, 운영자가 들어가 실행할 셸도 만들 수 없습니다.",
  },
  {
    zombies: 0,
    clock: "고친 뒤",
    fork: "성공",
    note: "server.py가 helper를 wait하거나 SIGCHLD를 SIG_IGN으로 두면 helper는 끝나는 즉시 칸을 돌려줍니다. 좀비 자체는 kill로 지울 수 없고 부모를 고치거나 끝내야 사라집니다.",
  },
];

function cellFill(index: number, zombies: number) {
  const start = index * PER_CELL;
  return Math.max(0, Math.min(1, (zombies - start) / PER_CELL));
}

export default function ZombieTableViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const state = STATES[scene];
  const free = PID_MAX - state.zombies;

  return (
    <VizFrame
      eyebrow="PID table"
      title="wait되지 않은 helper가 PID 칸을 하나씩 붙잡습니다"
      description="네모 하나가 PID 512개입니다. 진한 부분은 이미 끝났지만 부모가 종료 상태를 읽지 않은 좀비가 잡고 있는 칸입니다."
      note="16 CPU 서버의 pid_max 기본값 32,768과 초당 3개의 helper는 설명용 가정입니다. 실제 번호는 1~32,767이고 한 바퀴 돈 뒤에는 300 미만을 다시 쓰지 않으므로 좀비가 채울 수 있는 칸은 이보다 조금 적습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="좀비 프로세스가 PID 칸을 채우는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 grid w-full grid-cols-16 gap-1">
            {Array.from({ length: CELLS }, (_, i) => {
              const fill = cellFill(i, state.zombies);
              return (
                <div key={i} className="relative h-5 overflow-hidden rounded-sm border border-border bg-muted/40">
                  <div
                    className="absolute inset-y-0 left-0 transition-[width] duration-500"
                    style={{ width: `${fill * 100}%`, backgroundColor: "#dc2626" }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>PID 0</span>
            <span>32,767</span>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">경과</dt>
              <dd className="font-bold text-foreground">{state.clock}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">좀비(Z)</dt>
              <dd className="font-bold text-foreground">{state.zombies.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">남은 PID</dt>
              <dd className="font-bold text-foreground">{free.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">다음 fork</dt>
              <dd className="font-bold text-foreground">{state.fork}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
