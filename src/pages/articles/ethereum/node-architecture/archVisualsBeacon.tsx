import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// step 0: Gossipsub에서 블록 수신
export function BeaconBlockReceive() {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="rounded-lg border-2 border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 px-2 py-1.5 text-center shrink-0 text-[9px]">
        <p className="font-bold">libp2p</p>
        <p className="text-muted-foreground">Gossipsub</p>
      </div>
      <motion.span className="text-emerald-500 shrink-0"
        animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>→</motion.span>
      <div className="flex-1 rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1.5 font-mono">
        <p className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold">SignedBeaconBlock</p>
        <p className="text-[9px] text-muted-foreground">slot=47,291 · root=0xa3f2…</p>
      </div>
    </div>
  );
}

// step 1: process_block() 체크리스트
export function BeaconProcessBlock() {
  const checks = [
    { label: 'BLS 서명 검증', note: '유효한 검증자 주소가 서명했는지' },
    { label: '슬롯 번호 확인', note: '블록이 올바른 슬롯에 속하는지' },
    { label: '상태 전환 검증', note: '이전 상태에서 이 블록으로 정상 전이되는지' },
    { label: 'ExecutionPayload 해시', note: 'EL 페이로드 해시가 CL 헤더와 일치하는지' },
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN(p => p < checks.length ? p + 1 : 0), 600);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-1 text-[10px]">
      <p className="font-mono text-[9px] text-muted-foreground">process_block()</p>
      {checks.map((c, i) => (
        <div key={c.label} className={`flex items-start gap-2 rounded px-2 py-0.5 transition-all duration-300
          ${i < n ? 'text-foreground' : 'text-muted-foreground/40'}`}>
          <span className={`font-bold shrink-0 mt-0.5 ${i < n ? 'text-emerald-600' : 'text-border'}`}>{i < n ? '✓' : '○'}</span>
          <div>
            <p>{c.label}</p>
            <p className={`text-[9px] text-muted-foreground ${i < n ? '' : 'invisible'}`}>{c.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// step 2: engine_newPayloadV3 HTTP 요청
export function BeaconNewPayload() {
  return (
    <div className="rounded border bg-muted/40 px-3 py-2 font-mono text-[10px] space-y-0.5">
      <div className="flex gap-2">
        <span className="text-blue-600 font-bold">POST</span>
        <span className="text-muted-foreground">http://127.0.0.1:8551</span>
      </div>
      <p><span className="text-muted-foreground">method: </span><span className="text-emerald-600 font-bold">engine_newPayloadV3</span></p>
      <p className="text-[9px] text-muted-foreground">params: [ExecutionPayload, versioned_hashes[], parent_beacon_root]</p>
    </div>
  );
}

// step 3: VALID 응답 수신
export function BeaconValidResponse() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 font-bold">VALID ✓</span>
          <span className="text-muted-foreground text-[9px]">EL → CL 응답</span>
        </div>
        <p className="text-[9px] text-muted-foreground mt-0.5">stateRoot 일치 + EVM 실행 완료</p>
      </div>
      <p className="text-[9px] text-muted-foreground">↓ fork_choice() 트리거</p>
    </div>
  );
}

// step 4: LMD-GHOST fork choice
export function BeaconForkChoice() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="flex items-center gap-1 font-mono text-[9px]">
        <div className="rounded border-2 border-foreground/40 bg-card px-2 py-1 shrink-0">47289</div>
        <span className="text-muted-foreground">─</span>
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-1">
            <div className="rounded border-2 border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1 font-bold">47291</div>
            <div className="text-[8px] space-y-0.5">
              <p className="text-emerald-600 font-bold font-sans">← HEAD 선택</p>
              <p className="text-muted-foreground font-sans">어테스테이션 512개</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-30">
            <div className="rounded border border-border px-2 py-1">47291'</div>
            <div className="text-[8px] font-sans">
              <p className="text-muted-foreground">어테스테이션 8개 → 탈락</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground">더 많은 검증자가 투표한 블록을 canonical head로 선택</p>
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
        <p className="text-muted-foreground">LevelDB</p>
      </div>
    </div>
  );
}
