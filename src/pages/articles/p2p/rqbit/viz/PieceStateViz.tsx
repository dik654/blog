import SceneShell from "./SceneShell";

/**
 * 본문 대응: #peer-piece, #piece-verify — PieceTracker의 piece 상태와 사건별 이동.
 * QUEUED → IN_FLIGHT(예약), IN_FLIGHT 안에서 owner 교체(steal), IN_FLIGHT → QUEUED(pause),
 * Completed → in-flight에서 뺌 → check_piece → match면 HAVE, mismatch면 QUEUED.
 */
type Place = "queued" | "inflight" | "have";
type Edge = "reserve" | "steal" | "pause" | "complete" | "match" | "mismatch";

interface StateScene {
  label: string;
  summary: string;
  note: string;
  piece: Place;
  owner: string;
  edges: readonly Edge[];
}

const SCENES: readonly StateScene[] = [
  {
    label: "예약",
    summary: "QUEUED → IN_FLIGHT",
    note: "Peer A가 queue의 piece 1을 예약했다고 둡니다. IN_FLIGHT에는 owner peer와 시작 시각이 함께 적힙니다. 한 piece는 네 상태 가운데 정확히 하나에만 있습니다.",
    piece: "inflight",
    owner: "owner A · 시작 시각",
    edges: ["reserve"],
  },
  {
    label: "Steal",
    summary: "상태 그대로 · owner A → B",
    note: "A가 piece 1을 붙잡은 시간이 앞 그림의 문턱을 넘어 B가 가져가도 상태는 IN_FLIGHT 그대로이고 owner와 시작 시각만 바뀝니다. A의 request는 cancel하며, disk에 쓰기 직전 owner가 sender인지 다시 확인해 A의 늦은 byte가 섞이지 않게 합니다.",
    piece: "inflight",
    owner: "owner B · 시작 = now",
    edges: ["steal"],
  },
  {
    label: "Pause",
    summary: "IN_FLIGHT → QUEUED",
    note: "Pause할 때 in-flight piece를 queue로 되돌립니다. 그래서 사라진 task가 piece를 영원히 점유하지 않습니다.",
    piece: "queued",
    owner: "owner · 시작 시각",
    edges: ["pause"],
  },
  {
    label: "Hash가 맞을 때",
    summary: "Completed → check_piece → HAVE",
    note: "마지막 chunk를 써서 Completed가 되면 in-flight entry를 먼저 빼고, check_piece가 piece byte의 SHA-1을 metainfo와 비교합니다. 같으면 HAVE가 되고 checked counter, stream waker, peer HAVE를 갱신합니다.",
    piece: "have",
    owner: "owner · 시작 시각",
    edges: ["complete", "match"],
  },
  {
    label: "Hash가 다를 때",
    summary: "Completed → check_piece → QUEUED",
    note: "다르면 mark_piece_hash_failed가 piece를 queue로 되돌리고 현재 peer task를 오류로 끝냅니다. Hash로는 어느 byte가 틀렸는지 모르므로 piece 전체를 다시 받습니다.",
    piece: "queued",
    owner: "owner · 시작 시각",
    edges: ["complete", "mismatch"],
  },
];

const W = 420;
const H = 214;
const NODE_W = 108;
const NODE_H = 44;
const ROW_Y = 62;
const QX = 58;
const IX = 210;
const HX = 362;
const NODES: readonly { id: Place; x: number; title: string }[] = [
  { id: "queued", x: QX, title: "QUEUED" },
  { id: "inflight", x: IX, title: "IN_FLIGHT" },
  { id: "have", x: HX, title: "HAVE" },
];
const GATE = { x: IX, y: 150, w: 132, h: 42 };

const ACTIVE = "#2563eb";
const FAIL = "#dc2626";
const IDLE = "#cbd5e1";

function edgeColor(edge: Edge, on: readonly Edge[]) {
  if (!on.includes(edge)) return IDLE;
  return edge === "mismatch" ? FAIL : ACTIVE;
}

