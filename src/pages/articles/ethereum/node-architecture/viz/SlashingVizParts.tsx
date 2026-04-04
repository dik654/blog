import { motion } from 'framer-motion';
import { BLOCK_W, BLOCK_H } from './SlashingVizData';

export function Block({ x, y, label, color, show }: {
  x: number; y: number; label: string; color: string; show: boolean;
}) {
  const hw = BLOCK_W / 2, hh = BLOCK_H / 2;
  return (
    <g opacity={show ? 1 : 0.18}>
      <rect x={x - hw} y={y - hh} width={BLOCK_W} height={BLOCK_H} rx={9}
        fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      {/* Header text -- upper section */}
      <text x={x} y={y - 22} textAnchor="middle" fontSize={10} fontWeight="700" fill={color}>{label}</text>
      <text x={x} y={y - 9}  textAnchor="middle" fontSize={9}  fill="var(--muted-foreground)">slot 9,288,001</text>
      {/* Divider */}
      <line x1={x - hw + 7} y1={y + 1} x2={x + hw - 7} y2={y + 1}
        stroke={color} strokeWidth={0.8} opacity={0.35} />
      {/* Label for SIG area */}
      <text x={x} y={y + 13} textAnchor="middle" fontSize={9} fill={`${color}88`}>signature</text>
    </g>
  );
}

export function PenaltyBar({ pct, label, color }: { pct: number; label: string; color: string }) {
  return (
    <g>
      <text x={44} y={0} fontSize={9} fill="var(--muted-foreground)">{label}</text>
      <text x={375} y={0} textAnchor="end" fontSize={9} fontWeight="700" fill={color}>{Math.round(pct * 100)}%</text>
      <rect x={44} y={5} width={331} height={9} rx={4} fill="none" />
      <motion.rect x={44} y={5} height={9} rx={4} fill={color}
        animate={{ width: pct * 331 }} initial={{ width: 0 }} transition={{ duration: 0.6 }} />
    </g>
  );
}
