import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  init: '#8b5cf6',
  enc: '#0ea5e9',
  dec: '#f59e0b',
  api: '#10b981',
};

const STEPS = [
  { label: 'sme_early_init — 부팅 초기 활성화', body: 'CPUID 검사 + sme_me_mask 저장 + early page table에 적용' },
  { label: 'ioremap_encrypted — C-bit = 1', body: '암호화된 영역 매핑 (private memory)' },
  { label: 'ioremap_decrypted — C-bit = 0', body: 'shared 영역 매핑 (DMA, virtio)' },
  { label: 'set_memory_decrypted — 런타임 변환 API', body: 'PTE에서 C-bit 제거 + TLB flush + zero' },
];

export default function GuestMemEncryptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            arch/x86/mm/mem_encrypt_amd.c — Guest 측 SEV 지원
          </text>

          <motion.g animate={{ opacity: step === 0 ? 1 : 0.25 }}>
            <ModuleBox x={20} y={26} w={210} h={50} label="sme_early_init" sub="early boot" color={C.init} />
            {step === 0 && (
              <motion.g initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}>
                <DataBox x={250} y={32} w={210} h={20} label="cpuid_eax(0x8000_001f) & BIT(1)" color={C.init} outlined />
                <DataBox x={250} y={56} w={210} h={20} label="sme_me_mask = 1 << cpuid_ebx" color={C.init} outlined />
              </motion.g>
            )}
          </motion.g>

          <motion.g animate={{ opacity: step === 1 ? 1 : 0.25 }}>
            <ActionBox x={20} y={86} w={210} h={42} label="ioremap_encrypted" sub="addr | sme_me_mask" color={C.enc} />
            {step === 1 && (
              <DataBox x={250} y={92} w={210} h={32} label="C-bit = 1 → 암호화 영역" color={C.enc} outlined />
            )}
          </motion.g>

          <motion.g animate={{ opacity: step === 2 ? 1 : 0.25 }}>
            <ActionBox x={20} y={138} w={210} h={42} label="ioremap_decrypted" sub="addr & ~sme_me_mask" color={C.dec} />
            {step === 2 && (
              <DataBox x={250} y={144} w={210} h={32} label="C-bit = 0 → shared (DMA/virtio)" color={C.dec} outlined />
            )}
          </motion.g>

          <motion.g animate={{ opacity: step === 3 ? 1 : 0.25 }}>
            <ActionBox x={20} y={190} w={210} h={42} label="set_memory_decrypted" sub="런타임 PTE 수정" color={C.api} />
            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <DataBox x={250} y={184} w={70} h={26} label="PTE clear" color={C.api} outlined />
                <DataBox x={325} y={184} w={70} h={26} label="TLB flush" color={C.api} outlined />
                <DataBox x={400} y={184} w={60} h={26} label="zero" color={C.api} outlined />
                <text x={355} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  이전 암호화 데이터 잔류 방지
                </text>
              </motion.g>
            )}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
