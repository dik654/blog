import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS, ACTORS } from './PBFTFlowVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const TOP = 20, LIFE_START = 58;

function Msg({ x1, x2, y, label, color, delay = 0 }: {
  x1: number; x2: number; y: number; label?: string; color: string; delay?: number;
}) {
  const mx = (x1 + x2) / 2;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay }}>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={1.5} markerEnd="url(#pf-arr)" />
      {label && (<>
        <rect x={mx - 32} y={y - 13} width={64} height={15} rx={3} fill="var(--card)" />
        <text x={mx} y={y - 3} textAnchor="middle" fontSize={10} fill={color}>{label}</text>
      </>)}
    </motion.g>
  );
}

export default function PBFTFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
          {ACTORS.map((a) => (
            <line key={`l-${a.label}`} x1={a.x} y1={LIFE_START} x2={a.x} y2={240}
              stroke={a.color} strokeWidth={0.5} strokeDasharray="3 3" opacity={0.2} />
          ))}
          {step >= 0 && <Msg x1={42} x2={128} y={75} label="Request" color={C.A} />}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={sp}>
              <line x1={132} y1={100} x2={218} y2={100} stroke={C.P} strokeWidth={1.5} markerEnd="url(#pf-arr)" />
              <line x1={132} y1={100} x2={308} y2={106} stroke={C.P} strokeWidth={1.5} markerEnd="url(#pf-arr)" />
              <line x1={132} y1={100} x2={398} y2={112} stroke={C.P} strokeWidth={1.5} markerEnd="url(#pf-arr)" />
              <rect x={145} y={87} width={80} height={15} rx={3} fill="var(--card)" />
              <text x={185} y={97} textAnchor="middle" fontSize={10} fill={C.P}>Pre-Prepare</text>
            </motion.g>
          )}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
              <rect x={125} y={125} width={280} height={30} rx={5}
                fill={`${C.S}08`} stroke={C.S} strokeWidth={0.8} strokeDasharray="4 2" />
              <text x={265} y={144} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.S}>
                Prepare: All ↔ All
              </text>
              <rect x={375} y={126} width={36} height={16} rx={3}
                fill="#ef444420" stroke="#ef4444" strokeWidth={0.8} />
              <text x={393} y={137} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">O(n²)</text>
            </motion.g>
          )}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
              <rect x={125} y={165} width={280} height={30} rx={5}
                fill={`${C.G}08`} stroke={C.G} strokeWidth={0.8} strokeDasharray="4 2" />
              <text x={265} y={184} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.G}>
                Commit: All ↔ All
              </text>
            </motion.g>
          )}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
              <line x1={128} y1={210} x2={42} y2={210} stroke={C.G} strokeWidth={1.5} markerEnd="url(#pf-arr)" />
              <line x1={218} y1={214} x2={42} y2={214} stroke={C.G} strokeWidth={1.2} opacity={0.6} markerEnd="url(#pf-arr)" />
              <line x1={308} y1={218} x2={42} y2={218} stroke={C.G} strokeWidth={1.2} opacity={0.6} markerEnd="url(#pf-arr)" />
              <line x1={398} y1={222} x2={42} y2={222} stroke={C.G} strokeWidth={1.2} opacity={0.6} markerEnd="url(#pf-arr)" />
              <rect x={155} y={201} width={46} height={15} rx={3} fill="var(--card)" />
              <text x={178} y={211} textAnchor="middle" fontSize={10} fill={C.G}>Reply</text>
            </motion.g>
          )}
          {ACTORS.map((a) => (
            <g key={a.label}>
              <circle cx={a.x} cy={TOP + 12} r={16} fill="var(--card)" stroke={a.color} strokeWidth={1.5} />
              <text x={a.x} y={TOP + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={a.color}>
                {a.label}
              </text>
              <text x={a.x} y={TOP + 34} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                {a.sub}
              </text>
            </g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
