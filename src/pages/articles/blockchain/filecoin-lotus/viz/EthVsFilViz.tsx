import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const ROWS = [
  { eth: 'Casper FFG', fil: 'Expected Consensus', label: 'Consensus', color: '#6366f1' },
  { eth: 'EVM', fil: 'FVM + Built-in Actors', label: 'Execution', color: '#3b82f6' },
  { eth: 'Merkle Patricia Trie', fil: 'HAMT + AMT', label: 'State', color: '#10b981' },
  { eth: 'devp2p', fil: 'libp2p', label: 'P2P', color: '#f59e0b' },
  { eth: '—', fil: 'Storage Market', label: 'Market', color: '#ec4899' },
  { eth: '—', fil: 'PoRep + PoSt', label: 'Proving', color: '#ef4444' },
];

const STEPS = [
  { label: '합의 & 실행', body: '이더리움: Casper FFG + EVM\nFilecoin: Expected Consensus(Tipset) + FVM(WASM)' },
  { label: '상태 & P2P', body: '이더리움: MPT + devp2p\nFilecoin: HAMT/AMT + libp2p' },
  { label: 'Filecoin 고유 레이어', body: 'Storage Market: 스토리지 딜 중개\nStorage Proving: PoRep + PoSt' },
];

const EX = 95, EW = 145, FX = 260, FW = 150, H = 30, GAP = 36;

export default function EthVsFilViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 295" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={EX + EW / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">Ethereum</text>
          <text x={FX + FW / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">Filecoin</text>

          {ROWS.map((r, i) => {
            const y = 28 + i * GAP;
            const group = i < 2 ? 0 : i < 4 ? 1 : 2;
            const active = step === group;
            const isFilOnly = r.eth === '—';
            return (
              <motion.g key={r.label} animate={{ opacity: active ? 1 : 0.3 }} transition={sp}>
                <text x={10} y={y + 19} fontSize={10} fontWeight={600} fill={r.color}>{r.label}</text>

                <rect x={EX} y={y} width={EW} height={H} rx={4}
                  fill={isFilOnly ? 'transparent' : `${r.color}08`}
                  stroke={isFilOnly ? 'var(--border)' : r.color}
                  strokeWidth={active ? 1.5 : 0.5}
                  strokeDasharray={isFilOnly ? '3 3' : ''} />
                <text x={EX + EW / 2} y={y + 19} textAnchor="middle" fontSize={10}
                  fill={isFilOnly ? 'var(--muted-foreground)' : r.color}>{r.eth}</text>

                <rect x={FX} y={y} width={FW} height={H} rx={4}
                  fill={`${r.color}${active ? '15' : '08'}`}
                  stroke={r.color} strokeWidth={active ? 1.5 : 0.5} />
                <text x={FX + FW / 2} y={y + 19} textAnchor="middle" fontSize={10}
                  fontWeight={isFilOnly ? 700 : 400} fill={r.color}>{r.fil}</text>
              </motion.g>
            );
          })}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={FX - 4} y={28 + 4 * GAP - 4} width={FW + 8} height={2 * GAP + H + 8} rx={6}
                fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6 3" />
              <text x={FX + FW / 2} y={28 + 6 * GAP + 8} textAnchor="middle" fontSize={10}
                fontWeight={600} fill="#ef4444">Filecoin 고유 레이어</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
