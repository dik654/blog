import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  tee: '#10b981',
  ta: '#0ea5e9',
  shm: '#f59e0b',
  io: '#8b5cf6',
  vasp: '#6366f1',
  walk: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'TEE_RAM 계열 — 코드/RO/RW/RX/Nexus 등 OP-TEE 자체 메모리' },
  { label: 'TA_RAM · NSEC_SHM · RAM_NSEC — TA 영역과 Normal world 공유' },
  { label: 'IO 영역 — Secure/Non-secure 페리페럴 MMIO 분리' },
  { label: 'VA space 예약 — 가상 주소 전용 영역 (RES · SHM)' },
  { label: 'MMU walk 예 — VA 0x40200000 (TA code) → Secure DRAM' },
];

const TYPES = [
  { name: 'MEM_AREA_TEE_RAM', desc: 'TEE 실행 코드/데이터 (전체)', color: C.tee, group: 0 },
  { name: 'MEM_AREA_TEE_RAM_RX', desc: 'execute-only (코드 전용)', color: C.tee, group: 0 },
  { name: 'MEM_AREA_TEE_RAM_RO', desc: 'read-only (const data)', color: C.tee, group: 0 },
  { name: 'MEM_AREA_TEE_RAM_RW', desc: 'read/write (stack, heap)', color: C.tee, group: 0 },
  { name: 'MEM_AREA_NEX_RAM_RO', desc: 'Nexus RAM readonly', color: C.tee, group: 0 },
  { name: 'MEM_AREA_NEX_RAM_RW', desc: 'Nexus RAM r/w', color: C.tee, group: 0 },
  { name: 'MEM_AREA_TEE_COHERENT', desc: 'cache-coherent 영역', color: C.tee, group: 0 },
  { name: 'MEM_AREA_TEE_ASAN', desc: 'AddressSanitizer shadow', color: C.tee, group: 0 },
  { name: 'MEM_AREA_TA_RAM', desc: 'TA 로드 영역 (secure)', color: C.ta, group: 1 },
  { name: 'MEM_AREA_NSEC_SHM', desc: 'Non-secure shared memory', color: C.shm, group: 1 },
  { name: 'MEM_AREA_RAM_NSEC', desc: 'Non-secure RAM (Linux)', color: C.shm, group: 1 },
  { name: 'MEM_AREA_IO_SEC', desc: 'Secure peripheral MMIO', color: C.io, group: 2 },
  { name: 'MEM_AREA_IO_NSEC', desc: 'Non-secure peripheral MMIO', color: C.io, group: 2 },
  { name: 'MEM_AREA_DDR_OVERALL', desc: '전체 DDR 영역', color: C.io, group: 2 },
  { name: 'MEM_AREA_RES_VASPACE', desc: 'Reserved virtual', color: C.vasp, group: 3 },
  { name: 'MEM_AREA_SHM_VASPACE', desc: 'Shared memory virtual', color: C.vasp, group: 3 },
];

export default function MemTypesEnumViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            enum teecore_memtypes — 메모리 타입 분류
          </text>
          {step < 4 && TYPES.map((t, i) => {
            const visible = t.group === step;
            const col = i % 2;
            const idx = Math.floor(i / 2);
            return (
              <motion.g key={t.name} animate={{ opacity: visible ? 1 : 0.08 }} transition={{ ...sp, delay: visible ? idx * 0.04 : 0 }}>
                <rect x={20 + col * 230} y={28 + idx * 22} width={220} height={18} rx={3}
                  fill={`${t.color}12`} stroke={`${t.color}45`} strokeWidth={0.6} />
                <text x={30 + col * 230} y={41 + idx * 22} fontSize={8} fontFamily="monospace" fontWeight={700} fill={t.color}>{t.name}</text>
                <text x={30 + col * 230} y={50 + idx * 22} fontSize={7} fill="var(--muted-foreground)">{t.desc}</text>
              </motion.g>
            );
          })}
          {step === 4 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.walk}>
                MMU walk 예 — VA 0x40200000 (TA code)
              </text>
              {[
                { line: 'VA = 0x40200000', c: C.vasp, y: 56 },
                { line: '→ TTBR1_EL1 (커널/secure 영역)', c: C.tee, y: 78 },
                { line: '→ Page Table walk (L0 → L1 → L2 → L3)', c: C.tee, y: 100 },
                { line: '   PTE: NS = 0   (Secure)', c: C.tee, y: 122 },
                { line: '   PTE: XN = 0   (executable)', c: C.tee, y: 142 },
                { line: '   PTE: AP = 0b01 (r/w at EL1)', c: C.tee, y: 162 },
                { line: '→ PA = 0x3F900000 (secure DRAM 안)', c: C.walk, y: 184 },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={30} y={l.y - 13} width={420} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={45} y={l.y} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
