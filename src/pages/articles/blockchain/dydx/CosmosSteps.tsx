import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const GROUPS = [
  { code: 'clobKeeper := clob.NewKeeper(cdc, storeKey, perpKeeper, subKeeper)', color: '#6366f1', desc: 'Trading: clob + perpetuals + subaccounts + feetiers' },
  { code: 'pricesKeeper := prices.NewKeeper(cdc, storeKey, daemonClient)', color: '#10b981', desc: 'Core: prices + assets + epochs + blocktime' },
  { code: 'bridgeKeeper := bridge.NewKeeper(cdc, storeKey, accountKeeper)', color: '#f59e0b', desc: 'Support: bridge + rewards + delaymsg + stats' },
];

export default function CosmosSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        Cosmos SDK 모듈 — Trading / Core / Support
      </text>
      {GROUPS.map((g, i) => {
        const active = step === 0 || step === i + 1;
        const y = 22 + i * 40;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={34} rx={4}
              fill={step === i + 1 ? `${g.color}12` : `${g.color}06`}
              stroke={g.color} strokeWidth={step === i + 1 ? 1.5 : 0.5} />
            <text x={25} y={y + 14} fontSize={10} fontWeight={600} fill={g.color} fontFamily="monospace">
              Line {i + 1}: {g.code.slice(0, 55)}...
            </text>
            <text x={25} y={y + 28} fontSize={10} fill="var(--muted-foreground)">
              {g.desc}
            </text>
          </motion.g>
        );
      })}
      <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
        각 Keeper가 독립 storeKey로 상태 관리 — 모듈 간 의존 주입
      </text>
    </svg>
  );
}
