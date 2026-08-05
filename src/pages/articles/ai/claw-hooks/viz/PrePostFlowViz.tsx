import { motion } from 'framer-motion';

const ACTORS = [
  { id: 'llm', label: 'LLM', x: 80 },
  { id: 'enforcer', label: 'Enforcer', x: 200 },
  { id: 'preHook', label: 'PreHook', x: 320 },
  { id: 'tool', label: 'execute_tool', x: 440 },
  { id: 'postHook', label: 'PostHook', x: 520 },
];

const MESSAGES = [
  { from: 'llm', to: 'enforcer', label: 'tool_use', kind: 'sync', t: 0 },
  { from: 'enforcer', to: 'preHook', label: 'allow', kind: 'sync', t: 1 },
  { from: 'preHook', to: 'tool', label: 'proceed', kind: 'sync', t: 2 },
  { from: 'tool', to: 'postHook', label: 'output', kind: 'sync', t: 3 },
  { from: 'postHook', to: 'llm', label: 'tool_result', kind: 'return', t: 4 },
];

const REJECTS = [
  { from: 'enforcer', label: 'Deny → error', t: 1 },
  { from: 'preHook', label: 'Abort → error', t: 2 },
];

const Y_TOP = 56;
const Y_BOT = 320;
const ROW = (t: number) => 100 + t * 36;

export default function PrePostFlowViz() {
  const xOf = (id: string) => ACTORS.find(a => a.id === id)!.x;
  return (
    <div className="not-prose my-6 border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>sequence · pre/post hook flow</span>
        <span>UML</span>
      </div>
      <svg viewBox="0 0 560 360" className="block w-full h-auto" style={{ maxWidth: 720 }}>
        <defs>
          <marker id="seq-tip" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8" fill="none" stroke="var(--foreground)" strokeWidth="0.9" />
          </marker>
          <marker id="seq-tip-r" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8" fill="none" stroke="#ef4444" strokeWidth="0.9" />
          </marker>
        </defs>

        {/* actor heads + lifelines */}
        {ACTORS.map(a => (
          <g key={a.id}>
            <rect x={a.x - 36} y={Y_TOP} width={72} height={26} fill="var(--card)" stroke="var(--foreground)" strokeWidth={0.9} />
            <text x={a.x} y={Y_TOP + 17} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={700} fill="var(--foreground)">
              {a.label}
            </text>
            <line x1={a.x} y1={Y_TOP + 26} x2={a.x} y2={Y_BOT} stroke="var(--muted-foreground)" strokeWidth={0.6} strokeDasharray="2 3" />
            <rect x={a.x - 36} y={Y_BOT} width={72} height={4} fill="var(--foreground)" />
          </g>
        ))}

        {/* messages */}
        {MESSAGES.map((m, i) => {
          const x1 = xOf(m.from);
          const x2 = xOf(m.to);
          const y = ROW(m.t);
          const reverse = x2 < x1;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.18, delay: 0.25 + i * 0.35 }}
            >
              <motion.line
                x1={x1} y1={y} x2={x2} y2={y}
                stroke="var(--foreground)" strokeWidth={1}
                strokeDasharray={m.kind === 'return' ? '4 2' : ''}
                markerEnd="url(#seq-tip)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.35 }}
              />
              <text
                x={reverse ? x2 + (x1 - x2) / 2 : x1 + (x2 - x1) / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize={9.5}
                fontFamily="monospace"
                fontWeight={600}
                fill="var(--foreground)"
              >
                {m.label}
              </text>
              {/* activation bar on receiver */}
              <rect x={x2 - 3} y={y} width={6} height={28} fill="var(--card)" stroke="var(--foreground)" strokeWidth={0.6} />
            </motion.g>
          );
        })}

        {/* reject arrows */}
        {REJECTS.map((r, i) => {
          const x1 = xOf(r.from);
          const y = ROW(r.t) + 16;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.18, delay: 0.45 + r.t * 0.35 }}
            >
              <motion.line
                x1={x1} y1={y} x2={x1 - 60} y2={y}
                stroke="#ef4444" strokeWidth={0.9} strokeDasharray="3 2"
                markerEnd="url(#seq-tip-r)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.3, delay: 0.5 + r.t * 0.35 }}
              />
              <text x={x1 - 60} y={y - 4} fontSize={9} fontFamily="monospace" fill="#ef4444">
                {r.label}
              </text>
            </motion.g>
          );
        })}

        <text x={30} y={Y_BOT + 22} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          Pre = blocks · Post = audit (cannot block) · → sync · ⇢ return
        </text>
      </svg>
      <div className="border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground">
        UML sequence · lifelines dashed · activation bar on receiver
      </div>
    </div>
  );
}
