import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — containerStatuses[] 안의 state·lastState·restartCount와 STATUS 열의 관계.
 * 2초 만에 exit 1로 죽는 컨테이너(3절의 가정)가 대기 → 실행 → 다시 대기로 도는 동안 값이 어떻게 바뀌는지,
 * 마지막 장면은 같은 자리에 OOMKilled가 누구 손을 거쳐 적히는지를 보인다.
 */
const CHAIN = [
  { who: "커널 OOM killer", what: "memory limit에 닿으면 SIGKILL" },
  { who: "컨테이너 런타임", what: "exit code 137 · OOMKilled 기록" },
  { who: "kubelet", what: "Terminated · lastState에 옮겨 적음" },
] as const;

const SCENES = [
  { label: "backoff 창 안", summary: "STATUS CrashLoopBackOff", state: "Waiting", reason: "CrashLoopBackOff", last: "Terminated", lastDetail: "Exit Code 1", restarts: "n", status: "CrashLoopBackOff", oom: false, note: "kubelet이 아직 대기 중이라 컨테이너를 띄우지 않습니다. 현재 state는 Waiting이고 STATUS 열은 그 reason을 꺼내 보여 줍니다. 직전에 죽은 기록은 lastState에 있습니다. (가정: 3절의 exit 1 컨테이너, 지금까지 재시작 n번)" },
  { label: "대기가 끝나 다시 띄움", summary: "STATUS Running", state: "Running", reason: "reason 없음", last: "Terminated", lastDetail: "Exit Code 1", restarts: "n + 1", status: "Running", oom: false, note: "컨테이너를 띄우면 state는 Running이 되고 CrashLoopBackOff라는 단어는 사라집니다. 재시작은 같은 Pod 안에서 컨테이너를 새로 만드는 일이라 restartCount만 하나 늘고, Pod가 다른 노드로 옮겨 가지는 않습니다." },
  { label: "다시 죽음", summary: "STATUS CrashLoopBackOff", state: "Waiting", reason: "CrashLoopBackOff", last: "Terminated", lastDetail: "Exit Code 1", restarts: "n + 1", status: "CrashLoopBackOff", oom: false, note: "또 죽으면 다음 대기 창이 열려 CrashLoopBackOff가 돌아옵니다. 그래서 공식 문서는 이 단어를 상태라기보다 backoff 지연 메커니즘이 작동 중이라는 표시라고 설명합니다." },
  { label: "OOMKilled는 다른 경로로 적힘", summary: "lastState에 137", state: "Waiting", reason: "CrashLoopBackOff", last: "Terminated", lastDetail: "OOMKilled · 137", restarts: "n + 1", status: "CrashLoopBackOff", oom: true, note: "이 reason만은 kubelet이 아니라 커널의 SIGKILL에서 시작합니다. 런타임이 기록한 값을 kubelet이 옮겨 적고, 그 뒤의 재시작과 backoff는 다른 크래시와 같은 시계를 탑니다." },
] as const;

function Field({ name, value, detail }: { name: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background px-2 py-2 text-xs leading-5">
      <p className="font-mono text-muted-foreground">{name}</p>
      <p className="font-bold">{value}</p>
      <p className="font-mono text-[11px] leading-4 [overflow-wrap:anywhere] sm:text-xs">{detail}</p>
    </div>
  );
}

export default function ContainerStateViz() {
  return (
    <SceneShell
      eyebrow="한 컨테이너의 기록"
      title="STATUS 열은 state 안의 reason을 꺼내 보여 줍니다"
      description="바깥 칸이 Pod의 status.containerStatuses[] 한 항목입니다. state는 현재, lastState는 직전 상태이고 아래 칸이 kubectl이 표시하는 값입니다. 컨테이너 하나로 그렸습니다(가정)."
      ariaLabel="대기, 실행, 다시 대기와 OOM 경로에서 state, lastState, STATUS 값의 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="rounded-md border border-border/70 p-2">
              <p className="mb-2 font-mono text-[11px] text-muted-foreground sm:text-xs">status.containerStatuses[0]</p>
              <div className="grid grid-cols-2 gap-2">
                <Field name="state" value={scene.state} detail={scene.reason} />
                <Field name="lastState" value={scene.last} detail={scene.lastDetail} />
              </div>
              <p className="mt-2 font-mono text-xs">restartCount = {scene.restarts}</p>
            </div>
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-primary bg-background px-2 py-2 text-xs">
              <span className="min-w-0 font-mono font-bold [overflow-wrap:anywhere]">STATUS {scene.status}</span>
              <span className="font-mono">RESTARTS {scene.restarts}</span>
            </div>
            <ol className={`mt-2 grid grid-cols-3 gap-1.5 ${scene.oom ? "" : "opacity-35"}`}>
              {CHAIN.map((step, index) => (
                <li key={step.who} className={`min-w-0 rounded-md border px-1.5 py-1.5 text-[11px] leading-4 sm:text-xs sm:leading-5 ${scene.oom ? "border-primary bg-background" : "border-border/60"}`}>
                  <span className="block font-bold">{index + 1}. {step.who}</span>
                  {step.what}
                </li>
              ))}
            </ol>
          </div>
        );
      }}
    />
  );
}
