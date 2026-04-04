import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const LINES = [
  { code: 'ethTx := tx.GetMsgs()[0].(*MsgEthereumTx)  // MetaMask TX 수신', color: '#6366f1' },
  { code: 'if err := ante.Verify(ethTx); err != nil { return err }', color: '#10b981' },
  { code: 'res, err := k.ApplyTransaction(ctx, ethTx)  // EVM 컨트랙트 실행', color: '#f59e0b' },
  { code: 'k.CommitCachedContexts(ctx)  // EVM → Cosmos KVStore 업데이트', color: '#8b5cf6' },
  { code: 'ctx.EventManager().EmitEvents(evmLogs)  // Logs → Cosmos 이벤트', color: '#ef4444' },
];

export default function EVMFlowSteps({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        EVM TX 처리 흐름 — MetaMask → Ante → EVM → Commit
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
              Line {i + 1}: {l.code}
            </text>
          </motion.g>
        );
      })}
      <text x={15} y={156} fontSize={10} fill="var(--muted-foreground)">
        Fee Market: EIP-1559 Base Fee 동적 조정 (50% 목표 사용률)
      </text>
    </svg>
  );
}
