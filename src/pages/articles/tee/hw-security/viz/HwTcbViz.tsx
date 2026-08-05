import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '일반 시스템 TCB — Linux + libc + UEFI 합쳐 30M+ LoC, 수천~수만 버그 잠재' },
  { label: 'TEE 시스템 TCB (SGX) — CPU HW + microcode + SDK ~50K, 수십~수백 버그' },
  { label: 'TCB 작을수록 보안 강함 — 각 라인이 공격 표면 + 한 버그 = 전체 침해' },
];

const NORMAL = [
  { name: 'Linux kernel', loc: '~30M LoC', c: '#ef4444' },
  { name: 'systemd, libc, drivers', loc: '~10M LoC', c: '#ef4444' },
  { name: 'BIOS/UEFI', loc: '~2M LoC', c: '#ef4444' },
];

const TEE_TCB = [
  { name: 'CPU hardware', loc: 'immutable', c: '#10b981' },
  { name: 'Microcode', loc: 'updatable, signed', c: '#10b981' },
  { name: 'SGX SDK runtime', loc: '~50K LoC', c: '#10b981' },
  { name: 'Enclave 앱 코드', loc: 'custom', c: '#10b981' },
];

const REASONS = [
  { line: '각 라인이 공격 표면', c: '#ef4444' },
  { line: '모든 라인이 감사·검증 대상', c: '#f59e0b' },
  { line: '한 버그 → 전체 침해 가능', c: '#ef4444' },
];

export default function HwTcbViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              일반 시스템 TCB — 30M+ LoC
            </text>
            {NORMAL.map((n, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <AlertBox x={50} y={50 + i * 56} w={420} h={44}
                  label={n.name} sub={n.loc} color={n.c} />
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
              예상 버그 수: 수천 ~ 수만
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              TEE 시스템 TCB (SGX) — minimal
            </text>
            {TEE_TCB.map((n, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <ModuleBox x={50} y={42 + i * 42} w={420} h={32}
                  label={n.name} sub={n.loc} color={n.c} />
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
              예상 버그 수: 수십 ~ 수백 (formal verification 가능)
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              TCB 작을수록 보안 강함
            </text>
            {REASONS.map((r, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${r.c}10`} stroke={`${r.c}50`} strokeWidth={0.8} />
                <rect x={50} y={50 + i * 50} width={4} height={36} fill={r.c} />
                <text x={70} y={72 + i * 50} fontSize={11} fontWeight={600} fill={r.c}>{r.line}</text>
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              심층 분석 → /tee/tee-tcb 참조
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
