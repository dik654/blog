import { motion } from 'framer-motion';

// step 4: LMD-GHOST fork choice
export function BeaconForkChoice() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="flex items-center gap-1 font-mono text-[9px]">
        <div className="rounded border-2 border-foreground/40 bg-card px-2 py-1 shrink-0">47289</div>
        <span className="">─</span>
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-1">
            <div className="rounded border-2 border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1 font-bold">47291</div>
            <div className="text-[8px] space-y-0.5">
              <p className="text-emerald-600 font-bold font-sans">← HEAD 선택</p>
              <p className="text-foreground/75 font-sans">어테스테이션 512개</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-30">
            <div className="rounded border border-border px-2 py-1">47291'</div>
            <div className="text-[8px] font-sans">
              <p className="">어테스테이션 8개 → 탈락</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[9px] text-foreground/75">더 많은 검증자가 투표한 블록을 canonical head로 선택</p>
    </div>
  );
}

// step 5: 상태·블록 HotColdDB 기록
export function BeaconStore() {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="space-y-1">
        <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1 font-mono text-[9px]">SignedBeaconBlock</div>
        <div className="rounded border border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 px-2 py-1 font-mono text-[9px]">BeaconState</div>
      </div>
      <motion.span className="text-emerald-500 text-sm"
        animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>→</motion.span>
      <div className="rounded-lg border-2 border-purple-300 bg-purple-50/60 dark:bg-purple-950/20 px-3 py-2 text-center text-[9px]">
        <p className="font-bold text-purple-700 dark:text-purple-400">Hot DB</p>
        <p className="">LevelDB</p>
      </div>
    </div>
  );
}
