import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const FIELDS = [
  { group: 'state', items: ['state (NEW/ACTIVE/SYS_OFF)', 'lock (spinlock_t)'], color: '#3b82f6' },
  { group: 'memory', items: ['g_rtt → Stage 2 root granule', 'rtt_base · ipa_bits · s2_starting_level'], color: '#06b6d4' },
  { group: 'measurement', items: ['rim[64] — Realm Initial Measurement', 'rem[4][64] — Runtime Extendable'], color: '#10b981' },
  { group: 'params', items: ['algorithm (SHA-256/512) · hash_algo', 'feat_flag0'], color: '#f59e0b' },
  { group: 'vCPU', items: ['rec_count', 'num_aux'], color: '#8b5cf6' },
];

export default function RdStructViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">struct rd — Realm Descriptor (Realm PAS, 4KB granule)</text>

        <ModuleBox x={170} y={28} w={140} h={36}
          label="struct rd" sub="runtime/core/realm.c" color="#10b981" />

        {FIELDS.map((g, i) => {
          const y = 80 + i * 38;
          return (
            <motion.g key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}>
              <rect x={25} y={y} width={90} height={30} rx={4}
                fill={g.color} fillOpacity={0.18} stroke={g.color} strokeWidth={0.7} />
              <text x={70} y={y + 18} textAnchor="middle" fontSize={8} fontWeight={700}
                fill={g.color}>{g.group}</text>

              <rect x={125} y={y} width={335} height={30} rx={4}
                fill={g.color} fillOpacity={0.05} stroke="var(--border)" strokeWidth={0.4} />
              {g.items.map((it, j) => (
                <text key={j} x={135} y={y + 12 + j * 11} fontSize={7}
                  fontFamily="monospace" fill="var(--muted-foreground)">· {it}</text>
              ))}
            </motion.g>
          );
        })}

        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          x={240} y={273} textAnchor="middle" fontSize={7} fontStyle="italic"
          fill="var(--muted-foreground)">
          RD는 Realm PAS — Host 직접 읽기 불가 · RMM만 SMC로 조작
        </motion.text>
      </svg>
    </div>
  );
}
