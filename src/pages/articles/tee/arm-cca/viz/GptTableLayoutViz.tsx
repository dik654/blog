import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

export default function GptTableLayoutViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">2-Level GPT — L0 (Block/Table) → L1 (Granules)</text>

        <defs>
          <marker id="gtl-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#8b5cf6" />
          </marker>
        </defs>

        <ModuleBox x={20} y={40} w={130} h={50}
          label="L0 Table" sub="32KB · 1GB/entry" color="#3b82f6" />

        <ModuleBox x={185} y={20} w={120} h={36}
          label="L0 Block" sub="1GB granule PAS" color="#10b981" />

        <ModuleBox x={185} y={70} w={120} h={36}
          label="L0 Table → L1" sub="hierarchy" color="#f59e0b" />

        <ModuleBox x={340} y={70} w={130} h={50}
          label="L1 Table" sub="16KB · 4KB/entry" color="#8b5cf6" />

        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.4 }}
          x1={150} y1={50} x2={185} y2={38}
          stroke="#10b981" strokeWidth={1.2} markerEnd="url(#gtl-arr)" />
        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          x1={150} y1={75} x2={185} y2={88}
          stroke="#f59e0b" strokeWidth={1.2} markerEnd="url(#gtl-arr)" />
        <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          x1={305} y1={88} x2={340} y2={88}
          stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#gtl-arr)" />

        {/* Entry detail */}
        <text x={240} y={140} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)">gpt_l0_entry (16-bit packed)</text>

        {[
          { x: 25, w: 110, label: 'contents : 4', desc: '0=invalid 1=block 3=table', color: '#3b82f6' },
          { x: 145, w: 110, label: 'pas : 2', desc: 'NS/Secure/Root/Realm', color: '#10b981' },
          { x: 265, w: 200, label: 'reserved : 58', desc: '향후 확장', color: '#94a3b8' },
        ].map((f, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}>
            <DataBox x={f.x} y={155} w={f.w} h={32}
              label={f.label} color={f.color} outlined />
            <text x={f.x + f.w / 2} y={203} textAnchor="middle" fontSize={6.5}
              fill="var(--muted-foreground)">{f.desc}</text>
          </motion.g>
        ))}

        {/* Footer */}
        <text x={240} y={232} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="var(--muted-foreground)">총 GPT 메모리: 수 MB (PA 52비트 기준)</text>
        <text x={240} y={248} textAnchor="middle" fontSize={7} fontFamily="monospace"
          fill="var(--muted-foreground)">갱신은 Monitor 단독 · TLBI: tlbi paallos 필요</text>
      </svg>
    </div>
  );
}
