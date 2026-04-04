import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const PHASES = [
  { label: 'PrepareProposal', sub: 'forkchoiceUpdated', color: '#6366f1' },
  { label: 'ProcessProposal', sub: 'newPayload 검증', color: '#10b981' },
  { label: 'FinalizeBlock', sub: '상태 확정', color: '#f59e0b' },
  { label: 'Commit', sub: '다음 블록 빌드', color: '#8b5cf6' },
];

export default function BlockLifecycleSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 390 90" className="w-full max-w-xl" style={{ height: 'auto' }}>
      <defs>
        <marker id="bl-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" />
        </marker>
      </defs>

      <text x={10} y={10} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">CometBFT ABCI 2.0</text>
      <text x={260} y={10} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">Engine API</text>

      {PHASES.map((p, i) => {
        const y = 18 + i * 18;
        const active = step === 0 || step === i + 1;
        const glow = step === i + 1;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={10} y={y} width={100} height={14} rx={3}
              fill={glow ? `${p.color}18` : `${p.color}06`}
              stroke={p.color} strokeWidth={glow ? 1.5 : 0.4} />
            <text x={60} y={y + 10} textAnchor="middle" fontSize={7}
              fontWeight={600} fill={p.color}>{p.label}</text>

            <line x1={114} y1={y + 7} x2={240} y2={y + 7}
              stroke={p.color} strokeWidth={glow ? 1.2 : 0.4} markerEnd="url(#bl-a)" />

            <rect x={244} y={y} width={100} height={14} rx={3}
              fill={glow ? `${p.color}12` : `${p.color}04`}
              stroke={p.color} strokeWidth={glow ? 1.2 : 0.3} />
            <text x={294} y={y + 10} textAnchor="middle" fontSize={7}
              fill={p.color}>{p.sub}</text>
          </motion.g>
        );
      })}

      {step === 5 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
          <rect x={10} y={78} width={334} height={10} rx={2} fill="#10b98110" stroke="#10b981" strokeWidth={0.6} />
          <text x={177} y={86} textAnchor="middle" fontSize={7} fill="#10b981">
            Optimistic Payload: N+1 블록 선행 빌드 → 블록 타임 ~40% 단축
          </text>
        </motion.g>
      )}
    </svg>
  );
}
