import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  cpu: '#6366f1',
  table: '#0ea5e9',
  asid: '#10b981',
  aes: '#f59e0b',
  asp: '#8b5cf6',
};

const STEPS = [
  { label: 'CPU 내부 키 테이블 — ASID → AES 키', body: 'ASID 0=Host(TME), 1..N=각 VM, 키는 DRAM에 절대 저장 안 됨' },
  { label: '메모리 접근 1) TLB walk → PA + ASID', body: '현재 vCPU의 ASID와 함께 PA 결정' },
  { label: '2) ASID로 키 슬롯 선택', body: '하드웨어가 테이블에서 해당 키를 fetch' },
  { label: '3) AES 엔진이 (en/de)crypt — Host 미노출', body: '키는 ASP가 관리, 메모리·debug interface에 노출 없음' },
];

const KEYS = [
  { asid: '0', label: 'Host (TME)', color: '#888' },
  { asid: '1', label: 'VM_A key', color: C.aes },
  { asid: '2', label: 'VM_B key', color: '#0ea5e9' },
  { asid: '3', label: 'VM_C key', color: '#10b981' },
  { asid: '…', label: '…', color: '#888' },
  { asid: '1006', label: 'VM_1006 key', color: '#ef4444' },
];

export default function ASIDKeyTableViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const tlbActive = step >= 1;
        const lookupActive = step >= 2;
        const aesActive = step >= 3;
        return (
          <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* CPU + TLB */}
            <motion.g animate={{ opacity: tlbActive ? 1 : 0.3 }}>
              <ModuleBox x={20} y={26} w={130} h={42} label="vCPU" sub="현재 ASID 보유" color={C.cpu} />
              <ActionBox x={20} y={82} w={130} h={36} label="TLB walk" sub="PA 획득" color={C.cpu} />
            </motion.g>

            {/* Key table */}
            <motion.rect x={170} y={26} width={180} height={196} rx={8}
              fill="var(--card)" stroke={C.table} strokeWidth={lookupActive ? 1.5 : 0.6} />
            <text x={260} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.table}>CPU Internal Key Table</text>
            <line x1={180} y1={48} x2={340} y2={48} stroke={C.table} strokeWidth={0.4} />
            {KEYS.map((k, i) => {
              const y = 56 + i * 26;
              const highlight = lookupActive && i === 1;
              return (
                <motion.g key={k.asid} animate={{ opacity: lookupActive ? 1 : 0.5 }}>
                  <motion.rect x={180} y={y} width={160} height={20} rx={3}
                    animate={{ fill: highlight ? `${k.color}30` : `${k.color}10`, stroke: k.color, strokeWidth: highlight ? 1.4 : 0.4 }} />
                  <text x={194} y={y + 14} fontSize={9} fontWeight={600} fill={k.color}>ASID {k.asid}</text>
                  <text x={258} y={y + 14} fontSize={8.5} fill="var(--foreground)">{k.label}</text>
                </motion.g>
              );
            })}

            {/* AES engine */}
            <motion.g animate={{ opacity: aesActive ? 1 : 0.25 }}>
              <ModuleBox x={370} y={82} w={100} h={42} label="AES Engine" sub="en/decrypt" color={C.aes} />
              <DataBox x={370} y={140} w={100} h={28} label="DRAM" color="#888" outlined />
            </motion.g>

            {/* ASP source of truth */}
            <motion.g animate={{ opacity: step === 0 ? 1 : 0.4 }}>
              <DataBox x={20} y={140} w={130} h={28} label="ASP가 키 관리" color={C.asp} outlined />
              <text x={20} y={184} fontSize={8} fill="var(--muted-foreground)">Host 미노출, DRAM 미저장</text>
              <text x={20} y={196} fontSize={8} fill="var(--muted-foreground)">VM 종료 → key slot 비움</text>
            </motion.g>

            {/* Arrows */}
            {tlbActive && (
              <motion.line x1={150} y1={100} x2={170} y2={100}
                stroke={C.cpu} strokeWidth={1} markerEnd="url(#k1)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            )}
            {lookupActive && (
              <motion.line x1={340} y1={92} x2={370} y2={100}
                stroke={C.aes} strokeWidth={1} markerEnd="url(#k2)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            )}
            {aesActive && (
              <motion.line x1={420} y1={124} x2={420} y2={140}
                stroke={C.aes} strokeWidth={1} markerEnd="url(#k2)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            )}

            <defs>
              <marker id="k1" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
                <polygon points="0 0, 5 2.5, 0 5" fill={C.cpu} />
              </marker>
              <marker id="k2" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
                <polygon points="0 0, 5 2.5, 0 5" fill={C.aes} />
              </marker>
            </defs>
          </svg>
        );
      }}
    </StepViz>
  );
}
