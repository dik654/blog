import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export { ValidatorBLSSign, ValidatorGossip } from './archVisualsValidatorParts';

// step 0: beacon 노드로부터 제안자 의무 수신
export function ValidatorSlotAssign() {
  const [slot, setSlot] = useState(47291);
  useEffect(() => {
    const id = setInterval(() => setSlot(s => s + 1), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-1.5 text-[10px]">
      <div className="rounded border px-3 py-1.5 font-mono text-[9px]">
        <span className="text-blue-600 font-bold">GET </span>
        <span className="">/eth/v1/validator/duties/proposer/{slot}</span>
      </div>
      <div className="rounded border px-3 py-2 space-y-1.5 font-mono text-[9px]">
        <div className="flex items-center gap-2">
          <span className="text-foreground/75 shrink-0">이번 슬롯 제안자 주소</span>
          <span className="text-foreground font-bold">0x8f3a…</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground/75 shrink-0">우리 노드 검증자 주소</span>
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
      <div className="rounded border px-3 py-1.5">
        <span className="text-blue-600 font-bold">GET </span>
        <span className="">/eth/v2/validator/blocks/{'{slot}'}</span>
      </div>
      <motion.div className="text-center text-foreground/75"
        animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>↓</motion.div>
      <div className="rounded border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-3 py-2">
        <p className="text-emerald-700 dark:text-emerald-400 font-bold">BeaconBlockContents</p>
        <p className="text-[9px] text-foreground/75 font-sans">ExecutionPayload + attestations[]</p>
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
          ${i === phase ? 'border-border shadow-sm' : 'border-transparent opacity-30'}`}>
          <span className={`font-bold shrink-0 ${s.color}`}>{i + 1}</span>
          <div>
            <p className="font-mono text-[9px]">{s.label}</p>
            <p className="text-[8px] text-foreground/75">{s.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
