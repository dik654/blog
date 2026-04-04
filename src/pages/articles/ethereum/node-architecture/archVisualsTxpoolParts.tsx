import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// step 2: 가스 가격 순 정렬 후 best_transactions() 선별
export function TxPoolBuild() {
  const txs = [
    { hash: '0x9e8f', gwei: 42, ok: true },
    { hash: '0x1a2b', gwei: 38, ok: true },
    { hash: '0x5c4d', gwei: 31, ok: true },
    { hash: '0x3g7h', gwei: 9, ok: false },
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN(p => (p > txs.length ? 0 : p + 1)), 600);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-1 text-[10px]">
      <div className="flex items-center justify-between text-[9px]">
        <span className="">가스비 내림차순 선별</span>
        <span className="rounded border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 px-1.5 py-0.5 text-amber-700 dark:text-amber-400">
          현재 base fee: <span className="font-bold">15 gwei</span> — 이 미만은 포함 불가
        </span>
      </div>
      {txs.map((tx, i) => (
        <div key={tx.hash} className={`flex items-center gap-2 rounded px-2 py-1 border font-mono text-[9px] transition-all duration-300
          ${i < n ? (tx.ok ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20' : 'border-red-200 bg-red-50/40 dark:bg-red-950/10 opacity-40') : 'border-border opacity-30'}`}>
          <span className={`font-bold w-3 ${i < n ? (tx.ok ? 'text-emerald-600' : 'text-red-400') : 'text-border'}`}>
            {i < n ? (tx.ok ? '✓' : '✗') : (i + 1)}
          </span>
          <span>{tx.hash}</span>
          <span className={`ml-auto font-bold ${tx.gwei > 10 ? 'text-amber-600' : 'text-red-400'}`}>{tx.gwei} gwei</span>
          <span className={`text-[8px] text-red-400 ${i < n && !tx.ok ? '' : 'invisible'}`}>{tx.gwei} &lt; 15 → 제외</span>
        </div>
      ))}
    </div>
  );
}

// step 3: 확정 후 포함 tx 제거 + Queued → Pending 승격
export function TxPoolPrune() {
  const [phase, setPhase] = useState(0); // 0=대기, 1=제거, 2=승격
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 3), 1500);
    return () => clearInterval(id);
  }, []);
  const pending = ['0x1a2b', '0x3c4d', '0x5e6f'];
  const queued = ['0x7g8h', '0x9i0j'];
  return (
    <div className="space-y-2 text-[10px]">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className={`text-[9px] font-bold mb-1 ${phase === 1 ? 'text-red-500' : 'text-muted-foreground'}`}>
            Pending{phase === 1 ? ' — 제거 중' : ''}
          </p>
          {pending.map((tx, i) => (
            <div key={tx} className={`flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] mb-0.5 border transition-all duration-500
              ${phase === 1 && i < 2 ? 'opacity-25 border-red-200 line-through' : 'border-border'}`}>
              <span className={phase === 1 && i < 2 ? 'text-red-500' : 'text-emerald-500'}>
                {phase === 1 && i < 2 ? '✗' : '✓'}
              </span>
              {tx}
            </div>
          ))}
        </div>
        <div>
          <p className={`text-[9px] font-bold mb-1 ${phase === 2 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
            Queued{phase === 2 ? ' → Pending' : ''}
          </p>
          {queued.map(tx => (
            <motion.div key={tx}
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] mb-0.5 border transition-all duration-500
                ${phase === 2 ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 font-bold' : 'border-border'}`}
              animate={phase === 2 ? { x: [0, -4, 0] } : {}}
              transition={{ duration: 0.4 }}>
              {tx}
              {phase === 2 && <span className="ml-auto text-[8px] text-emerald-600 font-bold">↑</span>}
            </motion.div>
          ))}
        </div>
      </div>
      <p className={`text-[9px] font-semibold transition-colors
        ${phase === 0 ? 'text-muted-foreground' : phase === 1 ? 'text-red-500' : 'text-emerald-600'}`}>
        {phase === 0 ? '블록 확정 대기…' : phase === 1 ? '포함된 tx 제거 중…' : 'Queued → Pending 승격 완료 ✓'}
      </p>
    </div>
  );
}
