import { motion } from 'framer-motion';

export function Block({ cx, cy, id, c, canonical, dimmed, slot }: {
  cx: number; cy: number; id: string; c: string; canonical: boolean; dimmed: boolean; slot?: string;
}) {
  return (
    <g>
      <motion.rect x={cx - 26} y={cy - 19} width={52} height={38} rx={8}
        animate={{
          fill: canonical ? '#22c55e22' : `${c}22`,
          stroke: canonical ? '#22c55e' : c,
          strokeWidth: canonical ? 2.5 : 2,
          opacity: dimmed ? 0.15 : 1,
        }}
        transition={{ duration: 0.4 }} />
      <motion.text x={cx} y={cy + (slot ? 0 : 5)} textAnchor="middle" fontSize={11} fontWeight="700"
        animate={{ fill: dimmed ? '#6b7280' : canonical ? '#22c55e' : c, opacity: dimmed ? 0.2 : 1 }}
        transition={{ duration: 0.4 }}>{id}</motion.text>
      {slot && (
        <motion.text x={cx} y={cy + 13} textAnchor="middle" fontSize={8} fontFamily="monospace"
          animate={{ fill: dimmed ? '#6b7280' : canonical ? '#22c55e' : c, opacity: dimmed ? 0.15 : 0.6 }}
          transition={{ duration: 0.4 }}>{slot}</motion.text>
      )}
    </g>
  );
}
