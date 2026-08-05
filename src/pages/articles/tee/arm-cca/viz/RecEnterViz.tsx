import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. Host → RMM: RMI_REC_ENTER', body: 'KVM이 vCPU 진입 요청. rec_pa, rec_entry_pa 인자.' },
  { label: '2. Rec 복원 (sysregs + GPR)', body: 'restore_ns_state_to_rmm() — REC 페이지에서 EL1 컨텍스트 적재.' },
  { label: '3. ERET to EL1 (Realm)', body: 'asm volatile("eret") → Realm Guest 코드 실행 시작.' },
  { label: '4. Realm 실행 → exit', body: 'Realm이 HVC, IRQ, abort 등으로 exit. 컨텍스트 RMM이 캡처.' },
  { label: '5. Exit reason 전달', body: 'res->x[1] = exit_reason → KVM이 처리 분기.' },
];

const REC_FIELDS = [
  { name: 'sys_regs', color: '#3b82f6' },
  { name: 'regs[31] / pc / pstate', color: '#06b6d4' },
  { name: 'simd', color: '#8b5cf6' },
  { name: 'runnable / realm', color: '#10b981' },
  { name: 'exit info', color: '#f59e0b' },
];

export default function RecEnterViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 250" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">struct rec + smc_rec_enter (runtime/core/rec.c)</text>

          <ModuleBox x={20} y={28} w={130} h={36}
            label="struct rec" sub="vCPU context" color="#10b981" />

          {REC_FIELDS.map((f, i) => (
            <motion.g key={f.name}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}>
              <DataBox x={170 + (i % 3) * 100} y={28 + Math.floor(i / 3) * 36}
                w={90} h={28} label={f.name} color={f.color} outlined />
            </motion.g>
          ))}

          {STEPS.map((s, i) => {
            const y = 110 + i * 26;
            const active = i <= step;
            const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];
            const color = colors[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3, x: active ? 0 : -4 }}
                transition={{ duration: 0.3 }}>
                <rect x={25} y={y} width={26} height={20} rx={3}
                  fill={color} fillOpacity={0.25} stroke={color} strokeWidth={0.6} />
                <text x={38} y={y + 14} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill={color}>{i + 1}</text>
                <rect x={60} y={y} width={400} height={20} rx={3}
                  fill={color} fillOpacity={active ? 0.1 : 0.04}
                  stroke={color} strokeWidth={active ? 0.5 : 0.3} />
                <text x={70} y={y + 13} fontSize={7.5} fontWeight={600}
                  fill="var(--foreground)">{s.label.split('. ')[1]}</text>
              </motion.g>
            );
          })}

          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={150} y={245} w={180} h={3}
                label="" color="#10b981" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
