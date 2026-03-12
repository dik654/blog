import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// step 0: beacon 노드로부터 제안자 의무 수신
export function ValidatorSlotAssign() {
  const [slot, setSlot] = useState(47291);
  useEffect(() => {
    const id = setInterval(() => setSlot(s => s + 1), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border bg-muted/40 px-3 py-1.5 font-mono text-[9px]">
        <span className="text-blue-600 font-bold">GET </span>
        <span className="text-muted-foreground">/eth/v1/validator/duties/proposer/{slot}</span>
      </div>
      <div className="rounded border bg-muted/10 px-3 py-2 space-y-1.5 font-mono text-[9px]">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground shrink-0">이번 슬롯 제안자 주소</span>
          <span className="text-foreground font-bold">0x8f3a…</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground shrink-0">우리 노드 검증자 주소</span>
          <span className="text-foreground font-bold">0x8f3a…</span>
        </div>
        <div className="border-t border-border/50 pt-1.5 flex items-center gap-1.5">
          <span className="text-emerald-500 font-bold">일치 →</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-sans font-semibold">이번 슬롯 블록 제안 담당</span>
        </div>
      </div>
    </div>
  );
}

// step 1: BeaconChain에 블록 템플릿 요청
export function ValidatorBlockTemplate() {
  return (
    <div className="space-y-1.5 text-[10px] font-mono">
      <div className="rounded border bg-muted/40 px-3 py-1.5">
        <span className="text-blue-600 font-bold">GET </span>
        <span className="text-muted-foreground">/eth/v2/validator/blocks/{'{slot}'}</span>
      </div>
      <motion.div className="text-center text-muted-foreground"
        animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>↓</motion.div>
      <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-3 py-2">
        <p className="text-emerald-700 dark:text-emerald-400 font-bold">BeaconBlockContents</p>
        <p className="text-[9px] text-muted-foreground font-sans">ExecutionPayload + attestations[]</p>
      </div>
    </div>
  );
}

// step 2: EL 페이로드 빌드 (forkchoiceUpdated → getPayload)
export function ValidatorPayloadBuild() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 3), 900);
    return () => clearInterval(id);
  }, []);
  const steps = [
    { label: 'engine_forkchoiceUpdatedV3(attrs)', color: 'text-amber-600', note: 'EL에게 "페이로드 빌드 시작" 신호 + 목표 head 전달' },
    { label: 'TxPool에서 가스비 높은 순으로 tx 선별', color: 'text-blue-600', note: '블록에 넣을 트랜잭션 모음 구성' },
    { label: 'engine_getPayloadV4(id) → payload', color: 'text-emerald-600', note: '완성된 실행 페이로드 수신' },
  ];
  return (
    <div className="space-y-1.5 text-[10px]">
      {steps.map((s, i) => (
        <div key={s.label} className={`flex items-center gap-2 rounded px-2 py-1 border transition-all duration-300
          ${i === phase ? 'border-border bg-muted/50 shadow-sm' : 'border-transparent opacity-30'}`}>
          <span className={`font-bold shrink-0 ${s.color}`}>{i + 1}</span>
          <div>
            <p className="font-mono text-[9px]">{s.label}</p>
            <p className="text-[8px] text-muted-foreground">{s.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// step 3: 슬래싱 방지 DB 확인 후 BLS 서명
export function ValidatorBLSSign() {
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border border-red-200 bg-red-50/40 dark:bg-red-950/10 px-2 py-1.5 text-[9px] text-muted-foreground">
        <span className="font-semibold text-red-600 dark:text-red-400">슬래싱</span>이란? 같은 슬롯에 두 개의 다른 블록에 서명하는 "이중 서명"이 탐지되면 스테이킹한 ETH 일부를 강제 소각당하는 페널티.
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded border border-red-300 bg-red-50/60 dark:bg-red-950/20 px-2 py-1 text-[9px] shrink-0">
          <p className="font-semibold text-red-600 dark:text-red-400">슬래싱 DB 확인</p>
          <p className="text-muted-foreground">이전 서명 이력 없음</p>
        </div>
        <span className="text-emerald-500 font-bold">→ 안전 ✓</span>
      </div>
      <div className="rounded border border-blue-300 bg-blue-50/60 dark:bg-blue-950/20 px-3 py-2 font-mono text-[9px]">
        <p className="text-blue-600 font-bold">sign(block_root, DOMAIN_BEACON_PROPOSER)</p>
        <p className="text-muted-foreground font-sans mt-0.5">
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
        <p className="text-muted-foreground">gossipsub</p>
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
