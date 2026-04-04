import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const NODES = [
  { label: 'Rollup A', x: 10, color: '#6366f1' },
  { label: 'Portal', x: 88, color: '#8b5cf6' },
  { label: 'Omni 검증자', x: 170, color: '#10b981' },
  { label: 'Portal', x: 262, color: '#8b5cf6' },
  { label: 'Rollup B', x: 340, color: '#f59e0b' },
];

export default function CrossChainSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 410 100" className="w-full max-w-xl" style={{ height: 'auto' }}>
      <defs>
        <marker id="xm-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5" fill="#10b981" />
        </marker>
      </defs>

      {NODES.map((n, i) => {
        const show = step === 0 || (step === 1 && i <= 1) || (step === 2 && i <= 2) || (step === 3 && i <= 3) || step >= 4;
        return (
          <motion.g key={i} animate={{ opacity: show ? 1 : 0.15 }} transition={sp}>
            <rect x={n.x} y={34} width={60} height={28} rx={5} fill={`${n.color}14`}
              stroke={n.color} strokeWidth={show ? 1.5 : 0.6} />
            <text x={n.x + 30} y={48} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={n.color}>{n.label}</text>
            <text x={n.x + 30} y={57} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">{i === 2 ? 'Attestation' : i % 2 === 1 ? 'Contract' : 'Chain'}</text>
          </motion.g>
        );
      })}

      {/* edges */}
      {[
        { from: 0, to: 1, label: '이벤트', show: step >= 1 },
        { from: 1, to: 2, label: '관찰', show: step >= 2 },
        { from: 2, to: 3, label: '릴레이', show: step >= 3 },
        { from: 3, to: 4, label: '실행', show: step >= 4 },
      ].map((e, i) => (
        <motion.g key={`e-${i}`} animate={{ opacity: e.show ? 0.8 : 0 }} transition={sp}>
          <line x1={NODES[e.from].x + 62} y1={48} x2={NODES[e.to].x - 2} y2={48}
            stroke="#10b981" strokeWidth={1.2} markerEnd="url(#xm-a)" />
          <rect x={(NODES[e.from].x + NODES[e.to].x) / 2 + 18} y={28} width={28} height={10}
            rx={2} fill="var(--card)" />
          <text x={(NODES[e.from].x + NODES[e.to].x) / 2 + 32} y={35}
            textAnchor="middle" fontSize={7} fill="#10b981">{e.label}</text>
        </motion.g>
      ))}

      {/* speed comparison at bottom */}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={205} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            L1 경유: 수 시간~수일 vs Omni XMsg: 수 초
          </text>
        </motion.g>
      )}
    </svg>
  );
}
