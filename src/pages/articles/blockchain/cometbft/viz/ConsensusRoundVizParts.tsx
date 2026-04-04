import { motion } from 'framer-motion';
import { C } from './ConsensusRoundVizData';

export function Node({
  x, y, label, sub, color, highlight,
}: {
  x: number; y: number; label: string; sub: string; color: string; highlight?: boolean;
}) {
  const fill = highlight ? color : `${color}22`;
  const textFill = highlight ? '#fff' : color;
  return (
    <g>
      <motion.circle
        cx={x} cy={y} r={20}
        fill={fill} stroke={color} strokeWidth={1.5}
        animate={{ fill, scale: highlight ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
      <text x={x} y={y + 1} textAnchor="middle" fontSize={11} fontWeight="700" fill={textFill}>
        {label}
      </text>
      <text x={x} y={y + 34} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        {sub}
      </text>
    </g>
  );
}

export function Arrow({
  x1, y1, x2, y2, color, show, delay = 0,
}: {
  x1: number; y1: number; x2: number; y2: number; color: string; show: boolean; delay?: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = x1 + ux * 22;
  const sy = y1 + uy * 22;
  const ex = x2 - ux * 22;
  const ey = y2 - uy * 22;

  return (
    <>
      <defs>
        <marker id="arrowhead" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
          <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.5} />
        </marker>
      </defs>
      <motion.line
        x1={sx} y1={sy} x2={ex} y2={ey}
        stroke={color} strokeWidth={1.5}
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={show ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay }}
      />
    </>
  );
}

export function VoteCount({ show, count, x, y }: { show: boolean; count: string; x: number; y: number }) {
  if (!show) return null;
  return (
    <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <rect x={x - 30} y={y - 10} width={60} height={20} rx={4} fill={`${C.Committed}22`} stroke={C.Committed} strokeWidth={1} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.Committed}>
        {count}
      </text>
    </motion.g>
  );
}
