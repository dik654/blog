import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { BITSWAP_STEPS, BITSWAP_ACTORS, BITSWAP_MSGS } from '../BitswapData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const AX = [40, 130, 220, 310];
const TOP = 15, BOT = 180, AW = 70, AH = 24;

export default function BitswapFlowViz() {
  return (
    <StepViz steps={BITSWAP_STEPS}>
      {(step) => (
        <svg viewBox="0 0 370 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {BITSWAP_ACTORS.map((a, i) => (
            <g key={a}>
              <rect x={AX[i] - AW / 2} y={TOP} width={AW} height={AH} rx={5}
                fill="#6366f112" stroke="#6366f1" strokeWidth={1.2} />
              <text x={AX[i]} y={TOP + 15} textAnchor="middle"
                fontSize={10} fontWeight={600} fill="#6366f1">{a}</text>
              <line x1={AX[i]} y1={TOP + AH} x2={AX[i]} y2={BOT}
                stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="3 2" />
            </g>
          ))}
          {BITSWAP_MSGS.map((m, i) => {
            const vis = m.step <= step;
            const y = 55 + i * 22;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 1 : 0.06 }} transition={sp}>
                <motion.line x1={AX[m.from]} y1={y} x2={AX[m.to]} y2={y}
                  stroke="#10b981" strokeWidth={1.5} markerEnd="url(#arr)" />
                <text x={(AX[m.from] + AX[m.to]) / 2} y={y - 4}
                  textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{m.label}</text>
              </motion.g>
            );
          })}
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
