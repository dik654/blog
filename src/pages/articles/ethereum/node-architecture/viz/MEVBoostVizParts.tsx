import { motion } from 'framer-motion';

export function Actor({ x, y, label, sub, color, dim }: {
  x: number; y: number; label: string; sub: string; color: string; dim: boolean;
}) {
  return (
    <g opacity={dim ? 0.28 : 1}>
      <rect x={x - 34} y={y - 18} width={68} height={36} rx={7}
        fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y - 4} textAnchor="middle" fontSize={9} fontWeight="700" fill={color}>{label}</text>
      <text x={x} y={y + 9} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{sub}</text>
    </g>
  );
}

export function Pkt({ sx, sy, dx, dy, color, show, delay = 0, label }: {
  sx: number; sy: number; dx: number; dy: number;
  color: string; show: boolean; delay?: number; label: string;
}) {
  return (
    <motion.g
      animate={show ? { x: dx - sx, y: dy - sy } : { x: 0, y: 0 }}
      initial={{ x: 0, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.2, delay }}>
      <motion.g animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.2, delay }}>
        <rect x={sx - 18} y={sy - 9} width={36} height={18} rx={4}
          fill={`${color}33`} stroke={color} strokeWidth={1.5} />
        <text x={sx} y={sy + 4} textAnchor="middle" fontSize={9} fontWeight="700" fill={color}>{label}</text>
      </motion.g>
    </motion.g>
  );
}
