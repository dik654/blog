import { motion } from 'framer-motion';
import { DataBox, ModuleBox } from '@/components/viz/boxes';

const FIELDS = [
  { name: 'oa : 36', desc: 'Output Address (PA)', color: '#3b82f6' },
  { name: 'state : 2', desc: 'unassigned/assigned/walk', color: '#10b981' },
  { name: 'ripas : 2', desc: 'EMPTY/RAM/DESTROYED', color: '#f59e0b' },
  { name: 'ns : 1', desc: '0=protected 1=unprotected', color: '#8b5cf6' },
  { name: 'attr : 8', desc: 'memory attributes', color: '#06b6d4' },
  { name: 'ap : 2', desc: 'access permission', color: '#ec4899' },
];

const TYPES = [
  { name: 'TABLE', desc: 'L1/L2 → 하위 레벨', color: '#06b6d4' },
  { name: 'ASSIGNED', desc: '실제 granule 매핑', color: '#10b981' },
  { name: 'UNASSIGNED', desc: 'IPA EMPTY (fault)', color: '#94a3b8' },
  { name: 'DESTROYED', desc: '이전 RAM, destroy됨', color: '#ef4444' },
];

export default function RttEntryViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 290" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">RTT Entry — ARM Stage 2 (Realm)</text>

        <ModuleBox x={170} y={28} w={140} h={30}
          label="struct rtt_entry" sub="ARMv9 spec" color="#10b981" />

        <text x={240} y={75} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">필드 (총 64-bit packed)</text>

        {FIELDS.map((f, i) => {
          const x = 25 + (i % 3) * 150;
          const y = 90 + Math.floor(i / 3) * 50;
          return (
            <motion.g key={f.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <DataBox x={x} y={y} w={140} h={28}
                label={f.name} color={f.color} outlined />
              <text x={x + 70} y={y + 42} textAnchor="middle" fontSize={6.5}
                fill="var(--muted-foreground)">{f.desc}</text>
            </motion.g>
          );
        })}

        <text x={240} y={210} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">엔트리 타입</text>

        {TYPES.map((t, i) => (
          <motion.g key={t.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.06 }}>
            <rect x={25 + i * 110} y={225} width={100} height={45} rx={5}
              fill={t.color} fillOpacity={0.15} stroke={t.color} strokeWidth={0.7} />
            <text x={75 + i * 110} y={244} textAnchor="middle" fontSize={8}
              fontWeight={700} fontFamily="monospace" fill={t.color}>{t.name}</text>
            <text x={75 + i * 110} y={260} textAnchor="middle" fontSize={6}
              fill="var(--muted-foreground)">{t.desc}</text>
          </motion.g>
        ))}

        <text x={240} y={285} textAnchor="middle" fontSize={6.5} fontStyle="italic"
          fill="var(--muted-foreground)">
          IPA 40비트→L1 시작, IPA 48비트→L0 시작 · 4KB granule
        </text>
      </svg>
    </div>
  );
}
