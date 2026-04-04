import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export { EngineTreeStateTrie, EngineTreePersist } from './archVisualsEngineTreeParts';

// step 0: on_new_payload() HTTP 수신
export function EngineTreeReceive() {
  return (
    <div className="space-y-1.5 text-[10px] font-mono">
      <div className="rounded border px-3 py-2">
        <p><span className="text-blue-600 font-bold">POST</span> <span className="">http://127.0.0.1:8551</span></p>
        <p className="text-[9px] mt-0.5"><span className="">method: </span><span className="text-emerald-600 font-bold">engine_newPayloadV3</span></p>
        <p className="text-[9px] text-amber-600">Authorization: Bearer eyJ…</p>
      </div>
      <p className="text-[9px] text-foreground/75 font-sans">↓ on_new_payload() 핸들러 진입</p>
    </div>
  );
}

// step 1: PayloadProcessor: tx 순차 EVM 실행
export function EngineTreeEVM() {
  const txs = ['0x1a2b', '0x5c4d', '0x9e8f', '0x3g7h'];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(p => (p + 1) % (txs.length + 2)), 550);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const done = Math.min(idx, txs.length);
  return (
    <div className="space-y-1 text-[10px]">
      <p className="font-mono text-[9px] text-foreground/75">PayloadProcessor: tx 순차 실행</p>
      {txs.map((tx, i) => (
        <div key={tx} className={`flex items-center gap-2 font-mono text-[9px] transition-colors duration-300
          ${i < done ? 'text-foreground' : 'text-muted-foreground/40'}`}>
          <span className={`font-bold ${i < done ? 'text-emerald-600' : i === done ? 'text-amber-500' : 'text-border'}`}>
            {i < done ? '✓' : i === done ? '⟳' : '○'}
          </span>
          <span>{tx}</span>
          {i === done && idx < txs.length && (
            <motion.span className="text-amber-500 text-[9px]"
              animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>EVM 실행 중…</motion.span>
          )}
        </div>
      ))}
    </div>
  );
}

// step 4: VALID 응답 → fork_choice 대기
export function EngineTreeResponse() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-3 py-2 font-mono">
        <p className="text-emerald-700 dark:text-emerald-400 font-bold">{'{ status: "VALID" }'}</p>
        <p className="text-[9px] text-foreground/75 font-sans">latestValidHash: 0xa3f2…</p>
      </div>
      <p className="text-[9px] text-foreground/75">↑ CL로 반환 → fork_choice 업데이트 대기</p>
    </div>
  );
}
