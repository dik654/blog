import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  va: '#6366f1',
  l0: '#0ea5e9',
  l3: '#10b981',
  ns: '#f59e0b',
  fault: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'AArch64 — VA_BITS=39 (512GB virtual) · 3-level 페이지 테이블' },
  { label: 'TTBR0/TTBR1 — 사용자(TA) vs 커널(OP-TEE core) 분리' },
  { label: '39-bit VA 분해 — L0/L1/L2/L3 idx 9비트씩 + page offset 12비트' },
  { label: 'L3 leaf PTE 비트필드 — NS bit가 TrustZone 강제 핵심' },
  { label: 'Normal world의 NS=0 entry 접근 시 sync abort' },
];

const VA_PARTS = [
  { name: 'L0 idx', bits: '9b', x: 60, w: 60, color: C.l0 },
  { name: 'L1 idx', bits: '9b', x: 130, w: 60, color: C.l0 },
  { name: 'L2 idx', bits: '9b', x: 200, w: 60, color: C.l0 },
  { name: 'L3 idx', bits: '9b', x: 270, w: 60, color: C.l3 },
  { name: 'Page offset', bits: '12b', x: 340, w: 90, color: C.va },
];

const PTE_FIELDS = [
  { f: 'valid', bits: '1', desc: '1 = valid entry', color: C.l3 },
  { f: 'type', bits: '1', desc: '1 = Page (L3)', color: C.l3 },
  { f: 'attr_idx', bits: '3', desc: 'MAIR attribute index', color: C.l3 },
  { f: 'ns', bits: '1', desc: '← TrustZone 강제 (NS bit)', color: C.ns },
  { f: 'ap', bits: '2', desc: 'Access permission', color: C.l3 },
  { f: 'sh', bits: '2', desc: 'Shareability (cache)', color: C.l3 },
  { f: 'af', bits: '1', desc: 'Access Flag', color: C.l3 },
  { f: 'ng', bits: '1', desc: 'Not Global (ASID)', color: C.l3 },
  { f: 'oa', bits: '36', desc: 'Output (physical) Address', color: C.l3 },
  { f: 'pxn', bits: '1', desc: 'Privileged execute-never', color: C.l3 },
  { f: 'uxn', bits: '1', desc: 'Unprivileged execute-never', color: C.l3 },
];

