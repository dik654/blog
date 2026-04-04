import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

interface Props {
  baseX: number;
  y: number;
  slotW: number;
  labels: string[];
  colors: { lo: string; hi: string };
  delay?: number;
}

/** Render 12 Fp12 coefficient slots with lo/hi coloring */
export default function Fp12Slots({ baseX, y, slotW, labels, colors, delay = 0 }: Props) {
  return (
    <g>
      {labels.map((label, i) => {
        const isHi = i >= 6;
        const c = isHi ? colors.hi : colors.lo;
        return (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: delay + i * 0.02 }}>
            <rect x={baseX + i * slotW} y={y} width={slotW - 3} height={24} rx={3}
              fill={`${c}18`} stroke={`${c}40`} strokeWidth={0.5} />
            <text x={baseX + i * slotW + (slotW - 3) / 2} y={y + 16}
              textAnchor="middle" fontSize={10} fill={c}>{label}</text>
          </motion.g>
        );
      })}
    </g>
  );
}
