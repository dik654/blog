import { motion } from 'framer-motion';
import { DataBox, ModuleBox } from '@/components/viz/boxes';

const FIELDS = [
  { name: 'valid : 1', desc: 'STE 활성', color: '#3b82f6' },
  { name: 'config : 3', desc: 'S1/S2/bypass', color: '#06b6d4' },
  { name: 's1ctxptr : 52', desc: 'Stage 1 context', color: '#8b5cf6' },
  { name: 's2ttb : 52', desc: 'Stage 2 table base', color: '#10b981' },
  { name: 's2vmid : 16', desc: 'VMID', color: '#f59e0b' },
  { name: 'nse : 1', desc: '← RME 추가', color: '#ef4444' },
  { name: 'ns : 1', desc: 'NS bit', color: '#06b6d4' },
];

const WORLDS = [
  { ns: 1, nse: 0, name: 'Normal', color: '#3b82f6' },
  { ns: 0, nse: 0, name: 'Secure', color: '#f59e0b' },
  { ns: 1, nse: 1, name: 'Realm', color: '#10b981' },
  { ns: 0, nse: 1, name: 'Root', color: '#ef4444' },
];

export default function SmmuSteFieldsViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 290" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">SMMUv3 Stream Table Entry — RME 확장</text>

        <ModuleBox x={170} y={28} w={140} h={30}
          label="struct ste" sub="SMMU per-stream entry" color="#10b981" />

        {FIELDS.map((f, i) => {
          const x = 25 + (i % 4) * 110;
          const y = 75 + Math.floor(i / 4) * 50;
          return (
            <motion.g key={f.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <DataBox x={x} y={y} w={100} h={28}
                label={f.name} color={f.color} outlined />
              <text x={x + 50} y={y + 42} textAnchor="middle" fontSize={6.5}
                fill="var(--muted-foreground)">{f.desc}</text>
            </motion.g>
          );
        })}

        <text x={240} y={195} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">NS / NSE 조합 → 4 World 결정</text>

        {WORLDS.map((w, i) => (
          <motion.g key={w.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.06 }}>
            <rect x={25 + i * 110} y={210} width={100} height={50} rx={5}
              fill={w.color} fillOpacity={0.15} stroke={w.color} strokeWidth={0.8} />
            <text x={75 + i * 110} y={228} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={w.color}>{w.name}</text>
            <text x={75 + i * 110} y={244} textAnchor="middle" fontSize={6.5}
              fontFamily="monospace" fill="var(--muted-foreground)">
              NS={w.ns} NSE={w.nse}
            </text>
            <text x={75 + i * 110} y={254} textAnchor="middle" fontSize={6}
              fontFamily="monospace" fill="var(--muted-foreground)">
              {w.name === 'Realm' ? 'RMM S2 walk' : w.name === 'Root' ? 'Monitor only' : ''}
            </text>
          </motion.g>
        ))}

        <text x={240} y={280} textAnchor="middle" fontSize={6.5} fontStyle="italic"
          fill="var(--muted-foreground)">
          위반 시 DMA abort + GPC 자동 수행
        </text>
      </svg>
    </div>
  );
}
