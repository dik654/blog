import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CR = '#ef4444';

export default function TxLifecycleSteps({ step }: { step: number }) {
  const lines = [
    { code: 'msg := &MsgCall{Sender: tx.From, ContractAddr: to, Input: data}', desc: 'Cosmos TX → MsgCall 래핑', c: CV },
    { code: 'if err := msg.ValidateBasic(); err != nil { return err }', desc: '서명·수수료 검증 (Ante Handler)', c: CE },
    { code: 'evm := k.createEVM(ctx, caller, contractAddr)', desc: 'EVM 인스턴스 조립 (StateDB + JumpTable)', c: CA },
    { code: 'ret, gasLeft, err := evm.Call(caller, to, input, gas, value)', desc: '바이트코드 실행 (go-ethereum EVM)', c: CA },
    { code: 'k.CommitStateDB(ctx, stateDB)', desc: 'EVM 상태 → Cosmos KVStore 반영', c: CR },
  ];
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={14} fontSize={11} fontWeight={700} fill="var(--foreground)">
        Cosmos TX → EVM 실행 → 상태 커밋
      </text>
      {lines.map((l, i) => {
        const active = step === 0 || step === i + 1;
        const y = 22 + i * 26;
        return (
          <motion.g key={i} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
            <rect x={15} y={y} width={450} height={22} rx={4}
              fill={step === i + 1 ? `${l.c}10` : `${l.c}06`}
              stroke={l.c} strokeWidth={step === i + 1 ? 1.2 : 0.5} />
            <text x={25} y={y + 14} fontSize={10} fontWeight={600} fill={l.c} fontFamily="monospace">
              Line {i + 1}:
            </text>
            <text x={80} y={y + 14} fontSize={10} fill="var(--foreground)" fontFamily="monospace">
              {l.code.slice(0, 52)}{l.code.length > 52 ? '...' : ''}
            </text>
          </motion.g>
        );
      })}
      <text x={15} y={156} fontSize={10} fill="var(--muted-foreground)">
        Cosmos TX → EVM 실행 → Cosmos 상태 커밋 → 프리컴파일 디스패치
      </text>
    </svg>
  );
}
