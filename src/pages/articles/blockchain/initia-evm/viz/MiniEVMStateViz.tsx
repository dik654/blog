import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const MAPS = [
  { label: 'Account → x/evm KVStore', c: '#6366f1', eth: 'Account (MPT)', cosmos: 'x/evm KVStore' },
  { label: 'Storage → KVStore prefix', c: '#10b981', eth: 'Storage (MPT)', cosmos: 'KVStore prefix' },
  { label: 'Code → KVStore + code hash', c: '#f59e0b', eth: 'Code (LevelDB)', cosmos: 'KVStore + hash' },
  { label: 'Logs → ABCI Events', c: '#8b5cf6', eth: 'Receipt logs', cosmos: 'ABCI Events' },
];
const LX = 40, RX = 240, BOX_W = 120, BOX_H = 28;

export default function MiniEVMStateViz() {
  return (
    <StepViz steps={MAPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* column headers */}
          <text x={LX + BOX_W / 2} y={12} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.3}>EVM State</text>
          <text x={RX + BOX_W / 2} y={12} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.3}>Cosmos Store</text>
          {/* rows */}
          {MAPS.map((m, i) => {
            const y = 22 + i * 34;
            const active = i === step;
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                {/* ETH box */}
                <rect x={LX} y={y} width={BOX_W} height={BOX_H} rx={6}
                  fill={m.c + (active ? '18' : '06')} stroke={m.c}
                  strokeWidth={active ? 1.5 : 0.8} strokeOpacity={active ? 0.8 : 0.2} />
                <text x={LX + BOX_W / 2} y={y + BOX_H / 2 + 4} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={m.c}>{m.eth}</text>
                {/* Arrow */}
                <motion.line
                  x1={LX + BOX_W + 4} y1={y + BOX_H / 2}
                  x2={RX - 4} y2={y + BOX_H / 2}
                  stroke={m.c} strokeWidth={active ? 2 : 1} strokeOpacity={active ? 0.7 : 0.15}
                  markerEnd="url(#mevmarr)"
                  initial={active ? { pathLength: 0 } : {}}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4 }}
                />
                {/* Cosmos box */}
                <rect x={RX} y={y} width={BOX_W} height={BOX_H} rx={6}
                  fill={m.c + (active ? '18' : '06')} stroke={m.c}
                  strokeWidth={active ? 1.5 : 0.8} strokeOpacity={active ? 0.8 : 0.2} />
                <text x={RX + BOX_W / 2} y={y + BOX_H / 2 + 4} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={m.c}>{m.cosmos}</text>
              </motion.g>
            );
          })}
          <text x={200} y={158} textAnchor="middle" fontSize={9} fill="#10b981" fillOpacity={0.4}>
            MPT 제거 → IAVL 통합
          </text>
          <defs>
            <marker id="mevmarr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" fillOpacity={0.4} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
