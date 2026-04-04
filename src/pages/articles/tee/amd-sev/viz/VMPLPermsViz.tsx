import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };

const LEVELS = [
  { vmpl: 0, role: 'Paravisor / vTPM', trust: '최고 신뢰', color: C.indigo },
  { vmpl: 1, role: '게스트 OS 커널', trust: '높은 신뢰', color: C.green },
  { vmpl: 2, role: '게스트 앱 (Ring3)', trust: '제한', color: C.amber },
  { vmpl: 3, role: '게스트 앱 (최저)', trust: '최소', color: C.amber },
];

const BITS = [
  { name: 'READ', bit: 'bit 0', val: '1' },
  { name: 'WRITE', bit: 'bit 1', val: '1<<1' },
  { name: 'EXEC_USER', bit: 'bit 2', val: '1<<2' },
  { name: 'EXEC_SUPER', bit: 'bit 3', val: '1<<3' },
];

const STEPS = [
  { label: 'VMPL 계층 구조', body: 'VMPL 0(최고 권한) ~ VMPL 3(최저) — 게스트 VM 내부를 계층화' },
  { label: 'VmplPerms 비트 마스크', body: 'READ / WRITE / EXECUTE_USER(CPL3) / EXECUTE_SUPERVISOR(CPL0-2) 4비트 권한' },
  { label: '권한 위임', body: 'VMPL 1이 특정 페이지 RWX 권한을 VMPL 2에게 위임 — 계층적 privilege delegation' },
];

export default function VMPLPermsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* VMPL levels */}
          {LEVELS.map((l, i) => {
            const y = 12 + i * 36;
            const w = 210 - i * 20;
            return (
              <motion.g key={i} animate={{ opacity: step === 0 || step === 2 ? 1 : 0.25 }}>
                <rect x={20} y={y} width={w} height={28} rx={5}
                  fill={`${l.color}12`} stroke={l.color} strokeWidth={step === 0 ? 1.3 : 0.8} />
                <text x={30} y={y + 18} fontSize={10} fontWeight={700} fill={l.color}>VMPL {l.vmpl}</text>
                <text x={80} y={y + 18} fontSize={10} fill="var(--foreground)">{l.role}</text>
                <text x={w + 26} y={y + 18} fontSize={10} fill="var(--muted-foreground)">{l.trust}</text>
              </motion.g>
            );
          })}
          {/* Bit mask table */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.15 }}>
            <rect x={300} y={12} width={220} height={22} rx={4}
              fill={`${C.green}12`} stroke={C.green} strokeWidth={1} />
            <text x={410} y={27} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>VmplPerms : u8</text>
            {BITS.map((b, i) => {
              const y = 40 + i * 24;
              return (
                <g key={b.name}>
                  <rect x={300} y={y} width={220} height={20} rx={3}
                    fill={i % 2 === 0 ? `${C.green}06` : 'transparent'} />
                  <text x={310} y={y + 14} fontSize={10} fontWeight={500} fill="var(--foreground)">{b.name}</text>
                  <text x={420} y={y + 14} fontSize={10} fill="var(--muted-foreground)">{b.bit}</text>
                  <text x={480} y={y + 14} fontSize={10} fill={C.green} fontFamily="monospace">{b.val}</text>
                </g>
              );
            })}
          </motion.g>
          {/* Delegation arrow (step 2) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}>
              <path d="M170,60 C240,60 240,96 170,96" fill="none" stroke={C.amber} strokeWidth={1.3}
                strokeDasharray="5 3" markerEnd="url(#vmplArr)" />
              <rect x={230} y={70} width={60} height={16} rx={3} fill="var(--card)" />
              <text x={260} y={82} textAnchor="middle" fontSize={10} fill={C.amber}>RWX 위임</text>
            </motion.g>
          )}
          <defs>
            <marker id="vmplArr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.amber} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
