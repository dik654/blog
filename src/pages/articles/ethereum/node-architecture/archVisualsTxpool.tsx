import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// step 0: tx가 devp2p에서 들어와 Pending 풀에 쌓이는 과정
export function TxPoolReceive() {
  const txs = ['0x1a2b…f3', '0x5c4d…a1', '0x9e8f…b2'];
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN(p => (p >= txs.length ? 0 : p + 1)), 700);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50/60 dark:bg-orange-950/20 px-2 py-1.5 shrink-0 text-center">
        <p className="font-bold text-[9px]">devp2p</p>
        <p className="text-[8px] text-muted-foreground">NewPooledTxHashes</p>
      </div>
      <motion.span className="text-emerald-500 text-sm shrink-0"
        animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>→</motion.span>
      <div className="flex-1 rounded-lg border-2 border-border bg-muted/20 px-2 py-1.5">
        <p className="font-bold text-[9px] mb-1">Pending Pool</p>
        {txs.map((tx, i) => (
          <div key={tx} className={`font-mono text-[9px] rounded px-1 py-0.5 mb-0.5 transition-all duration-400
            ${i < n ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-muted-foreground/30'}`}>
            {i < n ? '✓ ' : '○ '}{tx}
          </div>
        ))}
      </div>
    </div>
  );
}

// step 1: eth_sendRawTransaction → decode → validate → Pending
export function TxPoolRpc() {
  const steps = ['decode', 'nonce check', 'balance check', '→ Pending'];
  return (
    <div className="space-y-2 text-[10px]">
      <div className="rounded border bg-muted/40 px-3 py-2 font-mono text-[9px]">
        <span className="text-blue-600 font-bold">eth_sendRawTransaction</span>
        <span className="text-muted-foreground">(</span>
        <span className="text-amber-600">"0x02f8b2..."</span>
        <span className="text-muted-foreground">)</span>
        <span className="text-muted-foreground ml-2 text-[8px]">// EIP-1559 서명 tx</span>
      </div>
      <div className="flex items-center flex-wrap gap-1">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-1">
            <span className={`rounded px-1.5 py-0.5 border text-[9px] font-medium
              ${i === steps.length - 1
                ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                : 'border-border bg-muted/40 text-muted-foreground'}`}>{s}</span>
            {i < steps.length - 1 && <span className="text-muted-foreground text-[9px]">→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

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
        <span className="text-muted-foreground">가스비 내림차순 선별</span>
        <span className="rounded border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 px-1.5 py-0.5 text-amber-700 dark:text-amber-400">
          현재 base fee: <span className="font-bold">15 gwei</span> — 이 미만은 포함 불가
        </span>
      </div>
      {txs.map((tx, i) => (
        <div key={tx.hash} className={`flex items-center gap-2 rounded px-2 py-1 border font-mono text-[9px] transition-all duration-300
          ${i < n ? (tx.ok ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20' : 'border-red-200 bg-red-50/40 dark:bg-red-950/10 opacity-40') : 'border-border bg-muted/20 opacity-30'}`}>
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
              ${phase === 1 && i < 2 ? 'opacity-25 border-red-200 line-through' : 'border-border bg-muted/20'}`}>
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
                ${phase === 2 ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 font-bold' : 'border-border bg-muted/20'}`}
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
