import { motion } from 'framer-motion';
import StepViz from './StepViz';
import { CA, CB, CG, STEPS, GX, GY, AB, BB, EDGES, VOTES } from './LMDGhostVizData';
import { Block } from './LMDGhostVizParts';

export default function LMDGhostViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 305" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arr-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={CA} />
            </marker>
            <marker id="arr-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={CB} />
            </marker>
          </defs>

          {/* Tree edges */}
          {EDGES.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border)" strokeWidth={1.5} />
          ))}

          {/* Genesis block */}
          <rect x={GX - 26} y={GY - 17} width={52} height={34} rx={8} fill={`${CG}22`} stroke={CG} strokeWidth={1.5} />
          <text x={GX} y={GY + 5} textAnchor="middle" fontSize={10} fontWeight="700" fill={CG}>G</text>

          {/* Chain labels */}
          <text x={110} y={68} textAnchor="middle" fontSize={11} fontWeight="700" fill={CA}>Chain A</text>
          <text x={310} y={68} textAnchor="middle" fontSize={11} fontWeight="700" fill={CB}>Chain B</text>

          {/* Blocks */}
          {AB.map(b => <Block key={b.id} cx={110} cy={b.cy} id={b.id} c={CA} canonical={step === 3} dimmed={false} slot={b.slot} />)}
          {BB.map(b => <Block key={b.id} cx={310} cy={b.cy} id={b.id} c={CB} canonical={false} dimmed={step === 3} slot={b.slot} />)}

          {/* Validators + vote arrows */}
          {VOTES.map(v => (
            <g key={v.id}>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.2 }}>
                <circle cx={v.vx} cy={v.vy} r={12}
                  fill={v.s === 'a' ? `${CA}22` : `${CB}22`}
                  stroke={v.s === 'a' ? CA : CB} strokeWidth={1.5} />
                <text x={v.vx} y={v.vy + 4} textAnchor="middle" fontSize={9} fontWeight="700"
                  fill={v.s === 'a' ? CA : CB}>{v.id}</text>
              </motion.g>
              <motion.path
                d={`M${v.vx + (v.s === 'a' ? 12 : -12)} ${v.vy} L${v.bx} ${v.by}`}
                stroke={v.s === 'a' ? CA : CB} strokeWidth={1.5} fill="none"
                markerEnd={`url(#arr-${v.s})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0 }}
                transition={{ duration: 0.4, delay: step >= 1 ? v.d : 0 }} />
            </g>
          ))}

          {/* Vote count labels with ETH weight */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={{ duration: 0.3 }}>
            <text x={68} y={48} textAnchor="middle" fontSize={12} fontWeight="700" fill={CA}>3표</text>
            <text x={68} y={62} textAnchor="middle" fontSize={9} fill={CA} opacity={0.7}>96 ETH</text>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}>
            <text x={352} y={48} textAnchor="middle" fontSize={12} fontWeight="700" fill={CB}>2표</text>
            <text x={352} y={62} textAnchor="middle" fontSize={9} fill={CB} opacity={0.7}>64 ETH</text>
          </motion.g>

          {/* Checkmark */}
          <motion.text x={148} y={84} textAnchor="middle" fontSize={18}
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: step === 3 ? 1 : 0, scale: step === 3 ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}>✓</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
