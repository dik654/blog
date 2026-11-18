import SceneShell from "./NetworkSceneShell";

/**
 * 본문 대응: #pcie-topology-peer-path — nvidia-smi topo -m의 PIX·PXB·PHB·SYS를 한 (가정) 배치도 위의 경로로 그립니다.
 * PIX = 한 PCIe switch, PXB = 여러 switch, PHB = PCIe host bridge, SYS = NUMA node 사이 CPU interconnect.
 * 거리표일 뿐 bandwidth 값이 아니므로 선 굵기·숫자로 속도를 표시하지 않습니다.
 */
type NodeId = "cpu0" | "cpu1" | "swTop" | "sw1" | "sw2" | "sw3" | "sw4" | "gA" | "gB" | "gC" | "gD" | "gE";

const NODES: Record<NodeId, { x: number; y: number; w: number; h: number; label: string; sub?: string }> = {
  cpu0: { x: 20, y: 10, w: 200, h: 34, label: "CPU 0", sub: "host bridge" },
  cpu1: { x: 268, y: 10, w: 92, h: 34, label: "CPU 1", sub: "host bridge" },
  swTop: { x: 64, y: 70, w: 56, h: 24, label: "SW 1" },
  sw3: { x: 172, y: 70, w: 56, h: 24, label: "SW 4" },
  sw4: { x: 286, y: 70, w: 56, h: 24, label: "SW 5" },
  sw1: { x: 27, y: 120, w: 56, h: 24, label: "SW 2" },
  sw2: { x: 102, y: 120, w: 56, h: 24, label: "SW 3" },
  gA: { x: 12, y: 176, w: 42, h: 26, label: "GPU A" },
  gB: { x: 60, y: 176, w: 42, h: 26, label: "GPU B" },
  gC: { x: 109, y: 176, w: 42, h: 26, label: "GPU C" },
  gD: { x: 179, y: 176, w: 42, h: 26, label: "GPU D" },
  gE: { x: 293, y: 176, w: 42, h: 26, label: "GPU E" },
};

type Edge = { id: string; from: NodeId; to: NodeId; fx?: number; tx?: number };

// fx/tx: 위쪽 노드의 아래 변에서 선이 나가는 x (넓은 CPU 상자에서 내려오는 선의 위치)
const EDGES: readonly Edge[] = [
  { id: "c0-top", from: "cpu0", to: "swTop", fx: 92 },
  { id: "c0-sw3", from: "cpu0", to: "sw3", fx: 200 },
  { id: "c1-sw4", from: "cpu1", to: "sw4", fx: 314 },
  { id: "top-sw1", from: "swTop", to: "sw1" },
  { id: "top-sw2", from: "swTop", to: "sw2" },
  { id: "sw1-A", from: "sw1", to: "gA" },
  { id: "sw1-B", from: "sw1", to: "gB" },
  { id: "sw2-C", from: "sw2", to: "gC" },
  { id: "sw3-D", from: "sw3", to: "gD" },
  { id: "sw4-E", from: "sw4", to: "gE" },
];

