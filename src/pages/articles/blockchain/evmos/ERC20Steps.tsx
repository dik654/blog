import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LINES = [
  { code: 'pair := TokenPair{Erc20Address: addr, Denom: denom, Enabled: true}', color: '#10b981', desc: 'TokenPair 등록 — Cosmos denom ↔ ERC20 주소 매핑' },
  { code: 'bk.SendCoinsToModule(ctx, sender, escrow, coins) // Coin → 에스크로', color: '#6366f1', desc: 'Coin→ERC20: 코인 잠금 후 ERC20 민팅' },
  { code: 'erc20.Burn(ctx, receiver, amount)  // ERC20 → Coin 역변환', color: '#f59e0b', desc: 'ERC20→Coin: 토큰 번(burn) 후 에스크로 해제' },
];

export default function ERC20Steps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        ERC20 ↔ Cosmos Coin 변환 — x/erc20 모듈
      </text>
      {LINES.map((l, i) => {
        const active = step === 0 || step === i + 1;
        const y = 22 + i * 40;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={34} rx={4}
              fill={step === i + 1 ? `${l.color}12` : `${l.color}06`}
              stroke={l.color} strokeWidth={step === i + 1 ? 1.5 : 0.5} />
            <text x={25} y={y + 14} fontSize={10} fontWeight={600} fill={l.color} fontFamily="monospace">
              Line {i + 1}: {l.code.slice(0, 58)}{l.code.length > 58 ? '...' : ''}
            </text>
            <text x={25} y={y + 28} fontSize={10} fill="var(--muted-foreground)">
              {l.desc}
            </text>
          </motion.g>
        );
      })}
      <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
        에스크로 → 잠금 → 민팅 (정방향) / 전송 → 번 → 해제 (역방향)
      </text>
    </svg>
  );
}
