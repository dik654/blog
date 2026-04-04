import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LAYERS = [
  { eth: 'Consensus Layer', ethSub: 'Beacon Chain', omni: 'CometBFT', omniSub: 'Cosmos 합의' },
  { eth: 'Engine API', ethSub: 'JSON-RPC', omni: 'Engine API', omniSub: '동일 인터페이스' },
  { eth: 'Execution Layer', ethSub: 'geth/reth', omni: 'EVM (geth)', omniSub: 'geth 기반 실행' },
];

const LY = [16, 46, 76];
const LW = 82, LH = 22;

export default function OverviewSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 340 110" className="w-full max-w-xl" style={{ height: 'auto' }}>
      <text x={75} y={10} textAnchor="middle" fontSize={9} fontWeight={700} fill="#6366f1">Ethereum</text>
      <text x={265} y={10} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">Omni Octane</text>
      <line x1={170} y1={14} x2={170} y2={100} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3 3" />
      {LAYERS.map((l, i) => {
        const y = LY[i];
        const active = step === i + 1 || step === 0;
        const glow = step === i + 1;
        return (
          <g key={i}>
            <motion.rect x={75 - LW / 2} y={y} width={LW} height={LH} rx={4}
              animate={{ fill: glow ? '#6366f122' : '#6366f108', stroke: '#6366f1',
                strokeWidth: glow ? 2 : 0.8, opacity: active ? 1 : 0.2 }} transition={sp} />
            <text x={75} y={y + 9} textAnchor="middle" fontSize={8} fontWeight={600}
              fill="#6366f1" opacity={active ? 1 : 0.2}>{l.eth}</text>
            <text x={75} y={y + 17} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)" opacity={active ? 0.6 : 0.15}>{l.ethSub}</text>

            <motion.rect x={265 - LW / 2} y={y} width={LW} height={LH} rx={4}
              animate={{ fill: glow ? '#10b98122' : '#10b98108', stroke: '#10b981',
                strokeWidth: glow ? 2 : 0.8, opacity: active ? 1 : 0.2 }} transition={sp} />
            <text x={265} y={y + 9} textAnchor="middle" fontSize={8} fontWeight={600}
              fill="#10b981" opacity={active ? 1 : 0.2}>{l.omni}</text>
            <text x={265} y={y + 17} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)" opacity={active ? 0.6 : 0.15}>{l.omniSub}</text>

            {glow && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <line x1={75 + LW / 2 + 4} y1={y + LH / 2} x2={265 - LW / 2 - 4} y2={y + LH / 2}
                  stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#oct-arw)" />
                <rect x={162} y={y + LH / 2 - 8} width={16} height={10} rx={2} fill="var(--card)" />
                <text x={170} y={y + LH / 2 - 1} textAnchor="middle" fontSize={7}
                  fill="#f59e0b" fontWeight={600}>=</text>
              </motion.g>
            )}
          </g>
        );
      })}
      <defs>
        <marker id="oct-arw" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5" fill="#f59e0b" />
        </marker>
      </defs>
    </svg>
  );
}
