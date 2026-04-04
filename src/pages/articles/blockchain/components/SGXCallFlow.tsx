import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Dir = 'ecall' | 'ocall';
const steps = {
  ecall: [
    { zone: 'app', label: 'User Application', detail: 'sgx_ecall(eid, fn_id, args) 호출' },
    { zone: 'urts', label: 'URTS (sgx_urts)', detail: '__morestack 경유 → AEX 전환 준비' },
    { zone: 'cpu', label: 'CPU (AEX)', detail: 'EENTER: 호스트 → 엔클레이브 컨텍스트 전환\nRSP/RBP/XMM 저장 → SSA(State Save Area) 기록' },
    { zone: 'trts', label: 'TRTS (trts_ecall.cpp)', detail: 'is_ecall_allowed() → 동적 ECALL 권한 확인\ndo_ecall() → 랜덤 스택 오프셋 (Spectre 완화)\n함수 디스패치 실행' },
    { zone: 'enclave', label: 'Enclave Function', detail: '신뢰 코드 실행\nEPC 메모리 내에서만 동작' },
  ],
  ocall: [
    { zone: 'enclave', label: 'Enclave Code', detail: 'sgx_ocall(idx, args) 호출' },
    { zone: 'trts', label: 'TRTS (trts_ocall.cpp)', detail: 'OCALL_FLAG 설정\n__morestack → EEXIT 준비' },
    { zone: 'cpu', label: 'CPU (EEXIT)', detail: 'EEXIT: 엔클레이브 → 호스트 컨텍스트 복원\n비신뢰 스택으로 복귀' },
    { zone: 'urts', label: 'URTS (do_oret)', detail: 'OCALL_FLAG 검증 (재진입 공격 방어)\n비신뢰 함수 실행' },
    { zone: 'app', label: 'Host Function', detail: '비신뢰 OS 함수 실행 후 결과 반환\n→ 다시 ECALL로 재진입' },
  ],
};

const zoneColors: Record<string, string> = {
  enclave: 'bg-emerald-500 text-white',
  trts: 'bg-emerald-600 text-white',
  cpu: 'bg-amber-500 text-white',
  urts: 'bg-blue-500 text-white',
  app: 'bg-slate-500 text-white',
};

export default function SGXCallFlow() {
  const [dir, setDir] = useState<Dir>('ecall');
  const [active, setActive] = useState(0);

  const current = steps[dir];

  return (
    <div className="rounded-xl border p-5 space-y-4 not-prose">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">SGX 호출 흐름</span>
        <div className="flex gap-2">
          {(['ecall', 'ocall'] as Dir[]).map(d => (
            <button
              key={d}
              onClick={() => { setDir(d); setActive(0); }}
              className={`text-xs px-3 py-1 rounded-full border cursor-pointer transition-colors font-mono ${dir === d ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
            >
              {d.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Flow steps */}
      <div className="flex flex-col gap-1">
        {current.map((step, i) => (
          <motion.div
            key={`${dir}-${i}`}
            initial={{ opacity: 0, x: dir === 'ecall' ? -8 : 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setActive(i)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left cursor-pointer transition-all ${active === i ? 'ring-2 ring-primary' : 'hover:bg-accent/50'}`}
            >
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-mono ${zoneColors[step.zone]}`}>
                {step.label}
              </span>
              {i < current.length - 1 && (
                <span className="text-foreground/40 text-xs">
                  {dir === 'ecall' ? '↓' : '↑'}
                </span>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${dir}-${active}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-lg bg-accent p-3 text-xs font-mono whitespace-pre"
        >
          {current[active].detail}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" />엔클레이브(신뢰)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500 inline-block" />CPU 전환</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" />URTS/App(비신뢰)</span>
      </div>
    </div>
  );
}
