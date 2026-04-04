import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const STAGES = [
  { label: 'Cosmos TX 수신', sub: 'MsgEVMCall 디코딩', color: '#6366f1' },
  { label: 'AnteHandler', sub: '가스·서명 검증', color: '#8b5cf6' },
  { label: 'StateDB 어댑터', sub: 'KVStore → StateDB', color: '#10b981' },
  { label: 'EVM 실행', sub: 'evm.Call()', color: '#f59e0b' },
  { label: 'KVStore 반영', sub: 'Commit + 이벤트', color: '#ef4444' },
];

export default function ExecFlowSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 400 70" className="w-full max-w-xl" style={{ height: 'auto' }}>
      <defs>
        <marker id="ex-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" />
        </marker>
      </defs>
      {STAGES.map((s, i) => {
        const x = 6 + i * 78;
        const active = step === 0 || step === i + 1;
        const glow = step === i + 1;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={x} y={14} width={68} height={30} rx={5}
              fill={glow ? `${s.color}20` : `${s.color}08`}
              stroke={s.color} strokeWidth={glow ? 1.8 : 0.6} />
            <text x={x + 34} y={27} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={s.color}>{s.label}</text>
            <text x={x + 34} y={38} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">{s.sub}</text>
            {i < STAGES.length - 1 && (
              <line x1={x + 70} y1={29} x2={x + 76} y2={29}
                stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#ex-a)" />
            )}
          </motion.g>
        );
      })}
      <text x={200} y={60} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
        EVM 자체 opcode 가스 비용 추적 (SDK GasKVStore 우회)
      </text>
    </svg>
  );
}
