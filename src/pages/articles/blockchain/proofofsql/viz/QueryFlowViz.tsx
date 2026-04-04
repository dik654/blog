import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { PROOF_STEPS, PROOF_ACTORS, PROOF_MSGS } from '../QueryProofData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const AX = [30, 100, 170, 240, 320];
const TOP = 10, BOT = 180, AW = 60, AH = 22;

export default function QueryFlowViz() {
  return (
    <StepViz steps={PROOF_STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 195" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PROOF_ACTORS.map((a, i) => (
            <g key={a}>
              <rect x={AX[i] - AW / 2} y={TOP} width={AW} height={AH} rx={5}
                fill="#8b5cf612" stroke="#8b5cf6" strokeWidth={1.2} />
              <text x={AX[i]} y={TOP + 14} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#8b5cf6">{a}</text>
              <line x1={AX[i]} y1={TOP + AH} x2={AX[i]} y2={BOT}
                stroke="var(--muted-foreground)" strokeWidth={0.7} strokeDasharray="3 2" />
            </g>
          ))}
          {PROOF_MSGS.map((m, i) => {
            const vis = m.step <= step;
            const y = 48 + i * 24;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 1 : 0.06 }} transition={sp}>
                <motion.line x1={AX[m.from]} y1={y} x2={AX[m.to]} y2={y}
                  stroke="#10b981" strokeWidth={1.5} markerEnd="url(#posarr)" />
                <text x={(AX[m.from] + AX[m.to]) / 2} y={y - 4}
                  textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{m.label}</text>
              </motion.g>
            );
          })}
          <defs>
            <marker id="posarr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
