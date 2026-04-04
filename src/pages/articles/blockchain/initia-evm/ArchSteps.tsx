import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const ROWS = [
  { eth: 'StateDB → MPT → LevelDB', mini: 'KVStore → IAVL Tree' },
  { eth: 'Account: nonce, balance, storageRoot', mini: 'x/auth sequence + x/bank 잔액' },
  { eth: 'Storage: mapping(bytes32→bytes32)', mini: 'KVStore key: addr+slot → value' },
  { eth: 'Code: bytecode in trie', mini: 'KVStore key: codeHash → bytecode' },
];

export default function ArchSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 400 110" className="w-full max-w-xl" style={{ height: 'auto' }}>
      <text x={90} y={10} textAnchor="middle" fontSize={8} fontWeight={700} fill="#6366f1">Ethereum EVM</text>
      <text x={310} y={10} textAnchor="middle" fontSize={8} fontWeight={700} fill="#10b981">MiniEVM (KVStore)</text>
      <line x1={200} y1={14} x2={200} y2={106} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3 3" />

      {ROWS.map((r, i) => {
        const y = 18 + i * 24;
        const active = step === 0 || step === i + 1;
        const glow = step === i + 1;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={4} y={y} width={185} height={18} rx={3}
              fill={glow ? '#6366f114' : '#6366f106'} stroke="#6366f1" strokeWidth={glow ? 1.2 : 0.4} />
            <text x={96} y={y + 12} textAnchor="middle" fontSize={7} fill="#6366f1">{r.eth}</text>

            <rect x={210} y={y} width={185} height={18} rx={3}
              fill={glow ? '#10b98114' : '#10b98106'} stroke="#10b981" strokeWidth={glow ? 1.2 : 0.4} />
            <text x={302} y={y + 12} textAnchor="middle" fontSize={7} fill="#10b981">{r.mini}</text>

            {glow && (
              <motion.text x={200} y={y + 12} textAnchor="middle" fontSize={9}
                fill="#f59e0b" fontWeight={700} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                →
              </motion.text>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
