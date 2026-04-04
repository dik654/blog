import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export { TxPoolBuild, TxPoolPrune } from './archVisualsTxpoolParts';

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
        <p className="text-[8px] text-foreground/75">NewPooledTxHashes</p>
      </div>
      <motion.span className="text-emerald-500 text-sm shrink-0"
        animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>→</motion.span>
      <div className="flex-1 rounded-lg border-2 border-border px-2 py-1.5">
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
      <div className="rounded border px-3 py-2 font-mono text-[9px]">
        <span className="text-blue-600 font-bold">eth_sendRawTransaction</span>
        <span className="">(</span>
        <span className="text-amber-600">"0x02f8b2..."</span>
        <span className="">)</span>
        <span className="text-foreground/75 ml-2 text-[8px]">// EIP-1559 서명 tx</span>
      </div>
      <div className="flex items-center flex-wrap gap-1">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-1">
            <span className={`rounded px-1.5 py-0.5 border text-[9px] font-medium
              ${i === steps.length - 1
                ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                : 'border-border text-foreground/75'}`}>{s}</span>
            {i < steps.length - 1 && <span className="text-foreground/75 text-[9px]">→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
