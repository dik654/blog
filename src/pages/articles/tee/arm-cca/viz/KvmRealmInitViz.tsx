import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'kvm_init_realm_vm(kvm)', body: 'KVM이 Realm VM 초기화 시작. arch/arm64/kvm/rme.c.' },
  { label: 'RD granule 할당 + delegate', body: 'alloc_delegated_granule() — Host 페이지를 Realm PAS로 전환.' },
  { label: 'params 설정', body: 's2sz · rtt_base · rtt_num_start 채움. KVM이 stage2 메타 결정.' },
  { label: 'rmi_realm_create(rd, params)', body: 'RMM이 RD 초기화 → REALM_STATE_NEW.' },
  { label: 'kvm_vcpu_enter_realm', body: 'Host EL2 레지스터 저장 → rmi_rec_enter() → Realm 실행 → exit handle.' },
];

export default function KvmRealmInitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">Linux KVM-CCA — kvm_init_realm_vm 흐름</text>

          <ModuleBox x={20} y={30} w={130} h={45}
            label="KVM (Host)" sub="arch/arm64/kvm/rme.c" color="#3b82f6" />
          <ModuleBox x={335} y={30} w={130} h={45}
            label="RMM" sub="EL2 Realm" color="#f59e0b" />

          {STEPS.map((s, i) => {
            const y = 95 + i * 27;
            const active = i <= step;
            const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];
            const color = colors[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                <rect x={25} y={y} width={22} height={20} rx={3}
                  fill={color} fillOpacity={0.25} stroke={color} strokeWidth={0.6} />
                <text x={36} y={y + 14} textAnchor="middle" fontSize={8.5}
                  fontWeight={700} fill={color}>{i + 1}</text>
                <rect x={55} y={y} width={400} height={20} rx={3}
                  fill={color} fillOpacity={active ? 0.08 : 0.03}
                  stroke={color} strokeWidth={active ? 0.5 : 0.2} />
                <text x={65} y={y + 13} fontSize={7.5} fontWeight={600}
                  fill="var(--foreground)">{s.label}</text>
              </motion.g>
            );
          })}

          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={155} y={210} w={170} h={22}
                label="Realm 실행 → exit handle"
                color="#10b981" outlined />
              <ActionBox x={335} y={210} w={130} h={22}
                label="handle_realm_exit" sub="vcpu" color="#ef4444" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
