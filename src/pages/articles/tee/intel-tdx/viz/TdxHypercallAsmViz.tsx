import { motion } from 'framer-motion';

const ASM = '#3b82f6';
const ARG = '#10b981';
const RET = '#f59e0b';
const MASK = '#8b5cf6';

interface AsmStep { num: number; line: string; meaning: string; phase: 'mask' | 'load' | 'call' | 'store'; }

const STEPS: AsmStep[] = [
  { num: 1, line: 'movl $TDVMCALL_EXPOSE_REGS_MASK, %ecx', meaning: 'TD Module에 노출할 레지스터 비트마스크', phase: 'mask' },
  { num: 2, line: 'mov 0(%rdi), %r10', meaning: 'args[0] → R10', phase: 'load' },
  { num: 3, line: 'mov 8(%rdi), %r11', meaning: 'args[1] → R11', phase: 'load' },
  { num: 4, line: 'mov 16(%rdi)..40(%rdi), %r12-%r15', meaning: 'args[2..5] → R12..R15', phase: 'load' },
  { num: 5, line: 'xor %eax, %eax', meaning: 'TDG.VP.VMCALL leaf = 0', phase: 'call' },
  { num: 6, line: 'tdcall', meaning: 'CPU 명령 → SEAM 진입 → Host로 exit', phase: 'call' },
  { num: 7, line: 'mov %r10, 0(%rdi) ... %r15, 40(%rdi)', meaning: '반환값 R10..R15 → args 구조체에 저장', phase: 'store' },
];

const PHASE_COLOR: Record<string, string> = {
  mask: MASK,
  load: ARG,
  call: ASM,
  store: RET,
};

export default function TdxHypercallAsmViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 380" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">__tdx_hypercall — ASM 실행 흐름 (tdcall.S)</text>

        {/* Function header */}
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={32} width={440} height={20} rx={4}
            fill={ASM} fillOpacity={0.18} stroke={ASM} strokeWidth={0.6} />
          <text x={240} y={46} textAnchor="middle"
            fontSize={8} fontFamily="monospace" fontWeight={700} fill={ASM}>
            SYM_FUNC_START(__tdx_hypercall)  // %rdi = struct tdx_module_args *
          </text>
        </motion.g>

        {/* Phase legend */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          {(['mask', 'load', 'call', 'store'] as const).map((p, i) => (
            <g key={p} transform={`translate(${20 + i * 110}, 60)`}>
              <rect x={0} y={0} width={100} height={14} rx={2}
                fill={PHASE_COLOR[p]} fillOpacity={0.18} stroke={PHASE_COLOR[p]} strokeWidth={0.4} />
              <text x={50} y={10} textAnchor="middle"
                fontSize={7} fontFamily="monospace" fontWeight={700} fill={PHASE_COLOR[p]}>
                {p.toUpperCase()}
              </text>
            </g>
          ))}
        </motion.g>

        {/* Steps */}
        {STEPS.map((s, i) => {
          const color = PHASE_COLOR[s.phase];
          return (
            <motion.g key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}>
              <rect x={20} y={86 + i * 38} width={440} height={32} rx={4}
                fill={color} fillOpacity={0.06} stroke={color} strokeWidth={0.5} />
              <rect x={20} y={86 + i * 38} width={3.5} height={32} fill={color} />

              <circle cx={42} cy={102 + i * 38} r={9} fill={color} />
              <text x={42} y={105 + i * 38} textAnchor="middle"
                fontSize={9} fontWeight={700} fill="white">
                {s.num}
              </text>

              <text x={60} y={99 + i * 38} fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={color}>
                {s.line}
              </text>
              <text x={60} y={111 + i * 38} fontSize={7} fill="var(--muted-foreground)">
                {s.meaning}
              </text>
            </motion.g>
          );
        })}

        {/* End */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
          <rect x={20} y={356} width={440} height={20} rx={4}
            fill={ASM} fillOpacity={0.12} stroke={ASM} strokeWidth={0.6} />
          <text x={240} y={370} textAnchor="middle"
            fontSize={8} fontFamily="monospace" fontWeight={700} fill={ASM}>
            ret  ;  SYM_FUNC_END(__tdx_hypercall)
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
