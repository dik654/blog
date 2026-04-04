import { useState, useEffect } from 'react';

// step 2: Discv5 ENR 탐색으로 피어 발견
export function LibP2PDiscovery() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setN(p => p < 5 ? p + 1 : 1), 700);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-2 text-[10px]">
      <p className="text-[9px] text-foreground/75">Discv5 ENR 탐색</p>
      <div className="flex items-center gap-3">
        <div className="rounded-full border-2 border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 w-12 h-12 flex items-center justify-center text-[9px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
          우리
        </div>
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: n }).map((_, i) => (
            <div key={i}
              className="rounded-full border-2 border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-0.5 text-[8px] text-emerald-700 dark:text-emerald-400">
              peer-{i + 1} ✓ ENR 등록
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// step 3: 어테스테이션 서브넷 전파
export function LibP2PAttestation() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % 4), 600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-1.5 text-[10px]">
      <p className="text-[9px] text-foreground/75">어테스테이션 서브넷 (64개 중 예시)</p>
      <div className="grid grid-cols-4 gap-1">
        {[0, 1, 2, 3].map(s => (
          <div key={s} className={`rounded border py-1.5 text-center text-[9px] font-mono transition-all duration-300
            ${s === active ? 'border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 font-bold text-blue-700 dark:text-blue-400 shadow-sm' : 'border-border text-muted-foreground/50'}`}>
            /att/{s}
            {s === active && <div className="text-[7px] text-blue-500 mt-0.5">전파 중</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
