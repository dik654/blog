import { motion } from 'framer-motion';
import { FP_SLOTS, FP2_SLOTS } from './WhySparseVizData';
import { PRIMARY, ACCENT, sp } from './constants';

const SW = 28;
const SH = 32;
const SX = 40;
const SY = 100;

export { SW, SH, SX, SY };

export default function SlotBox({ idx, step, label }: {
  idx: number; step: number; label?: string;
}) {
  const isFp = FP_SLOTS.some(s => s.idx === idx);
  const isFp2 = FP2_SLOTS.some(s => s.idx === idx);
  const showFp = step >= 1 && isFp;
  const showFp2 = step >= 2 && isFp2;
  const active = showFp || showFp2;
  const c = showFp ? PRIMARY : showFp2 ? ACCENT : '';

  return (
    <g>
      <motion.rect x={SX + idx * (SW + 4)} y={SY} width={SW} height={SH}
        rx={3}
        animate={{
          fill: active ? `${c}25` : 'hsl(var(--muted)/0.15)',
          stroke: active ? c : 'hsl(var(--border))',
          strokeWidth: active ? 1.6 : 0.7,
        }} transition={sp} />
      <text x={SX + idx * (SW + 4) + SW / 2} y={SY + SH + 14}
        textAnchor="middle" fontSize={10}
        fill="hsl(var(--muted-foreground))">{idx}</text>
      {active && label && (
        <motion.text x={SX + idx * (SW + 4) + SW / 2}
          y={SY + SH / 2 + 4}
          textAnchor="middle" fontSize={10} fontWeight={600} fill={c}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.15 }}>
          {label}
        </motion.text>
      )}
    </g>
  );
}
