import { motion } from 'framer-motion';

const C = { grid: '#10b981', block: '#6366f1', thread: '#0ea5e9' };

function ThreadBlock({ bx, by, delay }: { bx: number; by: number; delay: number }) {
  const ox = 20 + bx * 180;
  const oy = 60 + by * 140;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: delay + 0.2 }}
    >
      {/* Block border */}
      <rect x={ox} y={oy} width={150} height={110} rx={8}
        fill={`${C.block}11`} stroke={C.block} strokeWidth={1.5} strokeDasharray="4 2" />
      <text x={ox + 75} y={oy - 6} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.block}>
        Block ({bx},{by})
      </text>

      {/* 4x4 Threads */}
      {Array.from({ length: 4 }, (_, ty) =>
        Array.from({ length: 4 }, (_, tx) => {
          const cx = ox + 20 + tx * 32;
          const cy = oy + 18 + ty * 24;
          return (
            <motion.g key={`${tx}-${ty}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: delay + 0.4 + (tx + ty) * 0.03 }}
            >
              <rect x={cx - 10} y={cy - 8} width={20} height={16} rx={3}
                fill={`${C.thread}22`} stroke={C.thread} strokeWidth={1} />
              <text x={cx} y={cy + 3} textAnchor="middle" fontSize={10} fill={C.thread}>
                {tx},{ty}
              </text>
            </motion.g>
          );
        })
      )}
    </motion.g>
  );
}

export default function ThreadHierarchyViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs font-semibold text-foreground/75 mb-3 text-center">
        CUDA Thread Hierarchy: Grid &rarr; Block &rarr; Thread
      </p>
      <svg viewBox="0 0 400 370" className="w-full max-w-2xl mx-auto" role="img">
        {/* Grid border */}
        <motion.rect
          x={5} y={5} width={390} height={360} rx={12}
          fill={`${C.grid}08`} stroke={C.grid} strokeWidth={1.5}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
        />
        <motion.text
          x={200} y={28} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.grid}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
        >
          Grid (2 x 2 Blocks)
        </motion.text>

        {/* 2x2 Blocks each with 4x4 Threads */}
        <ThreadBlock bx={0} by={0} delay={0} />
        <ThreadBlock bx={1} by={0} delay={0.15} />
        <ThreadBlock bx={0} by={1} delay={0.3} />
        <ThreadBlock bx={1} by={1} delay={0.45} />

        {/* Legend */}
        <g transform="translate(20, 340)">
          <rect x={0} y={0} width={10} height={10} rx={2} fill={C.grid} opacity={0.6} />
          <text x={14} y={9} fontSize={10} fill="var(--muted-foreground)">Grid</text>
          <rect x={55} y={0} width={10} height={10} rx={2} fill={C.block} opacity={0.6} />
          <text x={69} y={9} fontSize={10} fill="var(--muted-foreground)">Block</text>
          <rect x={115} y={0} width={10} height={10} rx={2} fill={C.thread} opacity={0.6} />
          <text x={129} y={9} fontSize={10} fill="var(--muted-foreground)">Thread</text>
        </g>
      </svg>
    </div>
  );
}
