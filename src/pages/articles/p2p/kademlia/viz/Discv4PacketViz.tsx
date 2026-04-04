import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Ping/Pong: 노드 활성 확인 & 재생 공격 방지' },
  { label: 'FindNode/Neighbors: XOR 거리 기반 노드 탐색' },
  { label: 'ENRRequest/Response: Ethereum Node Record 교환' },
];

const ANNOT = ['Ping/Pong 생존+ENR 확인', 'FindNode XOR 거리 탐색', 'ENRRequest 노드 정보 교환'];
const PKTS = [
  [{ type: 1, name: 'Ping', color: '#6366f1', x: 50 }, { type: 2, name: 'Pong', color: '#10b981', x: 200 }],
  [{ type: 3, name: 'FindNode', color: '#f59e0b', x: 50 }, { type: 4, name: 'Neighbors', color: '#8b5cf6', x: 200 }],
  [{ type: 5, name: 'ENRReq', color: '#ec4899', x: 50 }, { type: 6, name: 'ENRRes', color: '#14b8a6', x: 200 }],
];

export default function Discv4PacketViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Packet structure header */}
          <rect x={30} y={8} width={320} height={22} rx={4} fill="#6366f106" stroke="#6366f1" />
          <text x={40} y={22} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
            hash(32B) | sig(65B) | type(1B) | RLP(data)
          </text>

          {/* Node A and B */}
          <circle cx={70} cy={80} r={18} fill="#6366f112" stroke="#6366f1" strokeWidth={1.5} />
          <text x={70} y={83} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">Node A</text>
          <circle cx={310} cy={80} r={18} fill="#10b98112" stroke="#10b981" strokeWidth={1.5} />
          <text x={310} y={83} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">Node B</text>

          {/* Packet pairs for current step */}
          {PKTS[step].map((p, i) => {
            const y = i === 0 ? 65 : 95;
            const fromX = i === 0 ? 88 : 292;
            const toX = i === 0 ? 292 : 88;
            return (
              <g key={p.type}>
                {/* Arrow */}
                <motion.line x1={fromX} y1={y} x2={toX} y2={y}
                  stroke={p.color} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.3, duration: 0.4 }} />
                <motion.polygon
                  points={toX > fromX ? `${toX - 5},${y - 3} ${toX},${y} ${toX - 5},${y + 3}` : `${toX + 5},${y - 3} ${toX},${y} ${toX + 5},${y + 3}`}
                  fill={p.color}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.3 + 0.3 }} />
                {/* Label */}
                <motion.rect x={175} y={y - 11} width={50} height={16} rx={3}
                  fill={`${p.color}18`} stroke={p.color} strokeWidth={1}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.3 + 0.1 }} />
                <motion.text x={200} y={y + 1} textAnchor="middle" fontSize={10} fontWeight={600} fill={p.color}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.3 + 0.1 }}>
                  [{p.type}] {p.name}
                </motion.text>
                {/* Moving packet */}
                <motion.circle r={4} cy={y} fill={p.color}
                  initial={{ cx: fromX }} animate={{ cx: toX }}
                  transition={{ delay: i * 0.3, duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }} />
              </g>
            );
          })}

          {/* Fields display */}
          <motion.rect x={30} y={130} width={320} height={48} rx={6}
            fill={`${PKTS[step][0].color}08`} stroke={`${PKTS[step][0].color}30`}
            key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          {step === 0 && (
            <text x={40} y={150} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
              <tspan x={40} dy={0}>Ping: from, to, expiry, enr_seq</tspan>
              <tspan x={40} dy={14}>Pong: to, ping_hash, expiry, enr_seq</tspan>
            </text>
          )}
          {step === 1 && (
            <text x={40} y={150} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
              <tspan x={40} dy={0}>FindNode: target:PubKey33, expiry</tspan>
              <tspan x={40} dy={14}>Neighbors: nodes:Vec&lt;NodeInfo&gt;[max 16]</tspan>
            </text>
          )}
          {step === 2 && (
            <text x={40} y={150} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
              <tspan x={40} dy={0}>ENRRequest: expiry</tspan>
              <tspan x={40} dy={14}>ENRResponse: request_hash, record:ENR</tspan>
            </text>
          )}
                  <motion.text x={385} y={95} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
