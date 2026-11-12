import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pdb-drain — replicas 4, PDB minAvailable 3(가정), worker-a에 checkout Pod 둘.
 * Allowed = currentHealthy − desiredHealthy(3). currentHealthy는 Ready이고 삭제 중이 아닌 Pod 수.
 * 첫 축출은 허용(4 − 3 = 1), 둘째는 429(3 − 3 = 0), drain은 5초마다 재시도한다.
 * 새 Pod가 Ready가 되면 4 − 3 = 1로 돌아오고, 못 되면 429만 반복된다. 20분 ÷ 5초 = 약 240번(산술).
 */
type PodState = "ready" | "deleting" | "gone" | "new-ready" | "new-notready" | "none";

interface DrainScene {
  label: string;
  summary: string;
  note: string;
  pods: readonly [PodState, PodState, PodState, PodState, PodState];
  healthy: number;
  log: readonly string[];
}

const SCENES: readonly DrainScene[] = [
  {
    label: "drain 전",
    summary: "4 Ready − 3 = 1 허용",
    note: "worker-a에 checkout Pod 둘, 다른 노드에 둘이 Ready입니다. PDB 컨트롤러는 Ready이고 삭제 중이 아닌 Pod를 세어 DisruptionsAllowed를 1로 적어 둡니다.",
    pods: ["ready", "ready", "ready", "ready", "none"],
    healthy: 4,
    log: [],
  },
  {
    label: "Pod 1 축출 → 허용",
    summary: "삭제 중 → 3 Ready − 3 = 0",
    note: "drain이 Pod 1에 Eviction을 보내면 Allowed가 1이라 통과합니다. Pod 1은 삭제되는 동안 건강 수에서 빠지므로 currentHealthy가 3, Allowed가 0이 됩니다.",
    pods: ["deleting", "ready", "ready", "ready", "none"],
    healthy: 3,
    log: ["Pod 1 · 허용"],
  },
  {
    label: "Pod 2 축출 → 429",
    summary: "Allowed 0 → 429 · 5초 뒤 다시",
    note: "같은 노드의 Pod 2에 대한 Eviction은 Allowed가 0이라 429로 거절됩니다. drain은 'will retry after 5s'를 찍고 5초 잔 뒤 다시 묻습니다.",
    pods: ["deleting", "ready", "ready", "ready", "none"],
    healthy: 3,
    log: ["Pod 1 · 허용", "Pod 2 · 429"],
  },
  {
    label: "새 Pod가 Ready가 되면",
    summary: "4 Ready − 3 = 1 → Pod 2 허용",
    note: "ReplicaSet이 다른 노드에 새 Pod를 만들고 그것이 Ready가 되면 currentHealthy가 4로 돌아옵니다. 그다음 재시도에서 Pod 2의 축출이 허용됩니다. 재시도가 몇 번 걸리는지는 새 Pod가 Ready가 되는 시간에 달렸습니다.",
    pods: ["gone", "ready", "ready", "ready", "new-ready"],
    healthy: 4,
    log: ["Pod 1 · 허용", "Pod 2 · 429", "…", "Pod 2 · 허용"],
  },
  {
    label: "새 Pod가 Ready가 못 되면",
    summary: "20분 ÷ 5초 = 약 240번의 429",
    note: "이미지 pull 실패든 readiness probe 실패든 새 Pod가 Ready가 못 되면 currentHealthy는 3에 머물고 429만 반복됩니다. drain의 기본 timeout은 무한이라 1절처럼 20분째 멈춰 있습니다.",
    pods: ["gone", "ready", "ready", "ready", "new-notready"],
    healthy: 3,
    log: ["Pod 1 · 허용", "Pod 2 · 429", "…", "Pod 2 · 429 (20분째)"],
  },
];

const DESIRED = 3;
const POD_NAMES = ["Pod 1", "Pod 2", "Pod 3", "Pod 4", "새 Pod"] as const;

const POD_STYLE: Record<PodState, { box: string; text: string }> = {
  ready: { box: "border-emerald-600/70 bg-emerald-500/15", text: "Ready" },
  deleting: { box: "border-dashed border-rose-500/80 bg-rose-500/10", text: "삭제 중" },
  gone: { box: "border-dashed border-border/60", text: "세지 않음" },
  "new-ready": { box: "border-emerald-600/70 bg-emerald-500/15", text: "Ready" },
  "new-notready": { box: "border-dashed border-amber-500/80 bg-amber-500/10", text: "NotReady" },
  none: { box: "border-dashed border-border/40", text: "아직 없음" },
};

function Pod({ index, state }: { index: number; state: PodState }) {
  const style = POD_STYLE[state];
  return (
    <div className={`rounded-md border px-1 py-1 text-center text-xs leading-5 sm:px-2 sm:py-1.5 ${style.box}`}>
      <span className="block font-semibold">{POD_NAMES[index]}</span>
      <span className="block text-muted-foreground">{style.text}</span>
    </div>
  );
}

export default function DrainRetryViz() {
  return (
    <SceneShell
      eyebrow="drain과 PDB"
      title="drain은 Ready 수가 돌아와야 다음 Pod를 내보냅니다"
      description="worker-a 칸이 비우려는 노드이고, 다른 노드 칸이 나머지입니다. 아래 식이 그 순간 PDB가 허용하는 축출 수(DisruptionsAllowed)이고, 맨 아래 줄이 drain이 받은 응답입니다."
      note="replicas 4와 minAvailable 3은 글의 가정이고, Pod 3·4를 worker-a 밖에 둔 배치는 그림을 위한 가정입니다. 240번은 20분을 재시도 간격 5초로 나눈 산술값입니다."
      ariaLabel="kubectl drain이 PDB 예산 때문에 두 번째 Pod 축출에서 429를 받고 재시도하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const allowed = scene.healthy - DESIRED;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
              <div className="rounded-lg border border-border p-2">
                <p className="mb-2 text-xs font-bold">worker-a (drain 대상)</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <Pod index={0} state={scene.pods[0]} />
                  <Pod index={1} state={scene.pods[1]} />
                </div>
              </div>
              <div className="rounded-lg border border-border p-2">
                <p className="mb-2 text-xs font-bold">다른 노드</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <Pod index={2} state={scene.pods[2]} />
                  <Pod index={3} state={scene.pods[3]} />
                  <Pod index={4} state={scene.pods[4]} />
                </div>
              </div>
            </div>
            <p className={`rounded-md border px-3 py-2 text-center font-mono text-xs font-bold sm:text-sm ${allowed > 0 ? "border-emerald-600/60 text-emerald-700 dark:text-emerald-400" : "border-rose-500/60 text-rose-700 dark:text-rose-400"}`}>
              currentHealthy {scene.healthy} − desired {DESIRED} = Allowed {allowed}
            </p>
            <div className="flex min-h-9 flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">drain 응답:</span>
              {scene.log.length === 0 && <span className="text-muted-foreground">아직 요청 없음</span>}
              {scene.log.map((entry, i) => (
                <span
                  key={`${entry}-${i}`}
                  className={`rounded border px-1.5 py-0.5 font-mono ${entry.includes("429") ? "border-rose-500/60 text-rose-700 dark:text-rose-400" : entry === "…" ? "border-transparent text-muted-foreground" : "border-emerald-600/60 text-emerald-700 dark:text-emerald-400"}`}
                >
                  {entry}
                </span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
