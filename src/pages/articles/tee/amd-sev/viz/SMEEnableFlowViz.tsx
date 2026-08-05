import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  cpuid: '#6366f1',
  msr: '#0ea5e9',
  boot: '#10b981',
  pte: '#f59e0b',
};

const STEPS = [
  { label: 'CPUID 0x8000_001f — 능력 확인', body: 'EAX 비트로 SME / SEV / SEV-ES / SEV-SNP 지원 조회' },
  { label: 'MSR 활성화 — SYSCFG bit 23', body: 'wrmsr로 SME 엔진을 켜고 이후 C-bit 기반 동작 시작' },
  { label: '커널 부트 옵션 — mem_encrypt', body: 'on / active-by-default 로 매핑 정책 결정' },
  { label: '페이지 매핑 — PTE에 sme_me_mask OR', body: '실제 page table entry에 C-bit 결합되어 암호화 활성화' },
];

const CPUID_BITS = [
  { bit: 'EAX[0]', label: 'SME' },
  { bit: 'EAX[1]', label: 'SEV' },
  { bit: 'EAX[3]', label: 'SEV-ES' },
  { bit: 'EAX[4]', label: 'SEV-SNP' },
];

export default function SMEEnableFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: CPUID */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.2 }}>
            <ActionBox x={20} y={20} w={170} h={40} label="cpuid(0x8000_001f)" sub="능력 비트 조회" color={C.cpuid} />
            {CPUID_BITS.map((b, i) => (
              <motion.g key={b.bit}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: step === 0 ? 1 : 0.3, x: 0 }}
                transition={{ delay: step === 0 ? i * 0.06 : 0 }}>
                <DataBox x={210 + (i % 2) * 130} y={20 + Math.floor(i / 2) * 24} w={120} h={20}
                  label={`${b.bit} = ${b.label}`} color={C.cpuid} outlined />
              </motion.g>
            ))}
          </motion.g>

          {/* Step 1: MSR */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.2 }}>
            <ActionBox x={20} y={80} w={170} h={40} label="wrmsr SYSCFG" sub="bit 23 = MEM_ENCRYPT" color={C.msr} />
            <motion.g animate={{ opacity: step === 1 ? 1 : 0.2 }}>
              <DataBox x={210} y={80} w={250} h={40} label="SME 엔진 ON — C-bit 페이지만 암호화" color={C.msr} />
            </motion.g>
          </motion.g>

          {/* Step 2: Boot */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.2 }}>
            <ActionBox x={20} y={140} w={170} h={40} label="kernel boot args" sub="mem_encrypt=…" color={C.boot} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 2 ? 1 : 0.2 }}>
              <DataBox x={210} y={138} w={120} h={22} label="on (force)" color={C.boot} outlined />
              <DataBox x={335} y={138} w={125} h={22} label="active-by-default" color={C.boot} outlined />
              <text x={210} y={172} fontSize={8} fill="var(--muted-foreground)">전체 강제 vs 기본 + 평문 매핑 가능</text>
            </motion.g>
          </motion.g>

          {/* Step 3: PTE */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.2 }}>
            <ModuleBox x={20} y={188} w={170} h={28} label="set_pte" sub="페이지 매핑" color={C.pte} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 3 ? 1 : 0.2 }}>
              <DataBox x={210} y={190} w={250} h={24}
                label="pte_val = phys_addr | sme_me_mask | perms" color={C.pte} />
            </motion.g>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
