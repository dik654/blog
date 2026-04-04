import { useState, useEffect } from 'react';

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
          ${i === phase ? 'border-border shadow-sm' : 'border-transparent opacity-30'}`}>
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
      <p className="text-[9px] text-foreground/75">피어 스코어 (0 이하 → 차단)</p>
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
