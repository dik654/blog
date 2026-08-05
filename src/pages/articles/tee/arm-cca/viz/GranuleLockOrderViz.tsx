import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. RD lock 먼저', body: 'find_lock_granule(rd_pa, GRANULE_STATE_RD) — 가장 먼저 lock.' },
  { label: '2. DATA granule lock', body: 'find_lock_unused_granule(data_pa, DELEGATED) — 실패 시 RD unlock.' },
  { label: '3. RTT walk lock (leaf까지)', body: 'rtt_walk_lock(rd, ipa, ...) — Stage 2 path 잠금.' },
  { label: '4. 작업 수행', body: 'copy_page_from_ns + measurement_extend_data + rtt_fold_leaf.' },
  { label: '5. 역순 unlock', body: 'rtt_walk_unlock → granule_unlock_transition → granule_unlock(rd).' },
];

const ORDER = ['RD', 'REC', 'RTT', 'DATA'];

export default function GranuleLockOrderViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">Granule Lock Ordering — Deadlock 방지</text>

          <text x={240} y={36} textAnchor="middle" fontSize={8.5} fontWeight={600}
            fill="var(--muted-foreground)">규칙: RD → REC → RTT → DATA (역전 시 panic)</text>

          {ORDER.map((g, i) => (
            <motion.g key={g}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}>
              <DataBox x={20 + i * 110} y={50} w={100} h={36}
                label={g} color={['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6'][i]} outlined />
              {i < ORDER.length - 1 && (
                <text x={130 + i * 110} y={72} textAnchor="middle" fontSize={10}
                  fontWeight={700} fill="#94a3b8">→</text>
              )}
            </motion.g>
          ))}

          <text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={700}
            fill="var(--foreground)">예시: smc_data_create 흐름</text>

          {STEPS.map((s, i) => {
            const y = 120 + i * 22;
            const active = i <= step;
            const colors = ['#10b981', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'];
            const color = colors[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                <rect x={25} y={y} width={22} height={18} rx={3}
                  fill={color} fillOpacity={0.25} stroke={color} strokeWidth={0.5} />
                <text x={36} y={y + 12} textAnchor="middle" fontSize={8}
                  fontWeight={700} fill={color}>{i + 1}</text>
                <text x={55} y={y + 13} fontSize={7.5} fontWeight={600}
                  fill="var(--foreground)">{s.label.split('. ')[1]}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