const SCENES = [
  {
    label: "PIX · 한 PCIe switch",
    summary: "GPU A ↔ GPU B",
    target: "gB",
    edges: ["sw1-A", "sw1-B"],
    nodes: ["sw1"],
    socket: false,
    note: "두 GPU가 같은 switch(SW 2) 아래 있습니다. Peer transaction이 그 switch에서 전달될 수 있어 CPU 쪽으로 올라가지 않아도 됩니다.",
  },
  {
    label: "PXB · 여러 PCIe switch",
    summary: "GPU A ↔ GPU C",
    target: "gC",
    edges: ["sw1-A", "top-sw1", "top-sw2", "sw2-C"],
    nodes: ["sw1", "swTop", "sw2"],
    socket: false,
    note: "SW 2 → SW 1 → SW 3처럼 switch를 여러 개 지나지만 CPU의 host bridge까지는 가지 않는 경로입니다.",
  },
  {
    label: "PHB · PCIe host bridge",
    summary: "GPU A ↔ GPU D",
    target: "gD",
    edges: ["sw1-A", "top-sw1", "c0-top", "c0-sw3", "sw3-D"],
    nodes: ["sw1", "swTop", "cpu0", "sw3"],
    socket: false,
    note: "공통 switch가 없어 CPU 0의 host bridge(CPU 쪽 PCIe 출입구, root complex)를 거쳐 내려갑니다. Platform에 따라 이런 peer access가 제한될 수도 있습니다.",
  },
  {
    label: "SYS · CPU 사이 연결",
    summary: "GPU A ↔ GPU E",
    target: "gE",
    edges: ["sw1-A", "top-sw1", "c0-top", "c1-sw4", "sw4-E"],
    nodes: ["sw1", "swTop", "cpu0", "cpu1", "sw4"],
    socket: true,
    note: "GPU E는 다른 CPU(다른 NUMA node) 아래 있습니다. 두 CPU 사이 연결까지 건너야 하고, platform에 따라 peer access가 제한될 수도 있습니다.",
  },
] as const;

const ON = "#2563eb";
const OFF = "#cbd5e1";
const TEXT = "#64748b";

function anchor(id: NodeId, side: "top" | "bottom", x?: number) {
  const n = NODES[id];
  return { x: x ?? n.x + n.w / 2, y: side === "top" ? n.y : n.y + n.h };
}

export default function PcieTopologyPathViz() {
  return (
    <SceneShell
      eyebrow="topo -m 표기를 배치도에서"
      title="같은 x16이라도 두 GPU 사이에 무엇이 끼느냐에 따라 표기가 달라집니다"
      description="SW는 PCIe switch입니다. 배치는 설명을 위한 가정이고, 파란 선이 GPU A에서 상대 GPU까지 지나는 경로입니다. 이 표기는 거리표이며 bandwidth 측정값이 아닙니다."
      ariaLabel="PIX, PXB, PHB, SYS 네 표기가 PCIe 배치도에서 어떤 경로에 해당하는지 보여 주는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const onEdges = new Set<string>(scene.edges);
        const onNodes = new Set<string>([...scene.nodes, "gA", scene.target]);
        return (
          <svg viewBox="0 0 380 214" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {EDGES.map((edge) => {
              const a = anchor(edge.from, "bottom", edge.fx);
              const b = anchor(edge.to, "top", edge.tx);
              const on = onEdges.has(edge.id);
              return <line key={edge.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? ON : OFF} strokeWidth={on ? 1.25 : 1} />;
            })}
            <line x1={220} x2={268} y1={27} y2={27} stroke={scene.socket ? ON : OFF} strokeWidth={scene.socket ? 1.25 : 1} />
            <text x={244} y={56} textAnchor="middle" fontSize={9} fill={scene.socket ? ON : TEXT}>CPU 간</text>
            <text x={244} y={66} textAnchor="middle" fontSize={9} fill={scene.socket ? ON : TEXT}>연결</text>
            {(Object.keys(NODES) as NodeId[]).map((id) => {
              const n = NODES[id];
              const on = onNodes.has(id);
              const cx = n.x + n.w / 2;
              return (
                <g key={id}>
                  <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={5} fill={on ? ON : "#94a3b8"} fillOpacity={on ? 0.14 : 0.06} stroke={on ? ON : "#94a3b8"} strokeWidth={1} />
                  {n.sub ? (
                    <>
                      <text x={cx} y={n.y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? ON : TEXT}>{n.label}</text>
                      <text x={cx} y={n.y + 27} textAnchor="middle" fontSize={9} fill={on ? ON : TEXT}>{n.sub}</text>
                    </>
                  ) : (
                    <text x={cx} y={n.y + n.h / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={on ? 700 : 400} fill={on ? ON : TEXT}>{n.label}</text>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
