import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_HW = '#6366f1';
const C_CC = '#10b981';
const C_OS = '#f59e0b';
const C_APP = '#ef4444';
const C_DEPLOY = '#a855f7';

const LAYERS = [
  { name: 'Hardware', color: C_HW, items: ['IBRS', 'IBPB', 'STIBP', 'SSBD', 'eIBRS'] },
  { name: 'Compiler', color: C_CC, items: ['Retpoline', 'LFENCE barrier', 'Spectre v1 masking'] },
  { name: 'OS', color: C_OS, items: ['KPTI', 'L1D flush on VMENTER', 'MDS clear on ctx switch'] },
  { name: 'App', color: C_APP, items: ['Branch-free 비교', 'AES-NI 사용', 'Oblivious data structure'] },
  { name: 'Deployment', color: C_DEPLOY, items: ['SMT 비활성화', 'Microcode 최신', 'TCB attestation 강제'] },
];

const STEPS = [
  {
    label: 'Defense in depth — 5개 계층 모두 필요',
    body: 'Hardware → Compiler → OS → App → Deployment 순으로 누적.\n공격자는 가장 약한 고리를 찾으므로 단일 계층만으로는 부족하다.',
  },
  {
    label: 'Hardware + Compiler 계층',
    body: 'CPU 차원의 IBRS/IBPB/STIBP/SSBD.\n컴파일러가 retpoline·LFENCE·index masking을 자동 삽입.',
  },
  {
    label: 'OS + App + Deployment 계층',
    body: 'OS가 KPTI/L1D flush/MDS clear.\n앱은 constant-time crypto. 운영자는 SMT off + microcode + TCB 정책으로 강제.',
  },
];

export default function MitigationLayersViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {LAYERS.map((l, i) => {
                const y = 20 + i * 42;
                return (
                  <motion.g key={l.name} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    <ModuleBox x={40} y={y} w={400} h={32} label={l.name} color={l.color} />
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {LAYERS.slice(0, 2).map((l, i) => {
                const y = 20 + i * 100;
                return (
                  <motion.g key={l.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.08 }}>
                    <ModuleBox x={40} y={y} w={400} h={28} label={l.name} color={l.color} />
                    {l.items.map((item, j) => {
                      const x = 50 + j * 95;
                      return (
                        <g key={j}>
                          <rect x={x} y={y + 36} width={85} height={22} rx={3}
                            fill={`${l.color}15`} stroke={l.color} strokeWidth={0.5} />
                          <text x={x + 42} y={y + 50} textAnchor="middle" fontSize={8.5}
                            fontWeight={500} fill={l.color}>{item}</text>
                        </g>
                      );
                    })}
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {LAYERS.slice(2).map((l, i) => {
                const y = 20 + i * 72;
                return (
                  <motion.g key={l.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.08 }}>
                    <ModuleBox x={40} y={y} w={400} h={26} label={l.name} color={l.color} />
                    {l.items.map((item, j) => {
                      const x = 50 + j * 130;
                      return (
                        <g key={j}>
                          <rect x={x} y={y + 32} width={120} height={22} rx={3}
                            fill={`${l.color}15`} stroke={l.color} strokeWidth={0.5} />
                          <text x={x + 60} y={y + 46} textAnchor="middle" fontSize={8.5}
                            fontWeight={500} fill={l.color}>{item}</text>
                        </g>
                      );
                    })}
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
