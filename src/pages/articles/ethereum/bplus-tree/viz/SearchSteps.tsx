import { motion } from 'framer-motion';

const CA = '#6366f1', CH = '#10b981', CR = '#f59e0b';

/* shared tree layout */
const root = { x: 200, y: 25, keys: ['15', '30'] };
const int1 = [
  { x: 70, y: 70, keys: ['8', '12'] },
  { x: 200, y: 70, keys: ['18', '25'] },
  { x: 330, y: 70, keys: ['35', '40'] },
];
const leaves = [
  { x: 20, y: 120, keys: ['3', '5', '7'] },
  { x: 110, y: 120, keys: ['8', '10', '12'] },
  { x: 200, y: 120, keys: ['20', '21', '23', '24'] },
  { x: 315, y: 120, keys: ['30', '32', '35'] },
  { x: 415, y: 120, keys: ['37', '40'] },
];

function NodeBox({ x, y, keys, highlight, found }: {
  x: number; y: number; keys: string[]; highlight?: boolean; found?: string;
}) {
  const w = Math.max(keys.length * 22 + 8, 60);
  return (
    <g>
      <rect x={x} y={y} width={w} height={24} rx={4}
        fill={highlight ? `${CA}18` : 'var(--card)'}
        stroke={highlight ? CA : 'var(--border)'} strokeWidth={highlight ? 1.4 : 0.6} />
      {keys.map((k, i) => (
        <text key={i} x={x + 12 + i * 22} y={y + 16} textAnchor="middle" fontSize={10}
          fontWeight={k === found ? 700 : 400}
          fill={k === found ? CH : 'var(--foreground)'}>{k}</text>
      ))}
    </g>
  );
}

function Edges({ from, tos }: { from: { x: number; y: number }; tos: { x: number; y: number }[] }) {
  return (
    <g>
      {tos.map((to, i) => (
        <line key={i} x1={from.x + 40} y1={from.y + 24} x2={to.x + 30} y2={to.y}
          stroke="var(--border)" strokeWidth={0.6} />
      ))}
    </g>
  );
}

export default function SearchSteps({ step }: { step: number }) {
  const highlightPath = step < 3;
  return (
    <svg viewBox="0 0 500 165" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <Edges from={root} tos={int1} />
      <Edges from={int1[0]} tos={[leaves[0], leaves[1]]} />
      <Edges from={int1[1]} tos={[leaves[2], leaves[3]]} />
      <Edges from={int1[2]} tos={[leaves[3], leaves[4]]} />

      <NodeBox {...root} highlight={step >= 0 && highlightPath} />
      {int1.map((n, i) => (
        <NodeBox key={i} {...n} highlight={step >= 1 && i === 1 && highlightPath} />
      ))}
      {leaves.map((n, i) => (
        <NodeBox key={i} {...n}
          highlight={step >= 2 && i === 2}
          found={step >= 2 ? '23' : undefined} />
      ))}

      {/* Search arrow path */}
      {step >= 0 && highlightPath && (
        <motion.path
          d={`M${root.x + 40},${root.y + 24} L${int1[1].x + 30},${int1[1].y}`}
          stroke={CA} strokeWidth={1.5} fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }} />
      )}
      {step >= 1 && highlightPath && (
        <motion.path
          d={`M${int1[1].x + 30},${int1[1].y + 24} L${leaves[2].x + 44},${leaves[2].y}`}
          stroke={CA} strokeWidth={1.5} fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }} />
      )}

      {/* Range scan arrows */}
      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <line x1={leaves[2].x + 96} y1={132} x2={leaves[3].x} y2={132}
            stroke={CR} strokeWidth={1.5} strokeDasharray="4,2" markerEnd="url(#arrS)" />
          <text x={275} y={158} textAnchor="middle" fontSize={10} fill={CR}>→next (범위 스캔)</text>
        </motion.g>
      )}

      <defs>
        <marker id="arrS" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CR} />
        </marker>
      </defs>
    </svg>
  );
}
