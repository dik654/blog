import StepViz from '@/pages/articles/ethereum/node-architecture/viz/StepViz';
import { motion, AnimatePresence } from 'framer-motion';
import { W, H, NODE_A, NAT_A, RELAY, NAT_B, NODE_B, BOX_W, BOX_H, STEPS } from './HolePunchVizData';

function NodeBox({ cx, label, color }: { cx: number; label: string; color: string }) {
  return (
    <g>
      <rect x={cx - BOX_W / 2} y={NODE_A.y - BOX_H / 2} width={BOX_W} height={BOX_H}
        rx={6} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5} />
      <text x={cx} y={NODE_A.y + 5} textAnchor="middle" fontSize={10} fontWeight={600} fill={color}>{label}</text>
    </g>
  );
}

function Packet({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} fill={color} fillOpacity={0.9} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={9} fill="#fff" fontWeight={600}>{label}</text>
    </g>
  );
}

function StepAnimation({ step }: { step: number }) {
  return (
    <AnimatePresence>
      {step === 0 && (
        <motion.g key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.g initial={{ x: NODE_A.x + 30 }} animate={{ x: RELAY.x - 30 }} transition={{ duration: 1.2, repeat: Infinity }}>
            <Packet x={0} y={55} color="#6366f1" label="Q" />
          </motion.g>
          <text x={190} y={105} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.6}>NodeId → 주소 쿼리</text>
        </motion.g>
      )}
      {step === 1 && (
        <motion.g key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.g initial={{ x: RELAY.x + 10 }} animate={{ x: NAT_B.x + 10 }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}>
            <Packet x={0} y={55} color="#f59e0b" label="C" />
          </motion.g>
          <text x={190} y={120} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.6}>CallMeMaybe (relay 경유)</text>
        </motion.g>
      )}
      {step === 2 && (
        <motion.g key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.g initial={{ x: NAT_A.x + 10 }} animate={{ x: NAT_B.x - 10 }} transition={{ duration: 0.9, repeat: Infinity }}>
            <Packet x={0} y={72} color="#6366f1" label="P" />
          </motion.g>
          <motion.g initial={{ x: NAT_B.x - 10 }} animate={{ x: NAT_A.x + 10 }} transition={{ duration: 0.9, repeat: Infinity, delay: 0.45 }}>
            <Packet x={0} y={90} color="#10b981" label="P" />
          </motion.g>
          <text x={190} y={120} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.6}>Ping ↔ Pong (NAT 홀 생성)</text>
        </motion.g>
      )}
      {step === 3 && (
        <motion.g key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <line x1={NODE_A.x + 30} y1={NODE_A.y} x2={NODE_B.x - 30} y2={NODE_B.y}
            stroke="#10b981" strokeWidth={1.5} />
          <motion.g initial={{ x: NODE_A.x + 30 }} animate={{ x: NODE_B.x - 30 }} transition={{ duration: 0.8, repeat: Infinity }}>
            <Packet x={0} y={NODE_A.y} color="#10b981" label="D" />
          </motion.g>
          <text x={190} y={120} textAnchor="middle" fontSize={10} fill="#10b981">직접 UDP 연결 수립</text>
        </motion.g>
      )}
    </AnimatePresence>
  );
}

export default function HolePunchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 160 }}>
          <text x={NAT_A.x} y={20} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.5}>NAT A</text>
          <text x={NAT_B.x} y={20} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.5}>NAT B</text>
          <text x={RELAY.x} y={20} textAnchor="middle" fontSize={9} fill="#f59e0b">Relay</text>
          <line x1={NAT_A.x} y1={30} x2={NAT_A.x} y2={H - 20} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={NAT_B.x} y1={30} x2={NAT_B.x} y2={H - 20} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.5} strokeDasharray="4 3" />
          <rect x={RELAY.x - 28} y={28} width={56} height={22} rx={5} fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1} />
          <text x={RELAY.x} y={43} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>Relay</text>
          <NodeBox cx={NODE_A.x} label="Node A" color="#6366f1" />
          <NodeBox cx={NODE_B.x} label="Node B" color="#10b981" />
          <StepAnimation step={step} />
        </svg>
      )}
    </StepViz>
  );
}
