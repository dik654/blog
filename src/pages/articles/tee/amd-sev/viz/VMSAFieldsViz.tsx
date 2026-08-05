import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const C = {
  seg: '#8b5cf6',
  ctrl: '#0ea5e9',
  flow: '#10b981',
  gpr: '#f59e0b',
  fpu: '#ef4444',
  enc: '#10b981',
};

const STEPS = [
  { label: 'VMSA 필드 그룹 — 레지스터 저장 영역', body: 'segment / control / flow / GPR / FPU 5개 그룹' },
  { label: 'SEV-ES — VMEXIT 시 VMSA 자동 암호화', body: 'CPU가 DRAM에 쓸 때 ASP가 VEK로 암호화' },
  { label: '평문 SEV(no ES) 취약점', body: 'Hypervisor가 RIP/RSP/RDTSC 등 관측 가능' },
  { label: 'SEV-ES 해결 — 암호문만 노출', body: 'GHCB로 명시 공유한 필드만 평문 (선택적)' },
];

const GROUPS = [
  { label: 'Segment selectors', sub: 'es/cs/ss/ds (16b × 4)', color: C.seg, x: 20, y: 26 },
  { label: 'Control regs', sub: 'cr0/cr2/cr3/cr4 + efer/dr', color: C.ctrl, x: 165, y: 26 },
  { label: 'Flow', sub: 'rflags · rip · rsp', color: C.flow, x: 310, y: 26 },
  { label: 'GPR', sub: 'rax..r15 (16개)', color: C.gpr, x: 20, y: 80 },
  { label: 'FPU/SSE', sub: 'fx_state[512]', color: C.fpu, x: 165, y: 80 },
];

export default function VMSAFieldsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            struct vmcb_save_area (VMSA)
          </text>

          {GROUPS.map((g, i) => (
            <motion.g key={g.label}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ModuleBox x={g.x} y={g.y} w={140} h={48} label={g.label} sub={g.sub} color={g.color} />
            </motion.g>
          ))}

          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0 }}>
              <ModuleBox x={310} y={80} w={140} h={48} label="암호화 (SEV-ES)" sub="ASP / VEK" color={C.enc} />
              <motion.line x1={290} y1={104} x2={310} y2={104}
                stroke={C.enc} strokeWidth={1.2} strokeDasharray="2 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <AlertBox x={20} y={150} w={440} h={56}
                label="평문 SEV의 취약점"
                sub="Hypervisor가 RIP/RSP/RDTSC/Reg 직접 관측 → timing side-channel 가능"
                color="#ef4444" />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ModuleBox x={20} y={150} w={210} h={56}
                label="SEV-ES — 암호문만 DRAM"
                sub="VMEXIT 시 자동 암호화/복호화"
                color={C.enc} />
              <DataBox x={250} y={150} w={210} h={56}
                label="GHCB로 명시한 필드만 평문 공유 (선택적)"
                color={C.flow} outlined />
            </motion.g>
          )}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20} y={150} w={440} h={56}
                label="VMRUN/VMEXIT 사이 vCPU 상태가 DRAM에 저장되는 영역"
                color="#888" outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
