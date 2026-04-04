import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { slot: '#6366f1', gamma: '#f59e0b', result: '#10b981' };

interface Props { step: number }

/** 12 coefficient slots for CoeffViz steps 0-1 */
export function SlotsOriginal({ step }: Props) {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 30 + i * 38;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: step >= 0 ? 1 : 0, y: 0 }}
            transition={{ ...sp, delay: i * 0.03 }}>
            <rect x={x} y={60} width={32} height={30} rx={4}
              fill={`${C.slot}18`} stroke={C.slot} strokeWidth={1} />
            <text x={x + 16} y={79} textAnchor="middle"
              fontSize={11} fill={C.slot} fontWeight={600}>
              {`c${i}`}
            </text>
          </motion.g>
        );
      })}
    </>
  );
}

/** Gamma constants dropping onto slots (step >= 1) */
export function GammaDrops({ step }: Props) {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 30 + i * 38;
        const isOne = i === 0;
        return (
          <motion.g key={`g${i}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : -20 }}
            transition={{ ...sp, delay: 0.1 + i * 0.04 }}>
            <text x={x + 16} y={50} textAnchor="middle"
              fontSize={10} fill={isOne ? 'var(--muted-foreground)' : C.gamma}
              fontWeight={isOne ? 400 : 600}>
              {isOne ? '1' : `\u03B3${i < 10 ? String.fromCharCode(0x2080 + i) : i}`}
            </text>
            <line x1={x + 16} y1={53} x2={x + 16} y2={60}
              stroke={isOne ? 'var(--muted-foreground)' : C.gamma}
              strokeWidth={0.6} strokeDasharray="2 2" />
          </motion.g>
        );
      })}
    </>
  );
}

/** Result slots after multiplication (step >= 2) */
export function SlotsResult({ step }: Props) {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 30 + i * 38;
        const isOne = i === 0;
        return (
          <motion.g key={`r${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 2 ? 1 : 0 }}
            transition={{ ...sp, delay: i * 0.03 }}>
            <rect x={x} y={120} width={32} height={30} rx={4}
              fill={`${C.result}18`} stroke={C.result} strokeWidth={1} />
            <text x={x + 16} y={140} textAnchor="middle"
              fontSize={isOne ? 11 : 10} fill={C.result} fontWeight={500}>
              {isOne ? `c${i}` : `c${i}\u00B7\u03B3`}
            </text>
          </motion.g>
        );
      })}
    </>
  );
}
