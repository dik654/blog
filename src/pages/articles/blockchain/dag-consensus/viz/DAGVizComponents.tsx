import { motion } from 'framer-motion';
import { COMMITTED, R, type Vertex, type Edge } from './DAGVizData';

export function VertexCircle({ v, show, glow, anchor, delay = 0 }: {
  v: Vertex; show: boolean; glow?: boolean; anchor?: boolean; delay?: number;
}) {
  const fillColor = glow ? COMMITTED : v.color;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
      transition={{ duration: 0.35, delay }}
    >
      {glow && (
        <motion.circle
          cx={v.rx} cy={v.vy} r={R + 5}
          fill="none" stroke={COMMITTED} strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <circle cx={v.rx} cy={v.vy} r={R}
        fill={`${fillColor}22`} stroke={fillColor} strokeWidth={1.5} />
      <text x={v.rx} y={v.vy + 4} textAnchor="middle"
        fontSize={10} fontWeight={600} fill={fillColor}>
        {v.label}
      </text>
      {anchor && (
        <motion.text
          x={v.rx} y={v.vy - R - 6} textAnchor="middle"
          fontSize={14} fill={v.color}
          initial={{ opacity: 0, y: v.vy - R }}
          animate={{ opacity: 1, y: v.vy - R - 6 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          ★
        </motion.text>
      )}
    </motion.g>
  );
}

export function EdgeLine({ e, show, delay = 0 }: { e: Edge; show: boolean; delay?: number }) {
  return (
    <motion.line
      x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
      stroke={e.color} strokeWidth={1.2} strokeOpacity={0.5}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={show ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.35, delay }}
    />
  );
}
