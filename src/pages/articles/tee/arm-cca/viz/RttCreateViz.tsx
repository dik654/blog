import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. RD lock 획득', body: 'find_lock_rd(rd_pa) — 동시성 보호.' },
  { label: '2. RTT walk: 부모 엔트리까지', body: 'rtt_walk_lock_unlock(rd, ipa, level - 1, &wi)' },
  { label: '3. 부모가 ASSIGNED면 block→table 전환', body: '하위 granule 전부 ASSIGNED로 복제 후 부모를 TABLE로.' },
  { label: '4. RTT granule state: DELEGATED → RTT', body: 'granule_set_state(rtt_pa, GRANULE_STATE_RTT)' },
  { label: '5. 새 테이블 zero (UNASSIGNED)', body: 'memset(phys_to_virt(rtt_pa), 0, PAGE_SIZE)' },
  { label: '6. 부모 엔트리 갱신 + TLBI', body: 'parent->oa = rtt_pa, state = TABLE → tlbi_realm_s2(ipa)' },
];

const COLORS = ['#3b82f6', '#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];

export default function RttCreateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 250" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">smc_rtt_create — Stage 2 테이블 확장 (runtime/core/rtt.c)</text>

          {STEPS.map((s, i) => {
            const y = 35 + i * 28;
            const active = i <= step;
            const color = COLORS[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3, x: active ? 0 : -4 }}
                transition={{ duration: 0.3 }}>
                <rect x={25} y={y} width={26} height={22} rx={3}
                  fill={color} fillOpacity={0.25} stroke={color} strokeWidth={0.6} />
                <text x={38} y={y + 15} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill={color}>{i + 1}</text>
                <rect x={60} y={y} width={400} height={22} rx={3}
                  fill={color} fillOpacity={active ? 0.1 : 0.04}
                  stroke={color} strokeWidth={active ? 0.6 : 0.3} />
                <text x={70} y={y + 14} fontSize={7.5} fontWeight={600}
                  fill="var(--foreground)">{s.label.split('. ')[1]}</text>
              </motion.g>
            );
          })}

          {step >= 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={120} y={215} w={120} h={28}
                label="RMI_SUCCESS" color="#10b981" outlined />
              <ActionBox x={250} y={215} w={120} h={28}
                label="RTT 계층 +1" color="#8b5cf6" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
