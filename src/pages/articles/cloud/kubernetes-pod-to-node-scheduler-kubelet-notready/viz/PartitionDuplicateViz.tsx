import SceneShell from "./SceneShell";

/**
 * 본문 대응: #taints-eviction·#boundary — 네트워크만 끊긴 노드에서는 삭제 요청이 컨테이너를 멈추지 못합니다.
 * 왼쪽 값은 API server가 아는 것, 아래 두 칸은 노드 안 실제입니다. web-y는 6절의 대체 Pod 이름입니다.
 */
const SCENES = [
  { label: "연결이 끊깁니다", summary: "전원은 켜져 있습니다", note: "(가정) web-x가 있는 worker-2가 전원은 켜진 채 API server와의 네트워크만 끊겼습니다. 노드 안 컨테이너는 계속 돕니다.", ready: "Ready=True(아직 판정 전)", x: "Running", y: "없음", w1: false, w1Text: "비어 있음" },
  { label: "Unknown", summary: "API server는 보고 두절만 압니다", note: "컨트롤러가 Unknown과 unreachable taint를 적습니다. 전원이 꺼졌는지 네트워크만 갈라졌는지는 이 값에서 구별되지 않습니다.", ready: "Unknown · unreachable taint", x: "Running(마지막 보고)", y: "없음", w1: false, w1Text: "비어 있음" },
  { label: "300초 뒤 삭제 요청", summary: "API 쪽만 Terminating", note: "300초 뒤 API server 쪽에서 삭제가 요청됩니다. 노드 안 컨테이너가 실제로 멈췄다는 보장은 없습니다. 삭제를 요청하는 일과 프로세스가 멈추는 일은 다릅니다.", ready: "Unknown · unreachable taint", x: "Terminating", y: "없음", w1: false, w1Text: "비어 있음" },
  { label: "대체 Pod", summary: "같은 일이 두 곳에서", note: "ReplicaSet이 대체 Pod web-y를 만들면 같은 Pod가 두 노드에서 동시에 도는 구간이 생깁니다. tolerationSeconds를 줄이면 대체 Pod를 더 일찍 만들 수 있지만 기존 컨테이너가 멈췄다는 보장은 생기지 않습니다.", ready: "Unknown · unreachable taint", x: "Terminating", y: "Running on worker-1", w1: true, w1Text: "web-y 실행 중" },
  { label: "StatefulSet이라면", summary: "대체 Pod를 만들지 않음", note: "StatefulSet은 옛 Pod가 Terminating인 동안 같은 이름의 대체 Pod를 만들지 않습니다. 노드가 확실히 꺼졌다는 외부 증거 없이 강제 삭제하면 같은 이름(identity)의 프로세스가 두 곳에서 동작할 수 있습니다.", ready: "Unknown · unreachable taint", x: "Terminating", y: "만들지 않음", w1: false, w1Text: "대체 Pod 없음" },
] as const;

function Row({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-3 text-xs leading-5">
      <span className="font-mono text-muted-foreground">{name}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function Node({ name, text, running, cut }: { name: string; text: string; running: boolean; cut?: string }) {
  return (
    <div className="min-w-0 rounded-lg border p-2" style={{ borderColor: running ? "#16a34a" : "#94a3b8" }}>
      <p className="font-mono text-xs font-bold">{name}</p>
      <p className="mt-1 break-keep rounded-sm px-1.5 py-1 text-center text-xs font-bold" style={running ? { backgroundColor: "#dcfce7", color: "#166534" } : { color: "#64748b" }}>{text}</p>
      {cut && <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{cut}</p>}
    </div>
  );
}

export default function PartitionDuplicateViz() {
  return (
    <SceneShell
      eyebrow="(가정) 분단된 worker-2"
      title="API server가 삭제를 요청해도 끊긴 노드의 컨테이너는 계속 돌 수 있습니다"
      description="위 칸은 API server가 아는 값, 아래 두 칸은 노드 안의 실제입니다. 빨간 점선이 끊긴 연결입니다."
      ariaLabel="네트워크가 끊긴 노드에서 컨테이너가 계속 도는 동안 다른 노드에 대체 Pod가 뜨는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="mb-1 text-xs font-bold text-primary">API server가 아는 것</p>
              <Row name="Node worker-2" value={scene.ready} />
              <Row name="Pod web-x" value={scene.x} />
              <Row name={active === 4 ? "대체 Pod" : "Pod web-y"} value={scene.y} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="mx-auto h-6 w-px bg-slate-400" />
              <div className="relative mx-auto h-6 w-0 border-l border-dashed border-red-600">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-1 text-xs font-bold leading-none text-red-700">×</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Node name="worker-1" text={scene.w1Text} running={scene.w1} />
              <Node name="worker-2" text="web-x 컨테이너 실행 중" running cut={active >= 2 ? "삭제 요청을 받지 못함" : "API server와 연결 끊김"} />
            </div>
          </div>
        );
      }}
    />
  );
}
