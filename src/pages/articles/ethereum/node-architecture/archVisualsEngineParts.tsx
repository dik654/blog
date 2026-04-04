import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 트랜잭션이 순서대로 EVM에서 실행되고 stateRoot가 계산되는 과정을 보여줌
export function EvmExecution() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % 6), 550);
    return () => clearInterval(id);
  }, []);

  const txs = ['0x1a2b…f3', '0x5c4d…a1', '0x9e8f…b2', '0x3g7h…c4'];
  const done = Math.min(idx, txs.length);

  return (
    <div className="space-y-2 text-[10px]">
      <div className="rounded border px-3 py-2 font-mono space-y-1">
        {txs.map((tx, i) => (
          <div key={tx} className={`flex items-center gap-2 transition-colors duration-300
            ${i < done ? 'text-foreground' : 'text-muted-foreground/40'}`}>
            <span className={`shrink-0 font-bold ${i < done ? 'text-emerald-600' : i === done ? 'text-amber-500' : 'text-border'}`}>
              {i < done ? '✓' : i === done ? '⟳' : '○'}
            </span>
            <span className="">tx[{i}]</span>
            <span>{tx}</span>
            {i === done && idx < txs.length && (
              <motion.span className="text-amber-500 text-[9px]"
                animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
                EVM 실행 중…
              </motion.span>
            )}
          </div>
        ))}
      </div>
      <div className={`flex items-center gap-2 transition-opacity duration-500 ${done === txs.length ? 'opacity-100' : 'opacity-30'}`}>
        <span className="text-foreground/75 font-mono text-[9px]">stateRoot:</span>
        <span className="font-mono text-blue-600 text-[9px]">0xa3f2…b9</span>
        {done === txs.length && <span className="text-emerald-600 text-[9px]">✓ payload와 일치</span>}
      </div>
    </div>
  );
}

// 각 응답 코드가 무엇을 의미하고 CL이 어떻게 반응하는지 보여줌
export function EngineResponse() {
  const rows = [
    { status: 'VALID', meaning: 'tx 실행 성공 + stateRoot 일치', next: 'fork_choice 업데이트 진행',
      b: 'border-emerald-400', bg: 'bg-emerald-50/60 dark:bg-emerald-950/20', t: 'text-emerald-600 dark:text-emerald-400' },
    { status: 'INVALID', meaning: 'tx 실패 또는 stateRoot 불일치', next: '블록 무시, 피어 페널티',
      b: 'border-red-400', bg: 'bg-red-50/60 dark:bg-red-950/20', t: 'text-red-600 dark:text-red-400' },
    { status: 'SYNCING', meaning: 'EL이 아직 동기화 중', next: 'optimistic 처리 후 재시도',
      b: 'border-amber-400', bg: 'bg-amber-50/60 dark:bg-amber-950/20', t: 'text-amber-600 dark:text-amber-400' },
  ];
  return (
    <div className="space-y-1.5 text-[10px]">
      {rows.map((r) => (
        <div key={r.status} className={`rounded-lg border-2 ${r.b} ${r.bg} px-3 py-1.5`}>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold ${r.t}`}>{r.status}</span>
            <span className="">{r.meaning}</span>
          </div>
          <p className="text-[9px] text-foreground/75 mt-0.5">→ CL: {r.next}</p>
        </div>
      ))}
    </div>
  );
}
