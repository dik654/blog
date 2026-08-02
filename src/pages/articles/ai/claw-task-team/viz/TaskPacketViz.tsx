import { motion } from 'framer-motion';

const FIELDS = [
  { group: 'Identity', items: ['id', 'title', 'description'], cost: 8, color: '#60a5fa' },
  { group: 'Classification', items: ['priority', 'tags'], cost: 4, color: '#a78bfa' },
  { group: 'Goals', items: ['description', 'completion_check'], cost: 6, color: '#22c55e' },
  { group: 'Constraints', items: ['NoTouchFiles', 'MaxChanges', '…'], cost: 10, color: '#ef4444' },
  { group: 'Acceptance', items: ['criteria checklist'], cost: 5, color: '#f59e0b' },
  { group: 'Assignment', items: ['team', 'worker'], cost: 3, color: '#06b6d4' },
  { group: 'Dependencies', items: ['depends_on', 'blocks'], cost: 5, color: '#ec4899' },
  { group: 'Metadata', items: ['created_by', 'deadline', 'duration'], cost: 7, color: '#94a3b8' },
];

const MAX = 10;

export default function TaskPacketViz() {
  return (
    <div className="not-prose my-6 border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>flame · TaskPacket field cost</span>
        <span>bytes ∝ width</span>
      </div>
      <svg viewBox="0 0 560 320" className="block w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={28} y={28} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">field group</text>
        <text x={250} y={28} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">cost</text>
        <text x={500} y={28} textAnchor="end" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">members</text>

        <line x1={28} y1={36} x2={528} y2={36} stroke="var(--border)" strokeWidth={0.6} />

        {FIELDS.map((f, i) => {
          const y = 56 + i * 30;
          const w = (f.cost / MAX) * 240;
          return (
            <motion.g key={f.group}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.12, delay: 0.1 + i * 0.1 }}
            >
              <text x={28} y={y + 11} fontSize={11} fontFamily="monospace" fontWeight={600} fill="var(--foreground)">
                {f.group}
              </text>
              <motion.rect
                x={150} y={y} height={16}
                fill={f.color} fillOpacity={0.85}
                stroke={f.color} strokeWidth={0.5}
                initial={{ width: 0 }}
                whileInView={{ width: w }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.45, delay: 0.18 + i * 0.1, ease: 'easeOut' }}
              />
              <text x={158} y={y + 11} fontSize={9} fontWeight={700} fontFamily="monospace" fill="white">
                {f.cost}
              </text>
              <text x={528} y={y + 11} textAnchor="end" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                {f.items.join(' · ')}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <div className="border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground">
        bar = approximate prompt-token cost · ordering = serialize order
      </div>
    </div>
  );
}
