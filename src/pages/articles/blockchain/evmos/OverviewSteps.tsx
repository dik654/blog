import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LINES = [
  { code: 'app.EvmKeeper = evm.NewKeeper(cdc, storeKey, ak, bk, fmk)', color: '#6366f1', desc: 'x/vm (EVM): go-ethereum 기반 EVM 모듈' },
  { code: 'app.FeeMarketKeeper = feemarket.NewKeeper(cdc, storeKey)', color: '#10b981', desc: 'x/feemarket: EIP-1559 Base Fee 동적 조정' },
  { code: 'app.Erc20Keeper = erc20.NewKeeper(cdc, storeKey, evmKeeper)', color: '#f59e0b', desc: 'x/erc20: Cosmos Coin ↔ ERC20 양방향 변환' },
  { code: 'app.PreciseBankKeeper = precisebank.NewKeeper(cdc, bk)', color: '#8b5cf6', desc: 'x/precisebank: 18자리 소수점 정밀도' },
];

export default function OverviewSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        Cosmos EVM 모듈 구성 — SDK v0.53 + go-ethereum v1.15
      </text>
      {LINES.map((l, i) => {
        const active = step === 0 || step === i + 1;
        const y = 22 + i * 32;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={28} rx={4}
              fill={step === i + 1 ? `${l.color}12` : `${l.color}06`}
              stroke={l.color} strokeWidth={step === i + 1 ? 1.5 : 0.5} />
            <text x={25} y={y + 12} fontSize={10} fontWeight={600} fill={l.color} fontFamily="monospace">
              Line {i + 1}: {l.code.slice(0, 54)}...
            </text>
            <text x={25} y={y + 24} fontSize={10} fill="var(--muted-foreground)">
              {l.desc}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
