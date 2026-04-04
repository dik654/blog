import { motion } from 'framer-motion';

const NODES = [
  { label: 'Observe', x: 120, y: 40, color: '#10b981' },
  { label: 'Think', x: 310, y: 40, color: '#6366f1' },
  { label: 'Act', x: 310, y: 130, color: '#f59e0b' },
  { label: 'Result', x: 120, y: 130, color: '#10b981' },
];

export function AgentLoop({ step }: { step: number }) {
  return (
    <g>
      {NODES.map((n, i) => (
        <motion.g key={n.label}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={n.x - 40} y={n.y} width={80} height={34} rx={6}
            fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
          <text x={n.x} y={n.y + 21} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={n.color}>{n.label}</text>
        </motion.g>
      ))}
      <line x1={160} y1={57} x2={270} y2={57}
        stroke="#6366f1" strokeWidth={1.2} opacity={0.5} />
      <line x1={310} y1={74} x2={310} y2={130}
        stroke="#f59e0b" strokeWidth={1.2} opacity={0.5} />
      <line x1={270} y1={147} x2={160} y2={147}
        stroke="#10b981" strokeWidth={1.2} opacity={0.5} />
      <line x1={120} y1={130} x2={120} y2={74}
        stroke="#10b981" strokeWidth={1.2} opacity={0.5} />
      {/* Concrete example inside loop */}
      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}>
          <rect x={150} y={80} width={130} height={36} rx={4}
            fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
          <text x={215} y={94} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fill="#f59e0b">
            read_file("main.ts")
          </text>
          <text x={215} y={108} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fill="#10b981">
            → "export function..."
          </text>
        </motion.g>
      )}
    </g>
  );
}
