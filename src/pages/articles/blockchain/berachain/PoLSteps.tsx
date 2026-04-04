import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const NODES = [
  { label: '유동성 제공', sub: 'DEX/대출 풀', color: '#6366f1' },
  { label: 'Reward Vault', sub: 'BGT 보상', color: '#10b981' },
  { label: '검증자 위임', sub: 'BGT boost', color: '#f59e0b' },
  { label: '블록 생성', sub: 'CometBFT', color: '#8b5cf6' },
  { label: 'BGT 배분', sub: '프로토콜별', color: '#ec4899' },
];

export default function PoLSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 420 80" className="w-full max-w-xl" style={{ height: 'auto' }}>
      <defs>
        <marker id="pol-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" />
        </marker>
      </defs>
      {NODES.map((n, i) => {
        const x = 6 + i * 82;
        const active = step === 0 || step === i + 1;
        const glow = step === i + 1;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={x} y={18} width={72} height={30} rx={5}
              fill={glow ? `${n.color}20` : `${n.color}08`}
              stroke={n.color} strokeWidth={glow ? 1.8 : 0.6} />
            <text x={x + 36} y={31} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={n.color}>{n.label}</text>
            <text x={x + 36} y={41} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">{n.sub}</text>
            {i < NODES.length - 1 && (
              <line x1={x + 74} y1={33} x2={x + 80} y2={33}
                stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#pol-a)" />
            )}
          </motion.g>
        );
      })}
      {step === 5 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
          <path d={`M${6 + 4 * 82 + 36},52 Q210,72 42,52`}
            fill="none" stroke="#ef4444" strokeWidth={1.2} strokeDasharray="3 3" markerEnd="url(#pol-a)" />
          <rect x={192} y={63} width={36} height={10} rx={2} fill="var(--card)" />
          <text x={210} y={70} textAnchor="middle" fontSize={7} fill="#ef4444">재투자</text>
        </motion.g>
      )}
    </svg>
  );
}
