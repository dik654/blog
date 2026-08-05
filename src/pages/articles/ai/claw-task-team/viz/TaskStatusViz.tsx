import { motion } from 'framer-motion';

const TRACE = [
  { name: 'Pending', start: 0, dur: 4, depth: 0, color: '#94a3b8', note: 'queued' },
  { name: 'Assigned', start: 4, dur: 2, depth: 0, color: '#60a5fa', note: 'worker bound' },
  { name: 'InProgress', start: 6, dur: 18, depth: 0, color: '#f59e0b', note: 'LLM + tool calls' },
  { name: '  validate_constraints', start: 8, dur: 3, depth: 1, color: '#fbbf24', note: 'NoTouchFiles…' },
  { name: '  tool_invocations', start: 11, dur: 11, depth: 1, color: '#fbbf24', note: 'edit / bash / fetch' },
  { name: '  completion_check', start: 22, dur: 2, depth: 1, color: '#fbbf24', note: 'auto check' },
  { name: 'Review', start: 24, dur: 6, depth: 0, color: '#a78bfa', note: 'criteria match' },
  { name: 'Completed', start: 30, dur: 2, depth: 0, color: '#22c55e', note: 'final' },
];

const REJECT = { name: 'Rejected', start: 24, dur: 4, depth: 0, color: '#ef4444', note: 'criteria fail → reloop' };

const TOTAL = 34;

export default function TaskStatusViz() {
  const px = (n: number) => 80 + (n / TOTAL) * 440;
  return (
    <div className="not-prose my-6 border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>flame · TaskStatus lifecycle</span>
        <span>ticks → time</span>
      </div>
      <svg viewBox="0 0 560 340" className="block w-full h-auto" style={{ maxWidth: 720 }}>
        {/* time axis */}
        <line x1={80} y1={36} x2={520} y2={36} stroke="var(--border)" strokeWidth={0.6} />
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 80 + (i / 8) * 440;
          return (
            <g key={i}>
              <line x1={x} y1={32} x2={x} y2={40} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <text x={x} y={28} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">
                t{i}
              </text>
            </g>
          );
        })}

        {TRACE.map((r, i) => {
          const y = 56 + i * 26;
          const w = (r.dur / TOTAL) * 440;
          return (
            <motion.g
              key={r.name + i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.12, delay: 0.1 + i * 0.13 }}
            >
              <text x={70} y={y + 11} textAnchor="end" fontSize={10} fontFamily="monospace"
                fill={r.depth ? 'var(--muted-foreground)' : 'var(--foreground)'}>
                {r.name.trim()}
              </text>
              <motion.rect
                x={px(r.start)} y={y - 1 + r.depth * 2} height={r.depth ? 12 : 16}
                fill={r.color} fillOpacity={r.depth ? 0.5 : 0.85}
                stroke={r.color} strokeWidth={0.6}
                initial={{ width: 0 }}
                whileInView={{ width: w }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.13, ease: 'easeOut' }}
              />
              <text x={px(r.start) + w + 6} y={y + 11} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                {r.note}
              </text>
            </motion.g>
          );
        })}

        {/* reject branch */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.12, delay: 0.1 + TRACE.length * 0.13 }}
        >
          <text x={70} y={56 + TRACE.length * 26 + 11} textAnchor="end" fontSize={10} fontFamily="monospace" fill="#ef4444">
            {REJECT.name}
          </text>
          <motion.rect
            x={px(REJECT.start)} y={56 + TRACE.length * 26 - 1} height={16}
            fill={REJECT.color} fillOpacity={0.6} stroke={REJECT.color} strokeWidth={0.6}
            strokeDasharray="3 2"
            initial={{ width: 0 }}
            whileInView={{ width: (REJECT.dur / TOTAL) * 440 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: 0.2 + TRACE.length * 0.13, ease: 'easeOut' }}
          />
          <text x={px(REJECT.start) + (REJECT.dur / TOTAL) * 440 + 6} y={56 + TRACE.length * 26 + 11}
            fontSize={9} fontFamily="monospace" fill="#ef4444">
            {REJECT.note}
          </text>
        </motion.g>

        {/* loop arrow */}
        <motion.path
          d={`M ${px(REJECT.start + REJECT.dur)} ${56 + TRACE.length * 26 + 7} C 540 ${56 + TRACE.length * 26 + 7}, 540 ${56 + 2 * 26 + 7}, ${px(6)} ${56 + 2 * 26 + 7}`}
          fill="none" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, delay: 0.5 + TRACE.length * 0.13 }}
        />
      </svg>
      <div className="border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground">
        bar width ∝ time · depth = nested action · rejected loops to InProgress
      </div>
    </div>
  );
}
