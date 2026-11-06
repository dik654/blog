import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — web-x(요청 0.5 CPU, toleration 없음)가 세 노드를 거쳐 worker-2에 적힙니다.
 * worker-1의 여유 CPU와 worker-2의 Allocatable은 본문에 없으므로 그리지 않습니다. 막대는 본문이 준 여유값(1.5, 0.2)만 씁니다.
 */
const REQUEST = 0.5;
const SCALE = 2;
const OUT = "#dc2626";
const PASS = "#16a34a";

type NodeState = { state: "idle" | "out" | "pass"; reason: string };
interface Scene {
  label: string;
  summary: string;
  note: string;
  stage: 0 | 1 | 2;
  nodeName: string;
  nodes: [NodeState, NodeState, NodeState];
}

const idle: NodeState = { state: "idle", reason: "검사 전" };
const w1out: NodeState = { state: "out", reason: "탈락: untolerated taint" };
const w3out: NodeState = { state: "out", reason: "탈락: Insufficient cpu 0.2 < 0.5" };
const w2pass: NodeState = { state: "pass", reason: "통과: 1.5 ≥ 0.5" };

const SCENES: readonly Scene[] = [
  { label: "입력", summary: "노드 3개, Pod 1개", note: "Pod는 nodeName이 비어 있습니다. taint는 노드에 붙인 표식, toleration은 Pod가 그 표식을 견딘다는 선언입니다. requests는 Pod가 미리 잡아 달라는 자원량이며 500m는 0.5 CPU입니다.", stage: 0, nodeName: "(비어 있음)", nodes: [idle, idle, idle] },
  { label: "Filter: taint", summary: "worker-1 탈락", note: "Filter 플러그인은 노드마다 '이 Pod가 갈 수 있나'를 예·아니오로 답합니다. web-x에는 toleration이 없으므로 TaintToleration 플러그인이 worker-1을 떨어뜨립니다.", stage: 0, nodeName: "(비어 있음)", nodes: [w1out, idle, idle] },
  { label: "Filter: CPU", summary: "worker-3 탈락", note: "NodeResourcesFit 플러그인이 여유와 요청을 비교합니다. worker-3은 Allocatable 2 가운데 1.8이 잡혀 0.2만 남아 0.5를 받지 못합니다. worker-2는 여유 1.5로 통과합니다.", stage: 0, nodeName: "(비어 있음)", nodes: [w1out, w2pass, w3out] },
  { label: "Score 생략", summary: "통과 1개면 바로 선택", note: "점수는 통과한 노드가 여럿일 때만 매깁니다. 하나뿐이면 점수 단계를 건너뛰고 worker-2를 고릅니다.", stage: 1, nodeName: "(비어 있음)", nodes: [w1out, { state: "pass", reason: "선택됨" }, w3out] },
  { label: "Binding", summary: "spec.nodeName = worker-2", note: "Pod의 binding 하위 자원에 Target: Node worker-2를 POST하면 API server가 nodeName을 채웁니다. scheduler는 worker-2의 kubelet에 아무것도 보내지 않습니다.", stage: 2, nodeName: "worker-2", nodes: [w1out, { state: "pass", reason: "이름이 적힘" }, w3out] },
  { label: "통과가 0이었다면", summary: "Pending + FailedScheduling", note: "(가정) worker-2도 탈락했다면 Pod는 Pending으로 남고 '0/3 nodes are available: 1 node(s) had untolerated taint, 1 Insufficient cpu, …' 같은 Event가 붙습니다. 뒤의 Score와 Binding은 없습니다.", stage: 0, nodeName: "(비어 있음)", nodes: [w1out, { state: "out", reason: "(가정) 다른 이유로 탈락" }, w3out] },
];

const NODES = [
  { name: "worker-1", tag: "taint: maintenance (NoSchedule)", free: null },
  { name: "worker-2", tag: "taint 없음", free: 1.5 },
  { name: "worker-3", tag: "taint 없음", free: 0.2 },
] as const;

function NodeCard({ node, status }: { node: (typeof NODES)[number]; status: NodeState }) {
  const out = status.state === "out";
  const color = out ? OUT : status.state === "pass" ? PASS : "#94a3b8";
  return (
    <div className="flex min-w-0 flex-col rounded-lg border p-2 text-xs leading-5" style={{ borderColor: color, borderStyle: out ? "dashed" : "solid" }}>
      <p className={`font-mono font-bold ${out ? "text-muted-foreground line-through" : ""}`}>{node.name}</p>
      <p className="mt-1 min-h-[3.75rem] break-words text-[11px] leading-4 text-muted-foreground">{node.tag}</p>
      <p className="text-[11px] font-bold text-muted-foreground">여유 CPU</p>
      {node.free === null ? (
        <p className="h-6 text-[11px] leading-4 text-muted-foreground">사례에 없음</p>
      ) : (
        <div className="relative h-6">
          <div className="absolute inset-x-0 top-1 h-3 rounded-sm bg-muted/60" />
          <div className="absolute left-0 top-1 h-3 rounded-sm" style={{ width: `${(node.free / SCALE) * 100}%`, backgroundColor: "#64748b" }} />
          <div className="absolute top-0 h-5 w-0 border-l border-foreground" style={{ left: `${(REQUEST / SCALE) * 100}%` }} />
        </div>
      )}
      <p className="min-h-[3rem] break-keep text-[11px] font-bold leading-4" style={{ color: out ? "#b91c1c" : status.state === "pass" ? "#15803d" : "#64748b" }}>{status.reason}</p>
    </div>
  );
}

export default function SchedulerFilterViz() {
  return (
    <SceneShell
      eyebrow="(가정) 노드 3개, Pod web-x"
      title="두 노드가 걸러지면 점수 없이 남은 하나에 이름을 적습니다"
      description="노드 칸의 막대는 남은 CPU(칸 전체 = 2 CPU), 세로선은 web-x의 요청 0.5 CPU입니다. 맨 아래 줄이 scheduler의 현재 단계입니다."
      ariaLabel="taint와 CPU 여유로 세 노드를 거른 뒤 worker-2에 Pod 이름을 적는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5">
              <span className="font-mono font-bold">Pod web-x</span>
              <span className="text-muted-foreground">요청 0.5 CPU</span>
              <span className="text-muted-foreground">toleration 없음</span>
              <span className={`font-mono ${scene.nodeName === "worker-2" ? "font-bold text-primary" : "text-muted-foreground"}`}>nodeName: {scene.nodeName}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {NODES.map((node, index) => <NodeCard key={node.name} node={node} status={scene.nodes[index]} />)}
            </div>
            <ol className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold">
              {["Filter", "Score", "Bind"].map((name, index) => (
                <li key={name} className={`rounded-sm border py-1 ${scene.stage === index ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}>
                  {name}{index === 1 && scene.stage >= 1 ? " 생략" : ""}
                </li>
              ))}
            </ol>
          </div>
        );
      }}
    />
  );
}
