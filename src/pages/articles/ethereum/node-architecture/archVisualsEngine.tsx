import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function JwtSharedSecret() {
  return (
    <div className="flex items-center justify-between gap-3 text-[10px]">
      <div className="rounded-lg border-2 border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 px-3 py-2 text-center shrink-0">
        <p className="font-bold">Lighthouse</p>
        <p className="text-blue-600 text-[9px]">CL</p>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 w-full text-center">
          <p className="font-mono text-amber-700 dark:text-amber-400">🔑 jwt.hex</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">공유 시크릿 (양쪽 동일 파일)</p>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <span className="text-emerald-500">←</span> read <span className="text-emerald-500">→</span>
        </div>
      </div>
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50/60 dark:bg-orange-950/20 px-3 py-2 text-center shrink-0">
        <p className="font-bold">Reth</p>
        <p className="text-orange-600 text-[9px]">EL</p>
      </div>
    </div>
  );
}

export function JwtHttpPost() {
  return (
    <div className="rounded-lg border overflow-hidden font-mono text-[10px]">
      <div className="bg-muted/60 px-3 py-1.5 flex gap-2 items-center">
        <span className="text-blue-600 font-bold">POST</span>
        <span className="text-muted-foreground">http://127.0.0.1:8551</span>
      </div>
      <div className="px-3 py-2 space-y-0.5">
        <p className="text-amber-600">Authorization: Bearer eyJhbGci...</p>
        <p className="text-muted-foreground">Content-Type: application/json</p>
        <div className="border-t border-border/50 pt-1 mt-1">
          <p><span className="text-muted-foreground">method: </span>
          <span className="text-blue-600">engine_newPayloadV3</span></p>
        </div>
      </div>
    </div>
  );
}

export function JwtVerify() {
  return (
    <div className="space-y-1.5 text-[10px] font-mono">
      <div className="rounded border bg-muted/30 px-3 py-2 space-y-0.5">
        <p><span className="text-muted-foreground">iat: </span>1700000000
          <span className="text-muted-foreground ml-2">(JWT 발행 시각)</span></p>
        <p><span className="text-muted-foreground">now: </span>1700000003
          <span className="text-muted-foreground ml-2">(EL 수신 시각)</span></p>
        <p><span className="text-muted-foreground">diff: </span>
          <span className="text-emerald-600 font-bold">3s</span>
          <span className="text-emerald-600 ml-1">≤ 5s → ✓ accept</span></p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 font-sans">
        <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1">
          <p className="text-emerald-700 dark:text-emerald-300">|diff| ≤ 5s → accept</p>
        </div>
        <div className="rounded border border-red-300 bg-red-50/60 dark:bg-red-950/20 px-2 py-1">
          <p className="text-red-700 dark:text-red-300">|diff| &gt; 5s → reject</p>
        </div>
      </div>
    </div>
  );
}

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
      <div className="rounded border bg-muted/30 px-3 py-2 font-mono space-y-1">
        {txs.map((tx, i) => (
          <div key={tx} className={`flex items-center gap-2 transition-colors duration-300
            ${i < done ? 'text-foreground' : 'text-muted-foreground/40'}`}>
            <span className={`shrink-0 font-bold ${i < done ? 'text-emerald-600' : i === done ? 'text-amber-500' : 'text-border'}`}>
              {i < done ? '✓' : i === done ? '⟳' : '○'}
            </span>
            <span className="text-muted-foreground">tx[{i}]</span>
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
        <span className="text-muted-foreground font-mono text-[9px]">stateRoot:</span>
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
            <span className="text-muted-foreground">{r.meaning}</span>
          </div>
          <p className="text-[9px] text-muted-foreground mt-0.5">→ CL: {r.next}</p>
        </div>
      ))}
    </div>
  );
}
