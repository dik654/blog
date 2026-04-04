import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export { DevP2PTxPropagate, DevP2PPeerScore } from './archVisualsDevp2pParts';

// step 0: eth/68 핸드셰이크
export function DevP2PHandshake() {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50/60 dark:bg-orange-950/20 px-2 py-1.5 text-center shrink-0 text-[9px]">
        <p className="font-bold">Reth</p>
        <p className="">우리</p>
      </div>
      <div className="flex-1 space-y-1 font-mono text-[9px]">
        <div className="flex items-center gap-1">
          <span className="text-blue-600 font-bold">→</span>
          <span className="rounded border border-border px-1.5 py-0.5">Status(chainId, td, head)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-emerald-600 font-bold">←</span>
          <span className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-1.5 py-0.5">Status (eth/68) ✓</span>
        </div>
      </div>
      <div className="rounded-lg border-2 border-border bg-card px-2 py-1.5 text-center shrink-0 text-[9px]">
        <p className="font-bold">peer</p>
      </div>
    </div>
  );
}

// step 1: NewBlock 브로드캐스트
export function DevP2PBlockBroadcast() {
  const peers = ['A', 'B', 'C', 'D'];
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN(p => (p >= peers.length ? 0 : p + 1)), 400);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50/60 dark:bg-orange-950/20 px-2 py-1.5 text-center shrink-0 text-[9px]">
        <p className="font-bold">NewBlock</p>
        <p className="">eth/68</p>
      </div>
      <motion.span className="text-emerald-500 shrink-0"
        animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>→</motion.span>
      <div className="flex gap-1">
        {peers.map((p, i) => (
          <div key={p} className={`rounded-full w-7 h-7 flex items-center justify-center text-[9px] font-bold border transition-all duration-300
            ${i < n ? 'border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700' : 'border-border text-muted-foreground/30'}`}>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
