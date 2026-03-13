import { motion } from 'framer-motion';
import { useState } from 'react';

/* PBFT Broadcast vs HotStuff Star topology 비교 시각화 */

const C = { pbft: '#ef4444', hs: '#6366f1', node: '#0ea5e9' };

function PBFTMesh() {
  // 4 nodes in a square
  const N = [
    { x: 40, y: 30 }, { x: 120, y: 30 },
    { x: 40, y: 100 }, { x: 120, y: 100 },
  ];
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < 4; i++)
    for (let j = i + 1; j < 4; j++)
      lines.push({ x1: N[i].x, y1: N[i].y, x2: N[j].x, y2: N[j].y });

  return (
    <g>
      <text x={80} y={14} textAnchor="middle" fontSize={9} fontWeight="700" fill={C.pbft}>PBFT: O(n²)</text>
      {lines.map((l, i) => (
        <motion.line key={i} {...l} stroke={C.pbft} strokeWidth={1.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: i * 0.06 }} />
      ))}
      {N.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={14} fill={`${C.node}22`} stroke={C.node} strokeWidth={1.5} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={8} fontWeight="600" fill={C.node}>R{i}</text>
        </g>
      ))}
      {/* 6 lines for 4 nodes */}
      <text x={80} y={128} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">
        6 edges (n=4)
      </text>
    </g>
  );
}

function HotStuffStar() {
  const leader = { x: 80, y: 60 };
  const replicas = [
    { x: 20, y: 110 }, { x: 80, y: 110 }, { x: 140, y: 110 },
  ];

  return (
    <g transform="translate(160, 0)">
      <text x={80} y={14} textAnchor="middle" fontSize={9} fontWeight="700" fill={C.hs}>HotStuff: O(n)</text>
      {replicas.map((r, i) => (
        <motion.line key={i} x1={leader.x} y1={leader.y} x2={r.x} y2={r.y}
          stroke={C.hs} strokeWidth={1.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }} />
      ))}
      <g>
        <circle cx={leader.x} cy={leader.y} r={14} fill={`${C.hs}22`} stroke={C.hs} strokeWidth={2} />
        <text x={leader.x} y={leader.y + 4} textAnchor="middle" fontSize={8} fontWeight="700" fill={C.hs}>L</text>
      </g>
      {replicas.map((r, i) => (
        <g key={i}>
          <circle cx={r.x} cy={r.y} r={14} fill={`${C.node}22`} stroke={C.node} strokeWidth={1.5} />
          <text x={r.x} y={r.y + 4} textAnchor="middle" fontSize={8} fontWeight="600" fill={C.node}>R{i + 1}</text>
        </g>
      ))}
      <text x={80} y={128} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">
        3 edges (n=4)
      </text>
    </g>
  );
}

export default function TopologyCompareViz() {
  const [hover, setHover] = useState<'pbft' | 'hs' | null>(null);
  return (
    <div className="not-prose rounded-xl border bg-muted/20 p-4 mb-6">
      <p className="text-xs text-center text-muted-foreground mb-3">토폴로지 비교: Broadcast vs Star</p>
      <svg viewBox="0 0 320 140" className="w-full max-w-[400px] mx-auto" style={{ height: 'auto' }}>
        <PBFTMesh />
        <HotStuffStar />
      </svg>
      <p className="text-xs text-center text-muted-foreground mt-2">
        PBFT는 모든 노드가 서로 통신 → n(n-1)/2 연결. HotStuff는 리더 경유 → n-1 연결.
      </p>
    </div>
  );
}
