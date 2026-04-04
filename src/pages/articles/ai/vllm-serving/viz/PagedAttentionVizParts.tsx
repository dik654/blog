import { motion } from 'framer-motion';
import { BLOCK_W, BLOCK_H } from './PagedAttentionVizData';

export function Block({ x, y, label, color, dim = false }: {
  x: number; y: number; label: string; color: string; dim?: boolean;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: dim ? 0.3 : 1, scale: 1 }}
      transition={{ duration: 0.3 }}>
      <rect x={x} y={y} width={BLOCK_W} height={BLOCK_H} rx={4}
        fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      <text x={x + BLOCK_W / 2} y={y + BLOCK_H / 2 + 3} textAnchor="middle"
        fontSize={9} fontWeight="600" fill={color}>{label}</text>
    </motion.g>
  );
}

export function Label({ x, y, text }: { x: number; y: number; text: string }) {
  return <text x={x} y={y} fontSize={9} fill="var(--muted-foreground)">{text}</text>;
}
