import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. Host → RMM: RMI_GRANULE_DELEGATE', body: 'KVM이 페이지 PA를 RMM에 위임 요청.' },
  { label: '2. RMM → Monitor: SMC(GRANULE_DELEGATE)', body: 'asm smc #0 — 인자 SMC_ASC_GRANULE_DELEGATE, granule_pa.' },
  { label: '3. Monitor: PA 유효성 + 현재 PAS 검사', body: '반드시 NS여야 함. NS가 아니면 거부.' },
  { label: '4. GPT entry 갱신 + Cache flush + TLBI', body: 'NS → Realm 변경, 모든 코어 TLB 무효화.' },
  { label: '5. RMM이 granule 분류·할당', body: 'RD/REC/RTT/Data 등 목적별 사용 시작.' },
];

export default function PasDelegateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">Granule Delegate — NS PAS → Realm PAS</text>

          <defs>
            <marker id="pd-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
            </marker>
          </defs>

          <ModuleBox x={20} y={35} w={100} h={40}
            label="Host (KVM)" sub="EL2 NS" color="#3b82f6" />
          <ModuleBox x={155} y={35} w={100} h={40}
            label="RMM" sub="EL2 Realm" color="#f59e0b" />
          <ModuleBox x={290} y={35} w={100} h={40}
            label="Monitor TF-A" sub="EL3" color="#ef4444" />
          <ModuleBox x={365} y={130} w={100} h={40}
            label="GPT" sub="2-level table" color="#10b981" />

          <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: step >= 0 ? 1 : 0 }}
            x1={120} y1={55} x2={155} y2={55}
            stroke={step === 0 ? '#3b82f6' : '#94a3b8'} strokeWidth={1.4}
            markerEnd="url(#pd-arr)" />
          <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }}
            x1={255} y1={55} x2={290} y2={55}
            stroke={step === 1 ? '#f59e0b' : '#94a3b8'} strokeWidth={1.4}
            markerEnd="url(#pd-arr)" />
          <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: step >= 3 ? 1 : 0 }}
            x1={345} y1={75} x2={395} y2={130}
            stroke={step >= 3 ? '#ef4444' : '#94a3b8'} strokeWidth={1.4}
            markerEnd="url(#pd-arr)" />

          <DataBox x={20} y={130} w={120} h={36}
            label="granule_pa" sub={step >= 3 ? 'Realm PAS' : 'NS PAS'}
            color={step >= 3 ? '#10b981' : '#3b82f6'} outlined />

          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={185} w={300} h={40}
                label="RD · REC · RTT · Data 중 하나로 사용"
                sub="granule_set_state(...)"
                color="#8b5cf6" />
            </motion.g>
          )}

          <text x={240} y={108} textAnchor="middle" fontSize={6.5} fontStyle="italic"
            fill="var(--muted-foreground)">
            Undelegate는 역방향 — 반드시 zeroize 후 NS로 복귀
          </text>
        </svg>
      )}
    </StepViz>
  );
}