export default function MmuPageTableViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            ARMv8 페이지 테이블 — OP-TEE의 NS bit 강제
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.va}>
                AArch64 페이지 테이블 (3-level)
              </text>
              {[
                { name: 'VA_BITS', v: '39 (512GB virtual)', color: C.va },
                { name: 'Page size', v: '4KB (표준) · 16KB · 64KB 옵션', color: C.l3 },
                { name: 'Translation', v: '3-level 또는 4-level walk', color: C.l0 },
                { name: 'TTBR0_EL1', v: '사용자 영역 (TA)', color: C.va },
                { name: 'TTBR1_EL1', v: '커널 영역 (OP-TEE core)', color: C.l3 },
              ].map((r, i) => (
                <motion.g key={r.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={50} y={56 + i * 26} width={380} height={22} rx={4} fill={`${r.color}10`} stroke={`${r.color}45`} strokeWidth={0.6} />
                  <text x={62} y={71 + i * 26} fontSize={9} fontWeight={700} fill={r.color} fontFamily="monospace">{r.name}</text>
                  <text x={180} y={71 + i * 26} fontSize={8.5} fill="var(--muted-foreground)">{r.v}</text>
                </motion.g>
              ))}
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.va}>
                TTBR0 vs TTBR1 — 영역 분리
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={56} width={200} height={120} rx={6} fill={`${C.va}10`} stroke={`${C.va}55`} strokeWidth={0.8} />
                <text x={130} y={76} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.va}>TTBR0_EL1</text>
                <text x={130} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">사용자 영역 (TA)</text>
                <text x={42} y={114} fontSize={8.5} fill="var(--muted-foreground)">• TA 로드 시 매핑</text>
                <text x={42} y={132} fontSize={8.5} fill="var(--muted-foreground)">• per-TA 전환 (context switch)</text>
                <text x={42} y={150} fontSize={8.5} fill="var(--muted-foreground)">• ASID로 TLB 분리</text>
                <text x={42} y={168} fontSize={8.5} fill="var(--muted-foreground)">• 0x000... ~ 0x7FF... (low VA)</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <rect x={250} y={56} width={200} height={120} rx={6} fill={`${C.l3}10`} stroke={`${C.l3}55`} strokeWidth={0.8} />
                <text x={350} y={76} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.l3}>TTBR1_EL1</text>
                <text x={350} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">커널 영역 (OP-TEE core)</text>
                <text x={262} y={114} fontSize={8.5} fill="var(--muted-foreground)">• 부팅시 한 번 매핑</text>
                <text x={262} y={132} fontSize={8.5} fill="var(--muted-foreground)">• 모든 TA에서 공통</text>
                <text x={262} y={150} fontSize={8.5} fill="var(--muted-foreground)">• Global mapping</text>
                <text x={262} y={168} fontSize={8.5} fill="var(--muted-foreground)">• 0xFFFF... (high VA)</text>
              </motion.g>
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.va}>VA (39 bits) 분해</text>
              {VA_PARTS.map((p, i) => (
                <motion.g key={p.name} initial={{ opacity: 0, scaleY: 0.5 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: i * 0.1 }}>
                  <rect x={p.x} y={56} width={p.w} height={36} rx={4} fill={`${p.color}15`} stroke={`${p.color}70`} strokeWidth={0.8} />
                  <text x={p.x + p.w / 2} y={73} textAnchor="middle" fontSize={9} fontWeight={700} fill={p.color}>{p.name}</text>
                  <text x={p.x + p.w / 2} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{p.bits}</text>
                </motion.g>
              ))}
              {[
                { lbl: 'L0 → L1 base', x: 90, y: 110, c: C.l0 },
                { lbl: 'L1 → L2 base', x: 160, y: 110, c: C.l0 },
                { lbl: 'L2 → L3 base', x: 230, y: 110, c: C.l0 },
                { lbl: 'L3 → PTE (PA)', x: 300, y: 110, c: C.l3 },
                { lbl: '+ offset → PA', x: 385, y: 110, c: C.va },
              ].map((s, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.5 + i * 0.08 }}
                  x={s.x} y={s.y} textAnchor="middle" fontSize={7.5} fill={s.c} fontWeight={600}>
                  {s.lbl}
                </motion.text>
              ))}
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 레벨에서 9-bit index → 512 entries × 8 bytes = 4KB page table
              </text>
              <text x={240} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                L3 leaf entry가 최종 PA + 권한 정보 보관
              </text>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.l3}>L3 PTE (leaf) 비트필드</text>
              {PTE_FIELDS.map((f, i) => {
                const col = i % 2;
                const idx = Math.floor(i / 2);
                return (
                  <motion.g key={f.f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <rect x={20 + col * 230} y={42 + idx * 24} width={220} height={20} rx={3}
                      fill={`${f.color}10`} stroke={`${f.color}45`} strokeWidth={0.6} />
                    <text x={28 + col * 230} y={56 + idx * 24} fontSize={9} fontWeight={700} fontFamily="monospace" fill={f.color}>{f.f}</text>
                    <text x={84 + col * 230} y={56 + idx * 24} fontSize={7.5} fill="var(--muted-foreground)" fontFamily="monospace">[{f.bits}]</text>
                    <text x={120 + col * 230} y={56 + idx * 24} fontSize={7.5} fill="var(--muted-foreground)">{f.desc}</text>
                  </motion.g>
                );
              })}
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fault}>Normal world → NS=0 entry 접근</text>
              {[
                { line: '1) MMU walk: NS world의 page table에 NS=0 entry 발견', c: C.l3, y: 64 },
                { line: '2) NS bit check: CPU의 NS=1 vs entry NS=0 → 불일치', c: C.ns, y: 88 },
                { line: '3) Sync abort: ESR_EL2.EC = Data abort from EL1', c: C.fault, y: 112 },
                { line: '4) Linux: SIGBUS 또는 unhandled exception → kernel panic', c: C.fault, y: 136 },
                { line: '* Secure world의 NS=1 매핑은 정상 (shared memory 통신)', c: C.l3, y: 168 },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={l.y - 14} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={l.y} fontSize={9} fontFamily="monospace" fill={l.c} fontWeight={600}>{l.line}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
