import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * docker stop 한 번이 pseudocode 일곱 줄을 차례로 지나며 PID 1의 상태를 바꾸는 과정을 보여 준다.
 * 한 mechanism: 처리기 없는 SIGTERM은 PID 1에서 버려지고, 10초 뒤 SIGKILL만 전달되어 128 + 9 = 137이 남는다.
 * 줄 번호와 note는 본문 AlgorithmBlock과 같다.
 */
const LINES = [
  "docker stop shop-api",
  "kill(PID 1, SIGTERM)",
  "if UNKILLABLE ∧ SIG_DFL ∧ ¬(force ∧ kernel_only) → 버림",
  "wait(10초)",
  "kill(PID 1, SIGKILL)",
  "PID 1 종료 → namespace 전체 SIGKILL",
  "exit status = 128 + 9",
] as const;

const SCENES = ["요청", "SIGTERM 보냄", "커널 판정", "10초 대기", "SIGKILL 보냄", "PID 1 종료", "종료 코드"] as const;

interface State {
  clock: string;
  pid1: string;
  pid7: string;
  verdict: string;
  exit: string;
  note: string;
}

const STATES: readonly State[] = [
  {
    clock: "0.0초",
    pid1: "sh start.sh 실행 중",
    pid7: "python server.py 실행 중",
    verdict: "—",
    exit: "—",
    note: "운영자가 docker stop을 부릅니다. 기본 유예는 Linux 컨테이너에서 10초이고, 신호는 컨테이너의 PID 1 하나에게만 갑니다.",
  },
  {
    clock: "0.0초",
    pid1: "sh start.sh 실행 중",
    pid7: "python server.py 실행 중",
    verdict: "보낸 쪽이 host라 force = true",
    exit: "—",
    note: "kill은 host의 PID namespace에서 옵니다. 컨테이너 namespace의 조상이므로 send_signal_locked가 force를 true로 둡니다.",
  },
  {
    clock: "0.0초",
    pid1: "sh start.sh 실행 중",
    pid7: "python server.py 실행 중",
    verdict: "SIGTERM 버림",
    exit: "—",
    note: "start.sh에는 trap이 없어 SIGTERM 처리기가 SIG_DFL입니다. SIGTERM은 SIGKILL·SIGSTOP이 아니므로 force가 있어도 버려지고 pending 목록에도 남지 않습니다.",
  },
  {
    clock: "10.0초",
    pid1: "sh start.sh 실행 중",
    pid7: "python server.py 실행 중",
    verdict: "아무 일도 없음",
    exit: "—",
    note: "python은 SIGTERM을 받은 적이 없으므로 요청 정리나 연결 닫기를 시작하지 않았습니다. 10초는 그냥 지나갑니다.",
  },
  {
    clock: "10.0초",
    pid1: "SIGKILL 전달됨",
    pid7: "python server.py 실행 중",
    verdict: "force ∧ kernel_only → 전달",
    exit: "—",
    note: "SIGKILL은 kernel_only 신호이고 조상 namespace에서 왔으므로 UNKILLABLE 검사를 통과합니다. 처리기를 둘 수 없으니 바로 종료됩니다.",
  },
  {
    clock: "10.0초",
    pid1: "종료",
    pid7: "SIGKILL로 종료",
    verdict: "namespace 정리",
    exit: "—",
    note: "PID namespace의 init이 끝나면 커널이 그 namespace의 나머지 프로세스에 SIGKILL을 보냅니다. python도 정리할 기회 없이 끝납니다.",
  },
  {
    clock: "10.0초",
    pid1: "종료",
    pid7: "종료",
    verdict: "신호 9로 죽음",
    exit: "137",
    note: "PID 1을 거둔 containerd-shim이 runc와 같은 128 + 신호 번호 규칙으로 종료 코드를 남깁니다. 그래서 docker ps에 Exited (137)이 보입니다.",
  },
];

export default function StopSequenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const state = STATES[scene];

  return (
    <VizFrame
      eyebrow="docker stop step-through"
      title="처리기 없는 PID 1은 SIGTERM을 버리고 10초 뒤 SIGKILL로 끝납니다"
      description="줄 목록은 본문 절차의 일곱 줄입니다. 진한 줄이 지금 실행 중인 줄이고, 상태 칸은 그 줄이 바꾼 값입니다."
      note="shop-api 컨테이너, start.sh가 PID 1이고 python server.py가 PID 7이라는 구성은 설명용 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="docker stop 절차를 한 줄씩 실행하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <ol className="space-y-1 font-mono text-[11px] leading-5">
              {LINES.map((line, i) => (
                <li
                  key={line}
                  className="flex gap-2 rounded-sm border px-2 py-1 transition-colors duration-300"
                  style={{
                    borderColor: i === scene ? "#2563eb" : "transparent",
                    backgroundColor: i === scene ? "#2563eb1a" : "transparent",
                    opacity: i > scene ? 0.45 : 1,
                  }}
                >
                  <span className="w-4 shrink-0 text-right text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0 break-words">{line}</span>
                  <span className="ml-auto shrink-0 text-muted-foreground">{i < scene ? "✓" : ""}</span>
                </li>
              ))}
            </ol>

            <dl className="grid grid-cols-2 content-start gap-x-4 gap-y-2 font-mono text-xs">
              <div>
                <dt className="text-muted-foreground">시각</dt>
                <dd className="font-bold text-foreground">{state.clock}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">종료 코드</dt>
                <dd className="font-bold text-foreground">{state.exit}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">PID 1</dt>
                <dd className="font-bold text-foreground">{state.pid1}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">PID 7</dt>
                <dd className="font-bold text-foreground">{state.pid7}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">커널 판정</dt>
                <dd className="font-bold text-foreground">{state.verdict}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
