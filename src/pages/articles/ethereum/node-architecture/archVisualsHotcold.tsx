import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// step 0: BeaconChain → Hot DB 기록
export function HotColdWrite() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-border/50 px-2 py-1 text-[9px] text-foreground/75">
        <span className="font-semibold text-foreground">Hot DB</span> — 최근 ~64 epoch(약 7시간)의 블록·상태를 RAM에 가깝게 빠르게 읽고 쓸 수 있는 영역.
        <span className="font-semibold text-foreground"> Cold Freezer</span>는 확정된 오래된 블록을 압축 저장하는 불변 아카이브.
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded-lg border-2 border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 px-2 py-1.5 text-center shrink-0 text-[9px]">
          <p className="font-bold">BeaconChain</p>
        </div>
        <motion.span className="text-emerald-500" animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>→</motion.span>
        <div className="flex-1 rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1.5 font-mono text-[9px]">
          <p className="text-emerald-700 dark:text-emerald-400 font-bold">Hot DB (LevelDB)</p>
          <p className="text-foreground/75 font-sans">put_block() · put_state()</p>
        </div>
      </div>
    </div>
  );
}

// step 1: ~64 epoch 슬라이딩 윈도우
export function HotColdRetain() {
  const slots = [47284, 47285, 47286, 47287, 47288, 47289, 47290, 47291];
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="flex items-center gap-0.5">
        {slots.map((s, i) => (
          <div key={s} className={`flex-1 rounded border text-center py-1 font-mono text-[8px]
            ${i === slots.length - 1 ? 'border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 font-bold' : 'border-border'}`}>
            {s}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-foreground/75">
        <span>← Hot DB (~64 epoch 보존)</span>
        <span className="text-emerald-600">HEAD →</span>
      </div>
    </div>
  );
}

// step 2: 확정 블록 → Cold Freezer
export function HotColdFreeze() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 3), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-border/50 px-2 py-1 text-[9px] text-foreground/75">
        <span className="font-semibold text-foreground">finalized</span> — 2/3 이상의 검증자가 투표해 영구 확정된 상태. 이후 절대 변경 불가.
      </div>
      <div className="flex items-center gap-2">
        <div className={`rounded border-2 px-2 py-1.5 text-center shrink-0 text-[9px] transition-all duration-500
          ${phase === 1 ? 'border-amber-300 bg-amber-50/60 dark:bg-amber-950/20' : 'border-border'}`}>
          <p className="font-bold">Hot DB</p>
          <p className="font-mono text-[8px] text-foreground/75">finalized</p>
        </div>
        <motion.span className={`font-bold transition-colors ${phase === 1 ? 'text-amber-500' : 'text-muted-foreground/30'}`}
          animate={phase === 1 ? { x: [0, 4, 0] } : {}} transition={{ duration: 0.4, repeat: Infinity }}>→</motion.span>
        <div className={`flex-1 rounded border-2 px-2 py-1.5 text-center text-[9px] transition-all duration-500
          ${phase === 2 ? 'border-purple-300 bg-purple-50/60 dark:bg-purple-950/20' : 'border-border'}`}>
          <p className={`font-bold ${phase === 2 ? 'text-purple-700 dark:text-purple-400' : ''}`}>Cold Freezer</p>
          <p className="text-[8px] text-foreground/75">불변 아카이브</p>
        </div>
      </div>
    </div>
  );
}

// step 3: EIP-4844 블롭 DB + TTL
export function HotColdBlobs() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-border/50 px-2 py-1 text-[9px] text-foreground/75">
        <span className="font-semibold text-foreground">EIP-4844 블롭</span> — L2 롤업이 데이터를 저렴하게 올리기 위한 임시 데이터 공간. calldata보다 훨씬 싸지만 약 18일 후 자동 삭제됨.
      </div>
      <div className="rounded border border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 px-3 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-[9px] text-amber-700 dark:text-amber-400">Blobs DB (EIP-4844)</span>
          <span className="text-[9px] font-mono text-foreground/75">TTL: 4,096 slots ≈ 18일</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-1 rounded border border-amber-200 bg-amber-50 dark:bg-amber-950/30 py-1 text-center text-[8px] text-amber-700 dark:text-amber-400 font-mono">
              b{i}
            </div>
          ))}
        </div>
        <p className="text-[9px] text-foreground/75 mt-1.5">TTL 만료 후 삭제 (beacon state는 유지)</p>
      </div>
    </div>
  );
}
