import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// step 0: on_new_payload() HTTP 수신
export function EngineTreeReceive() {
  return (
    <div className="space-y-1.5 text-[10px] font-mono">
      <div className="rounded border bg-muted/40 px-3 py-2">
        <p><span className="text-blue-600 font-bold">POST</span> <span className="text-muted-foreground">http://127.0.0.1:8551</span></p>
        <p className="text-[9px] mt-0.5"><span className="text-muted-foreground">method: </span><span className="text-emerald-600 font-bold">engine_newPayloadV3</span></p>
        <p className="text-[9px] text-amber-600">Authorization: Bearer eyJ…</p>
      </div>
      <p className="text-[9px] text-muted-foreground font-sans">↓ on_new_payload() 핸들러 진입</p>
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
      <p className="font-mono text-[9px] text-muted-foreground">PayloadProcessor: tx 순차 실행</p>
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

// step 2: SparseStateTrie 병렬 상태 루트 계산
export function EngineTreeStateTrie() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-border/50 bg-muted/20 px-2 py-1 text-[9px] text-muted-foreground">
        <span className="font-semibold text-foreground">SparseStateTrie</span> — 변경된 계정 노드만 선택적으로 업데이트하는 Merkle Patricia Trie. 전체를 재계산하지 않아 병렬화 가능.
      </div>
      <p className="font-mono text-[9px] text-muted-foreground">SparseStateTrie: 병렬 계산</p>
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          {['addr-A', 'addr-B', 'addr-C'].map((a) => (
            <div key={a} className="rounded border border-border bg-muted/30 px-2 py-0.5 font-mono text-[9px]">{a}</div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-1">
          {[0, 1, 2].map(i => (
            <motion.span key={i} className="text-emerald-500 text-[9px]"
              animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}>→</motion.span>
          ))}
        </div>
        <div className="rounded-lg border-2 border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1.5 text-center text-[9px]">
          <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">stateRoot</p>
          <p className="text-muted-foreground font-mono">0xa3f2…</p>
          <p className="text-[8px] text-muted-foreground font-sans mt-0.5">모든 계정 잔액·코드·스토리지<br/>변경을 하나의 해시로 압축</p>
        </div>
      </div>
    </div>
  );
}

// step 3: PersistenceService 비동기 Storage 기록
export function EngineTreePersist() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN(p => (p + 1) % 4), 700);
    return () => clearInterval(id);
  }, []);
  const items = ['SealedBlock', 'ExecutionOutcome', 'StorageChanges'];
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-border/50 bg-muted/20 px-2 py-1 text-[9px] text-muted-foreground">
        <span className="font-semibold text-foreground">PersistenceService</span> — EVM 실행과 분리된 비동기 저장 서비스. 블록 처리 속도를 높이기 위해 디스크 쓰기를 별도 스레드에서 처리.
      </div>
      <p className="font-mono text-[9px] text-muted-foreground">PersistenceService (비동기)</p>
      <div className="flex items-center gap-2">
        <div className="space-y-1">
          {items.map((it, i) => (
            <div key={it} className={`rounded border px-2 py-0.5 font-mono text-[9px] transition-all duration-300
              ${i < n ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' : 'border-border text-muted-foreground/50'}`}>
              {it}
            </div>
          ))}
        </div>
        <motion.span className="text-emerald-500" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 0.7 }}>→</motion.span>
        <div className="rounded-lg border-2 border-orange-300 bg-orange-50/60 dark:bg-orange-950/20 px-2 py-1.5 text-center text-[9px]">
          <p className="font-bold">Storage</p>
          <p className="text-muted-foreground">MDBX</p>
        </div>
      </div>
    </div>
  );
}

// step 4: VALID 응답 → fork_choice 대기
export function EngineTreeResponse() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-3 py-2 font-mono">
        <p className="text-emerald-700 dark:text-emerald-400 font-bold">{'{ status: "VALID" }'}</p>
        <p className="text-[9px] text-muted-foreground font-sans">latestValidHash: 0xa3f2…</p>
      </div>
      <p className="text-[9px] text-muted-foreground">↑ CL로 반환 → fork_choice 업데이트 대기</p>
    </div>
  );
}
