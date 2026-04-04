import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LINES = [
  { code: 'cacheCtx, writeCache := ctx.CacheContext()  // 롤백 준비', color: '#6366f1' },
  { code: 'bestOrder := ob.getBestOrder(side)  // 가격-시간 우선순위', color: '#10b981' },
  { code: 'if !canMatch(taker.Price, bestOrder.Price) { break }', color: '#8b5cf6' },
  { code: 'if !k.CheckCollateral(ctx, subaccount) { return err }', color: '#f59e0b' },
  { code: 'fillAmt := min(taker.Remaining, maker.Remaining); writeCache()', color: '#ef4444' },
];

export default function MatchingSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        매칭 엔진 — 가격-시간 우선순위(Price-Time Priority)
      </text>
      {LINES.map((l, i) => {
        const active = step === 0 || step === i + 1;
        const y = 22 + i * 26;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={22} rx={4}
              fill={step === i + 1 ? `${l.color}12` : `${l.color}06`}
              stroke={l.color} strokeWidth={step === i + 1 ? 1.5 : 0.5} />
            <text x={25} y={y + 14} fontSize={10} fontWeight={600} fill={l.color} fontFamily="monospace">
              Line {i + 1}:
            </text>
            <text x={80} y={y + 14} fontSize={10} fill="var(--foreground)" fontFamily="monospace">
              {l.code}
            </text>
          </motion.g>
        );
      })}
      <text x={15} y={156} fontSize={10} fill="var(--muted-foreground)">
        CacheContext → 체결 시 writeCache(), 실패 시 자동 롤백
      </text>
    </svg>
  );
}
