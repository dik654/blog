import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'REALM_CREATE 시 VMID 할당',
    body: 'rd->vmid = alloc_realm_vmid()\nHost VMID와 다른 네임스페이스.',
  },
  {
    label: 'TLB invalidate (Realm 전용)',
    body: 'tlbi vmalls12e1is — Stage 1 & 2, 모든 EL1, Inner Shareable.\ntlbi ipas2e1is, X — IPA 기반.',
  },
  {
    label: 'Realm 진입',
    body: 'msr VTTBR_EL2, rec->realm->rtt_base — Realm S2 base.\nmsr VTCR_EL2, rec->realm->vtcr → isb',
  },
  {
    label: 'Realm exit',
    body: 'msr VTTBR_EL2, host_vttbr — Host S2 복원.\nisb 후 Host 컨텍스트 정상.',
  },
];

export default function RealmTlbViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">Realm TLB / VMID — VTTBR_EL2 스왑</text>

          {STEPS.map((s, i) => {
            const y = 40 + i * 35;
            const active = i <= step;
            const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
            const color = colors[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                <rect x={25} y={y} width={28} height={26} rx={3}
                  fill={color} fillOpacity={0.25} stroke={color} strokeWidth={0.6} />
                <text x={39} y={y + 18} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill={color}>{i + 1}</text>
                <rect x={60} y={y} width={400} height={26} rx={3}
                  fill={color} fillOpacity={active ? 0.1 : 0.04}
                  stroke={color} strokeWidth={active ? 0.6 : 0.3} />
                <text x={70} y={y + 13} fontSize={7.5} fontWeight={600}
                  fill="var(--foreground)">{s.label}</text>
                <text x={70} y={y + 22} fontSize={6.5} fontFamily="monospace"
                  fill="var(--muted-foreground)">
                  {['alloc_realm_vmid', 'tlbi vmalls12e1is',
                    'msr VTTBR_EL2 ← Realm', 'msr VTTBR_EL2 ← Host'][i]}
                </text>
              </motion.g>
            );
          })}

          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20} y={195} w={200} h={28}
                label="TLB entry → World 비트 포함" color="#10b981" outlined />
              <ActionBox x={250} y={195} w={210} h={28}
                label="VMID 충돌 없음 (Host ↔ Realm)" color="#3b82f6" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
