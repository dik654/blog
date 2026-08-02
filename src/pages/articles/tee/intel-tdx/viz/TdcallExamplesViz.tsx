import { motion } from 'framer-motion';

const HALT = '#3b82f6';
const ACC = '#10b981';
const REP = '#f59e0b';
const REG = '#8b5cf6';

interface Example {
  func: string;
  purpose: string;
  args: { reg: string; val: string }[];
  leaf: string;
  color: string;
}

const EXAMPLES: Example[] = [
  {
    func: '__halt(irq_disabled)',
    purpose: 'vCPU 유휴 → Host에 스케줄링 양도',
    args: [
      { reg: 'r10', val: 'TDX_HYPERCALL_STANDARD' },
      { reg: 'r11', val: 'EXIT_REASON_HLT' },
      { reg: 'r12', val: 'irq_disabled' },
    ],
    leaf: '__tdx_hypercall (TDG.VP.VMCALL)',
    color: HALT,
  },
  {
    func: 'tdx_accept_memory(start, end)',
    purpose: '부팅 시 페이지 수락 (pending → present)',
    args: [
      { reg: 'rcx', val: 'addr (loop start..end)' },
    ],
    leaf: '__tdcall(TDG_MEM_PAGE_ACCEPT)',
    color: ACC,
  },
  {
    func: 'tdx_mcall_get_report0(rd, tr)',
    purpose: 'TDREPORT 생성 (로컬 증명)',
    args: [
      { reg: 'rcx', val: 'virt_to_phys(tdreport)' },
      { reg: 'rdx', val: 'virt_to_phys(reportdata)' },
      { reg: 'r8', val: 'TDREPORT_SUBTYPE_0' },
    ],
    leaf: '__tdcall(TDG_MR_REPORT)',
    color: REP,
  },
];

export default function TdcallExamplesViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 380" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">Linux Guest TDCALL — 3가지 대표 사용례</text>

        {EXAMPLES.map((ex, i) => {
          const y0 = 36 + i * 115;
          return (
            <motion.g key={i}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.18 }}>
              <rect x={20} y={y0} width={440} height={105} rx={8}
                fill={ex.color} fillOpacity={0.06} stroke={ex.color} strokeWidth={1} />

              {/* Function name + leaf */}
              <rect x={20} y={y0} width={440} height={22} rx={6}
                fill={ex.color} fillOpacity={0.18} />
              <text x={32} y={y0 + 14} fontSize={8.5} fontFamily="monospace" fontWeight={700} fill={ex.color}>
                {ex.func}
              </text>
              <text x={448} y={y0 + 14} textAnchor="end" fontSize={7} fontStyle="italic" fill={ex.color}>
                arch/x86/coco/tdx/tdx.c
              </text>

              {/* Purpose */}
              <text x={32} y={y0 + 38} fontSize={7.5} fill="var(--muted-foreground)">
                {ex.purpose}
              </text>

              {/* Args */}
              <text x={32} y={y0 + 54} fontSize={7} fontWeight={700} fill={REG}>
                tdx_module_args:
              </text>
              {ex.args.map((a, j) => (
                <motion.g key={j}
                  initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.18 + j * 0.05 }}>
                  <rect x={100 + j * 110} y={y0 + 45} width={105} height={22} rx={2}
                    fill={REG} fillOpacity={0.1} stroke={REG} strokeWidth={0.4} />
                  <text x={108 + j * 110} y={y0 + 53} fontSize={6.5} fontFamily="monospace" fontWeight={700} fill={REG}>
                    .{a.reg}
                  </text>
                  <text x={108 + j * 110} y={y0 + 63} fontSize={5.7} fontFamily="monospace" fill="var(--muted-foreground)">
                    = {a.val}
                  </text>
                </motion.g>
              ))}

              {/* Call line */}
              <rect x={32} y={y0 + 70} width={416} height={26} rx={4}
                fill="var(--card)" stroke={ex.color} strokeWidth={0.5} strokeOpacity={0.5} />
              <text x={42} y={y0 + 80} fontSize={6.5} fontWeight={700} fill={ex.color}>
                Call:
              </text>
              <text x={70} y={y0 + 80} fontSize={7} fontFamily="monospace" fontWeight={600} fill="var(--foreground)">
                {ex.leaf}
              </text>
              <text x={42} y={y0 + 91} fontSize={6.5} fill="var(--muted-foreground)">
                → CPU가 SEAM 진입 → TD Module이 leaf 디스패치 → 결과 RAX
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
