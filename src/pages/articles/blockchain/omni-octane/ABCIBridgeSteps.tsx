import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const PHASES = [
  { label: 'PrepareProposal', items: ['forkchoiceUpdatedV3', 'getPayloadV3', '페이로드 래핑'] },
  { label: 'ProcessProposal', items: ['newPayloadV3', 'forkchoiceUpdatedV3', 'Accept/Reject'] },
  { label: 'FinalizeBlock', items: ['GetBlockReceipts', 'EVM 로그 수집', '이벤트 처리'] },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

export default function ABCIBridgeSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 500 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={50} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--muted-foreground)">CometBFT</text>
      <text x={250} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Octane 브릿지</text>
      <text x={440} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--muted-foreground)">geth (EL)</text>

      {PHASES.map((phase, i) => {
        const y = 22 + i * 36;
        const active = step === i || step === 3;
        const c = COLORS[i];
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            {/* ABCI method */}
            <rect x={4} y={y} width={92} height={28} rx={4}
              fill={`${c}12`} stroke={c} strokeWidth={active ? 1.5 : 0.8} />
            <text x={50} y={y + 12} textAnchor="middle" fontSize={8} fontWeight={600} fill={c}>
              {phase.label}
            </text>
            <text x={50} y={y + 23} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">ABCI</text>

            <line x1={100} y1={y + 14} x2={130} y2={y + 14}
              stroke={c} strokeWidth={1} markerEnd={`url(#ab-${i})`} />

            {/* Engine API calls */}
            {phase.items.map((item, j) => {
              const ix = 134 + j * 118;
              return (
                <g key={j}>
                  <rect x={ix} y={y + 2} width={108} height={24} rx={3}
                    fill={active ? `${c}18` : 'var(--background)'}
                    stroke={c} strokeWidth={0.6} />
                  <text x={ix + 54} y={y + 18} textAnchor="middle"
                    fontSize={8} fill={c}>{item}</text>
                  {j < phase.items.length - 1 && (
                    <line x1={ix + 110} y1={y + 14} x2={ix + 116} y2={y + 14}
                      stroke={c} strokeWidth={0.6} />
                  )}
                </g>
              );
            })}
          </motion.g>
        );
      })}

      <defs>
        {COLORS.map((c, i) => (
          <marker key={i} id={`ab-${i}`} markerWidth="5" markerHeight="5"
            refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5" fill={c} />
          </marker>
        ))}
      </defs>
    </svg>
  );
}
