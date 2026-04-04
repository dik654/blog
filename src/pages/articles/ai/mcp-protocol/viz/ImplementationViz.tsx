import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, IMPL_BLOCKS, JSON_EXAMPLES } from './ImplementationData';

const W = 460, H = 260;
const BW = 300, BH = 32;
const BX = (W - BW) / 2;

export default function ImplementationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {IMPL_BLOCKS.map((b, i) => {
            const active = step === i;
            const done = step > i;
            const op = active ? 1 : done ? 0.55 : 0.15;
            return (
              <motion.g key={b.label} animate={{ opacity: op }}
                transition={{ duration: 0.3 }}>
                <rect x={BX} y={b.y} width={BW} height={BH} rx={5}
                  fill={active ? `${b.color}20` : `${b.color}08`}
                  stroke={b.color} strokeWidth={active ? 2 : 1} />
                <rect x={BX} y={b.y} width={4} height={BH} rx={2}
                  fill={b.color} opacity={active ? 1 : 0.3} />
                <text x={BX + 16} y={b.y + 20} fontSize={9}
                  fontWeight={700} fill={b.color}>{`Step ${i + 1}`}</text>
                <text x={BX + 70} y={b.y + 20} fontSize={10}
                  fontWeight={600} fill={active ? b.color : 'var(--foreground)'}>
                  {b.label}
                </text>
                <text x={BX + BW - 12} y={b.y + 20} textAnchor="end"
                  fontSize={9} fill="var(--muted-foreground)">{b.desc}</text>
                {i < 3 && (
                  <line x1={BX + BW / 2} y1={b.y + BH}
                    x2={BX + BW / 2} y2={b.y + BH + 8}
                    stroke={b.color} strokeWidth={0.8} opacity={done ? 0.4 : 0.15} />
                )}
              </motion.g>
            );
          })}

          {/* active indicator dot */}
          <motion.circle r={4}
            animate={{ cx: BX - 12, cy: IMPL_BLOCKS[step].y + BH / 2 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            fill={IMPL_BLOCKS[step].color}
            style={{ filter: `drop-shadow(0 0 4px ${IMPL_BLOCKS[step].color}88)` }} />

          {/* JSON-RPC example panel */}
          <motion.g key={step} initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}>
            <rect x={BX} y={190} width={BW}
              height={(JSON_EXAMPLES[step]?.length ?? 3) * 12 + 10}
              rx={5} fill="var(--card)"
              stroke={IMPL_BLOCKS[step].color} strokeWidth={1} />
            <rect x={BX} y={190} width={4}
              height={(JSON_EXAMPLES[step]?.length ?? 3) * 12 + 10}
              rx={2} fill={IMPL_BLOCKS[step].color} />
            {JSON_EXAMPLES[step]?.map((line, j) => (
              <text key={j} x={BX + 14} y={204 + j * 12}
                fontSize={8} fontFamily="monospace"
                fill={line.startsWith('←') ? '#10b981'
                  : line.startsWith('→') ? '#f59e0b'
                  : 'var(--muted-foreground)'}>
                {line}
              </text>
            ))}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
