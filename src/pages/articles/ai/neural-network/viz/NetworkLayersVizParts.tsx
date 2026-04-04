import { motion } from 'framer-motion';
import { C } from './NetworkLayersVizData';

export function Node({ cx, cy, label, sub, color, delay = 0, r = 18 }: {
  cx: number; cy: number; label: string; sub?: string; color: string; delay?: number; r?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}>
      <circle cx={cx} cy={cy} r={r} fill={`${color}22`} stroke={color} strokeWidth={2} />
      <text x={cx} y={sub ? cy : cy + 4} textAnchor="middle" fontSize={10} fontWeight="600" fill={color}>
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 11} textAnchor="middle" fontSize={9} fontWeight="700" fill={color}>
          {sub}
        </text>
      )}
    </motion.g>
  );
}

export function WeightEdge({ x1, y1, x2, y2, label, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; label?: string; delay?: number;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={C.line} strokeWidth={1} strokeOpacity={0.5} />
      {label && (
        <>
          <rect x={mx - 14} y={my - 7} width={28} height={13} rx={3}
            fill="var(--background)" stroke="none" />
          <text x={mx} y={my + 3} textAnchor="middle" fontSize={8} fill={C.weight}>
            {label}
          </text>
        </>
      )}
    </motion.g>
  );
}

export function LayerLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      {text}
    </text>
  );
}
