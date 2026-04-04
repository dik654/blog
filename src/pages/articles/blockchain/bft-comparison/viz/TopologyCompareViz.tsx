import { motion } from 'framer-motion';

const C = { pbft: '#ef4444', hs: '#6366f1', node: '#0ea5e9' };

function Node({ x, y, label, color, r = 16 }: { x: number; y: number; label: string; color: string; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="var(--card)" stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={color}>{label}</text>
    </g>
  );
}

function PBFTMesh() {
  const N = [
    { x: 50, y: 50 }, { x: 170, y: 50 },
    { x: 50, y: 140 }, { x: 170, y: 140 },
  ];
  const lines: [number, number][] = [];
  for (let i = 0; i < 4; i++)
    for (let j = i + 1; j < 4; j++)
      lines.push([i, j]);

  return (
    <g>
      <text x={110} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.pbft}>
        PBFT: O(n²)
      </text>
      {/* Lines first */}
      {lines.map(([a, b], i) => (
        <motion.line key={i} x1={N[a].x} y1={N[a].y} x2={N[b].x} y2={N[b].y}
          stroke={C.pbft} strokeWidth={1.5} opacity={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: i * 0.06 }} />
      ))}
      {/* Nodes after (opaque background covers lines) */}
      {N.map((n, i) => <Node key={i} x={n.x} y={n.y} label={`R${i}`} color={C.node} />)}
      <text x={110} y={170} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        6 edges (n=4)
      </text>
    </g>
  );
}

function HotStuffStar() {
  const leader = { x: 110, y: 50 };
  const replicas = [
    { x: 40, y: 140 }, { x: 110, y: 140 }, { x: 180, y: 140 },
  ];

  return (
    <g transform="translate(230, 0)">
      <text x={110} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.hs}>
        HotStuff: O(n)
      </text>
      {/* Lines first */}
      {replicas.map((r, i) => (
        <motion.line key={i} x1={leader.x} y1={leader.y + 16} x2={r.x} y2={r.y - 16}
          stroke={C.hs} strokeWidth={1.5} opacity={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }} />
      ))}
      {/* Nodes after */}
      <Node x={leader.x} y={leader.y} label="L" color={C.hs} r={18} />
      {replicas.map((r, i) => <Node key={i} x={r.x} y={r.y} label={`R${i + 1}`} color={C.node} />)}
      <text x={110} y={170} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        3 edges (n=4)
      </text>
    </g>
  );
}

export default function TopologyCompareViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">토폴로지 비교: Broadcast vs Star</p>
      <svg viewBox="0 0 460 180" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <PBFTMesh />
        <HotStuffStar />
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        PBFT: 모든 노드가 서로 통신 → n(n-1)/2 연결 / HotStuff: 리더 경유 → n-1 연결
      </p>
    </div>
  );
}