export default function PieceStateViz() {
  return (
    <SceneShell
      eyebrow="piece 상태"
      title="Piece 1은 사건마다 네 상태 가운데 하나로 옮겨 갑니다"
      description="파란 점이 piece 1의 현재 상태입니다. 예약 뒤의 네 장면은 각각 IN_FLIGHT에서 출발하는 따로 된 사건이며, 마지막 chunk를 쓴 뒤에는 hash 검사(check_piece)를 거쳐야 HAVE가 됩니다."
      ariaLabel="QUEUED, IN_FLIGHT, HAVE 상태와 check_piece 검사를 사이에 둔 piece 1의 상태 이동"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = scene.edges;
        const half = NODE_W / 2;
        const gateLeft = GATE.x - GATE.w / 2;
        const gateRight = GATE.x + GATE.w / 2;
        const gateTop = GATE.y - GATE.h / 2;
        const nodeBottom = ROW_Y + NODE_H / 2;
        const nodeTop = ROW_Y - NODE_H / 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              {[ACTIVE, FAIL, IDLE].map((color) => (
                <marker key={color} id={`rqbit-state-${color.slice(1)}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0 0L7 3.5L0 7Z" fill={color} />
                </marker>
              ))}
            </defs>

            {/* 예약: QUEUED → IN_FLIGHT (위쪽 선) */}
            <line x1={QX + half} y1={ROW_Y - 8} x2={IX - half - 2} y2={ROW_Y - 8} stroke={edgeColor("reserve", on)} strokeWidth={1.25} markerEnd={`url(#rqbit-state-${edgeColor("reserve", on).slice(1)})`} />
            <text x={(QX + IX) / 2} y={ROW_Y - 14} textAnchor="middle" fontSize={12} fill={on.includes("reserve") ? ACTIVE : "#94a3b8"}>예약</text>
            {/* Pause: IN_FLIGHT → QUEUED (아래쪽 선) */}
            <line x1={IX - half} y1={ROW_Y + 8} x2={QX + half + 2} y2={ROW_Y + 8} stroke={edgeColor("pause", on)} strokeWidth={1.25} markerEnd={`url(#rqbit-state-${edgeColor("pause", on).slice(1)})`} />
            <text x={(QX + IX) / 2} y={ROW_Y + 22} textAnchor="middle" fontSize={12} fill={on.includes("pause") ? ACTIVE : "#94a3b8"}>pause</text>
            {/* Steal: IN_FLIGHT 안에서 owner만 바뀜 */}
            <path d={`M ${IX - 12} ${nodeTop} C ${IX - 20} ${nodeTop - 26}, ${IX + 20} ${nodeTop - 26}, ${IX + 12} ${nodeTop + 1}`} fill="none" stroke={edgeColor("steal", on)} strokeWidth={1.25} markerEnd={`url(#rqbit-state-${edgeColor("steal", on).slice(1)})`} />
            <text x={IX + 22} y={nodeTop - 12} fontSize={12} fill={on.includes("steal") ? ACTIVE : "#94a3b8"}>steal</text>
            {/* Completed: IN_FLIGHT → check_piece */}
            <line x1={IX} y1={nodeBottom} x2={IX} y2={gateTop - 2} stroke={edgeColor("complete", on)} strokeWidth={1.25} markerEnd={`url(#rqbit-state-${edgeColor("complete", on).slice(1)})`} />
            <text x={IX + 6} y={nodeBottom + 18} fontSize={12} fill={on.includes("complete") ? ACTIVE : "#94a3b8"}>
              <tspan x={IX + 6}>Completed</tspan>
              <tspan x={IX + 6} dy={14}>in-flight에서 뺌</tspan>
            </text>
            {/* match → HAVE */}
            <polyline points={`${gateRight},${GATE.y} ${HX},${GATE.y} ${HX},${nodeBottom + 2}`} fill="none" stroke={edgeColor("match", on)} strokeWidth={1.25} markerEnd={`url(#rqbit-state-${edgeColor("match", on).slice(1)})`} />
            <text x={(gateRight + HX) / 2} y={GATE.y + 16} textAnchor="middle" fontSize={12} fill={on.includes("match") ? ACTIVE : "#94a3b8"}>match</text>
            {/* mismatch → QUEUED */}
            <polyline points={`${gateLeft},${GATE.y} ${QX},${GATE.y} ${QX},${nodeBottom + 2}`} fill="none" stroke={edgeColor("mismatch", on)} strokeWidth={1.25} markerEnd={`url(#rqbit-state-${edgeColor("mismatch", on).slice(1)})`} />
            <text x={(gateLeft + QX) / 2} y={GATE.y + 16} textAnchor="middle" fontSize={12} fill={on.includes("mismatch") ? FAIL : "#94a3b8"}>mismatch</text>

            {NODES.map((node) => {
              const here = scene.piece === node.id;
              return (
                <g key={node.id}>
                  <rect x={node.x - half} y={nodeTop} width={NODE_W} height={NODE_H} rx={8} fill={here ? ACTIVE : "none"} fillOpacity={here ? 0.14 : 1} stroke={here ? ACTIVE : "#94a3b8"} strokeWidth={here ? 1.25 : 1} />
                  <text x={node.x} y={node.id === "inflight" ? ROW_Y - 4 : ROW_Y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={here ? ACTIVE : "#64748b"}>{node.title}</text>
                  {node.id === "inflight" && (
                    <text x={node.x} y={ROW_Y + 12} textAnchor="middle" fontSize={11} fill="#64748b">{scene.owner}</text>
                  )}
                  {here && <circle cx={node.x - half + 9} cy={nodeTop + 9} r={4} fill={ACTIVE} />}
                </g>
              );
            })}

            <rect x={gateLeft} y={gateTop} width={GATE.w} height={GATE.h} rx={8} fill="#d97706" fillOpacity={0.12} stroke={on.includes("complete") ? "#b45309" : "#94a3b8"} strokeWidth={1} />
            <text x={GATE.x} y={GATE.y - 3} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">check_piece</text>
            <text x={GATE.x} y={GATE.y + 12} textAnchor="middle" fontSize={11} fill="#b45309">SHA-1 vs metainfo</text>

            <rect x={20} y={188} width={380} height={22} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={30} y={203} fontSize={12} fill="#64748b">NOT_NEEDED · 네 번째 상태 · 이 글은 이동을 다루지 않음</text>
          </svg>
        );
      }}
    />
  );
}
