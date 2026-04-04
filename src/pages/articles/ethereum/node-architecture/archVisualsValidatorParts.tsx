import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// step 3: 슬래싱 방지 DB 확인 후 BLS 서명
export function ValidatorBLSSign() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-red-200 bg-red-50/40 dark:bg-red-950/10 px-2 py-1.5 text-[9px] text-foreground/75">
        <span className="font-semibold text-red-600 dark:text-red-400">슬래싱</span>이란? 같은 슬롯에 두 개의 다른 블록에 서명하는 "이중 서명"이 탐지되면 스테이킹한 ETH 일부를 강제 소각당하는 페널티.
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded border border-red-300 bg-red-50/60 dark:bg-red-950/20 px-2 py-1 text-[9px] shrink-0">
          <p className="font-semibold text-red-600 dark:text-red-400">슬래싱 DB 확인</p>
          <p className="">이전 서명 이력 없음</p>
        </div>
        <span className="text-emerald-500 font-bold">→ 안전 ✓</span>
      </div>
      <div className="rounded border border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 px-3 py-2 font-mono text-[9px]">
        <p className="text-blue-600 font-bold">sign(block_root, DOMAIN_BEACON_PROPOSER)</p>
        <p className="text-foreground/75 font-sans mt-0.5">
          <span className="font-semibold not-italic">BLS12-381</span> — 검증자 서명에 쓰이는 타원곡선 서명 방식. 여러 서명을 하나로 합칠 수 있어 블록 검증 효율이 높음.
        </p>
      </div>
    </div>
  );
}

// step 4: Gossipsub으로 서명 블록 전파
export function ValidatorGossip() {
  const peers = ['A', 'B', 'C', 'D', 'E'];
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN(p => (p >= peers.length ? 0 : p + 1)), 400);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="rounded-lg border-2 border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 px-2 py-1.5 text-center shrink-0 text-[9px]">
        <p className="font-bold">beacon_block</p>
        <p className="">gossipsub</p>
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
