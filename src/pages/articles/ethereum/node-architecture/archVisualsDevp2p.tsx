import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// step 0: eth/68 핸드셰이크
export function DevP2PHandshake() {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50/60 dark:bg-orange-950/20 px-2 py-1.5 text-center shrink-0 text-[9px]">
        <p className="font-bold">Reth</p>
        <p className="text-muted-foreground">우리</p>
      </div>
      <div className="flex-1 space-y-1 font-mono text-[9px]">
        <div className="flex items-center gap-1">
          <span className="text-blue-600 font-bold">→</span>
          <span className="rounded border border-border bg-muted/40 px-1.5 py-0.5">Status(chainId, td, head)</span>
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
        <p className="text-muted-foreground">eth/68</p>
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

// step 2: tx 해시 공지 → 요청 → 전달 3-step
export function DevP2PTxPropagate() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 3), 1000);
    return () => clearInterval(id);
  }, []);
  const steps = [
    { dir: '→', label: 'NewPooledTransactionHashes([h1,h2,h3])', color: 'text-blue-600', note: '해시만 먼저 공지 — tx 전체를 보내면 중복 낭비' },
    { dir: '←', label: 'GetPooledTransactions([h1,h3])', color: 'text-amber-600', note: '피어가 이미 아는 tx는 빼고, 없는 것만 요청' },
    { dir: '→', label: 'PooledTransactions([tx1, tx3])', color: 'text-emerald-600', note: '요청받은 tx 데이터만 전달' },
  ];
  return (
    <div className="space-y-1.5 text-[10px]">
      {steps.map((s, i) => (
        <div key={s.label} className={`flex items-start gap-1.5 rounded px-2 py-1 border transition-all duration-300
          ${i === phase ? 'border-border bg-muted/50 shadow-sm' : 'border-transparent opacity-30'}`}>
          <span className={`font-bold shrink-0 mt-0.5 ${s.color}`}>{s.dir}</span>
          <div>
            <p className="font-mono text-[9px]">{s.label}</p>
            <p className={`text-[8px] text-muted-foreground ${i === phase ? '' : 'invisible'}`}>{s.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// step 3: 피어 스코어링 + 불량 피어 차단
export function DevP2PPeerScore() {
  const peers = [
    { id: 'peer-1', score: 85, ok: true },
    { id: 'peer-2', score: 62, ok: true },
    { id: 'peer-3', score: -45, ok: false },
  ];
  return (
    <div className="space-y-1 text-[10px]">
      <p className="text-[9px] text-muted-foreground">피어 스코어 (0 이하 → 차단)</p>
      {peers.map(p => (
        <div key={p.id} className={`flex items-center gap-2 rounded px-2 py-1 border
          ${p.ok ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20' : 'border-red-300 bg-red-50/60 dark:bg-red-950/20 opacity-60'}`}>
          <span className="font-mono text-[9px]">{p.id}</span>
          <span className={`ml-auto font-bold text-[9px] ${p.ok ? 'text-emerald-600' : 'text-red-600'}`}>
            {p.score > 0 ? '+' : ''}{p.score}
          </span>
          {!p.ok && <span className="text-red-600 text-[9px] font-bold">BANNED</span>}
        </div>
      ))}
    </div>
  );
}
