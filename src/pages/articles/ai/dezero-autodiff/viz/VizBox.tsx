import { motion } from 'framer-motion';

export default function VizBox({ x, y, w, h, label, sub, c, delay = 0 }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string; c: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <rect x={x} y={y} width={w} height={h} rx={5}
        fill={`${c}10`} stroke={c} strokeWidth={1} />
      <text x={x + w / 2} y={y + h / 2 - 3} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={c}>{label}</text>
      <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle"
        fontSize={7} fill="var(--muted-foreground)">{sub}</text>
    </motion.g>
  );
}
