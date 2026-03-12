import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TOPIC_COLORS = [
  'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400',
  'border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400',
  'border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400',
  'border-purple-300 bg-purple-50/60 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400',
];

// step 0: Gossipsub 토픽 구독 목록
export function LibP2PSubscribe() {
  const topics = [
    { name: 'beacon_block', note: '새로 제안된 블록 수신' },
    { name: 'beacon_aggregate_and_proof', note: '어테스테이션 집계 결과' },
    { name: 'attester_slashing', note: '이중 투표한 악성 검증자 신고' },
    { name: 'voluntary_exit', note: '검증자의 자발적 탈퇴 선언' },
  ];
  return (
    <div className="space-y-1 text-[10px]">
      <p className="text-[9px] text-muted-foreground">Gossipsub 토픽 구독 — 피어에서 메시지 수신 시작</p>
      {topics.map((t, i) => (
        <div key={t.name} className={`flex items-center gap-2 rounded px-2 py-1 border ${TOPIC_COLORS[i]}`}>
          <span className="text-[9px] font-bold shrink-0">SUB</span>
          <div className="min-w-0">
            <p className="font-mono text-[9px] truncate">{t.name}</p>
            <p className="text-[8px] opacity-80">{t.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// step 1: 새 블록 수신 → SyncManager 전달
export function LibP2PReceive() {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className="rounded-lg border-2 border-orange-300 bg-orange-50/60 dark:bg-orange-950/20 px-2 py-1.5 text-center shrink-0 text-[9px]">
        <p className="font-bold">peer</p>
        <p className="text-muted-foreground">P2P</p>
      </div>
      <motion.span className="text-emerald-500 shrink-0"
        animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>→</motion.span>
      <div className="flex-1 space-y-1">
        <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-1 font-mono text-[9px]">
          SignedBeaconBlock (slot=47,291)
        </div>
        <div className="text-[9px] text-muted-foreground flex items-center gap-1">
          <span className="text-amber-500">→</span> SyncManager 전달
        </div>
      </div>
    </div>
  );
}

// step 2: Discv5 ENR 탐색으로 피어 발견
export function LibP2PDiscovery() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setN(p => p < 5 ? p + 1 : 1), 700);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-2 text-[10px]">
      <p className="text-[9px] text-muted-foreground">Discv5 ENR 탐색</p>
      <div className="flex items-center gap-3">
        <div className="rounded-full border-2 border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 w-12 h-12 flex items-center justify-center text-[9px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
          우리
        </div>
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: n }).map((_, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-full border-2 border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 py-0.5 text-[8px] text-emerald-700 dark:text-emerald-400">
              peer-{i + 1} ✓ ENR 등록
            </motion.div>
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
      <p className="text-[9px] text-muted-foreground">어테스테이션 서브넷 (64개 중 예시)</p>
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
